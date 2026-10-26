export function FieldTag({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-[#1E4FD1]">{children}</span>;
}

export function StageBadge({ stage, label }: { stage: "design" | "execute"; label: string }) {
  const cls = stage === "design" ? "bg-primary text-white" : "bg-white text-primary border border-primary";
  return <span className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
}
