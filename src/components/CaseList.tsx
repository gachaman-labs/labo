"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CaseCard } from "./CaseCard";

export type CaseView = { slug: string; title: string; year: number; fieldIds: string[]; fieldLabels: string[] };

export function CaseList({ items, fields }: { items: CaseView[]; fields: { id: string; label: string }[] }) {
  const t = useTranslations("common");
  const tc = useTranslations("cases");
  const [year, setYear] = useState("all");
  const [field, setField] = useState("all");
  const years = useMemo(() => [...new Set(items.map((i) => i.year))].sort((a, b) => b - a), [items]);
  const shown = items.filter((i) => (year === "all" || String(i.year) === year) && (field === "all" || i.fieldIds.includes(field)));
  const sel = "rounded-lg border border-border bg-white px-3 py-2 text-sm";

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-text-muted">
          {t("year")}
          <select className={sel} value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">{t("all")}</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-text-muted">
          {t("field")}
          <select className={sel} value={field} onChange={(e) => setField(e.target.value)}>
            <option value="all">{t("all")}</option>
            {fields.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </label>
      </div>
      {shown.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => <CaseCard key={c.slug} title={c.title} year={c.year} tags={c.fieldLabels} />)}
        </div>
      ) : (
        <p className="mt-8 text-text-muted">{tc("empty")}</p>
      )}
    </div>
  );
}
