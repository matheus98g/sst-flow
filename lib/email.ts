import { Resend } from "resend";
import { ResetPasswordEmail } from "@/emails/reset-password-email";
import { VerificationEmail } from "@/emails/verification-email";

let resend: Resend | undefined;

function getResend() {
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "SST Flow <onboarding@resend.dev>";

export async function sendVerificationEmail(to: string, url: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Confirme seu e-mail — SST Flow",
    react: VerificationEmail({ url }),
  });
}

export async function sendResetPasswordEmail(to: string, url: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Redefinir senha — SST Flow",
    react: ResetPasswordEmail({ url }),
  });
}
