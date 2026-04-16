"use server";

import { createClient } from "@/lib/supabase/server";
import type { CustomerInsert, CustomerUpdate } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function getCustomers(filters?: {
	search?: string;
	is_supplier?: boolean;
}) {
	const supabase = await createClient();
	let query = supabase.from("customers").select("*").order("full_name");

	if (filters?.search) {
		query = query.or(
			`full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,dni.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
		);
	}
	if (filters?.is_supplier !== undefined) {
		query = query.eq("is_supplier", filters.is_supplier);
	}

	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data;
}

export async function getCustomerById(id: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("customers")
		.select("*")
		.eq("id", id)
		.single();
	if (error) throw new Error(error.message);
	return data;
}

export async function createCustomer(customer: CustomerInsert) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("customers")
		.insert(customer)
		.select()
		.single();
	if (error) throw new Error(error.message);
	revalidatePath("/admin/customers");
	return data;
}

export async function updateCustomer(id: string, updates: CustomerUpdate) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("customers")
		.update(updates)
		.eq("id", id)
		.select()
		.single();
	if (error) throw new Error(error.message);
	revalidatePath("/admin/customers");
	return data;
}

export async function getCustomerDevices(customerId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("devices")
		.select("*")
		.or(`supplier_id.eq.${customerId},buyer_id.eq.${customerId}`)
		.order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data;
}

export async function getCustomerRepairs(customerId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("repairs")
		.select("*")
		.eq("customer_id", customerId)
		.order("received_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data;
}

export async function getCustomerOrders(customerId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("v_orders_full")
		.select("*")
		.eq("customer_id", customerId)
		.order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
}

export async function getCustomerHistory(customerId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("v_customer_history")
		.select("*")
		.eq("customer_id", customerId)
		.order("order_date", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
}
