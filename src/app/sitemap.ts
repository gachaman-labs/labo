import type { MetadataRoute } from "next";
import { siteUrl } from "@data/site";
import { jaCorePaths, routing } from "@/i18n/routing";
import { services } from "@data/services";
import { industries } from "@data/industries";
import { publishedCases } from "@data/cases";
import { getPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "", "/about", "/services", "/industries", "/cases", "/insights", "/contact", "/company", "/privacy",
    ...services.map((s) => `/services/${s.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    ...publishedCases().map((c) => `/cases/${c.slug}`),
    ...getPosts().filter((p) => !p.draft).map((p) => `/insights/${p.slug}`),
  ];
  return paths.flatMap((path) => {
    const hasJa = jaCorePaths.includes(path);
    const languages: Record<string, string> = { ko: `${siteUrl}/ko${path}` };
    if (hasJa) languages.ja = `${siteUrl}/ja${path}`;
    // 일본어 핵심 페이지만 sitemap 에 올린다. 나머지 /ja 경로는 noindex.
    return routing.locales
      .filter((l) => l === "ko" || hasJa)
      .map((l) => ({ url: `${siteUrl}/${l}${path}`, alternates: { languages } }));
  });
}
