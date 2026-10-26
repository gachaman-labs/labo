import { FieldTag } from "@/components/ui/Tags";

export function CaseCard({ title, year, tags }: { title: string; year: number; tags: string[] }) {
  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <FieldTag key={t}>{t}</FieldTag>
        ))}
      </div>
      <h3 className="mt-4 flex-1 text-primary">{title}</h3>
      <p className="mt-4 text-sm text-text-muted">{year}</p>
    </article>
  );
}
