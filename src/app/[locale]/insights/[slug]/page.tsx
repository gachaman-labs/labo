import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { extractHeadings, getPost, getPosts, slugify } from "@/lib/blog";
import { siteUrl, company } from "@data/site";
import { FieldTag } from "@/components/ui/Tags";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { JsonLd } from "@/components/JsonLd";

type P = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getPosts().map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const meta = await pageMetadata({ locale, path: `/insights/${slug}`, titleKey: "insights", title: post.meta.title, description: post.meta.summary });
  return { ...meta, robots: post.meta.draft ? { index: false, follow: false } : meta.robots };
}

export default async function InsightDetail({ params }: P) {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const tc = await getTranslations("common");
  const { meta, content } = post;
  const headings = extractHeadings(content);
  const related = getPosts().filter((p) => p.slug !== slug && p.category === meta.category).slice(0, 3);

  return (
    <>
      <article className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_260px]">
          <div className="max-w-3xl">
            <FieldTag>{t(`categories.${meta.category}`)}</FieldTag>
            {meta.draft ? <span className="ml-2 text-xs text-text-muted">{t("draft")}</span> : null}
            {locale === "ja" ? <p className="mt-3 text-sm text-text-muted">{t("koOnlyNotice")}</p> : null}
            <h1 className="mt-4 text-primary">{meta.title}</h1>
            <time className="mt-3 block text-sm text-text-muted" dateTime={meta.date}>{meta.date}</time>
            <div className="prose-article mt-10">
              <MDXRemote
                source={content}
                components={{
                  h2: ({ children }) => <h2 id={slugify(String(children))} className="text-primary">{children}</h2>,
                }}
              />
            </div>
          </div>
          {headings.length ? (
            <aside className="hidden lg:block">
              <nav aria-label={t("toc")} className="sticky top-24 text-sm">
                <p className="mb-3 font-semibold text-primary">{t("toc")}</p>
                <ul className="space-y-2 border-l border-border pl-4">
                  {headings.map((h) => (
                    <li key={h.id}><a href={`#${h.id}`} className="text-text-muted hover:text-accent">{h.text}</a></li>
                  ))}
                </ul>
              </nav>
            </aside>
          ) : null}
        </div>
      </article>

      {related.length ? (
        <section className="section bg-bg-subtle">
          <div className="container-page">
            <h2 className="text-primary">{t("related")}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/insights/${p.slug}`} className="card p-6 transition-shadow hover:shadow-lg">
                  <h3 className="text-primary">{p.title}</h3>
                  <p className="mt-2 text-sm text-text-muted">{p.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner title={t("ctaTitle")} desc={t("ctaDesc")} button={tc("contactCta")} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.title,
          description: meta.summary,
          datePublished: meta.date,
          inLanguage: "ko",
          mainEntityOfPage: `${siteUrl}/${locale}/insights/${slug}`,
          author: { "@type": "Organization", name: company.nameEn },
          publisher: { "@type": "Organization", name: company.nameEn },
        }}
      />
    </>
  );
}
