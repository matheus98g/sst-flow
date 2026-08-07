"use client";

import { startTransition, useEffect, useState, ViewTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PASSWORD_RULES, PasswordChecklist } from "@/components/password-checklist";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_CHECK_DEBOUNCE_MS = 500;

type EmailStatus = "idle" | "checking" | "available" | "taken" | "error";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
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

  useEffect(() => {
    const trimmedEmail = email.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailStatus("idle");
      return;
    }

    setEmailStatus("checking");
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/check-email?email=${encodeURIComponent(trimmedEmail)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          startTransition(() => setEmailStatus("error"));
          return;
        }

        const data: { exists: boolean } = await response.json();
        startTransition(() => setEmailStatus(data.exists ? "taken" : "available"));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          startTransition(() => setEmailStatus("error"));
        }
      }
    }, EMAIL_CHECK_DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (emailStatus === "taken") {
      setError("Este e-mail já está cadastrado.");
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

    const { error: signUpError } = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message ?? "Não foi possível criar sua conta.");
      return;
    }

    router.push("/verify-email");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-balance text-muted-foreground">Cadastre-se para acessar o SST Flow.</p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailStatus === "taken"}
          aria-describedby="email-status"
          required
        />
        {emailStatus === "taken" && (
          <ViewTransition enter="fade-in" exit="fade-out">
            <p id="email-status" className="text-sm text-destructive">
              E-mail não disponível.
            </p>
          </ViewTransition>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
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
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
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
      <Button
        type="submit"
        className="w-full"
        disabled={loading || emailStatus === "taken" || !passwordsMatch || !passwordValid}
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
