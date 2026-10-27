# 투핸즈메타 (twohandsmeta) 홈페이지

일본에 진출하는 한국 기업 대상 B2B 에이전트 사업 소개 사이트.
Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · next-intl · MDX

## 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3000  (/ja 기본, /ko)
npm run build && npm start
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/app/[locale]/` | 페이지 (`/ja` 기본, `/ko`) |
| `messages/ko.json`, `ja.json` | 모든 문구. 일본어 번역이 빠진 키는 한국어로 대체됨(현재는 누락 없음) |
| `data/` | 교체할 값 (회사 정보, 서비스, 분야, 실적, 팀, 파트너) |
| `content/blog/*.mdx` | 인사이트 글 (frontmatter: title, date, category, summary, draft) |

## 교체해야 할 값 (TODO)

`data/site.ts`: 소재지, 사업자 정보, 연락처, 설립일 · `data/team.ts`: 프로필 사진 ·
`data/partners.ts`: 파트너 · `data/cases.ts`: 2026년 실적 2건(`published: true`로 변경) ·
`messages/ja.json`: 일본어 검수(`TODO(JP)`) · 서비스/분야 세부 문구, 진행 기간 ·
개인정보처리방침·회사 개요(법무 검토) · 도메인(`NEXT_PUBLIC_SITE_URL`) · 채널톡 키.
값이 `TODO`인 항목은 화면에 "준비 중"으로 표시된다.

## 검색엔진 노출 (기본: 차단)

정식 공개 전에는 검색엔진에 잡히지 않도록 **기본값이 차단**이다. `NEXT_PUBLIC_ALLOW_INDEXING=true`로 빌드해야 풀린다.

| 상태 | 차단(기본) | 공개(`NEXT_PUBLIC_ALLOW_INDEXING=true`) |
|---|---|---|
| 페이지 `<meta name="robots">` | `noindex, nofollow` | 없음 (일본어 인사이트·404만 noindex 유지) |
| 응답 헤더 `X-Robots-Tag` | `noindex, nofollow` (Vercel은 `next.config.ts`, Cloudflare는 `out/_headers`) | 없음 |
| `robots.txt` | `Disallow: /` | `Allow: /` + sitemap |
| `sitemap.xml` | 비어 있음 | 전체 주소 |

- 값은 빌드할 때 정해지므로 바꾸면 다시 빌드·배포해야 한다. Vercel은 환경변수를 바꾼 뒤 Redeploy.
- 정식 공개할 때 `NEXT_PUBLIC_SITE_URL`(실제 도메인)과 함께 이 값을 `true`로 바꾸는 것을 잊지 말 것.
- 이미 검색결과에 올라간 주소는 이 설정만으로 바로 사라지지 않는다. 처음부터 차단된 상태로 배포하는 것이 안전하다.

## 배포 (Vercel)

Vercel에 저장소를 연결하고 `.env.example`의 환경변수를 등록한다.

- 문의는 채널톡으로 받는다. `NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY`를 설정하면 활성화되고, 비어 있으면 연결 전 상태(아무것도 표시 안 함)이다. 문의 폼은 없다.
- 초안 글은 운영 환경에서 숨겨진다. 보이려면 `NEXT_PUBLIC_SHOW_DRAFTS=true`.

## 배포 (Cloudflare Pages, 정적 파일)

Vercel 배포와 별개로, 같은 코드를 서버 없이 올리는 정적 파일(`out/`)로 빌드할 수 있다. GitHub 연결은 필요 없다.

```bash
NEXT_PUBLIC_SITE_URL=https://<프로젝트>.pages.dev npm run build:cloudflare
```

1. 위 명령이 `out/` 폴더를 만든다. (`/` → `/ja` 이동용 `_redirects`, 404 페이지, OG 이미지용 `_headers` 포함)
2. Cloudflare 대시보드 → Workers & Pages → Create → Pages → **Direct Upload**에서 `out/` 폴더(또는 zip)를 올린다.
   명령어로는 `npx wrangler pages deploy out`.
3. 환경변수는 빌드할 때 정해지므로, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY` 등을 바꾸면 다시 빌드해서 올려야 한다.

정적 빌드에서는 `src/middleware.ts`와 `src/app/[locale]/[...rest]`가 쓰이지 않는다(스크립트가 빌드하는 동안만 치우고 끝나면 되돌린다).
공개된 블로그 글이 없으면 `insights/[slug]`도 같이 치운다. 기본 빌드(`npm run build`, Vercel)는 영향이 없다.
