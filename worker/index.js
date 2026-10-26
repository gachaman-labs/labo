// Cloudflare Worker: 브라우저 -> (이 프록시) -> Claude API.
// API 키는 `wrangler secret put ANTHROPIC_API_KEY` 로만 저장하고 프론트에 두지 않는다.
const SYSTEM = `당신은 Gachaman Labs(웹·앱·AI 개발 소프트웨어 연구소)의 문의 응대 도우미입니다.
회사 정보: 서비스는 웹 개발, 모바일 앱, AI 도입. 첫 프로토타입 약 2주, 일반 웹 프로젝트 4~8주.
연락처: hello@example.com, 02-0000-0000. 견적은 영업일 2일 내 회신.
모르는 내용이나 가격 확정은 추측하지 말고 담당자 연락처를 안내하세요. 한국어로 간결하게 답하세요.`;

const CORS = {
  "access-control-allow-origin": "*", // 배포 시 실제 사이트 도메인으로 제한하세요
  "access-control-allow-headers": "content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: CORS });

    const { messages } = await req.json();
    const trimmed = (messages || []).slice(-10).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 1000),
    }));

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: "claude-haiku-5-5", max_tokens: 500, system: SYSTEM, messages: trimmed }),
    });
    if (!res.ok) return new Response(JSON.stringify({ error: "upstream" }), { status: 502, headers: CORS });
    const data = await res.json();
    return new Response(JSON.stringify({ reply: data.content?.[0]?.text ?? "" }), {
      headers: { ...CORS, "content-type": "application/json" },
    });
  },
};
