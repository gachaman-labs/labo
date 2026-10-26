// 문의 도우미. CHAT_ENDPOINT에 프록시 URL(worker/ 참고)을 넣으면 Claude가 답하고,
// 비워 두면 아래 FAQ 키워드 매칭으로 답한다.
const CHAT_ENDPOINT = "";

const FAQ = [
  { k: ["가격", "비용", "견적", "얼마"], a: "프로젝트 범위에 따라 달라집니다. 요구사항을 알려주시면 영업일 2일 내 견적을 보내드립니다. (hello@example.com)" },
  { k: ["기간", "얼마나 걸", "일정"], a: "첫 프로토타입은 보통 2주, 일반적인 웹 프로젝트는 4~8주 정도 걸립니다." },
  { k: ["서비스", "개발", "앱", "웹", "ai"], a: "웹 개발, 모바일 앱, AI 도입(업무 자동화·문의 응대 에이전트)을 제공합니다." },
  { k: ["연락", "전화", "이메일", "메일"], a: "이메일 hello@example.com, 전화 02-0000-0000 으로 연락 주세요." },
];
const FALLBACK = "정확한 답변을 위해 담당자 확인이 필요합니다. hello@example.com 으로 문의 내용을 보내주세요.";

const $ = (id) => document.getElementById(id);
const log = $("chat-log");
const history = [];

function add(role, text) {
  const el = document.createElement("div");
  el.className = "msg " + (role === "user" ? "user" : "bot");
  el.textContent = text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

async function reply(text) {
  if (CHAT_ENDPOINT) {
    const res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return (await res.json()).reply;
  }
  const t = text.toLowerCase();
  const hit = FAQ.find((f) => f.k.some((w) => t.includes(w)));
  return hit ? hit.a : FALLBACK;
}

$("chat-toggle").onclick = () => {
  $("chat").hidden = !$("chat").hidden;
  if (!log.children.length) add("bot", "안녕하세요! Gachaman Labs 문의 도우미입니다. 서비스, 일정, 비용 등 무엇이든 물어보세요.");
};
$("chat-close").onclick = () => ($("chat").hidden = true);

$("chat-form").onsubmit = async (e) => {
  e.preventDefault();
  const input = $("chat-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  add("user", text);
  history.push({ role: "user", content: text });
  try {
    const answer = await reply(text);
    history.push({ role: "assistant", content: answer });
    add("bot", answer);
  } catch {
    add("bot", FALLBACK);
  }
};
