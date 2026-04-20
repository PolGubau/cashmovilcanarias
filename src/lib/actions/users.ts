"use server";

import { requireRole } from "@/lib/actions/auth";
import { createServiceClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export interface UserProfile {
	id: string;
	email: string;
	full_name: string | null;
	role: UserRole;
	created_at: string;
}

export async function getProfilesWithEmail(): Promise<UserProfile[]> {
	await requireRole("admin");
	const supabase = await createServiceClient();

	const [
		{ data: authData, error: authError },
		{ data: profiles, error: profileError },
	] = await Promise.all([
		supabase.auth.admin.listUsers({ perPage: 1000 }),
		supabase.from("profiles").select("id, role, full_name, created_at"),
	]);

	if (authError) throw new Error(authError.message);
	if (profileError) throw new Error(profileError.message);

	const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

	return (authData?.users ?? []).map((u) => ({
		id: u.id,
		email: u.email ?? "",
		full_name: profileMap.get(u.id)?.full_name ?? null,
		role: (profileMap.get(u.id)?.role as UserRole) ?? "customer",
		created_at: u.created_at,
	}));
}

export async function updateUserRole(
	userId: string,
	role: UserRole,
): Promise<void> {
	await requireRole("admin");
	const supabase = await createServiceClient();
	const { error } = await supabase
		.from("profiles")
		.update({ role })
		.eq("id", userId);
	if (error) throw new Error(error.message);
	revalidatePath("/admin/users");
}
