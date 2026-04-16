"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type AuthResult = { error: string } | { error: null };

function mapAuthError(message: string): string {
	if (message.includes("Invalid login credentials"))
		return "Email o contraseña incorrectos.";
	if (message.includes("Email not confirmed"))
		return "Debes confirmar tu correo antes de iniciar sesión.";
	if (message.includes("User already registered"))
		return "Ya existe una cuenta con este correo.";
	if (message.includes("Password should be at least"))
		return "La contraseña debe tener al menos 6 caracteres.";
	if (message.includes("Unable to validate email address"))
		return "El correo introducido no es válido.";
	if (message.includes("signup is disabled"))
		return "El registro está deshabilitado temporalmente.";
	return message;
}

export async function signIn(
	email: string,
	password: string,
	redirectTo = "/",
): Promise<AuthResult> {
	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) return { error: mapAuthError(error.message) };
	redirect(redirectTo);
}

export async function signUp(
	email: string,
	password: string,
	fullName?: string,
): Promise<AuthResult> {
	const supabase = await createClient();
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: { data: { full_name: fullName } },
	});
	if (error) return { error: mapAuthError(error.message) };
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
