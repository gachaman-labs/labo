import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export const categories = ["market", "legal", "sales", "industry", "case"] as const;
export type Category = (typeof categories)[number];

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: Category;
  summary: string;
  draft: boolean;
};

// 초안(draft: true)은 개발 환경이나 NEXT_PUBLIC_SHOW_DRAFTS=true 일 때만 노출한다.
const showDrafts = () => process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_DRAFTS === "true";

function read(file: string): { meta: PostMeta; content: string } {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
  return {
    content,
    meta: {
      slug,
      title: String(data.title),
      date,
      category: data.category as Category,
      summary: String(data.summary ?? ""),
      draft: Boolean(data.draft),
    },
  };
}

export function getPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => read(f).meta)
    .filter((p) => showDrafts() || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null;
  const post = read(file);
  if (post.meta.draft && !showDrafts()) return null;
  return post;
}

export function extractHeadings(source: string): { id: string; text: string }[] {
  return [...source.matchAll(/^##\s+(.+)$/gm)].map((m) => ({ text: m[1].trim(), id: slugify(m[1]) }));
}

export function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
}
