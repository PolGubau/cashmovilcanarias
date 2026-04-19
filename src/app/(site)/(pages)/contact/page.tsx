import Contact from "@/components/Contact";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contacto | CashMóvil Canarias",
  description:
    "Contacta con CashMóvil Canarias. CC Añaza Carrefour Planta 1 Local 20, Santa Cruz de Tenerife. Tel: 922 890 790.",
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
