import Breadcrumb from "@/components/Common/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | CashMóvil Canarias",
  description:
    "Términos y condiciones generales de contratación de CashMóvil Canarias – Henko Canarias S.L.",
};

export default function TerminosYCondicionesPage() {
  return (
    <main>
      <Breadcrumb title="Términos y Condiciones" pages={["Términos y Condiciones"]} />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 xl:px-0 prose prose-sm sm:prose lg:prose-lg max-w-none">

          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
            Términos y Condiciones
          </h1>
          <h2 className="text-lg font-semibold text-dark mb-6 uppercase tracking-wide">
            Términos y Condiciones Generales de la Contratación
          </h2>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8 text-sm text-dark-4">
            <p>
              Te rogamos que leas detenidamente estas condiciones antes de realizar cualquier pedido.
              Una vez realices el pedido, aceptas la plena vinculación de estas Condiciones Generales.
            </p>
            <p className="mt-3">
              Los Términos y Condiciones Generales de Contratación descritos a continuación rigen las
              relaciones contractuales entre los clientes de la Web{" "}
              <a href="https://cashmovil.shop/" className="text-blue underline">https://cashmovil.shop/</a>{" "}
              y Henko Canarias S.L. La navegación y uso de la Web por parte del usuario implica la
              aceptación de estas cláusulas y también las de la POLÍTICA DE PRIVACIDAD y las del AVISO LEGAL.
            </p>
          </div>

          {/* Datos de identificación */}
          <section className="mb-8">
            <h3 className="text-base font-semibold text-dark uppercase mb-3">Datos de Identificación</h3>
            <ul className="space-y-1 text-dark-4 text-sm">
              <li><strong>Nombre:</strong> Henko Canarias S.L.</li>
              <li><strong>Domicilio:</strong> C.C. Añaza Carrefour, planta 1 local 20, 38111, Santa Cruz de Tenerife</li>
              <li><strong>E-mail:</strong>{" "}<a href="mailto:hola@cashmovilcanarias.com" className="text-blue underline">hola@cashmovilcanarias.com</a></li>
              <li><strong>Teléfono:</strong>{" "}<a href="tel:+34822051839" className="text-blue underline">822 051 839</a></li>
              <li><strong>CIF:</strong> B13772744</li>
            </ul>
          </section>

          {/* Objeto */}
          <Section title="Objeto">
            <p>
              Estos Términos y Condiciones constituyen las Condiciones Generales de venta de todos los
              productos de la Web.
            </p>
            <p className="mt-3">
              La Web realiza ventas, en las condiciones descritas en este documento, únicamente a mayores
              de edad o menores de edad emancipados (*).
            </p>
            <p className="mt-2 text-xs text-dark-5">
              (*) Si tienes menos de 18 años y no estás emancipado y quieres comprar un terminal o
              aparato electrónico es necesario que pidas a tus padres o tutores que realicen el pedido por ti.
            </p>
            <p className="mt-3">
              El contrato entre Henko Canarias S.L y el cliente estará constituido por los presentes TÉRMINOS Y
              CONDICIONES GENERALES DE CONTRATACIÓN, por el PEDIDO y por las CONDICIONES PARTICULARES recogidas
              en el ACUSE DE RECIBO.
            </p>
            <p className="mt-3">
              Las Condiciones Particulares se limitarán a confirmar el producto solicitado, precio total final,
              incluidos gastos de envío e impuestos y tasas y el domicilio y señas de entrega.
            </p>
            <p className="mt-3">
              En el momento de formalizar el pedido, se entenderá que el usuario da su consentimiento expreso a
              estos TÉRMINOS Y CONDICIONES GENERALES DE CONTRATACIÓN y a recibir la factura por medios
              electrónicos, salvo manifestación expresa en contra.
            </p>
            <p className="mt-3">
              En el momento de realizar el pago el usuario da su consentimiento expreso, además, a las
              CONDICIONES PARTICULARES.
            </p>
          </Section>

          {/* Precios */}
          <Section title="Precios">
            <p>Todos los precios se indican en euros, salvo que se indique expresamente otra moneda.</p>
            <p className="mt-3">
              En el detalle de cada producto se especifica su precio y sus características. Este precio incluye
              los impuestos y tasas pero no incluye los gastos de envío. El precio total incluyendo los gastos
              de envío del pedido se puede visualizar accediendo al &quot;Carro de la compra&quot;.
            </p>
          </Section>

          {/* Proceso de compra */}
          <Section title="Proceso de Compra: Pedido, Revisión, Pago, Acuse de Recibo, Entrega y Factura">
            <p>El proceso de compra comporta 5 fases diferenciadas:</p>
            <ol className="list-decimal list-inside mt-3 space-y-1 font-medium">
              <li>Pedido</li>
              <li>Revisión de Pedido</li>
              <li>Pago</li>
              <li>Acuse de Recibo</li>
              <li>Entrega del Producto y Factura</li>
            </ol>
            <p className="mt-4">
              Realizamos envíos dentro del territorio español y Europeo. En cualquier caso, puedes contactar
              con nosotros a través del correo electrónico{" "}
              <a href="mailto:hola@cashmovilcanarias.com" className="text-blue underline">hola@cashmovilcanarias.com</a>{" "}
              o en el teléfono{" "}
              <a href="tel:+34822051839" className="text-blue underline">822 051 839</a>.
            </p>

            <h4 className="mt-5 font-semibold text-dark">1. Pedido</h4>
            <p className="mt-2">
              Para formalizar el Pedido, deberás seleccionar el producto, la cantidad de unidades que quieras
              adquirir y verificar que tu elección se encuentra correctamente especificada en el &quot;Carro de
              la compra&quot;, en el margen superior derecho de la Web.
            </p>

            <h4 className="mt-5 font-semibold text-dark">2. Revisión de Pedido</h4>
            <p className="mt-2">
              En la pantalla de confirmación del pedido tienes varias opciones. Si ya eres cliente y tienes una
              cuenta registrada, sólo deberás identificarte e ingresar tu contraseña. En caso de que no seas
              cliente, deberás rellenar el formulario con tus datos personales.
            </p>
            <p className="mt-2">
              Para realizar el pedido, selecciona el medio a través del cual vas a realizar el pago: Pago con
              tarjeta de crédito (Servired/Redsys), pago en efectivo en tienda, Financiación.
            </p>
            <p className="mt-2">
              Para poder realizar el pedido, es necesario que marques la casilla &quot;He leído y acepto la
              Política de Privacidad y los Términos y Condiciones&quot;.
            </p>
          </Section>

          {/* Formas de pago */}
          <Section title="3. Formas de Pago">
            <h4 className="font-semibold text-dark mt-2">3.1 Pago mediante tarjeta de crédito o débito</h4>
            <p className="mt-2">
              El usuario deberá disponer de tarjeta de crédito o débito en vigor. Sólo se aceptan tarjetas Visa
              y Mastercard con autenticación segura (&quot;Verified by Visa&quot; y &quot;MasterCard SecureCode&quot;).
            </p>

            <h4 className="font-semibold text-dark mt-4">3.2 Pago mediante Bizum</h4>

            <h4 className="font-semibold text-dark mt-4">3.3 Pago en plazos con seQura</h4>
            <p className="mt-2">
              seQura es un método de pago que permite la compra a plazos ofrecido por seQura Worldwide SA
              (NIF A66054164). Permite fraccionar el pago en 3 meses sin intereses, o en 6, 12 o 18 meses
              por un pequeño coste adicional al mes.
            </p>
            <p className="mt-2">
              seQura tiene sus propias políticas de privacidad y Henko Canarias S.L. no tiene ningún tipo de
              responsabilidad sobre ellas.
            </p>
          </Section>

          {/* Entrega */}
          <Section title="Entrega del Producto y Factura">
            <p>
              A partir del momento en que se verifique el pago, si tu domicilio se encuentra en Canarias,
              procederemos al envío del producto por transportistas privados: MRW, SEUR, ASIGNA.
            </p>
            <p className="mt-3">
              El pedido siempre será entregado en las fechas de entregas estimadas indicadas antes de realizar
              el pago. Los plazos de expedición son estimaciones y no son plazos garantizados.
            </p>
            <p className="mt-3">
              No se podrá modificar la dirección de entrega una vez enviado el pedido.
            </p>
            <p className="mt-3">
              Si tu pedido te ha llegado incompleto, necesitamos que te pongas en contacto con nosotros lo
              antes posible. El plazo máximo de gestión para estas incidencias será de 48 horas desde que
              recibiste el pedido.
            </p>
          </Section>

          {/* Desistimiento */}
          <Section title="Derecho de Desistimiento">
            <p>
              Como consumidor tiene derecho a desistir de la compra del producto en un plazo de 14 días
              naturales sin necesidad de justificación.
            </p>
            <p className="mt-3">
              Para ejercer el derecho de desistimiento, deberá notificarnos su decisión mediante correo
              electrónico a{" "}
              <a href="mailto:hola@cashmovilcanarias.com" className="text-blue underline">hola@cashmovilcanarias.com</a>{" "}
              con su nombre completo, dirección, teléfono, correo electrónico, fotos del estado del producto,
              embalaje, todos sus accesorios y factura o albarán de entrega.
            </p>
            <p className="mt-3">
              En caso de desistimiento le devolveremos todos los gastos referentes al coste de su factura, a
              más tardar 14 días naturales a partir de la fecha en la que se nos entregue el producto en
              nuestras instalaciones.
            </p>
            <h4 className="font-semibold text-dark mt-4">Devolución en caso de desistimiento:</h4>
            <p className="mt-2">
              Si el producto fue entregado en uno de nuestros establecimientos, la devolución también deberá
              realizarse del mismo modo y, en caso contrario, deberá el consumidor sufragar los gastos de
              envío hasta nuestra tienda en C.C Añaza Carrefour, planta 1 local 20, 38111, Santa Cruz de
              Tenerife.
            </p>
            <h4 className="font-semibold text-dark mt-4">Excepciones al desistimiento:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Todos los productos que requieran contacto directo con partes del cuerpo (auriculares, micrófonos, gafas virtuales).</li>
              <li>Todos aquellos productos que se devuelvan en malas condiciones y/o dañados.</li>
              <li>Bienes cuyo precio dependa de fluctuaciones del mercado financiero.</li>
              <li>Bienes precintados no aptos para ser devueltos por razones de salud o higiene y que hayan sido desprecintados tras la entrega sin poder ser utilizados para una posterior reventa.</li>
            </ul>
          </Section>

          {/* Formulario desistimiento */}
          <Section title="Modelo de Formulario de Desistimiento">
            <p className="italic text-xs mb-4">(Sólo debe cumplimentar y enviar el presente formulario si desea desistir del contrato)</p>
            <div className="bg-gray-1 rounded-lg p-5 text-sm space-y-3 border border-gray-2">
              <p><strong>A la atención de:</strong> Henko Canarias S.L. – CASHMOVIL</p>
              <p>C.C. Añaza Carrefour, Planta 1, Local 20, 38111, Santa Cruz de Tenerife</p>
              <p>
                E-mail:{" "}
                <a href="mailto:hola@cashmovilcanarias.com" className="text-blue underline">hola@cashmovilcanarias.com</a>
              </p>
              <p>—Por la presente le comunico que desisto de mi contrato de venta del siguiente bien:</p>
              <p>—Pedido el / recibido el (*)</p>
              <p>—Nombre del consumidor y usuario</p>
              <p>—Domicilio del consumidor y usuario</p>
              <p>—Firma del consumidor y usuario (solo si el presente formulario se presenta en papel)</p>
              <p>—Fecha</p>
              <p className="text-xs text-dark-5">(*) Táchese lo que no proceda.</p>
            </div>
          </Section>

          {/* FAQ */}
          <Section title="Preguntas Frecuentes">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-dark">¿Tenéis tienda física?</h4>
                <p className="mt-1">Sí, disponemos de tienda física en C.C. Añaza Carrefour, planta 1 local 20, Santa Cruz de Tenerife.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark">¿Qué tiempo tarda en llegar un pedido?</h4>
                <p className="mt-1">
                  Las entregas varían dependiendo del artículo comprado y la disponibilidad en el momento. El
                  97% de los pedidos son entregados antes de las 48 horas.
                </p>
              </div>
            </div>
          </Section>

          {/* Garantías */}
          <Section title="Garantías Legales y Reclamaciones">
            <p>
              Cuando recibas tu paquete, asegúrate de que los productos no hayan sufrido daños durante el
              transporte. En caso de estar en mal estado, infórmanos; en CASHMOVIL cuidamos a nuestros clientes
              con un seguro total de transporte.
            </p>
            <p className="mt-3">
              En caso de que el producto comprado presente un defecto de fabricación o no se ajuste al contrato,
              el cliente tendrá una garantía postventa de <strong>3 años</strong> desde la fecha de entrega del
              producto, para la reparación o sustitución del producto comprado.
            </p>
            <p className="mt-3">
              Si tienes que realizar una reclamación, puedes contactarnos en el teléfono{" "}
              <a href="tel:+34822051839" className="text-blue underline">822 051 839</a> o mediante el e-mail{" "}
              <a href="mailto:hola@cashmovilcanarias.com" className="text-blue underline">hola@cashmovilcanarias.com</a>.
            </p>
          </Section>

          {/* Responsabilidad */}
          <Section title="Responsabilidad">
            <p>
              Siempre intentamos garantizar la total disponibilidad de nuestros servicios y la información de
              la página Web, pero en ocasiones es posible que determinadas informaciones o apartados no se
              encuentren accesibles.
            </p>
            <p className="mt-3">
              Los contenidos o elementos de la Web{" "}
              <a href="https://cashmovil.shop/" className="text-blue underline">https://cashmovil.shop/</a> están
              sujetos a constante evolución, por lo que nos reservamos el derecho de modificarlos, ya sea total
              o parcialmente, en cualquier momento y sin previo aviso.
            </p>
            <p className="mt-3">No nos hacemos responsables de:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Que el servicio esté siempre disponible ininterrumpidamente, 24 horas al día, 365 días al año.</li>
              <li>Cualquier demora, error de aplicación o incumplimiento de las prestaciones gratuitas.</li>
              <li>Las compras efectuadas con ánimo fraudulento o mediante suplantación de identidad.</li>
            </ul>
          </Section>

          {/* Modificación */}
          <Section title="Modificación de los Términos y Condiciones">
            <p>
              Nos reservamos el derecho a modificar el presente texto de Términos y Condiciones en cualquier
              momento, sin carácter retroactivo.
            </p>
            <p className="mt-3">
              Cada compra implica la aceptación de los Términos y Condiciones vigentes en el momento de
              formalizar la transacción. Recomendamos que guardes copia de este documento a la fecha de tu
              pedido.
            </p>
          </Section>

          {/* Legislación */}
          <Section title="Legislación y Jurisdicción Aplicable">
            <p>
              Los presentes Términos y Condiciones y las transacciones que se desarrollen mediante la Web se
              rigen por la normativa española vigente que le es de aplicación.
            </p>
            <p className="mt-3">
              Para la resolución de las controversias que pudieran derivarse, el cliente acuerda someterse a
              la jurisdicción de los Juzgados y Tribunales de Tenerife, excepto en el caso de que el cliente
              sea un consumidor particular con domicilio en otra población.
            </p>
          </Section>

          {/* Anexo */}
          <Section title="Anexo – Información al Consumidor sobre el Derecho de Desistimiento">
            <p>
              Tienes derecho a desistir del presente contrato en un plazo de 14 días naturales sin necesidad
              de justificación. El plazo de desistimiento expirará a los 14 días naturales del día que tú o un
              tercero por ti indicado (distinto del transportista), haya adquirido la posesión material de los
              bienes.
            </p>
            <p className="mt-3">
              Para ejercer el derecho de desistimiento, deberás notificarnos tu nombre, dirección completa,
              número de teléfono y dirección de correo electrónico, además de tu decisión de desistir del
              contrato a través de una declaración inequívoca. Puedes enviarla al correo{" "}
              <a href="mailto:hola@cashmovilcanarias.com" className="text-blue underline">hola@cashmovilcanarias.com</a>.
            </p>
            <p className="mt-3">
              Si recurres a esa opción, te comunicaremos sin demora en un soporte duradero (por ejemplo, por
              correo electrónico) la recepción de dicho desistimiento.
            </p>

            <h4 className="font-semibold text-dark mt-5">Formulario de Desistimiento (Anexo)</h4>
            <p className="italic text-xs mt-1 mb-4">(Sólo debes cumplimentar el presente formulario si deseas desistir del contrato)</p>
            <div className="bg-gray-1 rounded-lg p-5 text-sm space-y-2 border border-gray-2">
              <p><strong>A la atención de:</strong> Henko Canarias S.L.</p>
              <p>C.C Añaza Carrefour, Planta 1 local 20, 38111, Santa Cruz de Tenerife</p>
              <p>Tel: <a href="tel:+34922890790" className="text-blue underline">922 890 790</a></p>
              <p>E-mail: <a href="mailto:hola@cashmovilcanarias.com" className="text-blue underline">hola@cashmovilcanarias.com</a></p>
              <hr className="border-gray-2 my-3" />
              <p>Por la presente le comunico que desisto de mi contrato de venta del siguiente bien/de los siguientes bienes:</p>
              <p className="mt-2">(Indica, por favor, el número de pedido que figura en la factura o confirmación de pedido)</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                <p>Solicitado el ____ / ____ / ____</p>
                <p>Recibido el ____ / ____ / ____</p>
                <p>Nombre: _______________________</p>
                <p>Apellidos: _____________________</p>
                <p>Dirección: _____________________</p>
                <p>Código postal: _________________</p>
                <p>Tel.: __________________________</p>
                <p>Mail: __________________________</p>
              </div>
              <p className="mt-4">Fecha ____ / ____ / ____</p>
              <p>Firma: ________________________________</p>
              <p className="text-xs text-dark-5 mt-2">(Si el presente formulario se presenta en papel o escaneado)</p>
            </div>
          </Section>

          <p className="text-xs text-dark-5 text-right mt-8 border-t border-gray-2 pt-4">
            Última revisión de este texto legal: 10 de noviembre de 2021
          </p>

        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h3 className="text-base font-semibold text-dark uppercase border-b border-gray-2 pb-2 mb-4 tracking-wide">
        {title}
      </h3>
      <div className="text-dark-4 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
