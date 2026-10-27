import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// CF_STATIC=1 이면 서버 없이 올릴 수 있는 정적 파일(out/)로 내보낸다 (Cloudflare Pages용).
// 기본 빌드(`npm run dev`, `npm run build && npm start`)는 서버로 실행하는 개발·확인용이다.
const isStatic = process.env.CF_STATIC === "1";

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

const nextConfig: NextConfig = {
  // 서버 빌드의 응답 헤더. 정적 내보내기는 headers() 를 못 쓰므로 빌드 스크립트가 out/_headers 에 같은 헤더를 쓴다.
  ...(!isStatic && !allowIndexing
    ? { headers: async () => [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] }
    : {}),
  ...(isStatic ? { output: "export" as const, images: { unoptimized: true } } : { images: { formats: ["image/webp"] } }),
};

export default withNextIntl(nextConfig);
