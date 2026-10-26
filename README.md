# Gachaman Labs 홈페이지

- `site/` — 정적 사이트 (빌드 불필요). `site/index.html`을 열거나 `python3 -m http.server -d site` 로 확인.
- `worker/` — 문의 응답 에이전트용 프록시(Cloudflare Worker). 배포 후 URL을 `site/chat.js`의 `CHAT_ENDPOINT`에 입력.
  - `wrangler secret put ANTHROPIC_API_KEY`
  - 미설정 시 챗봇은 FAQ 키워드 응답으로 동작.

회사명·연락처·수치는 샘플입니다. 실제 정보로 교체하세요.
