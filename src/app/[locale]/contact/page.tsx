import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { company } from "@data/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TodoText } from "@/components/ui/Todo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/contact", titleKey: "contact" });
}

// 문의는 채널톡(우하단 위젯)으로 받는다. 키는 NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY. 아직 연결 전이다.
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        </div>
      </section>
      <section className="section">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl text-primary">{t("channel.title")}</h2>
            <p className="mt-3 text-text-muted">{t("channel.body")}</p>
          </div>
          <div className="card p-6">
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
          </div>
        </div>
      </section>
    </>
  );
}
