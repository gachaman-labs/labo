import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { company } from "@data/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TodoText } from "@/components/ui/Todo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/company", titleKey: "company" });
}

// 법무 검토 필요: 상호·소재지·사업자 정보는 등기/사업자등록 내용과 일치해야 한다.
export default async function Company({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("company");
  const rep = locale === "ja" ? company.representativeJa : company.representative;
  const rows: [string, React.ReactNode][] = [
    [t("rows.name"), locale === "ja" ? company.nameJa : company.nameKo],
    [t("rows.nameEn"), company.nameEn],
    [t("rows.nameJa"), company.nameJa],
    [t("rows.representative"), rep],
    [t("rows.established"), <TodoText key="est" value={company.established} />],
    [t("rows.address"), <TodoText key="addr" value={company.address} />],
    [t("rows.registration"), <TodoText key="reg" value={company.registration} />],
    [t("rows.business"), t("businessValue")],
    [t("rows.phone"), <TodoText key="tel" value={company.phone} />],
    [t("rows.email"), <TodoText key="mail" value={company.email} />],
  ];

  return (
    <section className="section">
      <div className="container-page">
        <SectionTitle as="h1" title={t("title")} />
        <dl className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
              <dt className="font-semibold text-primary">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
