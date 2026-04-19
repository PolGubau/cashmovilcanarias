import { ClearCartOnMount } from "@/components/Common/ClearCartOnMount";
import {
  type EcommerceCartItem,
  createEcommerceOrder,
} from "@/lib/actions/orders";
import { getStripeServer } from "@/lib/stripe";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pedido completado | CashMóvil Canarias",
  description: "Tu pago ha sido procesado correctamente.",
};

export default async function MailSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment_intent?: string;
    redirect_status?: string;
  }>;
}) {
  const sp = await searchParams;
  const piId = sp.payment_intent;
  const status = sp.redirect_status;

  // Not coming from Stripe — show generic success
  if (!piId || status !== "succeeded") {
    return (
      <main className="container py-24 text-center">
        <CheckCircle className="h-16 w-16 text-green mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-dark">¡Gracias por tu compra!</h1>
        <p className="text-dark-4 mt-2">Nos pondremos en contacto contigo en breve.</p>
        <Link href="/tienda" className="mt-6 inline-block text-blue hover:underline">Seguir comprando</Link>
      </main>
    );
  }

  let invoiceNumber: string | null = null;
  let orderTotal: number | null = null;
  let errorMsg: string | null = null;

  try {
    const stripe = getStripeServer();
    const pi = await stripe.paymentIntents.retrieve(piId, {
      expand: ["payment_method"],
    });

    if (pi.status !== "succeeded") throw new Error("Pago no completado");

    const pm = pi.payment_method as { billing_details?: { name?: string | null; email?: string | null; phone?: string | null; address?: { line1?: string | null } | null } } | null;
    const billing = pm?.billing_details ?? {};
    const items: EcommerceCartItem[] = pi.metadata?.items
      ? JSON.parse(pi.metadata.items)
      : [];

    orderTotal = pi.amount / 100;

    const order = await createEcommerceOrder({
      billing: {
        name: billing.name ?? "Cliente",
        email: billing.email ?? "",
        phone: billing.phone ?? "",
        address: billing.address?.line1 ?? "",
      },
      items,
      total: orderTotal,
      stripePaymentIntentId: piId,
    });

    invoiceNumber = order.invoice_number;
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : "Error desconocido";
  }

  if (errorMsg) {
    return (
      <main className="container py-24 text-center">
        <XCircle className="h-16 w-16 text-red mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-dark">Error al registrar el pedido</h1>
        <p className="text-dark-4 mt-2">{errorMsg}</p>
        <p className="text-sm text-dark-4 mt-1">Tu pago fue procesado. Contáctanos con el nº de referencia: <code className="font-mono">{piId}</code></p>
      </main>
    );
  }

  return (
    <main className="container py-24 max-w-lg mx-auto text-center">
      <ClearCartOnMount />
      <CheckCircle className="h-16 w-16 text-green mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-dark">¡Pedido confirmado!</h1>
      {invoiceNumber && (
        <p className="text-dark-4 mt-2">Nº de pedido: <span className="font-mono font-semibold text-dark">{invoiceNumber}</span></p>
      )}
      {orderTotal && (
        <p className="text-dark-4 mt-1">Total pagado: <span className="font-semibold text-dark">{formatCurrency(orderTotal)}</span></p>
      )}
      <p className="text-dark-4 mt-4 text-sm">Recibirás un email de confirmación en breve. Si tienes dudas, contáctanos.</p>
      <div className="flex gap-4 justify-center mt-8">
        <Link href="/tienda" className="px-6 py-2.5 rounded-lg bg-dark text-white text-sm font-medium hover:bg-dark/90 transition-colors">Seguir comprando</Link>
        <Link href="/contact" className="px-6 py-2.5 rounded-lg border border-gray-3 text-sm font-medium hover:border-dark transition-colors">Contactar</Link>
      </div>
    </main>
  );
}
