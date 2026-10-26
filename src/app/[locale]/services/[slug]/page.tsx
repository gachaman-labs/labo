import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { services } from "@data/services";
import { publishedCases } from "@data/cases";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StageBadge } from "@/components/ui/Tags";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Todo } from "@/components/ui/Todo";

type P = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!services.some((s) => s.slug === slug)) return {};
  const t = await getTranslations({ locale, namespace: "services.items" });
  return pageMetadata({ locale, path: `/services/${slug}`, titleKey: "services", title: t(`${slug}.title`), description: t(`${slug}.summary`) });
}

export default async function ServiceDetail({ params }: P) {
  const { locale, slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tc = await getTranslations("common");
  const tcase = await getTranslations("cases.items");
  // 서비스별 관련 실적 연결은 실적 상세가 정해지면 data/cases.ts 에 필드를 추가해 필터링한다.
  const related = publishedCases().slice(0, 0);

  // TODO: 서비스별 세부 문구(필요한 기업, 수행 내용, 산출물, 진행 방식)
  const todoSections = ["need", "tasks", "deliverables", "process"] as const;

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <StageBadge stage={service.stage} label={tc(`stage.${service.stage}`)} />
          <div className="mt-4">
            <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t(`items.${slug}.title`)} desc={t(`items.${slug}.summary`)} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10">
          <div>
            <h2 className="text-primary">{t("sections.overview")}</h2>
            <p className="mt-4 max-w-3xl text-lg">{t(`items.${slug}.summary`)}</p>
          </div>
          {todoSections.map((k) => (
            <div key={k}>
              <h2 className="text-primary">{t(`sections.${k}`)}</h2>
              <div className="mt-4 max-w-3xl"><Todo /></div>
            </div>
          ))}
          <div>
            <h2 className="text-primary">{t("sections.relatedCases")}</h2>
            <div className="mt-4 max-w-3xl">
              {related.length ? (
                <ul className="list-disc pl-5">
                  {related.map((c) => <li key={c.slug}>{tcase(`${c.slug}.title`)}</li>)}
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
