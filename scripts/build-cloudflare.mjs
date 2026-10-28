// Cloudflare(정적 호스팅)용 빌드. 결과는 out/ 폴더이다.
//   npm run build:cloudflare              미리보기용: 검색엔진 노출 차단 (주소는 NEXT_PUBLIC_SITE_URL, 없으면 로컬 주소)
//   npm run build:cloudflare -- --launch  정식 공개용: twohandsmeta.co.jp 주소, 노출 허용
// Cloudflare 의 Git 연동 빌드(Workers Builds)에서도 같은 명령을 쓴다. 이어서 `npx wrangler deploy` 가 wrangler.jsonc 대로 out/ 을 올린다.
// 정적 내보내기에서 쓸 수 없는 파일 두 개는 빌드하는 동안만 치워 두고 끝나면(실패해도) 원래 자리로 되돌린다.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// 미리보기 주소는 배포 후 Cloudflare 가 알려 주는 *.workers.dev 주소이다. 대시보드 빌드 변수 NEXT_PUBLIC_SITE_URL 로 지정한다.
// 지정하지 않으면(로컬 확인용) 아래 주소를 쓴다.
const PREVIEW_URL = "http://localhost:8787";
const LAUNCH_URL = "https://twohandsmeta.co.jp";
const launch = process.argv.includes("--launch");
// 환경변수로 직접 지정하면 그 값을 우선한다.
process.env.NEXT_PUBLIC_SITE_URL ||= launch ? LAUNCH_URL : PREVIEW_URL;
if (launch) process.env.NEXT_PUBLIC_ALLOW_INDEXING ||= "true";

// Cloudflare Git 빌드(Workers Builds: WORKERS_CI_BRANCH, Pages: CF_PAGES_BRANCH): main(운영 브랜치)이 아닌 브랜치는
// 항상 노출을 막는다. 운영 설정(NEXT_PUBLIC_ALLOW_INDEXING=true)이 있어도 미리보기 배포가 검색에 잡히지 않도록 하는 안전장치이다.
// 브랜치 이름을 알 수 없을 때는 건드리지 않는다. (기본값이 이미 "차단"이다)
// Pages 빌드는 그 배포의 주소(CF_PAGES_URL)도 알려 주므로 그것을 사이트 주소로 쓴다.
const PRODUCTION_BRANCH = "main";
const ciBranch = process.env.CF_PAGES_BRANCH || process.env.WORKERS_CI_BRANCH;
if (ciBranch && ciBranch !== PRODUCTION_BRANCH) {
  process.env.NEXT_PUBLIC_ALLOW_INDEXING = "false";
  if (process.env.CF_PAGES_URL) process.env.NEXT_PUBLIC_SITE_URL = process.env.CF_PAGES_URL;
}

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

// / 는 기본 언어로 보낸다. (_redirects 는 Cloudflare 가 읽고, index.html 은 안전장치)
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

// 없는 주소용 404 (Cloudflare 는 out/404.html 을 자동으로 사용한다)
fs.writeFileSync(
  path.join(out, "404.html"),
  `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 | twohandsmeta</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:-apple-system,"Noto Sans JP","Pretendard",sans-serif;background:#12284C;color:#fff;text-align:center}p{margin:.4rem 0;opacity:.85}a{display:inline-block;margin:1.2rem .5rem 0;padding:.7rem 1.4rem;border-radius:8px;background:#2F6BFF;color:#fff;text-decoration:none;font-weight:600}h1{font-size:3rem;margin:0}</style></head>
<body><main><h1>404</h1><p>ページが見つかりません。</p><p>페이지를 찾을 수 없습니다.</p><a href="/ja">日本語</a><a href="/ko">한국어</a></main></body></html>\n`,
);

const count = (dir) => fs.readdirSync(dir, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : 1), 0);
console.log(
  `\nCloudflare용 정적 파일 ${count(out)}개를 out/ 에 만들었습니다.\n  주소: ${process.env.NEXT_PUBLIC_SITE_URL}\n  검색엔진 노출: ${allowIndexing ? "허용" : "차단"}`,
);
