import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  company?: string;
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
};

const MAX_COMPANY_LENGTH = 120;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_TOPIC_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 3000;

const sanitize = (value: unknown, maxLength: number): string => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const isEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export async function POST(request: Request) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const contactTo = process.env.CONTACT_TO ?? gmailUser;
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!gmailUser || !gmailAppPassword || !contactTo) {
    return NextResponse.json(
      { message: "Server mail configuration is missing." },
      { status: 500 }
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 }
    );
  }

  const company = sanitize(body.company, MAX_COMPANY_LENGTH);
  const name = sanitize(body.name, MAX_NAME_LENGTH);
  const email = sanitize(body.email, MAX_EMAIL_LENGTH);
  const topic = sanitize(body.topic, MAX_TOPIC_LENGTH);
  const message = sanitize(body.message, MAX_MESSAGE_LENGTH);

  if (!name || !email || !topic || !message) {
    return NextResponse.json(
      { message: "Required fields are missing." },
      { status: 400 }
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { message: "Email format is invalid." },
      { status: 400 }
    );
  }

  const submittedAt = new Date().toISOString();
  const subject = `[Ligare] お問い合わせ: ${topic}`;
  const text = [
    "お問い合わせを受信しました。",
    "",
    `送信日時: ${submittedAt}`,
    `会社名: ${company || "(未入力)"}`,
    `名前: ${name}`,
    `メールアドレス: ${email}`,
    `相談内容: ${topic}`,
    "",
    "メッセージ:",
    message,
  ].join("\n");

  const slackText = [
    "📩 *Ligare お問い合わせ通知*",
    `送信日時: ${submittedAt}`,
    `会社名: ${company || "(未入力)"}`,
    `名前: ${name}`,
    `メールアドレス: ${email}`,
    `相談内容: ${topic}`,
    "メッセージ:",
    message,
  ].join("\n");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: `"Ligare Contact" <${gmailUser}>`,
      to: contactTo,
      replyTo: email,
      subject,
      text,
    });

    if (slackWebhookUrl) {
      const slackResponse = await fetch(slackWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: slackText,
        }),
      });

      if (!slackResponse.ok) {
        throw new Error(`Failed to send Slack notification: ${slackResponse.status}`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to process contact request:", error);
    return NextResponse.json(
      { message: "Failed to send message." },
      { status: 500 }
    );
  }
}
