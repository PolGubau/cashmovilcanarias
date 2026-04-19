import Breadcrumb from "@/components/Common/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal | CashMóvil Canarias",
  description:
    "Aviso legal de CashMóvil Canarias – Henko Canarias S.L. Información legal, condiciones de uso y propiedad intelectual.",
};

export default function AvisoLegalPage() {
  return (
    <main>
      <Breadcrumb title="Aviso Legal" pages={["Aviso Legal"]} />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 xl:px-0">

          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-8">Aviso Legal</h1>

          {/* Responsable */}
          <Section title="Responsable de https://cashmovil.shop/">
            <ul className="space-y-1 text-sm text-dark-4">
              <li><strong>Identidad del Responsable:</strong> Henko Canarias S.L.</li>
              <li><strong>Nombre comercial:</strong> CashMovil</li>
              <li><strong>NIF/CIF:</strong> B13772744</li>
              <li><strong>Dirección:</strong> C.C. Añaza Carrefour, planta 1 local 20, 38111 Santa Cruz de Tenerife</li>
              <li>
                <strong>Correo electrónico:</strong>{" "}
                <a href="mailto:hola@cashmovilcanarias.com" className="text-blue underline">
                  hola@cashmovilcanarias.com
                </a>
              </li>
            </ul>
            <p className="mt-4 text-sm text-dark-4">
              En este espacio, el usuario podrá encontrar toda la información relativa a los términos y
              condiciones legales que definen las relaciones entre los usuarios y el responsable de esta web.
              Como usuario, es importante que conozcas estos términos antes de continuar tu navegación.
            </p>
            <p className="mt-3 text-sm text-dark-4">
              Henko Canarias S.L., como responsable de esta web, asume el compromiso de procesar la
              información de los usuarios con plenas garantías y cumplir con los requisitos nacionales y
              europeos que regulan la recopilación y uso de los datos personales. Esta web cumple
              rigurosamente con la Ley Orgánica 15/1999 (LOPD), el Real Decreto 1720/2007, el Reglamento
              (UE) 2016/679 (RGPD) y la Ley 34/2002 (LSSICE).
            </p>
          </Section>

          {/* Condiciones generales */}
          <Section title="Condiciones Generales de Uso">
            <p className="text-sm text-dark-4">
              Las presentes Condiciones Generales regulan el uso (incluyendo el mero acceso) de las páginas
              de{" "}
              <a href="https://cashmovil.shop/" className="text-blue underline">https://cashmovil.shop/</a>,
              incluidos los contenidos y servicios puestos a disposición en ellas. Toda persona que acceda a
              la web acepta someterse a las Condiciones Generales vigentes en cada momento del portal.
            </p>
          </Section>

          {/* Datos personales */}
          <Section title="Datos Personales que Recabamos y Cómo lo Hacemos">
            <p className="text-sm text-dark-4">
              Para consultar nuestra política de privacidad, visita:{" "}
              <a href="https://cashmovil.shop/" className="text-blue underline">
                Política de Privacidad
              </a>.
            </p>
          </Section>

          {/* Compromisos */}
          <Section title="Compromisos y Obligaciones de los Usuarios">
            <p className="text-sm text-dark-4">
              El usuario queda informado, y acepta, que el acceso a la presente web no supone, en modo
              alguno, el inicio de una relación comercial con Henko Canarias S.L. El usuario se compromete
              a utilizar el sitio web, sus servicios y contenidos sin contravenir la legislación vigente,
              la buena fe y el orden público.
            </p>
            <p className="mt-3 text-sm text-dark-4">Queda prohibido el uso de la web con fines ilícitos o lesivos. Respecto de los contenidos, se prohíbe:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-dark-4">
              <li>Su reproducción, distribución o modificación, total o parcial, sin autorización del titular.</li>
              <li>Cualquier vulneración de los derechos del prestador o del legítimo titular.</li>
              <li>Su utilización para fines comerciales o publicitarios.</li>
            </ul>
            <p className="mt-3 text-sm text-dark-4">
              El usuario debe ser consciente de que las medidas de seguridad de los sistemas informáticos en
              Internet no son enteramente fiables y que, por tanto, Henko Canarias S.L. no puede garantizar
              la inexistencia de malware u otros elementos dañinos, aunque pone todos los medios necesarios
              y las medidas de seguridad oportunas para evitarlos.
            </p>
          </Section>

          {/* Anuncios */}
          <Section title="Anuncios Patrocinados, Enlaces de Afiliados y Publicidad">
            <p className="text-sm text-dark-4">
              Esta web no ofrece a los usuarios contenidos patrocinados, anuncios y/o enlaces de afiliados.
            </p>
          </Section>

          {/* Seguridad */}
          <Section title="Medidas de Seguridad">
            <p className="text-sm text-dark-4">
              Los datos personales comunicados por el usuario a Henko Canarias S.L. pueden ser almacenados
              en bases de datos automatizadas o no, cuya titularidad corresponde en exclusiva a Henko
              Canarias S.L., asumiendo ésta todas las medidas de índole técnica, organizativa y de seguridad
              que garantizan la confidencialidad, integridad y calidad de la información contenida en las
              mismas de acuerdo con lo establecido en la normativa vigente en protección de datos.
            </p>
            <p className="mt-3 text-sm text-dark-4">
              La comunicación entre los usuarios y Henko Canarias S.L. utiliza un canal seguro, y los datos
              transmitidos son cifrados gracias a protocolos HTTPS, garantizando las mejores condiciones de
              seguridad para que la confidencialidad de los usuarios esté garantizada.
            </p>
          </Section>

          {/* Resolución conflictos */}
          <Section title="Plataforma de Resolución de Conflictos">
            <p className="text-sm text-dark-4">
              Ponemos a disposición de los usuarios la plataforma de resolución de litigios que facilita la
              Comisión Europea, disponible en:{" "}
              <a
                href="http://ec.europa.eu/consumers/odr/"
                className="text-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                http://ec.europa.eu/consumers/odr/
              </a>
            </p>
          </Section>

          {/* Propiedad intelectual */}
          <Section title="Derechos de Propiedad Intelectual e Industrial">
            <p className="text-sm text-dark-4">
              En virtud de lo dispuesto en los artículos 8 y 32.1, párrafo segundo, de la Ley de Propiedad
              Intelectual, quedan expresamente prohibidas la reproducción, la distribución y la comunicación
              pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los
              contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier
              medio técnico, sin la autorización de Henko Canarias S.L.
            </p>
            <p className="mt-3 text-sm text-dark-4">
              El usuario conoce y acepta que la totalidad del sitio web —incluyendo texto, software,
              contenidos, fotografías, material audiovisual y gráficos— está protegida por marcas, derechos
              de autor y otros derechos legítimos, de acuerdo con los tratados internacionales en los que
              España es parte.
            </p>
            <p className="mt-3 text-sm text-dark-4">
              En caso de que un usuario o un tercero considere que se ha producido una violación de sus
              derechos de propiedad intelectual, deberá notificarlo a Henko Canarias S.L. indicando sus
              datos personales, los contenidos protegidos y su ubicación en la web, así como la acreditación
              de dichos derechos.
            </p>
          </Section>

          {/* Exclusión de garantías */}
          <Section title="Exclusión de Garantías y Responsabilidad">
            <p className="text-sm text-dark-4">
              CashMovil no otorga ninguna garantía ni se hace responsable, en ningún caso, de los daños y
              perjuicios de cualquier naturaleza que pudieran traer causa de:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-dark-4">
              <li>La falta de disponibilidad, mantenimiento y efectivo funcionamiento de la web, o de sus servicios y contenidos.</li>
              <li>La existencia de malware, programas maliciosos o lesivos en los contenidos.</li>
              <li>El uso ilícito, negligente, fraudulento o contrario a este Aviso Legal.</li>
              <li>La falta de licitud, calidad, fiabilidad, utilidad y disponibilidad de los servicios prestados por terceros.</li>
            </ul>
            <p className="mt-3 text-sm text-dark-4">
              El prestador no se hace responsable bajo ningún concepto de los daños que pudieran dimanar del
              uso ilegal o indebido de la presente página web.
            </p>
          </Section>

          {/* Legislación */}
          <Section title="Ley Aplicable y Jurisdicción">
            <p className="text-sm text-dark-4">
              Con carácter general, las relaciones entre Henko Canarias S.L. y los usuarios de sus servicios
              telemáticos presentes en esta web se encuentran sometidas a la legislación y jurisdicción
              españolas y a los tribunales de Tenerife.
            </p>
          </Section>

        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-dark uppercase border-b border-gray-2 pb-2 mb-4 tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}
