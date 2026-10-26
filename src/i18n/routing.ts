import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "ja"],
  defaultLocale: "ko",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

// 일본어를 1차로 제공하는 핵심 페이지. 그 외 일본어 경로는 한국어 문구로 대체되므로 noindex 처리한다.
export const jaCorePaths = ["", "/about", "/services", "/contact", "/company", "/privacy"];
