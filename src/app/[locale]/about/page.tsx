import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { team } from "@data/team";
import { partners } from "@data/partners";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Todo } from "@/components/ui/Todo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/about", titleKey: "about" });
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <section className="bg-bg-subtle">
        <div className="container-page section">
          <SectionTitle as="h1" eyebrow={t("eyebrow")} title={t("title")} />
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-primary">{t("mission.title")}</h2>
            <p className="mt-4 text-lg">{t("mission.body")}</p>
          </div>
          <div>
            <h2 className="text-primary">{t("business.title")}</h2>
            <p className="mt-4 text-text-muted">{t("business.body")}</p>
          </div>
        </div>
      </section>

      <section className="section bg-bg-subtle">
        <div className="container-page">
          <h2 className="text-primary">{t("team.title")}</h2>
          <div className="mt-10 grid gap-8">
            {team.map((m) => {
              const base = `team.${m.id}`;
              const career = t.raw(`${base}.career`) as string[];
              return (
                <article key={m.id} className="card grid gap-8 p-6 md:grid-cols-[220px_1fr] md:p-8">
                  <div>
                    {m.photo ? (
                      <Image src={m.photo} alt={t(`${base}.name`)} width={220} height={260} className="rounded-card object-cover" />
                    ) : (
                      // TODO: 프로필 사진 교체 (data/team.ts 의 photo)
                      <div role="img" aria-label={t("team.photoAlt")} className="flex aspect-[220/260] items-center justify-center rounded-card bg-primary/10 text-sm text-text-muted">
                        {t("team.photoAlt")}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent">{t(`${base}.role`)}</p>
                    <h3 className="mt-1 text-2xl text-primary">{t(`${base}.name`)}</h3>
                    <dl className="mt-6 space-y-4">
                      <div>
                        <dt className="text-sm font-semibold text-text-muted">{t("team.education")}</dt>
                        <dd>{t(`${base}.education`)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-semibold text-text-muted">{t("team.career")}</dt>
                        <dd>
                          <ul className="list-disc pl-5">
                            {career.map((c) => <li key={c}>{c}</li>)}
                          </ul>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-semibold text-text-muted">{t("team.current")}</dt>
                        <dd>{t(`${base}.current`)}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2 className="text-primary">{t("partners.title")}</h2>
          <div className="mt-8">
            {partners.length ? (
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {partners.map((p) => (
                  <li key={p.name} className="card p-5 text-center font-medium text-primary">{p.name}</li>
                ))}
              </ul>
            ) : (
              <Todo label={t("partners.empty")} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
