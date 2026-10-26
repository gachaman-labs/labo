// 확정되지 않은 값은 TODO 로 두고, 화면에서는 "준비 중"으로 표시된다.
// 값이 정해지면 이 파일만 고치면 된다.
export const TODO = "TODO" as const;
export const isTodo = (v: unknown): boolean => v === TODO;

export const company = {
  nameKo: "투핸즈 메타",
  nameEn: "Two Hands Meta",
  nameJa: TODO, // TODO(JP): 일본어 상호 표기 확정 필요
  representative: "김현",
  representativeJa: "김현", // TODO(JP): 일본어 표기(한자/가타카나) 확정 필요
  established: TODO,
  address: TODO, // 소재지 (일본)
  registration: TODO, // 사업자 정보
  phone: TODO,
  email: TODO, // 대표 연락처·수신 이메일
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || TODO, // 미팅 예약 링크
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, ""); // TODO: 도메인
