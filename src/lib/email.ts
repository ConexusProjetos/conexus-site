import { Resend } from "resend";
import type { ContactMessage } from "@/server/db/schema";

const FROM = process.env.RESEND_FROM_EMAIL ?? "contato@conexus.com.br";
const NOTIFY = process.env.RESEND_NOTIFY_EMAIL ?? "conexus@conexus.com.br";

// Lazy-init: only construct the Resend client when a key is actually present.
// Instantiating `new Resend(undefined)` throws at module load, which would
// break `next build` / SSR even though email is meant to be optional.
let resendClient: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

// ─── Templates ────────────────────────────────────────────────────────────────

function leadNotificationHtml(message: ContactMessage): string {
  const serviceLabel = message.service ? `<strong>${message.service}</strong>` : "Não especificado";
  const whatsappLink = message.whatsapp
    ? `<a href="https://wa.me/${message.whatsapp.replace(/\D/g, "")}" style="color:#00A5B7">Abrir WhatsApp</a>`
    : "Não informado";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background:#0A0F1E; margin:0; padding:0; }
    .wrapper { max-width:600px; margin:0 auto; background:#111827; border-radius:12px; overflow:hidden; }
    .header { background:#00A5B7; padding:24px 32px; }
    .header h1 { color:#fff; margin:0; font-size:20px; font-weight:600; }
    .body { padding:32px; color:#B0BAC9; font-size:14px; line-height:1.6; }
    .field { margin-bottom:16px; }
    .field label { display:block; font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:#8892A4; margin-bottom:4px; }
    .field .value { color:#fff; font-size:15px; }
    .message-box { background:#0A0F1E; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:16px; color:#B0BAC9; margin-top:8px; }
    .footer { padding:16px 32px; text-align:center; font-size:12px; color:#8892A4; border-top:1px solid rgba(255,255,255,0.06); }
    .badge { display:inline-block; background:rgba(0,165,183,0.15); color:#00A5B7; padding:2px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Novo Lead recebido</h1>
    </div>
    <div class="body">
      <div class="field">
        <label>Nome</label>
        <div class="value">${message.name}</div>
      </div>
      <div class="field">
        <label>E-mail</label>
        <div class="value"><a href="mailto:${message.email}" style="color:#00A5B7">${message.email}</a></div>
      </div>
      ${message.company ? `<div class="field"><label>Empresa</label><div class="value">${message.company}</div></div>` : ""}
      <div class="field">
        <label>WhatsApp</label>
        <div class="value">${whatsappLink}</div>
      </div>
      <div class="field">
        <label>Serviço de interesse</label>
        <div class="value"><span class="badge">${serviceLabel}</span></div>
      </div>
      <div class="field">
        <label>Mensagem</label>
        <div class="message-box">${message.message.replace(/\n/g, "<br>")}</div>
      </div>
      ${message.utmSource ? `<div class="field"><label>Origem (UTM)</label><div class="value">${message.utmSource} / ${message.utmMedium ?? "n/d"} / ${message.utmCampaign ?? "n/d"}</div></div>` : ""}
    </div>
    <div class="footer">Conexus · Site Institucional · ${new Date().toLocaleDateString("pt-BR")}</div>
  </div>
</body>
</html>`;
}

function leadConfirmationHtml(name: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background:#0A0F1E; margin:0; padding:0; }
    .wrapper { max-width:600px; margin:0 auto; background:#111827; border-radius:12px; overflow:hidden; }
    .header { background:#00A5B7; padding:24px 32px; }
    .header h1 { color:#fff; margin:0; font-size:20px; font-weight:600; }
    .body { padding:32px; color:#B0BAC9; font-size:15px; line-height:1.7; }
    .cta { display:inline-block; margin-top:24px; background:#00A5B7; color:#fff; padding:12px 28px; border-radius:8px; text-decoration:none; font-weight:600; }
    .footer { padding:16px 32px; text-align:center; font-size:12px; color:#8892A4; border-top:1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Mensagem recebida </h1>
    </div>
    <div class="body">
      <p>Olá, <strong>${name}</strong>!</p>
      <p>Recebemos sua mensagem e nossa equipe entrará em contato em até <strong>48 horas úteis</strong>.</p>
      <p>Se preferir uma resposta mais rápida, fale direto pelo WhatsApp:</p>
      <a href="https://wa.me/5585985353536" class="cta">Falar no WhatsApp</a>
      <p style="margin-top:32px;font-size:13px;color:#8892A4">Conexus - Tecnologia que resolve. Simples assim.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Conexus Tecnologia</div>
  </div>
</body>
</html>`;
}

// ─── Exported functions ───────────────────────────────────────────────────────

/** Send internal lead notification to the Conexus team */
export async function sendLeadNotification(message: ContactMessage): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set - skipping email");
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: [NOTIFY],
    subject: `Novo lead: ${message.name}${message.service ? ` - ${message.service}` : ""}`,
    html: leadNotificationHtml(message),
    replyTo: message.email,
  });
}

/** Send confirmation to the lead */
export async function sendLeadConfirmation(
  email: string,
  name: string
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: [email],
    subject: "Recebemos sua mensagem - Conexus",
    html: leadConfirmationHtml(name),
  });
}
