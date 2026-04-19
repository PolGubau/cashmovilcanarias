import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterXIcon } from "@/components/icons/SocialIcons";
import { Link, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden">
      <div className="max-w-292.5 mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- footer menu start --> */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-17.5 xl:pt-22.5 pb-10 xl:pb-15">
          <div className="max-w-82.5 w-full">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark">
              Ayuda y Soporte
            </h2>

            <ul className="flex flex-col gap-3">
              <li className="flex gap-4.5">
                <MapPin className="w-6 h-6 text-blue shrink-0" />
                Calle Mayor 10, Las Palmas de Gran Canaria, España.
              </li>

              <li>
                <a href="tel:+34099532786" className="flex items-center gap-4.5">
                  <Phone className="w-6 h-6 text-blue shrink-0" />
                  (+099) 532-786-9843
                </a>
              </li>

              <li>
                <a href="mailto:support@cashmovil.es" className="flex items-center gap-4.5">
                  <Mail className="w-6 h-6 text-blue shrink-0" />
                  support@cashmovil.es
                </a>
              </li>
            </ul>

            {/* <!-- Social Links start --> */}
            <div className="flex items-center gap-4 mt-7.5">
              <a href="#" aria-label="Facebook Social Link" className="flex ease-out duration-200 hover:text-blue">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="X (Twitter) Social Link" className="flex ease-out duration-200 hover:text-blue">
                <TwitterXIcon />
              </a>
              <a href="#" aria-label="Instagram Social Link" className="flex ease-out duration-200 hover:text-blue">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="LinkedIn Social Link" className="flex ease-out duration-200 hover:text-blue">
                <LinkedInIcon />
              </a>
            </div>
            {/* <!-- Social Links end --> */}
          </div>

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark">
              Mi Cuenta
            </h2>

            <ul className="flex flex-col gap-3.5">
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="/my-account">
                  Mi Cuenta
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="/signin">
                  Iniciar sesión / Registrarse
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="/cart">
                  Carrito
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="/wishlist">
                  Lista de deseos
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="/tienda">
                  Tienda
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark">
              Accesos Rápidos
            </h2>

            <ul className="flex flex-col gap-3">
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Política de devoluciones
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Términos de uso
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-blue" href="#">
                  Preguntas comunes
                </a>
              </li>
              <li>
                <Link className="ease-out duration-200 hover:text-blue" href="/contact">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>


        </div>
        {/* <!-- footer menu end --> */}
      </div>

      {/* <!-- footer bottom start --> */}
      <footer className="py-5 xl:py-7.5 bg-gray-1">
        <div className="max-w-292.5 mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <p className="text-dark font-medium">
              &copy; {year}. Todos los derechos reservados - CashMóvil Canarias.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <p className="font-medium">Aceptamos:</p>

              <div className="flex flex-wrap items-center gap-6">
                <Image
                  src="/images/payment/payment-01.svg"
                  alt="visa card"
                  width={66}
                  height={22}
                />
                <Image
                  src="/images/payment/payment-02.svg"
                  alt="paypal"
                  width={18}
                  height={21}
                />
                <Image
                  src="/images/payment/payment-03.svg"
                  alt="master card"
                  width={33}
                  height={24}
                />
                <Image
                  src="/images/payment/payment-04.svg"
                  alt="apple pay"
                  width={52.94}
                  height={22}
                />
                <Image
                  src="/images/payment/payment-05.svg"
                  alt="google pay"
                  width={56}
                  height={22}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* <!-- footer bottom end --> */}
    </footer>
  );
};

export default Footer;
