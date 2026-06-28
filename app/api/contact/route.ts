import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTACT_TO = process.env.CONTACT_TO ?? "gutentscheiden@simplyrational.de";
const CONTACT_FROM = process.env.CONTACT_FROM ?? "Kontaktformular <kontakt@simplyrational.de>";

const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitHits.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );
  hits.push(now);
  rateLimitHits.set(ip, hits);

  if (rateLimitHits.size > 5000) {
    for (const [key, times] of rateLimitHits) {
      if (times.every((time) => now - time >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitHits.delete(key);
      }
    }
  }

  return hits.length > RATE_LIMIT_MAX;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const data = (payload ?? {}) as Record<string, unknown>;

  if (asString(data.company) !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = asString(data.name);
  const email = asString(data.email);
  const subject = asString(data.subject);
  const message = asString(data.message);
  const privacy = data.privacy === true;

  if (
    !name ||
    name.length > MAX_NAME ||
    !email ||
    email.length > MAX_EMAIL ||
    !EMAIL_PATTERN.test(email) ||
    !subject ||
    subject.length > MAX_SUBJECT ||
    !message ||
    message.length > MAX_MESSAGE ||
    !privacy
  ) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Kontaktformular: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nBetreff: ${subject}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Betreff:</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });

    if (error) {
      console.error("Contact form: Resend error", error);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Contact form: send failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
