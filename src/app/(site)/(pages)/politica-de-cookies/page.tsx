import Breadcrumb from "@/components/Common/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | CashMóvil Canarias",
  description:
    "Política de cookies de CashMóvil Canarias. Información sobre los tipos de cookies utilizadas, su finalidad y cómo gestionarlas.",
};

export default function PoliticaDeCookiesPage() {
  return (
    <main>
      <Breadcrumb title="Política de Cookies" pages={["Política de Cookies"]} />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 xl:px-0">

          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-8">Política de Cookies</h1>

          <Section title="">
            <p className="text-sm text-dark-4">
              En cumplimiento de lo establecido el art. 22.2 de la Ley 34/2002 de Servicios de la Sociedad de la
              información (LSSI), desde CASHMOVIL le informamos que para la correcta navegación y uso de esta página
              web se requiere de la instalación de cookies.
            </p>
            <p className="mt-3 text-sm text-dark-4">
              La finalidad de la instalación, y por ende tratamiento de datos personales asociados al uso de esta
              tecnología es la configuración de medidas técnicas de seguridad, personalización, y funcionamiento
              básico de la web (cookies técnicas), así como la realización de análisis del paso por la web de los
              visitantes y usuarios (cookies analíticas).
            </p>
            <p className="mt-3 text-sm text-dark-4">
              El plazo de conservación de los datos recogidos por las cookies será el que se indica en la tabla que
              aparece más adelante, en este mismo apartado. El plazo contará a partir de la finalización de cada
              sesión del usuario en la página web.
            </p>
            <p className="mt-3 text-sm text-dark-4">
              Usted puede elegir prestar o no su consentimiento a la instalación de las cookies de CASHMOVIL. En caso
              de no aceptarlas o de bloquearlas, la navegación por la página puede no ser correcta. Entre los fallos
              más habituales por la no instalación de las cookies se encuentra el error en la carga de contenidos
              multimedia, la imposibilidad de entrar en la zona cliente o de configurar las preferencias de uso de la
              página.
            </p>
          </Section>

          <Section title="¿Qué son las Cookies?">
            <p className="text-sm text-dark-4">
              Las cookies son pequeños ficheros de texto, que guardan información del usuario y se almacenan en su
              propio dispositivo, bien sea PC, Tablet o móvil.
            </p>
          </Section>

          <Section title="¿Quién emite las cookies y para qué?">
            <p className="text-sm text-dark-4">
              Las cookies son emitidas por una página web, con la finalidad de mejorar la experiencia de navegación
              del usuario, así como para realizar análisis de sus acciones dentro de la web. Las cookies permiten
              que la página web que las ha emitido recuerde las elecciones y características de navegación del
              usuario.
            </p>
          </Section>

          <Section title="¿Qué tipos de cookies existen?">
            <p className="text-sm text-dark-4">Las cookies pueden catalogarse según 3 criterios:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-dark-4">
              <li>Entidad que las gestiona: Si son propias o de terceros.</li>
              <li>Plazo en que permanecen activas: Cookies de sesión o persistentes.</li>
              <li>
                Según su finalidad:
                <ul className="list-[lower-alpha] list-inside ml-4 mt-1 space-y-1">
                  <li>Cookies técnicas (no requieren consentimiento)</li>
                  <li>Cookies de personalización</li>
                  <li>Cookies de análisis</li>
                  <li>Cookies publicitarias</li>
                  <li>Cookies de publicidad comportamental</li>
                </ul>
              </li>
            </ol>
          </Section>

          <Section title="¿Cómo administro las cookies de mis dispositivos?">
            <p className="text-sm text-dark-4">
              Usted elige si acepta o no la instalación de cookies de esta página web, cashmovil.shop, en sus
              dispositivos. Puede elegir el bloqueo directo de la instalación de las cookies desde su navegador, así
              como también puede elegir la instalación de unas y el borrado de otras.
            </p>
            <p className="mt-3 text-sm text-dark-4 font-medium">¿Cómo configurar las cookies según su navegador?</p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-dark-4">
              <li>Internet Explorer: Herramientas &gt; Opciones de Internet &gt; Privacidad &gt; Configuración.</li>
              <li>Firefox: Herramientas &gt; Opciones &gt; Privacidad &gt; Historial &gt; Configuración Personalizada.</li>
              <li>Chrome: Configuración &gt; Mostrar opciones avanzadas &gt; Privacidad &gt; Configuración de contenido.</li>
              <li>Safari: Preferencias &gt; Seguridad.</li>
              <li>Opera: Configuración &gt; Opciones &gt; Avanzado.</li>
            </ol>
            <p className="mt-3 text-sm text-dark-4 italic">
              *Estas configuraciones pueden no estar disponibles en dispositivos móviles tales como tablets o
              smartphones. Si usa otro navegador distinto a los anteriores, consulte su política de instalación, uso
              y bloqueo de cookies.
            </p>
          </Section>

          <Section title="Cookies utilizadas en esta web">
            <p className="text-sm text-dark-4 mb-6">
              La siguiente es una relación de las cookies usadas en esta página web. Esta lista no tiene carácter
              limitativo.
            </p>

            {/* Cookies propias técnicas */}
            <h3 className="text-sm font-semibold text-dark mb-3 uppercase tracking-wide">
              Cookies propias (con finalidades técnicas)
            </h3>
            <CookieTable
              headers={["Cookie", "Duración", "Información que nos facilita"]}
              rows={[
                ["sb-*-auth-token", "1 semana", "Cookie de sesión generada por Supabase Auth. Almacena el token de autenticación del usuario registrado de forma segura (HttpOnly). Permite mantener la sesión activa entre visitas sin necesidad de volver a iniciar sesión."],
                ["sb-*-auth-token-code-verifier", "Sesión", "Verificador de código PKCE utilizado durante el flujo de autenticación OAuth (p.ej. inicio de sesión con Google). Se elimina automáticamente al completar el proceso de autenticación."],
              ]}
            />
            <p className="mt-3 text-sm text-dark-4 italic">
              * El prefijo <code className="bg-gray-1 px-1 rounded text-xs">sb-*</code> varía según el entorno del proyecto. Estas cookies son estrictamente necesarias para el funcionamiento de la zona de cliente y no requieren consentimiento.
            </p>

            {/* Cookies de terceros – Supabase */}
            <h3 className="text-sm font-semibold text-dark mt-8 mb-3 uppercase tracking-wide">
              Cookies de terceros – Supabase (infraestructura de base de datos y autenticación)
            </h3>
            <p className="text-sm text-dark-4 mb-4">
              Esta web utiliza <strong>Supabase</strong> como plataforma de base de datos y gestión de usuarios. Supabase es un servicio de Supabase Inc. con servidores en la Unión Europea (región <em>eu-west-1</em>). Para más información:{" "}
              <a href="https://supabase.com/privacy" className="text-blue underline" target="_blank" rel="noopener noreferrer">
                https://supabase.com/privacy
              </a>
              .
            </p>
            <CookieTable
              headers={["Cookie", "Duración", "Propietario", "Función"]}
              rows={[
                ["sb-*-auth-token", "1 semana", "Supabase Inc.", "Gestión de sesión de usuario autenticado. Técnicamente necesaria."],
              ]}
            />
          </Section>

          <Section title="Redes Sociales">
            <p className="text-sm text-dark-4 mb-2">
              Esta web puede enlazar a perfiles de Cashmovil en redes sociales externas. Al hacer clic en esos
              enlaces y acceder a dichas plataformas, se aplicará la política de cookies propia de cada servicio:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-dark-4">
              <li>
                Facebook:{" "}
                <a href="https://www.facebook.com/help/cookies" className="text-blue underline" target="_blank" rel="noopener noreferrer">
                  Política de cookies de Meta
                </a>
              </li>
              <li>
                Instagram:{" "}
                <a href="https://privacycenter.instagram.com/policies/cookies/" className="text-blue underline" target="_blank" rel="noopener noreferrer">
                  Política de cookies de Instagram
                </a>
              </li>
            </ol>
            <p className="mt-3 text-sm text-dark-4">
              Esta web <strong>no incrusta</strong> widgets ni píxeles de seguimiento de redes sociales de forma
              directa, por lo que la instalación de sus cookies solo se produce si el usuario accede activamente a
              dichas plataformas.
            </p>
          </Section>

          <Section title="Actualización de la Política de Cookies">
            <p className="text-sm text-dark-4">
              Con la evolución tecnológica el uso de distintas cookies se presenta muy posible, por lo que en caso
              de implementar el uso de cookies que afecten su privacidad de forma distinta a las que haya autorizado
              anteriormente, le informaremos y solicitaremos su consentimiento.
            </p>
          </Section>

        </div>
      </section>
    </main>
  );
}

function CookieTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-2">
        <thead className="bg-gray-1 text-dark font-semibold">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 border border-gray-2 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className={rows.indexOf(row) % 2 === 0 ? "bg-white" : "bg-gray-1"}>
              {row.map((cell) => (
                <td key={cell} className="px-3 py-2 border border-gray-2 text-dark-4 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      {title && (
        <h2 className="text-base font-semibold text-dark uppercase border-b border-gray-2 pb-2 mb-4 tracking-wide">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
