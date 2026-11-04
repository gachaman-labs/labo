// 확정되지 않은 값은 TODO 로 두고, 화면에서는 "준비 중"으로 표시된다.
// 값이 정해지면 이 파일만 고치면 된다.
export const TODO = "TODO" as const;
export const isTodo = (v: unknown): boolean => v === TODO;

export const company = {
  nameKo: "주식회사 투핸즈메타",
  nameEn: "twohandsmeta Inc.",
  nameJa: "株式会社ツーハンズメタ",
  representative: "김현",
  representativeJa: "金 炫(キム　ヒョン)",
  established: { ja: "2022年11月11日", ko: "2022년 11월 11일" },
  // 소재지(일본). 연락처·이메일·사업자 정보는 노출하지 않는다. 문의는 채널톡으로 받는다.
  address: {
    ja: "〒105-0001 東京都港区虎ノ門２丁目４−７ T-LITE 16F",
    ko: "〒105-0001 도쿄도 미나토구 도라노몬 2-4-7 T-LITE 16층",
  },
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || TODO, // 미팅 예약 링크
} as const;

export const addressOf = (locale: string): string => (locale === "ja" ? company.address.ja : company.address.ko);

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, ""); // TODO: 도메인
