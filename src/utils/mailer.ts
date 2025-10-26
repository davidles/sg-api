import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const MAIL_FROM = process.env.MAIL_FROM || 'no-reply@example.com';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (transporter) return transporter;
  if (!SMTP_HOST) {
    // Fallback for development: log the email as JSON instead of sending
    transporter = nodemailer.createTransport({ jsonTransport: true } as any);
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  });
  return transporter;
};

export const sendMail = async (options: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}): Promise<void> => {
  const t = getTransporter();
  const from = options.from || MAIL_FROM;
  await t.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  });
};

export const sendResetPasswordEmail = async (to: string, resetUrl: string): Promise<void> => {
  const subject = 'Restablecer contraseña - Secretaría General';
  const text = `Para restablecer tu contraseña, hacé clic en el siguiente enlace o copialo en tu navegador:\n\n${resetUrl}\n\nSi no solicitaste este cambio, podés ignorar este mensaje.`;
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#0f172a">
    <h2 style="color:#0f172a;margin:0 0 12px">Restablecer contraseña</h2>
    <p>Para restablecer tu contraseña, hacé clic en el botón o usá el siguiente enlace:</p>
    <p style="margin:16px 0"><a href="${resetUrl}" style="background:#1d4ed8;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Restablecer contraseña</a></p>
    <p style="font-size:14px;color:#475569">Si el botón no funciona, copiá y pegá este enlace en tu navegador:</p>
    <p style="word-break:break-all;font-size:12px;color:#334155">${resetUrl}</p>
    <p style="font-size:12px;color:#64748b">Si no solicitaste este cambio, ignorá este mensaje.</p>
  </div>`;
  await sendMail({ to, subject, text, html });
};
