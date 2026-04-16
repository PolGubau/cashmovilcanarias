"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(
	email: string,
	password: string,
	redirectTo = "/",
) {
	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw new Error(error.message);
	redirect(redirectTo);
}

export async function signUp(
	email: string,
	password: string,
	fullName?: string,
) {
	const supabase = await createClient();
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: { data: { full_name: fullName } },
	});
	if (error) throw new Error(error.message);
	redirect("/");
}

export async function signOut() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/admin/login");
}

export async function getSession() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}
