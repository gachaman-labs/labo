import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { categories, getPosts, type Category } from "@/lib/blog";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FieldTag } from "@/components/ui/Tags";
import { Todo } from "@/components/ui/Todo";

const PAGE_SIZE = 6;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = await pageMetadata({ locale, path: "/insights", titleKey: "insights" });
  return { ...meta, alternates: { ...meta.alternates, types: { "application/rss+xml": "/rss.xml" } } };
}

export default async function Insights({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const tc = await getTranslations("common");

  const category = categories.includes(sp.category as Category) ? (sp.category as Category) : undefined;
  const all = getPosts().filter((p) => !category || p.category === category);
  const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(sp.page) || 1), pages);
  const posts = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const href = (c?: string, p?: number) => {
    const q = new URLSearchParams();
    if (c) q.set("category", c);
    if (p && p > 1) q.set("page", String(p));
    const s = q.toString();
    return `/insights${s ? `?${s}` : ""}`;
  };
  const chip = (on: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium ${on ? "border-primary bg-primary text-white" : "border-border bg-white text-text hover:border-primary"}`;

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
          {locale === "ja" && getPosts().length ? <p className="mt-4 text-sm text-text-muted">{t("koOnlyNotice")}</p> : null}
          <a href="/rss.xml" className="mt-6 inline-block text-sm font-semibold text-accent">{t("rss")}</a>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap gap-2" role="group">
            <Link href={href()} className={chip(!category)}>{tc("all")}</Link>
            {categories.map((c) => (
              <Link key={c} href={href(c)} className={chip(category === c)}>{t(`categories.${c}`)}</Link>
            ))}
          </div>

          {posts.length ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.slug} href={`/insights/${p.slug}`} className="card flex h-full flex-col p-6 transition-shadow hover:shadow-lg">
                  <div className="flex flex-wrap items-center gap-2">
                    <FieldTag>{t(`categories.${p.category}`)}</FieldTag>
                    {p.draft ? <span className="text-xs text-text-muted">{t("draft")}</span> : null}
                  </div>
                  <h2 className="mt-4 text-xl text-primary">{p.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-text-muted">{p.summary}</p>
                  <time className="mt-4 text-sm text-text-muted" dateTime={p.date}>{p.date}</time>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10"><Todo label={t("empty")} /></div>
          )}

          {pages > 1 ? (
            <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
              {page > 1 ? <Link href={href(category, page - 1)} className="btn-secondary !py-2">{t("prev")}</Link> : null}
              <span className="text-sm text-text-muted">{page} / {pages}</span>
              {page < pages ? <Link href={href(category, page + 1)} className="btn-secondary !py-2">{t("next")}</Link> : null}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
