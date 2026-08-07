"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangleIcon,
  ClipboardCheckIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  SquareCheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutItem } from "@/components/dashboard/sign-out-item";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  {
    label: "Inspeções",
    href: "/dashboard/inspecoes",
    icon: ClipboardCheckIcon,
  },
  {
    label: "Ocorrências",
    href: "/dashboard/ocorrencias",
    icon: AlertTriangleIcon,
  },
  {
    label: "Ações Corretivas",
    href: "/dashboard/acoes-corretivas",
    icon: SquareCheckIcon,
  },
  { label: "Admin", href: "/dashboard/admin", icon: ShieldCheckIcon },
];

const navItemClass =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors [&_svg]:size-5 [&_svg]:shrink-0";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed z-20 hidden h-screen w-64 flex-col gap-2 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground md:flex">
      <div className="mb-6 flex items-center gap-3 px-1 pt-1">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-accent">
          <Image
            src="/sst-flow-logo.png"
            alt="SST Flow"
            width={40}
            height={40}
            className="size-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-lg leading-tight font-semibold uppercase tracking-tight">
            Gestão SST
          </span>
          <span className="text-xs text-sidebar-foreground/70">
            Unidade Industrial 01
          </span>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === pathname;
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  navItemClass,
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-2 border-t border-sidebar-border pt-3">
        <Link
          href="/dashboard/suporte"
          aria-current={pathname === "/dashboard/suporte" ? "page" : undefined}
          className={cn(
            navItemClass,
            pathname === "/dashboard/suporte"
              ? "bg-secondary text-secondary-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <HelpCircleIcon />
          <span>Suporte</span>
        </Link>

        <SignOutItem
          className={cn(
            navItemClass,
            "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        />
      </div>
    </nav>
  );
}
