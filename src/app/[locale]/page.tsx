import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { services } from "@data/services";
import { industries } from "@data/industries";
import { publishedCases } from "@data/cases";
import { getPosts, type Category } from "@/lib/blog";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StageBadge, FieldTag } from "@/components/ui/Tags";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ServiceCard } from "@/components/ServiceCard";
import { CaseCard } from "@/components/CaseCard";
import { Todo } from "@/components/ui/Todo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "", titleKey: "home" });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const ts = await getTranslations("services.items");
  const ti = await getTranslations("industries.items");
  const tcase = await getTranslations("cases.items");
  const tcat = await getTranslations("insights.categories");
  const steps = t.raw("process.steps") as { title: string; desc: string }[];
  const cases = publishedCases().slice(0, 3);
  const posts = getPosts().slice(0, 3);
  const design = services.filter((s) => s.stage === "design");
  const execute = services.filter((s) => s.stage === "execute");

  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-page section">
          <p className="fade-up mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white/80">
            <span aria-hidden className="h-2 w-2 rounded-full bg-highlight" />
            {t("hero.eyebrow")}
          </p>
          <h1 className="fade-up max-w-4xl text-white">{t("hero.title")}</h1>
          <p className="fade-up mt-6 max-w-2xl text-lg text-white/80">{t("hero.sub")}</p>
          <div className="fade-up mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">{tc("contactCta")}</Link>
            <Link href="/services" className="btn-secondary-inv">{tc("servicesCta")}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionTitle eyebrow={t("roadmap.eyebrow")} title={t("roadmap.title")} desc={t("roadmap.desc")} />
          <div className="mt-12 grid gap-8 lg:grid-cols-[3fr_2fr]">
            {[
              { stage: "design" as const, list: design, offset: 0 },
              { stage: "execute" as const, list: execute, offset: design.length },
            ].map(({ stage, list, offset }) => (
              <div key={stage}>
                <StageBadge stage={stage} label={tc(`stage.${stage}`)} />
                <div className={`mt-4 grid gap-4 ${stage === "design" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                  {list.map((s, i) => (
                    <ServiceCard key={s.slug} index={offset + i + 1} slug={s.slug} title={ts(`${s.slug}.title`)} summary={ts(`${s.slug}.summary`)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-bg-subtle">
        <div className="container-page">
          <SectionTitle eyebrow={t("industries.eyebrow")} title={t("industries.title")} desc={t("industries.desc")} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((i) => (
              <Link key={i.slug} href={`/industries/${i.slug}`} className="card flex h-full flex-col p-5 transition-shadow hover:shadow-lg">
                <h3 className="text-primary">{ti(`${i.slug}.title`)}</h3>
                <p className="mt-2 flex-1 text-sm text-text-muted">{ti(`${i.slug}.summary`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow={t("cases.eyebrow")} title={t("cases.title")} desc={t("cases.desc")} />
            <Link href="/cases" className="font-semibold text-accent">{tc("viewAll")} →</Link>
          </div>
          {cases.length ? (
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {cases.map((c) => (
                <CaseCard key={c.slug} title={tcase(`${c.slug}.title`)} year={c.year} tags={c.fields.map((f) => ti(`${f}.title`))} />
              ))}
            </div>
          ) : (
            <div className="mt-12"><Todo label={t("cases.empty")} /></div>
          )}
        </div>
      </section>

      <section className="section bg-bg-subtle">
        <div className="container-page">
          <SectionTitle eyebrow={t("process.eyebrow")} title={t("process.title")} desc={t("process.desc")} />
          <ol className="mt-12 grid gap-4 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title} className="card p-5">
                <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{s.desc}</p>
                {/* TODO: 단계별 소요 기간 확정 후 표시 */}
                <p className="mt-3 text-xs text-text-muted">{t("process.duration")}: {tc("pending")}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow={t("insights.eyebrow")} title={t("insights.title")} desc={t("insights.desc")} />
            <Link href="/insights" className="font-semibold text-accent">{tc("viewAll")} →</Link>
          </div>
          {posts.length ? (
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.slug} href={`/insights/${p.slug}`} className="card flex h-full flex-col p-6 transition-shadow hover:shadow-lg">
                  <FieldTag>{tcat(p.category as Category)}</FieldTag>
                  <h3 className="mt-4 text-primary">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-text-muted">{p.summary}</p>
                  <time className="mt-4 text-sm text-text-muted" dateTime={p.date}>{p.date}</time>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-12"><Todo label={t("insights.empty")} /></div>
          )}
        </div>
      </section>

      <CtaBanner title={t("cta.title")} desc={t("cta.desc")} button={t("cta.button")} />
    </>
  );
}
