import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { services } from "@data/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StageBadge } from "@/components/ui/Tags";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ServiceCard } from "@/components/ServiceCard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/services", titleKey: "services" });
}

export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tc = await getTranslations("common");
  const th = await getTranslations("home.cta");

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        </div>
      </section>
      <section className="section">
        <div className="container-page grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.slug} className="flex flex-col gap-3">
              <div><StageBadge stage={s.stage} label={tc(`stage.${s.stage}`)} /></div>
              <div className="flex-1">
                <ServiceCard index={i + 1} slug={s.slug} title={t(`items.${s.slug}.title`)} summary={t(`items.${s.slug}.summary`)} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <CtaBanner title={th("title")} desc={th("desc")} button={th("button")} />
    </>
  );
}
