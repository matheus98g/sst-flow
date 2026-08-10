import { Body, Container, Head, Hr, Html, Preview, Section, Tailwind, Text } from "@react-email/components";
import type { ReactNode } from "react";

const emailTheme = {
  extend: {
    colors: {
      primary: "#1d232a",
      "on-primary": "#ffffff",
      secondary: "#0b7a3e",
      background: "#f2f4f7",
      surface: "#ffffff",
      "on-surface": "#191c1e",
      "on-surface-variant": "#44474b",
      outline: "#c5c6cb",
    },
    fontFamily: {
      heading: ['"Barlow Condensed"', '"Arial Narrow"', "Arial", "sans-serif"],
      body: ["Inter", "Helvetica", "Arial", "sans-serif"],
    },
  },
};

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Tailwind config={{ theme: emailTheme }}>
      <Html lang="pt-BR">
        <Head />
        <Preview>{preview}</Preview>
        <Body className="bg-background font-body py-8">
          <Container className="mx-auto max-w-[480px] overflow-hidden rounded-lg border border-solid border-outline bg-surface">
            <Section className="bg-primary px-6 py-5">
              <Text className="font-heading m-0 text-lg font-bold uppercase tracking-wide text-on-primary">
                SST Flow
              </Text>
            </Section>
            <Section className="px-6 py-8">{children}</Section>
          </Container>
          <Container className="mx-auto max-w-[480px] px-6 py-4">
            <Hr className="my-4 border-outline" />
            <Text className="font-body m-0 text-xs leading-5 text-on-surface-variant">
              Este é um e-mail automático do SST Flow — Sistema de Gestão de Segurança do Trabalho. Se você não
              esperava esta mensagem, pode ignorá-la com segurança.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
