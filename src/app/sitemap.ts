import type { MetadataRoute } from "next";
import { absoluteUrl, pages } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.filter((page) => page.indexable).map((page) => ({ url: absoluteUrl(page.path), lastModified: new Date(page.dateModified), changeFrequency: page.category === "blog" ? "monthly" : "weekly", priority: page.path === "/" ? 1 : page.category === "legal" ? 0.3 : 0.8 }));
}
