import type { IndustrySlug } from "./industries";

export type CaseItem = {
  slug: string;
  year: number;
  fields: IndustrySlug[];
  // published: false 면 화면에 노출되지 않는다. 확인된 실적만 true 로 바꿀 것.
  published: boolean;
};

// 제목은 messages 의 cases.items.<slug>.title 에 있다. 고객사명은 공개 허용된 경우에만 표기.
export const cases: CaseItem[] = [
  { slug: "ai-character-japan", year: 2026, fields: ["ai", "content"], published: true },
  { slug: "todo-2026-02", year: 2026, fields: [], published: false }, // TODO: 2026년 실적 2
  { slug: "todo-2026-03", year: 2026, fields: [], published: false }, // TODO: 2026년 실적 3
];

export const publishedCases = () => cases.filter((c) => c.published).sort((a, b) => b.year - a.year);
