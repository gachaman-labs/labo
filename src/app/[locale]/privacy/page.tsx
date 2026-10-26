import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/ui/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/privacy", titleKey: "privacy" });
}

// 법무 검토 필요: 이 문구는 초안이다. 게시 전에 한국(개인정보 보호법)과 일본(個人情報保護法) 요건을 검토할 것.
// 시행일(updated)도 확정 후 기재한다.
export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as { title: string; body: string }[];

  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <SectionTitle as="h1" title={t("title")} />
        <p className="mt-6 rounded-card border border-dashed border-border bg-bg-subtle px-4 py-3 text-sm text-text-muted">{t("legalNote")}</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl text-primary">{s.title}</h2>
              <p className="mt-2">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
