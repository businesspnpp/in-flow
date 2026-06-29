import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth-server";
export default async function RootPage() {
  const user = await verifySession();
  if (user) {
    redirect("/dashboard");
  }
  redirect("/login");
}
