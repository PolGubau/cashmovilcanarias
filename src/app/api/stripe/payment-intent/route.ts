import { getStripeServer } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { amount, currency = "eur", metadata = {} } = await req.json();

		if (!amount || amount < 50) {
			return NextResponse.json({ error: "Importe inválido" }, { status: 400 });
		}

		const paymentIntent = await getStripeServer().paymentIntents.create({
			amount: Math.round(amount * 100), // cents
			currency,
			automatic_payment_methods: { enabled: true },
			metadata,
		});

		return NextResponse.json({ clientSecret: paymentIntent.client_secret });
	} catch (err: unknown) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Internal error" },
			{ status: 500 },
		);
	}
}
