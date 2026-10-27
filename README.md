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
개인정보처리방침·회사 개요(법무 검토) · 도메인(`NEXT_PUBLIC_SITE_URL`) · 채널톡 키 · OG 이미지.
값이 `TODO`인 항목은 화면에 "준비 중"으로 표시된다.

## 배포 (Vercel)

Vercel에 저장소를 연결하고 `.env.example`의 환경변수를 등록한다.

- 문의는 채널톡으로 받는다. `NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY`를 설정하면 활성화되고, 비어 있으면 연결 전 상태(아무것도 표시 안 함)이다. 문의 폼은 없다.
- 초안 글은 운영 환경에서 숨겨진다. 보이려면 `NEXT_PUBLIC_SHOW_DRAFTS=true`.
