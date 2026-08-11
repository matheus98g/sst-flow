import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getThemePreference } from "@/lib/preferences";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ThemeHydrator } from "@/components/dashboard/theme-hydrator";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const theme = await getThemePreference();

  return (
    <div className="flex min-h-screen bg-background">
      <ThemeHydrator theme={theme} />
      <DashboardSidebar />
      <div className="flex flex-1 flex-col md:ml-64">
        <DashboardHeader
          userName={session.user.name}
          userEmail={session.user.email}
        />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
