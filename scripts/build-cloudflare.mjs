// Cloudflare Pages(정적 호스팅)용 빌드. 결과는 out/ 폴더이며 그대로 업로드하면 된다.
//   npm run build:cloudflare
// 기본 빌드(Vercel)는 건드리지 않는다. 정적 내보내기에서 쓸 수 없는 파일 두 개는 빌드하는 동안만 치워 두고
// 끝나면(실패해도) 원래 자리로 되돌린다.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const hold = path.join(root, ".cf-hold");
const moved = [
  ["src/middleware.ts", "middleware.ts"], // 정적 호스팅에서는 실행되지 않는다. / 이동은 _redirects 가 맡는다.
  ["src/app/[locale]/[...rest]", "rest"], // 404 는 out/404.html 이 맡는다.
];

// 공개할 블로그 글이 하나도 없으면 상세 경로는 정적으로 만들 페이지가 없으므로 함께 치워 둔다.
// (초안은 NEXT_PUBLIC_SHOW_DRAFTS=true 일 때만 공개 글로 센다. src/lib/blog.ts 와 같은 규칙)
const blogDir = path.join(root, "content", "blog");
const showDrafts = process.env.NEXT_PUBLIC_SHOW_DRAFTS === "true";
const publishedPosts = fs.existsSync(blogDir)
  ? fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith(".mdx"))
      .filter((f) => showDrafts || !matter(fs.readFileSync(path.join(blogDir, f), "utf8")).data.draft).length
  : 0;
if (publishedPosts === 0) moved.push(["src/app/[locale]/insights/[slug]", "insight-slug"]);

function restore() {
  for (const [from, name] of moved) {
    const held = path.join(hold, name);
    if (fs.existsSync(held)) {
      fs.mkdirSync(path.dirname(path.join(root, from)), { recursive: true });
      fs.renameSync(held, path.join(root, from));
    }
  }
  fs.rmSync(hold, { recursive: true, force: true });
}
process.on("exit", restore);
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => process.exit(1));

if (fs.existsSync(hold)) restore(); // 이전 실행이 비정상 종료된 경우
fs.mkdirSync(hold, { recursive: true });
for (const [from, name] of moved) fs.renameSync(path.join(root, from), path.join(hold, name));

fs.rmSync(path.join(root, ".next"), { recursive: true, force: true });
fs.rmSync(path.join(root, "out"), { recursive: true, force: true });

const res = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  env: { ...process.env, CF_STATIC: "1", NEXT_TELEMETRY_DISABLED: "1" },
});
restore();
if (res.status !== 0) process.exit(res.status ?? 1);

const out = path.join(root, "out");
const defaultLocale = "ja";
// 검색엔진 노출은 기본 차단. 정식 공개 때 NEXT_PUBLIC_ALLOW_INDEXING=true 로 다시 빌드한다.
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

// / 는 기본 언어로 보낸다. (_redirects 는 Cloudflare Pages 가 읽고, index.html 은 안전장치)
fs.writeFileSync(path.join(out, "_redirects"), `/ /${defaultLocale} 302\n`);
fs.writeFileSync(
  path.join(out, "index.html"),
  `<!doctype html><html lang="${defaultLocale}"><head><meta charset="utf-8"><meta name="robots" content="${allowIndexing ? "index" : "noindex, nofollow"}"><meta http-equiv="refresh" content="0;url=/${defaultLocale}"><link rel="canonical" href="/${defaultLocale}"><title>twohandsmeta</title></head><body><a href="/${defaultLocale}">/${defaultLocale}</a></body></html>\n`,
);

// 확장자 없는 OG 이미지 파일의 형식을 알려 준다. (링크 미리보기 크롤러가 이미지로 인식하도록)
fs.writeFileSync(
  path.join(out, "_headers"),
  "/opengraph-image\n  Content-Type: image/png\n" + (allowIndexing ? "" : "\n/*\n  X-Robots-Tag: noindex, nofollow\n"),
);

// 없는 주소용 404 (Cloudflare Pages 는 out/404.html 을 자동으로 사용한다)
fs.writeFileSync(
  path.join(out, "404.html"),
  `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 | twohandsmeta</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:-apple-system,"Noto Sans JP","Pretendard",sans-serif;background:#12284C;color:#fff;text-align:center}p{margin:.4rem 0;opacity:.85}a{display:inline-block;margin:1.2rem .5rem 0;padding:.7rem 1.4rem;border-radius:8px;background:#2F6BFF;color:#fff;text-decoration:none;font-weight:600}h1{font-size:3rem;margin:0}</style></head>
<body><main><h1>404</h1><p>ページが見つかりません。</p><p>페이지를 찾을 수 없습니다.</p><a href="/ja">日本語</a><a href="/ko">한국어</a></main></body></html>\n`,
);

const count = (dir) => fs.readdirSync(dir, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : 1), 0);
console.log(`\nCloudflare Pages용 정적 파일 ${count(out)}개를 out/ 에 만들었습니다.`);
