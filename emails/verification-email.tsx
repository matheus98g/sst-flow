import { Link, Section, Text } from "@react-email/components";
import { Button } from "@/emails/components/button";
import { EmailLayout } from "@/emails/components/layout";

interface VerificationEmailProps {
  url: string;
}

export function VerificationEmail({ url }: VerificationEmailProps) {
  return (
    <EmailLayout preview="Confirme seu e-mail para ativar sua conta no SST Flow">
      <Text className="font-heading m-0 mb-4 text-2xl font-semibold text-on-surface">Confirme seu e-mail</Text>
      <Text className="font-body m-0 mb-6 text-base leading-6 text-on-surface-variant">
        Recebemos um cadastro no SST Flow com este endereço de e-mail. Confirme seu e-mail para ativar sua conta e
        começar a usar o sistema.
      </Text>
      <Section className="mb-6">
        <Button href={url}>Confirmar e-mail</Button>
      </Section>
      <Text className="font-body m-0 text-sm leading-5 text-on-surface-variant">
        Se o botão não funcionar, copie e cole este link no navegador:{" "}
        <Link href={url} className="text-secondary underline">
          {url}
        </Link>
      </Text>
    </EmailLayout>
  );
}

export default VerificationEmail;
