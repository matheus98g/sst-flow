import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Confirme seu e-mail</h1>
        <p className="text-balance text-muted-foreground">
          Enviamos um link de confirmação para o e-mail informado. Clique no link para ativar sua conta.
        </p>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
