import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 text-center pb-6">
          <Image
            src="/sst-flow-logo-text.png"
            alt="SST Flow"
            width={320}
            height={320}
            className="h-64 w-auto"
            priority
          />
          <p className="max-w-md text-muted-foreground">
            SST Flow - Gestão de Segurança
          </p>
          <div className="flex gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button>Acessar Plataforma</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button>Entrar</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline">Criar conta</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
