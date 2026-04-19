"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Lock, Package } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

interface BillingData { name: string; email: string; phone: string; address: string }

function CheckoutForm({ billing }: { billing: BillingData }) {
  const stripe = useStripe();
  const elements = useElements();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setErr(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/mail-success`,
        payment_method_data: {
          billing_details: { name: billing.name, email: billing.email, phone: billing.phone },
        },
      },
    });
    if (error) setErr(error.message ?? "Error en el pago");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {err && <p className="text-sm text-red">{err}</p>}
      <Button type="submit" size="lg" className="w-full" loading={loading} disabled={!stripe} leftIcon={<Lock className="h-4 w-4" />}>
        Pagar ahora
      </Button>
      <p className="text-xs text-center text-dark-4">Pago procesado de forma segura por Stripe.</p>
    </form>
  );
}

const Checkout = () => {
  const cartItems = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalPrice)();
  const [billing, setBilling] = useState<BillingData>({ name: "", email: "", phone: "", address: "" });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [piError, setPiError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length === 0 || total <= 0) return;
    fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        metadata: {
          items: JSON.stringify(cartItems.map((i) => ({ variantId: i.variantId ?? i.id, name: i.name, qty: i.quantity, price: i.price }))),
        },
      }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.error) setPiError(d.error); else setClientSecret(d.clientSecret); })
      .catch(() => setPiError("No se pudo iniciar el pago."));
  }, [total]);

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <Package className="h-12 w-12 text-gray-4 mx-auto mb-4" />
        <p className="text-dark font-medium">Tu carrito está vacío</p>
      </div>
    );
  }

  const FIELDS = [
    { key: "name" as const, label: "Nombre completo", type: "text" },
    { key: "email" as const, label: "Correo electrónico", type: "email" },
    { key: "phone" as const, label: "Teléfono", type: "tel" },
    { key: "address" as const, label: "Dirección de envío", type: "text", wide: true },
  ];

  return (
    <>
      <Breadcrumb title="Pagar" pages={["Pagar"]} />
      <section className="overflow-hidden py-20 bg-gray-1">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left: billing + payment */}
            <div className="xl:max-w-[670px] w-full space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-1">
                <h2 className="font-semibold text-dark text-lg mb-4">Datos de contacto</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {FIELDS.map(({ key, label, type, wide }) => (
                    <div key={key} className={wide ? "sm:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-dark-3 mb-1">{label}</label>
                      <input
                        type={type}
                        value={billing[key]}
                        onChange={(e) => setBilling((b) => ({ ...b, [key]: e.target.value }))}
                        required
                        className="w-full rounded-lg border border-gray-3 bg-gray-1 py-2.5 px-4 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-1">
                <h2 className="font-semibold text-dark text-lg mb-4">Pago</h2>
                {piError && <p className="text-sm text-red mb-3">{piError}</p>}
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, locale: "es" }}>
                    <CheckoutForm billing={billing} />
                  </Elements>
                ) : (
                  <div className="h-32 flex items-center justify-center text-dark-4 text-sm">Cargando…</div>
                )}
              </div>
            </div>

            {/* Right: order summary */}
            <div className="flex-1">
              <div className="bg-white rounded-xl p-6 shadow-1 sticky top-24">
                <h2 className="font-semibold text-dark text-lg mb-4">Resumen del pedido</h2>
                <ul className="divide-y divide-gray-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-3">
                      {item.primary_image_url ? (
                        <Image src={item.primary_image_url} alt={item.name} width={56} height={56}
                          className="rounded-lg object-cover border border-gray-3 flex-shrink-0" />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-1 flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 text-gray-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark truncate">{item.name}</p>
                        <p className="text-xs text-dark-4">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-dark whitespace-nowrap">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-3 mt-4 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-dark">Total</span>
                  <span className="font-bold text-xl text-dark">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
