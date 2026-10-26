"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher({ inverse = false }: { inverse?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const base = "rounded px-2 py-1 text-sm font-semibold";
  const idle = inverse ? "text-white/70 hover:text-white" : "text-text-muted hover:text-primary";
  const on = inverse ? "bg-white/15 text-white" : "bg-bg-subtle text-primary";

  return (
    <div role="group" aria-label={t("language")} className="flex items-center gap-1">
      {(["ja", "ko"] as const).map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          hrefLang={l}
          lang={l}
          aria-current={locale === l ? "true" : undefined}
          className={`${base} ${locale === l ? on : idle}`}
        >
          {l === "ko" ? "KR" : "JP"}
        </Link>
      ))}
    </div>
  );
}
