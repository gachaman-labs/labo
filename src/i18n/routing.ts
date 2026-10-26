import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ja", "ko"],
  defaultLocale: "ja",
  localePrefix: "always",
  // 브라우저 언어와 상관없이 / 는 항상 기본 언어(일본어)로 보낸다. 한국어 방문자 자동 안내가 필요하면 true 로.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
