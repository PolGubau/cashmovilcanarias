import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

/** Server-side Stripe client — lazy to avoid build-time errors when key is missing */
let _stripe: Stripe | null = null;
export function getStripeServer(): Stripe {
	if (!_stripe) {
		const key = process.env.STRIPE_SECRET_KEY;
		if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
		_stripe = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
	}
	return _stripe;
}

/** Client-side Stripe promise */
let stripePromise: ReturnType<typeof loadStripe>;
export function getStripe() {
	if (!stripePromise) {
		stripePromise = loadStripe(
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
		);
	}
	return stripePromise;
}
