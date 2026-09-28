import raw from "@/content/site-content.json";
import type { Metadata } from "next";

export type FaqItem = { question: string; answer: string };
export type Citation = { label: string; url: string };
export type ContentSection = { heading: string; body: string; items?: string[]; steps?: string[]; table?: { headers: string[]; rows: string[][] } };
export type SeoPage = { path: string; category: string; intent: string; keyword: string; title: string; description: string; h1: string; summary: string; caseStudyNote?: string; image: string; alt: string; sections: ContentSection[]; faq: FaqItem[]; citations: Citation[]; relatedPaths: string[]; datePublished: string; dateModified: string; indexable: boolean; isBlogHub?: boolean; author?: string; hreflangExclusions?: string[]; italyOnly?: boolean; alternatePath?: string };
export type SiteContent = typeof raw;
export const content = raw;
export const pages = raw.pages as SeoPage[];
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || raw.site.url).replace(/\/+$/, "");
export const findPage = (slug?: string[]) => {
  const pathname = !slug || slug.length === 0 ? "/" : "/" + slug.join("/");
  return pages.find((page) => page.path === pathname);
};
export const absoluteUrl = (pathname: string) => siteUrl + (pathname === "/" ? "" : pathname);

export const metadataForPage = (page: SeoPage): Metadata => {
  const canonical = absoluteUrl(page.path);
  const suffix = (page.alternatePath ?? page.path) === "/" ? "" : (page.alternatePath ?? page.path);
  // Pages that exist only on this site have no sibling equivalents: emitting the
  // network hreflang map would point search engines at 404s on every other domain.
  const languages = page.italyOnly
    ? undefined
    : {
        ...Object.fromEntries(
          Object.entries(raw.site.hreflang as Record<string, string>).filter(([locale]) => !page.hreflangExclusions?.includes(locale)).map(([locale, base]) => [locale, base + suffix])
        ),
      };
  return {
    title: page.title,
    description: page.description,
    alternates: languages ? { canonical, languages } : { canonical },
    robots: {
      index: page.indexable,
      follow: true,
      googleBot: { index: page.indexable, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: raw.site.name,
      locale: raw.site.openGraphLocale,
      type: page.category === "blog" ? "article" : "website",
      images: [{ url: absoluteUrl(page.image), width: 1200, height: 675, alt: page.alt }],
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [absoluteUrl(page.image)] },
  };
};

export const metadataForPath = (pathname: string): Metadata => {
  const page = pages.find((candidate) => candidate.path === pathname);
  return page ? metadataForPage(page) : {};
};
