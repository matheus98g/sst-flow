"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type Theme = "light" | "dark" | "system";

type UserPreferences = {
  theme?: Theme;
};

export async function getThemePreference(): Promise<Theme | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true },
  });

  const preferences = user?.preferences as UserPreferences | null;
  return preferences?.theme ?? null;
}

export async function setThemePreference(theme: Theme): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true },
  });

  const preferences = (user?.preferences as UserPreferences | null) ?? {};

  await prisma.user.update({
    where: { id: session.user.id },
    data: { preferences: { ...preferences, theme } },
  });
}
