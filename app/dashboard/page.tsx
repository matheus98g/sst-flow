import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="text-center">
        <p className="text-lg font-medium">Olá, {session.user.name}</p>
        <p className="text-sm text-muted-foreground">{session.user.email}</p>
      </div>
      <SignOutButton />
    </div>
  );
}
