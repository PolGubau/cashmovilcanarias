"use server";

import { createClient } from "@/lib/supabase/server";
import type { DeviceInsert, DeviceUpdate } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function getDevices(filters?: {
	status?: string;
	brand?: string;
	search?: string;
}) {
	const supabase = (await createClient()) as any;
	let query = supabase
		.from("v_devices_full")
		.select("*")
		.order("created_at", { ascending: false });

	if (filters?.status) query = query.eq("status", filters.status);
	if (filters?.brand) query = query.ilike("brand", `%${filters.brand}%`);
	if (filters?.search) {
		query = query.or(
			`imei.ilike.%${filters.search}%,model.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`,
		);
	}

	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data;
}

export async function getDeviceByImei(imei: string) {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("v_devices_full")
		.select("*")
		.eq("imei", imei)
		.single();
	if (error) throw new Error(error.message);
	return data;
}

export async function getDeviceById(id: string) {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("v_devices_full")
		.select("*")
		.eq("id", id)
		.single();
	if (error) throw new Error(error.message);
	return data;
}

export async function createDevice(device: DeviceInsert) {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("devices")
		.insert(device)
		.select()
		.single();
	if (error) throw new Error(error.message);
	revalidatePath("/admin/inventory");
	return data;
}

export async function updateDevice(id: string, updates: DeviceUpdate) {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("devices")
		.update(updates)
		.eq("id", id)
		.select()
		.single();
	if (error) throw new Error(error.message);
	revalidatePath("/admin/inventory");
	return data;
}

export async function updateDeviceStatus(id: string, status: string) {
	const supabase = (await createClient()) as any;
	const { error } = await supabase
		.from("devices")
		.update({ status })
		.eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath("/admin/inventory");
}

export async function getInventoryStats() {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase.from("v_inventory_status").select("*");
	if (error) throw new Error(error.message);
	return data;
}
