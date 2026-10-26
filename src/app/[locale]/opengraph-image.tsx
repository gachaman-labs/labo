import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Two Hands Meta";

// 기본 폰트에는 한글·일본어 글리프가 없어 영문 로고 텍스트만 쓴다. TODO: 브랜드 OG 이미지로 교체
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#12284C", color: "#fff" }}>
        <div style={{ width: 64, height: 6, background: "#C8102E", marginBottom: 32 }} />
        <div style={{ fontSize: 88, fontWeight: 700 }}>Two Hands Meta</div>
      </div>
    ),
    size,
  );
}
