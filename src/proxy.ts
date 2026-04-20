import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		// biome-ignore lint/style/noNonNullAssertion: env validated at boot
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: env validated at boot
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					supabaseResponse = NextResponse.next({ request });
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	// Refresh session token
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { pathname } = request.nextUrl;
	const isAdminRoute = pathname.startsWith("/admin");
	const isLoginPage = pathname === "/admin/login";
	const isMyAccount = pathname === "/my-account";

	// ── Helper ────────────────────────────────────────────────────────────────
	function redirectTo(path: string, params?: Record<string, string>) {
		const url = request.nextUrl.clone();
		url.pathname = path;
		if (params) {
			for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
		}
		return NextResponse.redirect(url);
	}

	// ── Admin routes ─────────────────────────────────────────────────────────
	if (isAdminRoute) {
		// Unauthenticated → login
		if (!user) {
			if (!isLoginPage) return redirectTo("/admin/login");
			return supabaseResponse;
		}

		// Authenticated → fetch role (one lightweight query per request)
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();

		const role = (profile?.role ?? "customer") as string;
		const hasAdminAccess = role === "admin" || role === "staff";

		// Cache role in httpOnly cookie so the layout avoids a second DB round-trip
		supabaseResponse.cookies.set("user_role", role, {
			httpOnly: true,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24,
		});

		// Login page: redirect to panel if already has access
		if (isLoginPage) {
			if (hasAdminAccess) return redirectTo("/admin");
			return supabaseResponse;
		}

		// No access → login with forbidden flag
		if (!hasAdminAccess) {
			return redirectTo("/admin/login", { forbidden: "1" });
		}

		// /admin/users is restricted to admin only
		if (pathname.startsWith("/admin/users") && role !== "admin") {
			return redirectTo("/admin");
		}

		return supabaseResponse;
	}

	// ── Other protected routes ────────────────────────────────────────────────
	if (isMyAccount && !user) return redirectTo("/signin");

	return supabaseResponse;
}

export const config = {
	matcher: ["/admin/:path*", "/my-account"],
};
