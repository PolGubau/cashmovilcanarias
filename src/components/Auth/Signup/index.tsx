"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button, FormField, Input } from "@/components/ui";
import { signInWithGoogle, signUp } from "@/lib/actions/auth";
import { Check, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

// ── Password rules ──────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "length", label: "6 caracteres", test: (p: string) => p.length >= 6 },
  { id: "upper", label: "Mayúscula", test: (p: string) => /[A-Z]/.test(p) },
  { id: "number", label: "Número", test: (p: string) => /[0-9]/.test(p) },
] as const;

type Errors = Partial<Record<"name" | "email" | "password" | "confirm", string>>;

function getStrength(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  return passed as 0 | 1 | 2 | 3;
}

const STRENGTH_LABEL = ["", "Débil", "Regular", "Fuerte"] as const;
const STRENGTH_BAR = ["", "bg-red", "bg-yellow-dark", "bg-green"] as const;
const STRENGTH_TEXT = ["", "text-red", "text-yellow-dark", "text-green"] as const;

function validate(fd: FormData): Errors {
  const errs: Errors = {};
  const name = (fd.get("name") as string).trim();
  const email = (fd.get("email") as string).trim();
  const pass = fd.get("password") as string;
  const confirm = fd.get("re-type-password") as string;

  if (name.length < 2)
    errs.name = "El nombre debe tener al menos 2 caracteres";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = "Introduce un correo válido";
  if (pass.length < 6)
    errs.password = "La contraseña debe tener al menos 6 caracteres";
  if (pass !== confirm)
    errs.confirm = "Las contraseñas no coinciden";
  return errs;
}

// ── Component ───────────────────────────────────────────────────────────────
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const strength = getStrength(password);

  function clearError(field: keyof Errors) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await signUp(
      fd.get("email") as string,
      fd.get("password") as string,
      fd.get("name") as string,
    );

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    formRef.current?.reset();
    setPassword("");
    setConfirm("");
    setConfirmTouched(false);

    if ("requiresConfirmation" in result && result.requiresConfirmation) {
      toast.success("¡Cuenta creada! Revisa tu correo para confirmar el email.");
      router.push("/signin");
    } else {
      toast.success("¡Cuenta creada correctamente! Bienvenido.");
      router.push("/my-account");
    }
  }

  return (
    <>
      <Breadcrumb title={"Registrarse"} pages={["Registrarse"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Crear una cuenta
              </h2>
              <p>Introduce tus datos a continuación</p>
            </div>

            <div className="flex flex-col gap-4.5">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-3.5 py-6"
                onClick={() =>
                  signInWithGoogle(`${window.location.origin}/my-account`)
                }
              >
                <GoogleIcon />
                Registrarse con Google
              </Button>
            </div>

            <span className="relative z-1 block font-medium text-center mt-4.5">
              <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3" />
              <span className="inline-block px-3 bg-white">O</span>
            </span>

            <div className="mt-5.5">
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <FormField label="Nombre completo" htmlFor="name" required className="mb-5">
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Tu nombre completo"
                    autoComplete="name"
                    className="py-3 px-5 h-auto"
                    error={errors.name}
                    onChange={() => clearError("name")}
                  />
                </FormField>

                {/* Email */}
                <FormField label="Correo electrónico" htmlFor="email" required className="mb-5">
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    inputMode="email"
                    className="py-3 px-5 h-auto"
                    error={errors.email}
                    onChange={() => clearError("email")}
                  />
                </FormField>

                {/* Password */}
                <FormField label="Contraseña" htmlFor="password" required className="mb-2">
                  <Input
                    type={showPass ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    className="py-3 px-5 h-auto"
                    error={errors.password}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError("password");
                    }}
                    rightAddon={
                      <button
                        type="button"
                        className="pointer-events-auto text-dark-4 hover:text-dark transition-colors"
                        onClick={() => setShowPass((v) => !v)}
                        tabIndex={-1}
                        aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                </FormField>

                {/* Strength meter */}
                {password.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-1 mb-2">
                      {([1, 2, 3] as const).map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? STRENGTH_BAR[strength] : "bg-gray-3"
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-xs font-medium ${STRENGTH_TEXT[strength]}`}>
                        {STRENGTH_LABEL[strength]}
                      </span>
                      <ul className="flex gap-3">
                        {PASSWORD_RULES.map((rule) => {
                          const ok = rule.test(password);
                          return (
                            <li
                              key={rule.id}
                              className={`flex items-center gap-1 text-xs transition-colors ${ok ? "text-green" : "text-dark-4"
                                }`}
                            >
                              {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              {rule.label}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Confirm password */}
                {(() => {
                  const showMatch = confirmTouched && confirm.length > 0 && !errors.confirm;
                  const matches = confirm === password;
                  return (
                    <FormField label="Repetir contraseña" htmlFor="re-type-password" required className="mb-5.5">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        name="re-type-password"
                        id="re-type-password"
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                        className="py-3 px-5 h-auto"
                        error={errors.confirm}
                        value={confirm}
                        onChange={(e) => {
                          setConfirm(e.target.value);
                          clearError("confirm");
                        }}
                        onBlur={() => setConfirmTouched(true)}
                        rightAddon={
                          <button
                            type="button"
                            className="pointer-events-auto text-dark-4 hover:text-dark transition-colors"
                            onClick={() => setShowConfirm((v) => !v)}
                            tabIndex={-1}
                            aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />
                      {showMatch && (
                        <p className={`flex items-center gap-1 text-xs ${matches ? "text-green" : "text-red"}`}>
                          {matches
                            ? <><Check className="h-3 w-3" /> Las contraseñas coinciden</>
                            : <><X className="h-3 w-3" /> Las contraseñas no coinciden</>}
                        </p>
                      )}
                    </FormField>
                  );
                })()}

                <Button type="submit" loading={loading} size="lg" className="w-full mt-7.5">
                  Crear cuenta
                </Button>

                <p className="text-center mt-6">
                  ¿Ya tienes cuenta?
                  <Link href="/signin" className="text-dark ease-out duration-200 hover:text-blue pl-2">
                    Inicia sesión
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

export default Signup;
