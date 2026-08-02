import { absoluteUrl, content } from "@/lib/content";

type Testimonial = { name: string; vimeoId: string };

export default function SiteJsonLd() {
  const site = content.site as typeof content.site & {
    alternateNames: string[];
    foundingDate: string;
    knowsAbout: string[];
    schemaSameAs: string[];
    aggregateRating: { ratingValue: number; reviewCount: number; bestRating: number; verifiedAt: string; source: string };
  };
  const videos = (content as { videos?: { testimonials?: Testimonial[] } }).videos;
  const organizationId = absoluteUrl("/#organization");
  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    alternateName: site.alternateNames,
    legalName: site.legalEntity.name,
    url: absoluteUrl("/"),
    logo: "https://bunny-agency.com/wp-content/uploads/2021/12/only-fans-managemnt-logo.webp",
    image: absoluteUrl("/images/seo/site-identity.webp"),
    description: site.description,
    foundingDate: site.foundingDate,
    areaServed: site.market,
    knowsAbout: site.knowsAbout,
    knowsLanguage: site.locale,
    email: site.legalEntity.email,
    parentOrganization: { "@id": "https://bunny-agency.com/#organization", name: "Bunny Agency" },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.legalEntity.streetAddress,
      addressLocality: site.legalEntity.addressLocality,
      addressRegion: site.legalEntity.addressRegion,
      postalCode: site.legalEntity.postalCode,
      addressCountry: site.legalEntity.addressCountry,
    },
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.legalEntity.email },
    founder: {
      "@type": "Person",
      name: site.legalEntity.managingDirector,
      jobTitle: site.legalEntity.managingDirectorRole,
      sameAs: "https://www.linkedin.com/in/sophia-brecht-b07072355/",
    },
    employee: content.people.map((person) => ({ "@type": "Person", name: person.name, jobTitle: person.role })),
    sameAs: site.schemaSameAs,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.aggregateRating.ratingValue,
      reviewCount: site.aggregateRating.reviewCount,
      bestRating: site.aggregateRating.bestRating,
      worstRating: 1,
      url: site.aggregateRating.source,
    },
    review: (videos?.testimonials ?? []).map((testimonial) => ({
      "@type": "Review",
      author: { "@type": "Person", name: testimonial.name },
      reviewBody: `${testimonial.name} video testimonial about working with Bunny Agency.`,
      url: `https://player.vimeo.com/video/${testimonial.vimeoId}`,
    })),
  };
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      { "@type": "WebSite", "@id": absoluteUrl("/#website"), name: site.name, url: absoluteUrl("/"), publisher: { "@id": organizationId }, inLanguage: site.locale },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
