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
import {
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

interface BillingData { name: string; email: string; phone: string; address: string }

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  icon: Icon,
  hint,
  wide,
}: {
  id: keyof BillingData;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  icon: React.ElementType;
  hint?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="block text-sm font-medium text-dark-3 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5 pointer-events-none">
          <Icon className="h-4 w-4" />
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full rounded-lg border border-gray-3 bg-gray-1 py-2.5 pl-9 pr-4 text-sm text-dark outline-none transition-all duration-200 placeholder:text-dark-5 focus:border-blue focus:ring-2 focus:ring-blue/20"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-dark-5">{hint}</p>}
    </div>
  );
}

function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, label: "Pago 100% seguro" },
    { icon: Truck, label: "Envío rápido garantizado" },
    { icon: RotateCcw, label: "Devolución en 30 días" },
    { icon: CreditCard, label: "Datos encriptados" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2 rounded-lg bg-gray-1 border border-gray-3 px-3 py-2">
          <Icon className="h-4 w-4 text-blue flex-shrink-0" />
          <span className="text-xs text-dark-4 font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

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
      {err && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {err}
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full text-base"
        loading={loading}
        disabled={!stripe}
        leftIcon={<Lock className="h-4 w-4" />}
      >
        Completar compra
      </Button>
      <p className="text-xs text-center text-dark-5">
        🔒 Pago procesado de forma segura con cifrado SSL de 256 bits por Stripe.
        <br />
        Nunca almacenamos tus datos de tarjeta.
      </p>
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

  return (
    <>
      <Breadcrumb title="Pagar" pages={["Pagar"]} />
      <section className="overflow-hidden py-20 bg-gray-1">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left: billing + payment */}
            <div className="xl:max-w-[670px] w-full space-y-6">

              {/* Contact & shipping info */}
              <div className="bg-white rounded-xl p-6 shadow-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue text-white text-xs font-bold">1</span>
                  <h2 className="font-semibold text-dark text-lg">Datos de contacto y envío</h2>
                </div>
                <p className="text-xs text-dark-5 mb-5 ml-8">Tu pedido llegará a la dirección que indiques.</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    id="name"
                    label="Nombre completo"
                    type="text"
                    value={billing.name}
                    onChange={(v) => setBilling((b) => ({ ...b, name: v }))}
                    placeholder="p. ej. María García López"
                    autoComplete="name"
                    icon={User}
                  />
                  <InputField
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    value={billing.email}
                    onChange={(v) => setBilling((b) => ({ ...b, email: v }))}
                    placeholder="p. ej. maria@email.com"
                    autoComplete="email"
                    icon={Mail}
                    hint="Te enviaremos la confirmación del pedido aquí."
                  />
                  <InputField
                    id="phone"
                    label="Teléfono"
                    type="tel"
                    value={billing.phone}
                    onChange={(v) => setBilling((b) => ({ ...b, phone: v }))}
                    placeholder="p. ej. +34 612 345 678"
                    autoComplete="tel"
                    icon={Phone}
                    hint="Solo para avisos de entrega."
                  />
                  <InputField
                    id="address"
                    label="Dirección de envío"
                    type="text"
                    value={billing.address}
                    onChange={(v) => setBilling((b) => ({ ...b, address: v }))}
                    placeholder="Calle, número, piso, puerta, ciudad, CP"
                    autoComplete="street-address"
                    icon={MapPin}
                    wide
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl p-6 shadow-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue text-white text-xs font-bold">2</span>
                  <h2 className="font-semibold text-dark text-lg">Método de pago</h2>
                </div>
                <p className="text-xs text-dark-5 mb-5 ml-8">Acepta Visa, Mastercard, American Express y más.</p>

                {piError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-4">
                    {piError}
                  </div>
                )}
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, locale: "es" }}>
                    <CheckoutForm billing={billing} />
                  </Elements>
                ) : (
                  <div className="h-32 flex items-center justify-center gap-2 text-dark-4 text-sm">
                    <Lock className="h-4 w-4" />
                    Cargando pasarela segura…
                  </div>
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
                        <Image
                          src={item.primary_image_url}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="rounded-lg object-cover border border-gray-3 shrink-0"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-1 flex items-center justify-center shrink-0">
                          <Package className="h-6 w-6 text-gray-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark truncate">{item.name}</p>
                        <p className="text-xs text-dark-4">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-dark whitespace-nowrap">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-3 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-dark-4">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-dark-4">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-3">
                    <span className="font-semibold text-dark">Total</span>
                    <span className="font-bold text-xl text-dark">{formatCurrency(total)}</span>
                  </div>
                </div>

                <TrustBadges />

                <p className="mt-4 text-xs text-center text-dark-5">
                  Al completar tu compra aceptas nuestros{" "}
                  <a href="/terms" className="underline hover:text-dark">términos y condiciones</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
