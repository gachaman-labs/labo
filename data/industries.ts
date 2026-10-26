export const industries = [
  { slug: "game" },
  { slug: "ai" },
  { slug: "content" },
  { slug: "solution" },
  { slug: "cosmetics" },
] as const;

export type IndustrySlug = (typeof industries)[number]["slug"];
