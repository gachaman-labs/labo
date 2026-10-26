export type Stage = "design" | "execute";

// 제목·요약 문구는 messages 의 services.items.<slug> 에 있다.
export const services = [
  { slug: "market-research", stage: "design" },
  { slug: "go-to-market", stage: "design" },
  { slug: "localization", stage: "design" },
  { slug: "network", stage: "execute" },
  { slug: "b2b-sales", stage: "execute" },
] as const satisfies readonly { slug: string; stage: Stage }[];

export type ServiceSlug = (typeof services)[number]["slug"];
