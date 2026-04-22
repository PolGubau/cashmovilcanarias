"use server";

import { createClient } from "@/lib/supabase/server";
import type {
	OrderInsert,
	OrderItemInsert,
	OrderUpdate,
} from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function getOrders(filters?: {
	status?: string;
	search?: string;
}) {
	const supabase = (await createClient()) as any;
	let query = supabase
		.from("v_orders_full")
		.select("*")
		.order("created_at", { ascending: false });

	if (filters?.status) query = query.eq("status", filters.status);
	if (filters?.search) {
		query = query.or(
			`customer_name.ilike.%${filters.search}%,invoice_number.ilike.%${filters.search}%`,
		);
	}

	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data;
}

export async function getOrderById(id: string) {
	const supabase = (await createClient()) as any;
	const [order, items] = await Promise.all([
		supabase.from("v_orders_full").select("*").eq("id", id).single(),
		supabase
			.from("order_items")
			.select("*, devices(imei, brand, model, cost_price)")
			.eq("order_id", id),
	]);
	if (order.error) throw new Error(order.error.message);
	if (items.error) throw new Error(items.error.message);
	return { order: order.data, items: items.data };
}

export async function createOrder(
	order: OrderInsert,
	items: Array<{ device_id: string; price_sold: number }>,
) {
	const supabase = (await createClient()) as any;

	// Reserve devices
	for (const item of items) {
		await supabase
			.from("devices")
			.update({ status: "reserved" })
			.eq("id", item.device_id);
	}

	const subtotal = items.reduce((sum, i) => sum + i.price_sold, 0);
	const total = subtotal - (order.discount || 0);

	const { data: newOrder, error: orderError } = await supabase
		.from("orders")
		.insert({ ...order, subtotal, total })
		.select()
		.single();
	if (orderError) throw new Error(orderError.message);

	const orderItems: OrderItemInsert[] = items.map((i) => ({
		order_id: newOrder.id,
		device_id: i.device_id,
		price_sold: i.price_sold,
		notes: null,
	}));

	const { error: itemsError } = await supabase
		.from("order_items")
		.insert(orderItems);
	if (itemsError) throw new Error(itemsError.message);

	revalidatePath("/admin/orders");
	return newOrder;
}

export async function updateOrderStatus(
	id: string,
	status: string,
	extras?: Partial<OrderUpdate>,
) {
	const supabase = (await createClient()) as any;
	const updates: OrderUpdate = { status: status as any, ...extras };
	if (status === "completed" && !updates.paid_at)
		updates.paid_at = new Date().toISOString();

	const { data, error } = await supabase
		.from("orders")
		.update(updates)
		.eq("id", id)
		.select()
		.single();
	if (error) throw new Error(error.message);
	revalidatePath("/admin/orders");
	return data;
}

// ─── Ecommerce: crea cliente + pedido tras pago Stripe ───────────────────────

export interface EcommerceCartItem {
	variantId: string;
	name: string;
	qty: number;
	price: number;
}

export interface EcommerceBilling {
	name: string;
	email: string;
	phone: string;
	address: string;
}

export async function createEcommerceOrder({
	billing,
	items,
	total,
	stripePaymentIntentId,
}: {
	billing: EcommerceBilling;
	items: EcommerceCartItem[];
	total: number;
	stripePaymentIntentId: string;
}) {
	const supabase = (await createClient()) as any;

	// 1. Upsert customer by email
	const { data: customer, error: customerError } = await supabase
		.from("customers")
		.upsert(
			{
				full_name: billing.name,
				email: billing.email,
				phone: billing.phone,
				address: billing.address,
				is_supplier: false,
				user_id: null,
			},
			{ onConflict: "email", ignoreDuplicates: false },
		)
		.select("id")
		.single();

	if (customerError) throw new Error(customerError.message);

	// 2. Create order (items stored in notes until devices are assigned)
	const notesPayload = JSON.stringify({
		stripe_pi: stripePaymentIntentId,
		items,
	});

	const { data: order, error: orderError } = await supabase
		.from("orders")
		.insert({
			customer_id: customer.id,
			status: "pending",
			total,
			notes: notesPayload,
			paid_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (orderError) throw new Error(orderError.message);
	revalidatePath("/admin/orders");
	return order as { id: string; invoice_number: string | null };
}

export async function getOrderStats(filters?: {
	dateFrom?: string;
	dateTo?: string;
	brand?: string;
}) {
	const supabase = (await createClient()) as any;
	let query = supabase
		.from("orders")
		.select("status, total, paid_at, created_at");
	if (filters?.dateFrom) query = query.gte("created_at", filters.dateFrom);
	if (filters?.dateTo)
		query = query.lte("created_at", filters.dateTo + "T23:59:59");
	const { data, error } = await query;
	if (error) throw new Error(error.message);

	const stats = {
		total_orders: data.length,
		completed: data.filter((o: any) => o.status === "completed").length,
		pending: data.filter((o: any) => o.status === "pending").length,
		revenue: data
			.filter((o: any) => o.status === "completed")
			.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
	};
	return stats;
}

export async function getSalesChartData(filters?: {
	dateFrom?: string;
	dateTo?: string;
	brand?: string;
}) {
	const supabase = (await createClient()) as any;
	// Join through order_items → devices to support brand filter
	let query = supabase
		.from("order_items")
		.select(
			"price_sold, orders!inner(status, paid_at, created_at), devices!inner(brand)",
		)
		.eq("orders.status", "completed");

	if (filters?.dateFrom)
		query = query.gte("orders.created_at", filters.dateFrom);
	if (filters?.dateTo)
		query = query.lte("orders.created_at", filters.dateTo + "T23:59:59");
	if (filters?.brand) query = query.eq("devices.brand", filters.brand);

	const { data, error } = await query;
	if (error) {
		// Fallback: fetch orders directly without brand filter
		let q2 = supabase
			.from("orders")
			.select("total, created_at, status")
			.eq("status", "completed")
			.order("created_at", { ascending: true });
		if (filters?.dateFrom) q2 = q2.gte("created_at", filters.dateFrom);
		if (filters?.dateTo)
			q2 = q2.lte("created_at", filters.dateTo + "T23:59:59");
		const { data: d2, error: e2 } = await q2;
		if (e2) throw new Error(e2.message);
		// Group by day
		const byDay: Record<string, number> = {};
		(d2 ?? []).forEach((o: any) => {
			const day = o.created_at.slice(0, 10);
			byDay[day] = (byDay[day] ?? 0) + (o.total || 0);
		});
		return Object.entries(byDay)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, revenue]) => ({ date, revenue }));
	}

	const byDay: Record<string, number> = {};
	(data ?? []).forEach((item: any) => {
		const day = (item.orders?.created_at ?? "").slice(0, 10);
		if (!day) return;
		byDay[day] = (byDay[day] ?? 0) + (item.price_sold || 0);
	});
	return Object.entries(byDay)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([date, revenue]) => ({ date, revenue }));
}

export async function getTopSellers(filters?: {
	dateFrom?: string;
	dateTo?: string;
	brand?: string;
	limit?: number;
}) {
	const supabase = (await createClient()) as any;
	let query = supabase
		.from("order_items")
		.select(
			"price_sold, devices!inner(brand, model, cost_price), orders!inner(status, created_at)",
		)
		.eq("orders.status", "completed");

	if (filters?.dateFrom)
		query = query.gte("orders.created_at", filters.dateFrom);
	if (filters?.dateTo)
		query = query.lte("orders.created_at", filters.dateTo + "T23:59:59");
	if (filters?.brand) query = query.eq("devices.brand", filters.brand);

	const { data, error } = await query;
	if (error) throw new Error(error.message);

	// Aggregate by brand+model
	const map: Record<
		string,
		{
			brand: string;
			model: string;
			units: number;
			revenue: number;
			margin: number;
		}
	> = {};
	(data ?? []).forEach((item: any) => {
		const key = `${item.devices?.brand} ${item.devices?.model}`;
		if (!map[key]) {
			map[key] = {
				brand: item.devices?.brand,
				model: item.devices?.model,
				units: 0,
				revenue: 0,
				margin: 0,
			};
		}
		const sold = item.price_sold || 0;
		const cost = item.devices?.cost_price || 0;
		map[key].units += 1;
		map[key].revenue += sold;
		map[key].margin += sold - cost;
	});

	return Object.values(map)
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, filters?.limit ?? 10);
}
