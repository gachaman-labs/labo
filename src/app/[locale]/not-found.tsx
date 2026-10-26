import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="container-page section text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-3 text-primary">Page not found</h1>
      <Link href="/" className="btn-primary mt-8">Home</Link>
    </div>
  );
}
