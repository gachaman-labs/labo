import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteUrl } from "@data/site";
import { jaCorePaths, routing } from "@/i18n/routing";

type Args = { locale: string; path: string; titleKey: string; title?: string; description?: string };

// 페이지별 title/description/canonical/hreflang/OG 를 만든다.
// 일본어 핵심 페이지가 아닌 /ja 경로는 한국어 문구가 섞이므로 noindex 로 둔다.
export async function pageMetadata({ locale, path, titleKey, title, description }: Args): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const hasJa = jaCorePaths.includes(path);
  const url = `${siteUrl}/${locale}${path}`;
  const languages: Record<string, string> = { ko: `${siteUrl}/ko${path}` };
  if (hasJa) languages.ja = `${siteUrl}/ja${path}`;
  languages["x-default"] = languages.ko;

  const resolvedTitle = title ?? t(`${titleKey}.title`);
  const resolvedDescription = description ?? t(`${titleKey}.description`);
  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: hasJa || locale === routing.defaultLocale ? url : `${siteUrl}/ko${path}`, languages },
    openGraph: { title: resolvedTitle, description: resolvedDescription, url, locale: locale === "ja" ? "ja_JP" : "ko_KR", type: "website" },
    robots: locale === "ja" && !hasJa ? { index: false, follow: true } : undefined,
  };
}
