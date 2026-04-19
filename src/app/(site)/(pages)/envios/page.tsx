import Breadcrumb from "@/components/Common/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos | CashMóvil Canarias",
  description:
    "Información sobre los plazos y condiciones de envío de CashMóvil Canarias.",
};

export default function EnviosPage() {
  return (
    <main>
      <Breadcrumb title="Envíos" pages={["Envíos"]} />

      <section className="overflow-hidden py-20 lg:py-25 xl:py-30">
        <div className="max-w-[780px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8 text-sm text-dark-4">
            <p>
              Todos los pedidos serán enviados el mismo día de la recepción del
              pago, siempre que el pedido sea realizado antes de las{" "}
              <strong>15:00 PM</strong>, en caso contrario, será enviado el
              siguiente día hábil a la recepción del pago.
            </p>
          </div>

          <div className="text-dark-4 text-sm leading-relaxed space-y-6">
            <p>
              Una vez se reciba el pago, nuestro departamento comercial le
              facilitará vía email su número de pedido con el que podrá
              contactar con nosotros en caso de cualquier duda.
            </p>

            <p>
              Los plazos de entrega dependerán de la disponibilidad de cada
              producto, la cual se encuentra indicada en todos y cada uno de los
              productos ofertados. En los pedidos que incluyan varios artículos
              se hará un único envío y el plazo de entrega se corresponderá con
              el artículo cuyo plazo de entrega sea mayor.
            </p>

            <p>
              Los plazos de entrega son estimados y dependen del servicio de
              mensajería, con lo cual, pueden verse afectados por circunstancias
              no imputables a <strong>CASHMOVIL</strong>.
            </p>

            <p>
              Todos los pedidos realizados bajo la opción de{" "}
              <strong>&ldquo;ENVÍO GRATUITO&rdquo;</strong> son efectuados
              mediante envío estándar no urgente y siempre se envían con paquete
              asegurado.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
