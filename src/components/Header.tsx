"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

const items = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "industries", href: "/industries" },
  { key: "cases", href: "/cases" },
  { key: "insights", href: "/insights" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${scrolled || open ? "border-b border-border bg-white" : "bg-white/80 backdrop-blur"}`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="twohandsmeta" width={1438} height={170} priority className="h-6 w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {items.map((i) => {
            const active = pathname === i.href || pathname.startsWith(`${i.href}/`);
            return (
              <Link
                key={i.key}
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={`text-[15px] font-medium hover:text-accent ${active ? "text-accent" : "text-text"}`}
              >
                {t(i.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <Link href="/contact" className="btn-primary hidden !px-4 !py-2 text-sm lg:inline-flex">
            {t("cta")}
          </Link>
          <button
            type="button"
            className="rounded p-2 text-primary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-border bg-white lg:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {items.map((i) => (
              <Link key={i.key} href={i.href} className="py-3 text-base font-medium text-text">
                {t(i.key)}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
              <LanguageSwitcher />
              <Link href="/contact" className="btn-primary !px-4 !py-2 text-sm">
                {t("cta")}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
