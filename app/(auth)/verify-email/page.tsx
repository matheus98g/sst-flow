import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirme seu e-mail</CardTitle>
        <CardDescription>
          Enviamos um link de confirmação para o e-mail informado. Clique no link para ativar sua conta.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
            Voltar para o login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
