import type { MetadataRoute } from "next";
import { siteUrl } from "@data/site";
import { routing } from "@/i18n/routing";
import { services } from "@data/services";
import { industries } from "@data/industries";
import { publishedCases } from "@data/cases";
import { getPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "", "/about", "/services", "/industries", "/cases", "/insights", "/contact", "/company", "/privacy",
    ...services.map((s) => `/services/${s.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    ...publishedCases().map((c) => `/cases/${c.slug}`),
    ...getPosts().filter((p) => !p.draft).map((p) => `/insights/${p.slug}`),
  ];
  return paths.flatMap((path) => {
    const hasJa = !path.startsWith("/insights");
    const languages: Record<string, string> = { ko: `${siteUrl}/ko${path}` };
    if (hasJa) languages.ja = `${siteUrl}/ja${path}`;
    // 인사이트는 한국어 본문이라 ko 만 올린다.
    return routing.locales
      .filter((l) => l === "ko" || hasJa)
      .map((l) => ({ url: `${siteUrl}/${l}${path}`, alternates: { languages } }));
  });
}
