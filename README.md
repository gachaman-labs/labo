# 투핸즈메타 (twohandsmeta) 홈페이지

일본에 진출하는 한국 기업 대상 B2B 에이전트 사업 소개 사이트.
Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · next-intl · MDX · **Cloudflare(정적 파일, GitHub 연동)로 배포**

## 개발

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3000  (/ja 기본, /ko)
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/app/[locale]/` | 페이지 (`/ja` 기본, `/ko`) |
| `messages/ko.json`, `ja.json` | 모든 문구. 일본어 번역이 빠진 키는 한국어로 대체됨(현재는 누락 없음) |
| `data/` | 교체할 값 (회사 정보, 서비스, 분야, 실적, 팀, 파트너) |
| `content/blog/*.mdx` | 인사이트 글 (frontmatter: title, date, category, summary, draft) |
| `public/` | 로고(`logo.png`, `logo-white.png`) |
| `scripts/build-cloudflare.mjs` | Cloudflare용 정적 빌드 |
| `wrangler.jsonc` | Cloudflare 배포 설정 (`out/` 폴더를 정적 파일로 올림) |

## 배포 (Cloudflare Workers Builds + GitHub 연동)

GitHub에 푸시하면 Cloudflare가 알아서 빌드하고 배포한다. 서버 없이 올리는 정적 파일(`out/`)이며, `wrangler.jsonc`가 그 폴더를 올리도록 알려 준다.

- `main`에 병합 → 운영 배포 (`https://twohandsmeta.<계정>.workers.dev`, 정식 공개 후에는 `https://twohandsmeta.co.jp`)
- 다른 브랜치 → 미리보기 배포. 브랜치 이름을 알 수 있는 환경에서는 설정과 관계없이 **검색엔진 노출이 항상 차단**된다.

### 프로젝트 설정 (Workers & Pages → `twohandsmeta` → Settings → Build)

| 항목 | 값 |
|---|---|
| Git repository / Production branch | `gachaman-labs/labo` / `main` |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Root directory | (비워 둠 또는 `/`) |

- **Build command를 기본값(`npm run build`)으로 두면 안 된다.** 설정 파일이 없던 때처럼 wrangler가 Next.js 서버 방식(OpenNext)으로 자동 설정하려다 `WORKER_SELF_REFERENCE ... not found`(코드 10143)로 실패한다.
- Worker 이름(`wrangler.jsonc`의 `name`)은 대시보드의 프로젝트 이름 `twohandsmeta`와 같아야 한다.
- Node 버전은 `.node-version`(22)에서 읽는다. 조직 저장소는 Cloudflare GitHub 앱 설치에 조직 owner의 승인이 필요하다.

### 첫 배포 후

1. 배포가 끝나면 나오는 `*.workers.dev` 주소를 확인한다.
2. Settings → Build → **Build variables**에 `NEXT_PUBLIC_SITE_URL` = 그 주소를 넣고 다시 배포한다. (링크 미리보기 이미지와 canonical 주소가 맞게 된다. 아직 검색엔진 노출은 차단 상태이다.)

### 정식 공개 (twohandsmeta.co.jp)

1. **Build variables**를 바꾼다.
   - `NEXT_PUBLIC_SITE_URL` = `https://twohandsmeta.co.jp`
   - `NEXT_PUBLIC_ALLOW_INDEXING` = `true`
2. 운영 배포를 다시 실행한다. 값은 빌드할 때 정해지므로 바꾼 뒤에는 반드시 다시 빌드해야 한다.
3. Settings → **Domains & Routes → Add → Custom domain**에서 `twohandsmeta.co.jp`를 연결한다. 도메인의 DNS를 Cloudflare가 관리해야 루트 도메인을 연결할 수 있다. `www`를 함께 쓰면 한쪽을 대표 주소로 정하고 나머지는 리다이렉트한다.

### 빌드가 하는 일

- `out/_redirects`: `/` → `/ja`, `out/404.html`: 없는 주소 안내(일본어·한국어), `out/_headers`: OG 이미지 형식 지정과 노출 차단 헤더. `wrangler.jsonc`는 `/ja/` 같은 끝 슬래시를 `/ja`로 정리한다.
- 정적 내보내기에서 쓸 수 없는 `src/middleware.ts`, `src/app/[locale]/[...rest]`는 빌드하는 동안만 치우고 끝나면 되돌린다. 공개된 블로그 글이 없으면 `insights/[slug]`도 같이 치운다.
- 환경변수(`NEXT_PUBLIC_*`)는 빌드할 때 정해진다. 서버가 없으므로 문의 폼 같은 서버 기능은 넣을 수 없고, 문의는 채널톡으로 받는다.
- 로컬 확인: `npm run build:cloudflare` 후 `npx wrangler dev`(http://localhost:8787). 정식 주소로 만들려면 `npm run build:cloudflare -- --launch`.

## 검색엔진 노출 (기본: 차단)

정식 공개 전에는 검색엔진에 잡히지 않도록 **기본값이 차단**이다. `Build variables의 `NEXT_PUBLIC_ALLOW_INDEXING=true`(로컬은 `npm run build:cloudflare -- --launch`)로 빌드해야 풀린다. 미리보기 브랜치는 항상 차단된다.

| 상태 | 차단(기본) | 공개 |
|---|---|---|
| 페이지 `<meta name="robots">` | `noindex, nofollow` | 없음 (일본어 인사이트·404만 noindex 유지) |
| 응답 헤더 `X-Robots-Tag` | `noindex, nofollow` (`out/_headers`) | 없음 |
| `robots.txt` | `Disallow: /` | `Allow: /` + sitemap |
| `sitemap.xml` | 비어 있음 | 전체 주소 |

- 정식 공개할 때 위 "정식 공개" 절차로 Build variables를 바꾸고 다시 배포하는 것을 잊지 말 것.
- noindex는 검색엔진에 노출하지 말라는 요청이며 접속 자체를 막지는 않는다. 이미 검색결과에 올라간 주소는 바로 사라지지 않는다.

## 채널톡

`NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY`를 넣고 다시 빌드하면 활성화된다. 비어 있으면 연결 전 상태(아무것도 표시 안 함).
로케일에 따라 한국어/일본어가 자동 전환된다.

## 교체해야 할 값 (TODO)

`data/site.ts`: 소재지, 사업자 정보, 연락처, 설립일 · `data/team.ts`: 프로필 사진 ·
`data/partners.ts`: 파트너 · `data/cases.ts`: 2026년 실적 2건(`published: true`로 변경) ·
`messages/ja.json`: 일본어 검수(`TODO(JP)`) · 서비스/분야 세부 문구, 진행 기간 ·
개인정보처리방침·회사 개요(법무 검토) · 채널톡 키 · 파비콘/OG 이미지 교체 시 `src/app/` 의 이미지 파일.
값이 `TODO`인 항목은 화면에 "준비 중"으로 표시된다.
블로그 샘플 글은 `draft: true`라 숨겨진다. 공개하려면 `NEXT_PUBLIC_SHOW_DRAFTS=true`.
