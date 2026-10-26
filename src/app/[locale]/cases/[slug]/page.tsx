import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { publishedCases } from "@data/cases";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FieldTag } from "@/components/ui/Tags";
import { Todo } from "@/components/ui/Todo";
import { Link } from "@/i18n/navigation";

type P = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => publishedCases().map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!publishedCases().some((c) => c.slug === slug)) return {};
  const t = await getTranslations({ locale, namespace: "cases.items" });
  return pageMetadata({ locale, path: `/cases/${slug}`, titleKey: "cases", title: t(`${slug}.title`) });
}

// TODO: 실적 상세 내용. 현재는 카드와 같은 정보만 보여준다.
export default async function CaseDetail({ params }: P) {
  const { locale, slug } = await params;
  const item = publishedCases().find((c) => c.slug === slug);
  if (!item) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const ti = await getTranslations("industries.items");
  const tc = await getTranslations("common");

  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-wrap gap-2">
          {item.fields.map((f) => <FieldTag key={f}>{ti(`${f}.title`)}</FieldTag>)}
        </div>
        <div className="mt-4">
          <SectionTitle as="h1" title={t(`items.${slug}.title`)} desc={String(item.year)} />
        </div>
        <div className="mt-10 max-w-3xl"><Todo label={t("detailPending")} /></div>
        <Link href="/cases" className="btn-secondary mt-10">{tc("back")}</Link>
      </div>
    </section>
  );
}
