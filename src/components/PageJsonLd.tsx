import { absoluteUrl, content, type SeoPage } from "@/lib/content";
import { breadcrumbPages } from "@/components/Breadcrumbs";

export default function PageJsonLd({ page }: { page: SeoPage }) {
  const organizationId = absoluteUrl("/#organization");
  const crumbs = breadcrumbPages(page);
  const breadcrumb = crumbs.length ? {
    "@type": "BreadcrumbList",
    "@id": absoluteUrl(page.path + "#breadcrumb"),
    itemListElement: [
      { "@type": "ListItem", position: 1, name: content.labels.home, item: absoluteUrl("/") },
      ...crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 2, name: crumb.h1, item: absoluteUrl(crumb.path) }))
    ]
  } : null;
  const main = page.category === "service" ? {
    "@type": "Service", "@id": absoluteUrl(page.path + "#service"), name: page.h1, description: page.summary,
    provider: { "@id": organizationId }, areaServed: content.site.market, url: absoluteUrl(page.path)
  } : page.category === "blog" ? {
    "@type": "Article", "@id": absoluteUrl(page.path + "#article"), headline: page.h1, description: page.summary,
    image: absoluteUrl(page.image), datePublished: page.datePublished, dateModified: page.dateModified,
    author: { "@type": "Person", name: page.author ?? content.site.legalEntity.managingDirector, worksFor: { "@id": organizationId } },
    reviewedBy: { "@type": "Person", name: page.author ?? content.site.legalEntity.managingDirector },
    publisher: { "@id": organizationId }, mainEntityOfPage: absoluteUrl(page.path),
    citation: page.citations.map((item) => item.url)
  } : {
    "@type": "WebPage", "@id": absoluteUrl(page.path + "#webpage"), name: page.h1, description: page.summary, url: absoluteUrl(page.path),
    isPartOf: { "@id": absoluteUrl("/#website") }
  };
  const faq = page.faq.length ? {
    "@type": "FAQPage", "@id": absoluteUrl(page.path + "#faq"),
    mainEntity: page.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }))
  } : null;
  const media = (content as { videos?: {
    caseStudies?: { vimeoId: string; title: string; stat: string; uploadDate?: string; thumbnailUrl?: string }[];
    testimonials?: { name: string; vimeoId: string; uploadDate?: string; thumbnailUrl?: string }[];
  } }).videos;
  const videos = page.path === "/" ? [
    ...(media?.caseStudies ?? []).map((item) => ({
      "@type": "VideoObject",
      "@id": absoluteUrl(`/#video-${item.vimeoId}`),
      name: item.title,
      description: `${item.title}. Documented result: ${item.stat}.`,
      thumbnailUrl: item.thumbnailUrl,
      uploadDate: item.uploadDate,
      embedUrl: `https://player.vimeo.com/video/${item.vimeoId}`,
      publisher: { "@id": organizationId },
    })),
    ...(media?.testimonials ?? []).map((item) => ({
      "@type": "VideoObject",
      "@id": absoluteUrl(`/#video-${item.vimeoId}`),
      name: `${item.name} testimonial`,
      description: `${item.name} shares a video testimonial about working with Bunny Agency.`,
      thumbnailUrl: item.thumbnailUrl,
      uploadDate: item.uploadDate,
      embedUrl: `https://player.vimeo.com/video/${item.vimeoId}`,
      publisher: { "@id": organizationId },
    })),
  ] : [];
  const graph = [main, ...(breadcrumb ? [breadcrumb] : []), ...(faq ? [faq] : []), ...videos];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}
