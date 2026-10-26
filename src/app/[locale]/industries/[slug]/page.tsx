import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { industries, type IndustrySlug } from "@data/industries";
import { publishedCases } from "@data/cases";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Todo } from "@/components/ui/Todo";

type P = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => industries.map((i) => ({ locale, slug: i.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!industries.some((i) => i.slug === slug)) return {};
  const t = await getTranslations({ locale, namespace: "industries.items" });
  return pageMetadata({ locale, path: `/industries/${slug}`, titleKey: "industries", title: t(`${slug}.title`), description: t(`${slug}.summary`) });
}

export default async function IndustryDetail({ params }: P) {
  const { locale, slug } = await params;
  if (!industries.some((i) => i.slug === slug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("industries");
  const tcase = await getTranslations("cases.items");
  const tc = await getTranslations("common");
  const related = publishedCases().filter((c) => c.fields.includes(slug as IndustrySlug));

  // 시장 특징·지원 내용은 출처 있는 내용으로 채울 것 (출처 없는 수치 금지)
  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t(`items.${slug}.title`)} desc={t(`items.${slug}.summary`)} />
        </div>
      </section>
      <section className="section">
        <div className="container-page grid gap-10">
          {(["market", "support"] as const).map((k) => (
            <div key={k}>
              <h2 className="text-primary">{t(`sections.${k}`)}</h2>
              <div className="mt-4 max-w-3xl"><Todo /></div>
            </div>
          ))}
          <div>
            <h2 className="text-primary">{t("sections.cases")}</h2>
            <div className="mt-4 max-w-3xl">
              {related.length ? (
                <ul className="list-disc pl-5">
                  {related.map((c) => <li key={c.slug}>{tcase(`${c.slug}.title`)} ({c.year})</li>)}
                </ul>
              ) : (
                <Todo label={t("noRelatedCases")} />
              )}
            </div>
          </div>
        </div>
      </section>
      <CtaBanner title={t("sections.ctaTitle")} desc={t("sections.ctaDesc")} button={tc("contactCta")} />
    </>
  );
}
