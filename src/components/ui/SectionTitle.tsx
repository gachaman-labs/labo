export function SectionTitle({
  eyebrow,
  title,
  desc,
  as: Tag = "h2",
  inverse = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  as?: "h1" | "h2";
  inverse?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-widest ${inverse ? "text-white/80" : "text-accent"}`}>{eyebrow}</p>
      ) : null}
      <Tag className={inverse ? "text-white" : "text-primary"}>{title}</Tag>
      {desc ? <p className={`mt-4 text-lg ${inverse ? "text-white/80" : "text-text-muted"}`}>{desc}</p> : null}
    </div>
  );
}
