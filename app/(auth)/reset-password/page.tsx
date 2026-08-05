"use client";

import { Suspense, startTransition, useEffect, useState, ViewTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PASSWORD_RULES, PasswordChecklist } from "@/components/password-checklist";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(false);

  useEffect(() => {
    if (!confirmPassword) {
      startTransition(() => setPasswordsMatch(true));
      return;
    }

    startTransition(() => setPasswordsMatch(password === confirmPassword));
  }, [password, confirmPassword]);

  useEffect(() => {
    startTransition(() => setPasswordValid(PASSWORD_RULES.every((rule) => rule.test(password))));
  }, [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Link de redefinição inválido ou expirado.");
      return;
    }

    if (!passwordValid) {
      setError("A senha não atende aos requisitos mínimos.");
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error: resetError } = await resetPassword({ newPassword: password, token });
    setLoading(false);

    if (resetError) {
      setError(resetError.message ?? "Não foi possível redefinir sua senha.");
      return;
    }

    router.push("/sign-in");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Redefinir senha</h1>
        <p className="text-balance text-muted-foreground">Escolha uma nova senha para sua conta.</p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        {password && <PasswordChecklist password={password} />}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={!passwordsMatch}
          aria-describedby="confirm-password-status"
          minLength={8}
          required
        />
        {!passwordsMatch && (
          <ViewTransition enter="fade-in" exit="fade-out">
            <p id="confirm-password-status" className="text-sm text-destructive">
              As senhas não coincidem.
            </p>
          </ViewTransition>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading || !passwordsMatch || !passwordValid}>
        {loading ? "Salvando..." : "Redefinir senha"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
