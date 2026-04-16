"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { RepairInsert, RepairUpdate } from "@/lib/supabase/types";

export async function getRepairs(filters?: { status?: string; search?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("v_repairs_full")
    .select("*")
    .order("received_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) {
    query = query.or(
      `customer_name.ilike.%${filters.search}%,resolved_imei.ilike.%${filters.search}%,resolved_model.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getRepairById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("v_repairs_full")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createRepair(repair: RepairInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("repairs").insert(repair).select().single();
  if (error) throw new Error(error.message);

  // If linked to an inventory device, update its status
  if (repair.device_id) {
    await supabase.from("devices").update({ status: "in_repair" }).eq("id", repair.device_id);
  }

  revalidatePath("/admin/repairs");
  return data;
}

export async function updateRepair(id: string, updates: RepairUpdate) {
  const supabase = await createClient();

  // If delivering, set timestamp
  if (updates.status === "delivered" && !updates.delivered_at) {
    updates.delivered_at = new Date().toISOString();
  }
  if (updates.status === "ready" && !updates.completed_at) {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("repairs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);

  // If repair delivered and linked device, return to in_stock
  if (updates.status === "delivered") {
    const repair = await supabase.from("repairs").select("device_id").eq("id", id).single();
    if (repair.data?.device_id) {
      await supabase.from("devices").update({ status: "in_stock" }).eq("id", repair.data.device_id);
    }
  }

  revalidatePath("/admin/repairs");
  return data;
}

export async function getRepairStats() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("repairs")
    .select("status")
    .then(async ({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
      return { data: counts, error: null };
    });
  if (error) throw new Error(String(error));
  return data;
}
