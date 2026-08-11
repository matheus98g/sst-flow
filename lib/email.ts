import { Resend } from "resend";
import { ResetPasswordEmail } from "@/emails/reset-password-email";
import { VerificationEmail } from "@/emails/verification-email";
import { createLogger } from "@/lib/logger";

const log = createLogger("email");

let resend: Resend | undefined;

function getResend() {
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "SST Flow <onboarding@resend.dev>";

export async function sendVerificationEmail(to: string, url: string) {
  const { data, error } = await getResend().emails.send({
    from: FROM,
    to,
    subject: "Confirme seu e-mail — SST Flow",
    react: VerificationEmail({ url }),
  });

  if (error) {
    log.error({ to, err: error }, "falha ao enviar e-mail de verificação");
    throw new Error(`Falha ao enviar e-mail de verificação: ${error.message}`);
  }

  log.info({ to, emailId: data?.id }, "e-mail de verificação enviado");
}

export async function sendResetPasswordEmail(to: string, url: string) {
  const { data, error } = await getResend().emails.send({
    from: FROM,
    to,
    subject: "Redefinir senha — SST Flow",
    react: ResetPasswordEmail({ url }),
  });

  if (error) {
    log.error({ to, err: error }, "falha ao enviar e-mail de redefinição de senha");
    throw new Error(`Falha ao enviar e-mail de redefinição de senha: ${error.message}`);
  }

  log.info({ to, emailId: data?.id }, "e-mail de redefinição de senha enviado");
}
