"use client";

import { useTheme } from "next-themes";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setThemePreference, type Theme } from "@/lib/preferences";

const options: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Claro", icon: SunIcon },
  { value: "dark", label: "Escuro", icon: MoonIcon },
  { value: "system", label: "Sistema", icon: MonitorIcon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function handleSelect(value: Theme) {
    setTheme(value);
    void setThemePreference(value);
  }

  const current = options.find((option) => option.value === theme) ?? options[2];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Alternar tema"
        className="flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-muted"
      >
        <CurrentIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => handleSelect(value)}>
            <Icon className="size-4" />
            <span className="flex-1">{label}</span>
            {theme === value && <CheckIcon className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
