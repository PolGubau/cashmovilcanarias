import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
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

	if (isAdminRoute && !isLoginPage && !user) {
		const loginUrl = request.nextUrl.clone();
		loginUrl.pathname = "/admin/login";
		return NextResponse.redirect(loginUrl);
	}

	if (isLoginPage && user) {
		const dashboardUrl = request.nextUrl.clone();
		dashboardUrl.pathname = "/admin";
		return NextResponse.redirect(dashboardUrl);
	}

	if (isMyAccount && !user) {
		const signinUrl = request.nextUrl.clone();
		signinUrl.pathname = "/signin";
		return NextResponse.redirect(signinUrl);
	}

	return supabaseResponse;
}

export const config = {
	matcher: ["/admin/:path*", "/my-account"],
};
