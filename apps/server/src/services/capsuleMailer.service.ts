import nodemailer from "nodemailer";
import { Resend } from "resend";

interface CapsuleEmail {
  recipientEmail: string;
  subject: string;
  message: string;
  paperColor: string;
  decoration: string;
  stamps: string[];
}

const paperColors: Record<string, string> = {
  ivory: "#f5f0df",
  rose: "#f4e0e9",
  sky: "#dfebee",
  sage: "#e3eadc",
};

const decorations: Record<string, string> = {
  botanical: "Folhas prensadas",
  celestial: "Pequeno céu",
  pressed: "Flores delicadas",
};

const stampMarks: Record<string, string> = {
  flower: "✿",
  star: "✦",
  heart: "♥",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function createEmailContent(capsule: CapsuleEmail) {
  const background = paperColors[capsule.paperColor] ?? paperColors.ivory;
  const decoration = decorations[capsule.decoration] ?? decorations.botanical;
  const stamps = capsule.stamps
    .map((stamp) => stampMarks[stamp] ?? "")
    .filter(Boolean)
    .join("  ");
  const message = escapeHtml(capsule.message).replace(/\r?\n/g, "<br>");

  return {
    text: `${capsule.message}\n\nSua cápsula do tempo chegou.`,
    html: `<div style="margin:0;padding:40px 16px;background:#f8eaf0;font-family:Georgia,serif;color:#52293c"><div style="max-width:560px;margin:auto;padding:38px 34px;background:${background};border:1px solid #d6aaba"><p style="margin:0 0 24px;font:11px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#875d70">Uma carta do seu eu de dois anos atrás</p><p style="margin:0 0 12px;font:italic 14px Arial,sans-serif;color:#875d70">${escapeHtml(decoration)} ${stamps}</p><h1 style="margin:0 0 28px;font-size:30px;font-weight:400">${escapeHtml(capsule.subject)}</h1><div style="font-size:17px;line-height:1.8">${message}</div><p style="margin:36px 0 0;font:italic 15px Georgia,serif;color:#875d70">Com carinho, do seu eu de antes.</p></div></div>`,
  };
}

export async function sendCapsuleEmail(capsule: CapsuleEmail): Promise<void> {
  const content = createEmailContent(capsule);
  const from = process.env.MAIL_FROM ?? "Cápsula do tempo <cartas@capsula.local>";

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from,
      to: capsule.recipientEmail,
      subject: capsule.subject,
      text: content.text,
      html: content.html,
    });
    if (error) throw new Error(error.message);
    return;
  }

  const port = Number(process.env.SMTP_PORT) || 1025;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
  });

  await transporter.sendMail({
    from,
    to: capsule.recipientEmail,
    subject: capsule.subject,
    text: content.text,
    html: content.html,
  });
}