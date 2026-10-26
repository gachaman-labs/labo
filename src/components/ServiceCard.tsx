import { Link } from "@/i18n/navigation";

export function ServiceCard({ index, slug, title, summary }: { index: number; slug: string; title: string; summary: string }) {
  return (
    <Link href={`/services/${slug}`} className="card group flex h-full flex-col p-6 transition-shadow hover:shadow-lg">
      <span className="text-sm font-bold text-accent">{String(index).padStart(2, "0")}</span>
      <h3 className="mt-2 text-primary">{title}</h3>
      <p className="mt-3 flex-1 text-text-muted">{summary}</p>
      <span aria-hidden className="mt-5 text-xl text-accent transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}
