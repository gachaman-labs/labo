import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { company } from "@data/site";
import { services } from "@data/services";
import { industries } from "@data/industries";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TodoText } from "@/components/ui/Todo";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/contact", titleKey: "contact" });
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const ts = await getTranslations("services.items");
  const ti = await getTranslations("industries.items");

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        </div>
      </section>
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_320px]">
          <ContactForm
            services={services.map((s) => ({ id: s.slug, label: ts(`${s.slug}.title`) }))}
            industries={industries.map((i) => ({ id: i.slug, label: ti(`${i.slug}.title`) }))}
          />
          <aside className="card h-fit p-6">
            <h2 className="text-xl text-primary">{t("direct.title")}</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-text-muted">{t("direct.email")}</dt>
                <dd><TodoText value={company.email} /></dd>
              </div>
              <div>
                <dt className="font-semibold text-text-muted">{t("direct.booking")}</dt>
                <dd>
                  {company.bookingUrl !== "TODO" ? (
                    <a href={company.bookingUrl} className="text-accent underline" target="_blank" rel="noopener noreferrer">{t("direct.bookingLink")}</a>
                  ) : (
                    <TodoText value="TODO" />
                  )}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
