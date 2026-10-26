import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteUrl } from "@data/site";
import { routing } from "@/i18n/routing";

type Args = { locale: string; path: string; titleKey: string; title?: string; description?: string };

// 페이지별 title/description/canonical/hreflang/OG 를 만든다.
// 인사이트(블로그) 본문은 한국어뿐이므로 /ja 의 인사이트 경로는 noindex 로 두고 canonical 을 /ko 로 보낸다.
export async function pageMetadata({ locale, path, titleKey, title, description }: Args): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const hasJa = !path.startsWith("/insights");
  const url = `${siteUrl}/${locale}${path}`;
  const languages: Record<string, string> = { ko: `${siteUrl}/ko${path}` };
  if (hasJa) languages.ja = `${siteUrl}/ja${path}`;
  languages["x-default"] = languages[routing.defaultLocale];

  const resolvedTitle = title ?? t(`${titleKey}.title`);
  const resolvedDescription = description ?? t(`${titleKey}.description`);
  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: hasJa ? url : `${siteUrl}/ko${path}`, languages },
    openGraph: { title: resolvedTitle, description: resolvedDescription, url, locale: locale === "ja" ? "ja_JP" : "ko_KR", type: "website" },
    robots: locale === "ja" && !hasJa ? { index: false, follow: true } : undefined,
  };
}
