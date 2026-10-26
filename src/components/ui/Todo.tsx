import { getTranslations } from "next-intl/server";

// 확정 전 값을 표시하는 플레이스홀더. 내용이 정해지면 data/ 또는 messages/ 를 고치면 된다.
export async function Todo({ label }: { label?: string }) {
  const t = await getTranslations("common");
  return (
    <div className="rounded-card border border-dashed border-border bg-bg-subtle px-5 py-6 text-text-muted">
      {label ? <span className="font-medium">{label} · </span> : null}
      {t("pending")}
    </div>
  );
}

export async function TodoText({ value, inverse = false }: { value: string; inverse?: boolean }) {
  const t = await getTranslations("common");
  return value === "TODO" ? <span className={inverse ? "text-white/70" : "text-text-muted"}>{t("pending")}</span> : <>{value}</>;
}
