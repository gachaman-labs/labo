import type { MetadataRoute } from "next";
import { siteUrl } from "@data/site";
import { allowIndexing } from "@/lib/indexing";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
