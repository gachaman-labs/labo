import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "twohandsmeta";
export const dynamic = "force-static";

// 모든 페이지가 공유하는 링크 미리보기 이미지. 로고(public/logo-white.png)를 남색 배경 가운데에 둔다.
// 기본 폰트에는 한글·일본어 글리프가 없어 글자는 넣지 않는다.
const LOGO_RATIO = 170 / 1438;

export default async function Image() {
  const logo = await readFile(path.join(process.cwd(), "public", "logo-white.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  const width = 880;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#12284C" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ width: 72, height: 8, background: "#C8102E", marginBottom: 40 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" width={width} height={Math.round(width * LOGO_RATIO)} />
        </div>
      </div>
    ),
    size,
  );
}
