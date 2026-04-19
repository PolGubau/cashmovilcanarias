"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SignInResult = { error: string } | { error: null };
export type SignUpResult =
	| { error: string }
	| { error: null; requiresConfirmation: boolean };

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
): Promise<SignInResult> {
	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) return { error: mapAuthError(error.message) };
	return { error: null };
}

export async function signUp(
	email: string,
	password: string,
	fullName?: string,
): Promise<SignUpResult> {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: { data: { full_name: fullName } },
	});
	if (error) return { error: mapAuthError(error.message) };
	// Supabase devuelve éxito con identities vacío cuando el email ya existe
	if ((data.user?.identities?.length ?? 0) === 0)
		return { error: "Ya existe una cuenta con este correo." };
	return { error: null, requiresConfirmation: !data.session };
}

export async function signOut(
	destination: "/signin" | "/admin/login" = "/signin",
) {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect(destination);
}

export async function signInWithGoogle(redirectTo: string) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo,
			queryParams: { access_type: "offline", prompt: "consent" },
		},
	});
	if (error) return { error: mapAuthError(error.message) };
	if (data.url) redirect(data.url);
}

export async function getSession() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

export async function updateProfile(updates: {
	full_name?: string;
	phone?: string;
}): Promise<{ error: string | null }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { error: "No autenticado" };

	const { error } = await (supabase as any)
		.from("profiles")
		.update(updates)
		.eq("id", user.id);

	if (error) return { error: error.message };
	revalidatePath("/my-account");
	return { error: null };
}
