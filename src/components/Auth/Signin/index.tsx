"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button, FormField, Input } from "@/components/ui";
import { signIn, signInWithGoogle } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await signIn(
      fd.get("email") as string,
      fd.get("password") as string,
    );
    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    toast.success("¡Bienvenido de nuevo!");
    router.push("/my-account");
  }

  return (
    <>
      <Breadcrumb title={"Iniciar sesión"} pages={["Iniciar sesión"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Inicia sesión en tu cuenta
              </h2>
              <p>Introduce tus datos a continuación</p>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <FormField label="Correo electrónico" htmlFor="email" required className="mb-5">
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Introduce tu correo electrónico"
                    className="py-3 px-5 h-auto"
                  />
                </FormField>

                <FormField label="Contraseña" htmlFor="password" required className="mb-5">
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Introduce tu contraseña"
                    autoComplete="current-password"
                    className="py-3 px-5 h-auto"
                  />
                </FormField>

                <Button
                  type="submit"
                  loading={loading}
                  size="lg"
                  className="w-full mt-7.5"
                >
                  Iniciar sesión
                </Button>

                <a
                  href="#"
                  className="block text-center text-dark-4 mt-4.5 ease-out duration-200 hover:text-dark"
                >
                  ¿Olvidaste tu contraseña?
                </a>

                <span className="relative z-1 block font-medium text-center mt-4.5">
                  <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3" />
                  <span className="inline-block px-3 bg-white">O</span>
                </span>

                <div className="flex flex-col gap-4.5 mt-4.5">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-3.5 py-6"
                    onClick={() =>
                      signInWithGoogle(`${window.location.origin}/my-account`)
                    }
                  >
                    <GoogleIcon />
                    Iniciar sesión con Google
                  </Button>


                </div>

                <p className="text-center mt-6">
                  ¿No tienes cuenta?
                  <Link
                    href="/signup"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    ¡Regístrate ahora!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
