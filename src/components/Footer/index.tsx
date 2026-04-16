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
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" aria-label="X (Twitter) Social Link" className="flex ease-out duration-200 hover:text-blue">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram Social Link" className="flex ease-out duration-200 hover:text-blue">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn Social Link" className="flex ease-out duration-200 hover:text-blue">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
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
