import { getPosts } from "@/lib/blog";
import { siteUrl } from "@data/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const dynamic = "force-static";

export function GET() {
  const items = getPosts()
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${siteUrl}/ko/insights/${p.slug}</link><guid>${siteUrl}/ko/insights/${p.slug}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>투핸즈메타 인사이트</title><link>${siteUrl}/ko/insights</link><description>일본 비즈니스 인사이트</description><language>ko</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
