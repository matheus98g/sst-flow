"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutItem({
  className,
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await signOut();
        router.push("/sign-in");
      }}
    >
      {showIcon && <LogOutIcon className="size-5" />}
      <span>Sair</span>
    </button>
  );
}
