import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { industries } from "@data/industries";
import { SectionTitle } from "@/components/ui/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/industries", titleKey: "industries" });
}

export default async function Industries({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industries");

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        </div>
      </section>
      <section className="section">
        <div className="container-page grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <Link key={i.slug} href={`/industries/${i.slug}`} className="card group flex h-full flex-col p-6 transition-shadow hover:shadow-lg">
              <h3 className="text-primary">{t(`items.${i.slug}.title`)}</h3>
              <p className="mt-3 flex-1 text-text-muted">{t(`items.${i.slug}.summary`)}</p>
              <span aria-hidden className="mt-5 text-xl text-accent transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
