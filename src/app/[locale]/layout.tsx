import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteUrl, company } from "@data/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChannelTalk } from "@/components/ChannelTalk";
import { JsonLd } from "@/components/JsonLd";
import "../globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#12284C" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${t("siteName")} | Two Hands Meta`, template: `%s | ${t("siteName")}` },
    description: t("defaultDescription"),
    openGraph: { siteName: t("siteName"), type: "website" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <ChannelTalk />
        </NextIntlClientProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: company.nameEn,
            alternateName: company.nameKo,
            url: siteUrl,
            founder: { "@type": "Person", name: company.representative },
          }}
        />
      </body>
    </html>
  );
}
