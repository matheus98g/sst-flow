"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

function setTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
  for (const listener of listeners) listener();
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Alternar modo escuro"
      onClick={() => setTheme(!isDark)}
      suppressHydrationWarning
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-muted transition-colors"
    >
      <span
        suppressHydrationWarning
        className={`inline-flex size-4 items-center justify-center rounded-full bg-card shadow transition-transform ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <MoonIcon className="size-3 text-primary" />
        ) : (
          <SunIcon className="size-3 text-warning" />
        )}
      </span>
    </button>
  );
}
