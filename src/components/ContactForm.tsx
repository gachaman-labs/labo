"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Option = { id: string; label: string };
type Status = "idle" | "sending" | "success" | "error" | "invalid" | "tooMany";

export function ContactForm({ services, industries }: { services: Option[]; industries: Option[] }) {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          company: fd.get("company"),
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          services: fd.getAll("services"),
          industry: fd.get("industry"),
          message: fd.get("message"),
          consent: fd.get("consent") === "on",
          website: fd.get("website"), // honeypot
        }),
      });
      if (res.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus(res.status === 400 ? "invalid" : res.status === 429 ? "tooMany" : "error");
      }
    } catch {
      setStatus("error");
    }
  }

  const input = "mt-1 w-full rounded-lg border border-border bg-white px-4 py-3 text-base";
  const label = "block text-sm font-semibold text-primary";
  const req = <span className="ml-1 text-highlight" aria-label={t("required")}>*</span>;

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate={false}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className={label}>{t("company")}{req}
          <input name="company" required maxLength={100} autoComplete="organization" className={input} />
        </label>
        <label className={label}>{t("name")}{req}
          <input name="name" required maxLength={60} autoComplete="name" className={input} />
        </label>
        <label className={label}>{t("email")}{req}
          <input name="email" type="email" required maxLength={120} autoComplete="email" className={input} />
        </label>
        <label className={label}>{t("phone")}
          <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={input} />
        </label>
      </div>

      <fieldset>
        <legend className={label}>{t("services")}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {services.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-base">
              <input type="checkbox" name="services" value={s.id} className="h-4 w-4 accent-[#2F6BFF]" />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className={label}>{t("industry")}
        <select name="industry" defaultValue="" className={input}>
          <option value="">{t("industryPlaceholder")}</option>
          {industries.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
        </select>
      </label>

      <label className={label}>{t("message")}{req}
        <textarea name="message" required rows={6} maxLength={4000} className={input} />
      </label>

      {/* 스팸 방지용 honeypot: 사람에게는 보이지 않는다 */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#2F6BFF]" />
        <span>
          {t("consent")}{req}{" "}
          <Link href="/privacy" className="text-accent underline" target="_blank">{t("consentLink")}</Link>
        </span>
      </label>

      <div>
        <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
          {status === "sending" ? t("sending") : t("submit")}
        </button>
      </div>

      <p role="status" aria-live="polite" className={`text-sm ${status === "success" ? "text-primary" : "text-highlight"}`}>
        {status === "success" ? t("success") : status === "error" ? t("error") : status === "invalid" ? t("invalid") : status === "tooMany" ? t("tooMany") : ""}
      </p>
    </form>
  );
}
