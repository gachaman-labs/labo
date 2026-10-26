import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company } from "@data/site";
import { TodoText } from "@/components/ui/Todo";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const name = locale === "ja" && company.nameJa !== "TODO" ? company.nameJa : company.nameKo;
  const rep = locale === "ja" ? company.representativeJa : company.representative;
  const contact = company.email !== "TODO" ? company.email : company.phone;

  return (
    <footer className="bg-primary text-white/80">
      <div className="container-page py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-bold text-white">
              {name} <span className="font-normal text-white/70">({company.nameEn})</span>
            </p>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex gap-2"><dt>{t("representative")}</dt><dd>{rep}</dd></div>
              <div className="flex gap-2"><dt>{t("address")}</dt><dd><TodoText value={company.address} inverse /></dd></div>
              <div className="flex gap-2"><dt>{t("registration")}</dt><dd><TodoText value={company.registration} inverse /></dd></div>
              <div className="flex gap-2"><dt>{t("contact")}</dt><dd><TodoText value={contact} inverse /></dd></div>
            </dl>
          </div>
          <nav aria-label="Footer" className="flex gap-6 text-sm">
            <Link href="/company" className="hover:text-white">{t("links.company")}</Link>
            <Link href="/privacy" className="hover:text-white">{t("links.privacy")}</Link>
            <Link href="/contact" className="hover:text-white">{t("links.contact")}</Link>
          </nav>
        </div>
        <p className="mt-10 border-t border-white/15 pt-6 text-xs text-white/70">
          © {new Date().getFullYear()} {company.nameEn}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
