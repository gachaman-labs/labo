import { Link } from "@/i18n/navigation";

export function CtaBanner({ title, desc, button }: { title: string; desc: string; button: string }) {
  return (
    <section className="bg-primary text-white">
      <div className="container-page flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-2xl">
          <span aria-hidden className="mb-4 block h-1 w-10 bg-highlight" />
          <h2 className="text-white">{title}</h2>
          <p className="mt-3 text-white/80">{desc}</p>
        </div>
        <Link href="/contact" className="btn-primary shrink-0">
          {button}
        </Link>
      </div>
    </section>
  );
}
