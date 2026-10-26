import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { publishedCases } from "@data/cases";
import { industries } from "@data/industries";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CaseList } from "@/components/CaseList";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/cases", titleKey: "cases" });
}

export default async function Cases({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const ti = await getTranslations("industries.items");
  const items = publishedCases().map((c) => ({
    slug: c.slug,
    title: t(`items.${c.slug}.title`),
    year: c.year,
    fieldIds: c.fields as string[],
    fieldLabels: c.fields.map((f) => ti(`${f}.title`)),
  }));

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <CaseList items={items} fields={industries.map((i) => ({ id: i.slug, label: ti(`${i.slug}.title`) }))} />
        </div>
      </section>
    </>
  );
}
