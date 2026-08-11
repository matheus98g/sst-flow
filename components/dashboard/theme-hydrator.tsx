"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import type { Theme } from "@/lib/preferences";

export function ThemeHydrator({ theme }: { theme: Theme | null }) {
  const { theme: currentTheme, setTheme } = useTheme();

  useEffect(() => {
    if (theme && theme !== currentTheme) {
      setTheme(theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return null;
}
