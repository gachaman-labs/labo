import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { categories, getPosts } from "@/lib/blog";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Todo } from "@/components/ui/Todo";
import { InsightList } from "@/components/InsightList";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = await pageMetadata({ locale, path: "/insights", titleKey: "insights" });
  return { ...meta, alternates: { ...meta.alternates, types: { "application/rss+xml": "/rss.xml" } } };
}

export default async function Insights({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const posts = getPosts();

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
          {locale === "ja" && posts.length ? <p className="mt-4 text-sm text-text-muted">{t("koOnlyNotice")}</p> : null}
          <a href="/rss.xml" className="mt-6 inline-block text-sm font-semibold text-accent">{t("rss")}</a>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          {posts.length ? (
            <InsightList posts={posts.map((p) => ({ ...p }))} categories={[...categories]} />
          ) : (
            <Todo label={t("empty")} />
          )}
        </div>
      </section>
    </>
  );
}
