import { Link, Section, Text } from "@react-email/components";
import { Button } from "@/emails/components/button";
import { EmailLayout } from "@/emails/components/layout";

interface ResetPasswordEmailProps {
  url: string;
}

export function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Redefina sua senha no SST Flow">
      <Text className="font-heading m-0 mb-4 text-2xl font-semibold text-on-surface">Redefinir senha</Text>
      <Text className="font-body m-0 mb-6 text-base leading-6 text-on-surface-variant">
        Recebemos um pedido para redefinir a senha da sua conta no SST Flow. Clique no botão abaixo para escolher
        uma nova senha.
      </Text>
      <Section className="mb-6">
        <Button href={url}>Redefinir senha</Button>
      </Section>
      <Text className="font-body m-0 mb-4 text-sm leading-5 text-on-surface-variant">
        Se o botão não funcionar, copie e cole este link no navegador:{" "}
        <Link href={url} className="text-secondary underline">
          {url}
        </Link>
      </Text>
      <Text className="font-body m-0 text-sm leading-5 text-on-surface-variant">
        Se você não solicitou isso, ignore este e-mail — sua senha permanecerá inalterada.
      </Text>
    </EmailLayout>
  );
}

export default ResetPasswordEmail;
