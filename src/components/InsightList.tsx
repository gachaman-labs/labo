"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FieldTag } from "@/components/ui/Tags";

type Item = { slug: string; title: string; summary: string; date: string; category: string; draft: boolean };

const PAGE_SIZE = 6;

// 카테고리 필터와 페이지 넘김은 브라우저에서 처리한다. (정적 호스팅에서도 동작하도록)
export function InsightList({ posts, categories }: { posts: Item[]; categories: string[] }) {
  const t = useTranslations("insights");
  const tc = useTranslations("common");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = posts.filter((p) => !category || p.category === category);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const chip = (on: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium ${on ? "border-primary bg-primary text-white" : "border-border bg-white text-text hover:border-primary"}`;
  const pick = (c: string | null) => {
    setCategory(c);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group">
        <button type="button" className={chip(!category)} aria-pressed={!category} onClick={() => pick(null)}>{tc("all")}</button>
        {categories.map((c) => (
          <button key={c} type="button" className={chip(category === c)} aria-pressed={category === c} onClick={() => pick(c)}>
            {t(`categories.${c}`)}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
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
        <p className="mt-10 text-text-muted">{t("empty")}</p>
      )}

      {pages > 1 ? (
        <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
          {current > 1 ? <button type="button" className="btn-secondary !py-2" onClick={() => setPage(current - 1)}>{t("prev")}</button> : null}
          <span className="text-sm text-text-muted">{current} / {pages}</span>
          {current < pages ? <button type="button" className="btn-secondary !py-2" onClick={() => setPage(current + 1)}>{t("next")}</button> : null}
        </nav>
      ) : null}
    </div>
  );
}
