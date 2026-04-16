"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStockMovements(filters?: {
  device_id?: string;
  reason?: string;
  since?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("stock_movements")
    .select(`
      *,
      devices (imei, brand, model),
      profiles:actor_id (full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(filters?.limit || 100);

  if (filters?.device_id) query = query.eq("device_id", filters.device_id);
  if (filters?.reason) query = query.eq("reason", filters.reason);
  if (filters?.since) query = query.gte("created_at", filters.since);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getDeviceAuditTrail(deviceId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stock_movements")
    .select(`
      *,
      profiles:actor_id (full_name)
    `)
    .eq("device_id", deviceId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}
