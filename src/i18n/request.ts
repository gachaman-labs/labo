import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import ko from "../../messages/ko.json";

type Json = { [k: string]: unknown };
const isObj = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

// 일본어 번역이 없는 키는 한국어로 대체한다.
function merge(base: Json, over: Json): Json {
  const out: Json = { ...base };
  for (const [k, v] of Object.entries(over)) {
    out[k] = isObj(v) && isObj(base[k]) ? merge(base[k] as Json, v) : v;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages =
    locale === "ko" ? ko : merge(ko as Json, (await import("../../messages/ja.json")).default as Json);
  return { locale, messages };
});
