"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangleIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  SquareCheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutItem } from "@/components/dashboard/sign-out-item";

type NavLeaf = { label: string; href: string; icon: typeof LayoutDashboardIcon };
type NavGroup = {
  label: string;
  icon: typeof LayoutDashboardIcon;
  items: {
    label: string;
    href: string;
    icon: typeof LayoutDashboardIcon;
    matchPrefix?: boolean;
  }[];
};

const navItems: (NavLeaf | NavGroup)[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  {
    label: "Inspeções",
    icon: ClipboardCheckIcon,
    items: [
      { label: "Nova Inspeção", href: "/dashboard/inspecoes", icon: PlusCircleIcon },
      {
        label: "Checklists",
        href: "/dashboard/inspecoes/checklists",
        icon: ClipboardListIcon,
        matchPrefix: true,
      },
    ],
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

const navSubItemClass =
  "flex items-center gap-3 rounded-lg py-1.5 pr-3 pl-9 text-sm font-medium transition-colors [&_svg]:size-4 [&_svg]:shrink-0";

function isGroup(item: NavLeaf | NavGroup): item is NavGroup {
  return "items" in item;
}

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
          const Icon = item.icon;

          if (isGroup(item)) {
            const isGroupActive = item.items.some((subItem) =>
              subItem.matchPrefix ? isPathActive(pathname, subItem.href) : subItem.href === pathname,
            );
            return (
              <li key={item.label} className="flex flex-col gap-1">
                <div
                  className={cn(
                    navItemClass,
                    "cursor-default",
                    isGroupActive
                      ? "text-sidebar-foreground"
                      : "text-sidebar-foreground/80",
                  )}
                >
                  <Icon />
                  <span>{item.label}</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {item.items.map((subItem) => {
                    const isActive = subItem.matchPrefix
                      ? isPathActive(pathname, subItem.href)
                      : subItem.href === pathname;
                    const SubIcon = subItem.icon;
                    return (
                      <li key={subItem.label}>
                        <Link
                          href={subItem.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            navSubItemClass,
                            isActive
                              ? "bg-secondary text-secondary-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <SubIcon />
                          <span>{subItem.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          }

          const isActive = item.href === pathname;
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
