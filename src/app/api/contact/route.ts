import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { services } from "@data/services";
import { industries } from "@data/industries";

export const runtime = "nodejs";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`contact:${ip}`)) return NextResponse.json({ ok: false }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // honeypot: 봇은 숨은 필드를 채운다. 성공한 것처럼 응답하고 버린다.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const company = oneLine(clean(body.company, 100));
  const name = oneLine(clean(body.name, 60));
  const email = oneLine(clean(body.email, 120));
  const phone = oneLine(clean(body.phone, 40));
  const message = clean(body.message, 4000);
  const industry = clean(body.industry, 30);
  const picked = (Array.isArray(body.services) ? body.services : []).filter(
    (s): s is string => typeof s === "string" && services.some((x) => x.slug === s),
  );

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const industryOk = industry === "" || industries.some((i) => i.slug === industry);
  if (!company || !name || !emailOk || !message || body.consent !== true || !industryOk) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    // TODO: 수신 주소와 발송 서비스 확정 후 환경변수 설정
    if (process.env.NODE_ENV !== "production") {
      console.warn("[contact] 메일 환경변수가 없어 발송하지 않고 로그만 남깁니다.", { company, name, email });
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const text = [
    `회사명: ${company}`,
    `담당자명: ${name}`,
    `이메일: ${email}`,
    `연락처: ${phone || "-"}`,
    `관심 서비스: ${picked.join(", ") || "-"}`,
    `관심 분야: ${industry || "-"}`,
    `언어: ${clean(body.locale, 5) || "-"}`,
    "",
    message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `[홈페이지 문의] ${company} / ${name}`,
      text,
    }),
  });
  if (!res.ok) return NextResponse.json({ ok: false }, { status: 502 });
  return NextResponse.json({ ok: true });
}
