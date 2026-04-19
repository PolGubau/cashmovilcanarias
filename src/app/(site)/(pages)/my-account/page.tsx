import MyAccount from "@/components/MyAccount";
import { getSession } from "@/lib/actions/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mi cuenta | CashMóvil Canarias",
  description: "Gestiona tu cuenta",
};

export default async function MyAccountPage() {
  const user = await getSession();
  if (!user) redirect("/signin");

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Usuario";

  return (
    <main>
      <MyAccount user={{ name: displayName, email: user.email ?? "" }} />
    </main>
  );
}
