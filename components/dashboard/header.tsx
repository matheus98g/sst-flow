import { BellIcon, SearchIcon, SettingsIcon } from "lucide-react";
import { SignOutItem } from "@/components/dashboard/sign-out-item";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-foreground hover:bg-muted md:hidden"
          aria-label="Abrir menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary uppercase">
          SST Precisão
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden items-center lg:flex">
          <SearchIcon className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-48 rounded-lg border border-border bg-muted py-1.5 pr-3 pl-9 text-sm outline-none transition-all focus:w-64 focus:border-2 focus:border-primary"
          />
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-muted"
          aria-label="Notificações"
        >
          <BellIcon className="size-5" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-muted"
          aria-label="Configurações"
        >
          <SettingsIcon className="size-5" />
        </button>

        <ThemeToggle />

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-medium text-foreground">
            {userName}
          </span>
          <span className="text-xs text-muted-foreground">{userEmail}</span>
        </div>
        <SignOutItem
          showIcon={false}
          className="hidden text-xs font-bold tracking-wide text-muted-foreground uppercase underline-offset-4 hover:text-primary hover:underline sm:inline"
        />
      </div>
    </header>
  );
}
