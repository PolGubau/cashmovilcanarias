import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Login = () => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div
        onClick={() => setDropdown(!dropdown)}
        className={`cursor-pointer flex items-center gap-0.5 py-5 px-5.5 ${dropdown && "border-b border-gray-3"
          }`}
      >
        ¿Ya eres cliente?
        <span className="flex items-center gap-2.5 pl-1 font-medium text-dark">
          Haz clic aquí para iniciar sesión
          <ChevronDown
            className={`size-[22px] ease-out duration-200 ${dropdown ? "rotate-180" : ""}`}
          />
        </span>
      </div>

      {/* <!-- dropdown menu --> */}
      <div
        className={`${dropdown ? "block" : "hidden"
          } pt-7.5 pb-8.5 px-4 sm:px-8.5`}
      >
        <p className="text-custom-sm mb-6">
          Si aún no has iniciado sesión, por favor hazlo antes de continuar.
        </p>

        <div className="mb-5">
          <label htmlFor="name" className="block mb-2.5">
            Usuario o correo electrónico
          </label>

          <input
            type="text"
            name="name"
            id="name"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2.5">
            Contraseña
          </label>

          <input
            type="password"
            name="password"
            id="password"
            autoComplete="on"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <Button type="submit">Iniciar sesión</Button>
      </div>
    </div>
  );
};

export default Login;
