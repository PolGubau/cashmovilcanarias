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

export async function getOrderStats() {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase.from("orders").select("status, total");
	if (error) throw new Error(error.message);

	const stats = {
		total_orders: data.length,
		completed: data.filter((o) => o.status === "completed").length,
		pending: data.filter((o) => o.status === "pending").length,
		revenue: data
			.filter((o) => o.status === "completed")
			.reduce((sum, o) => sum + (o.total || 0), 0),
	};
	return stats;
}
