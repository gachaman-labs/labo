import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { addressOf, company } from "@data/site";
import { SectionTitle } from "@/components/ui/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/contact", titleKey: "contact" });
}

// 문의는 채널톡(우하단 위젯)으로 받는다. 키는 NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY. 아직 연결 전이다.
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  // 지도 검색은 일본어 주소가 정확하다.
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address.ja)}`;

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
            <h2 className="text-xl text-primary">{t("office.title")}</h2>
            <p className="mt-4">{addressOf(locale)}</p>
            <a href={mapUrl} className="mt-3 inline-block text-sm text-accent underline" target="_blank" rel="noopener noreferrer">{t("office.map")}</a>
            {company.bookingUrl !== "TODO" ? (
              <p className="mt-4 text-sm">
                <a href={company.bookingUrl} className="text-accent underline" target="_blank" rel="noopener noreferrer">{t("direct.bookingLink")}</a>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
