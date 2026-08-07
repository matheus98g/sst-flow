import { Resend } from "resend";

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
    html: `<p>Confirme seu e-mail para ativar sua conta no SST Flow.</p><p><a href="${url}">Confirmar e-mail</a></p>`,
  });
}

export async function sendResetPasswordEmail(to: string, url: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Redefinir senha — SST Flow",
    html: `<p>Recebemos um pedido para redefinir sua senha.</p><p><a href="${url}">Redefinir senha</a></p><p>Se você não solicitou isso, ignore este e-mail.</p>`,
  });
}
