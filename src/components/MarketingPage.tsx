import Image from "next/image";
import Link from "next/link";
import { content, pages, type SeoPage } from "@/lib/content";
import PageJsonLd from "@/components/PageJsonLd";
import TrackedHubSpotForm from "@/components/TrackedHubSpotForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";

export default function MarketingPage({ page }: { page: SeoPage }) {
  const related = page.relatedPaths.filter((item) => item !== page.path).map((item) => pages.find((candidate) => candidate.path === item)).filter(Boolean) as SeoPage[];
  const articles = page.isBlogHub ? pages.filter((item) => item.category === "blog") : [];
  const serviceChildren = page.path === "/services" ? pages.filter((item) => item.category === "service") : [];
  const media = (content as { videos?: { caseStudiesHeading?: string; testimonialsHeading?: string; caseStudies?: { vimeoId: string; title: string; stat: string }[]; testimonials?: { name: string; vimeoId: string }[] } }).videos;
  const gallery = (content as { creatorGallery?: { heading?: string; items?: { src: string; alt: string }[] } }).creatorGallery;
  const heroHome = (content as { heroHome?: { ctaPrimary?: { label: string; href: string }; ctaSecondary?: { label: string; href: string }; badges?: string[]; statChip?: { value: string; label: string } } }).heroHome;
  const stats = (content as { stats?: { ariaLabel?: string; items?: { value: string; label: string }[] } }).stats;
  const asideFacts = (content as { asideFacts?: string[] }).asideFacts;
  const isHome = page.path === "/";
  return <>
    <PageJsonLd page={page} />
    <article className="page-shell">
      <Breadcrumbs page={page} />
      <header className="hero">
        <div className="hero-frame">
          <div className="hero-copy">
            <p className="eyebrow">{page.keyword}</p>
            <h1>{page.h1}</h1>
            <div className="answer-card">
              <strong>{content.labels.directAnswer}</strong>
              <p>{page.summary}</p>
            </div>
          {page.caseStudyNote && <p className="case-study-note">{page.caseStudyNote}</p>}
            {isHome && heroHome ? <>
              <div className="hero-ctas">
                {heroHome.ctaPrimary ? <Link className="button button-hero" href={heroHome.ctaPrimary.href}>{heroHome.ctaPrimary.label}</Link> : null}
                {heroHome.ctaSecondary ? <Link className="button button-ghost" href={heroHome.ctaSecondary.href}>{heroHome.ctaSecondary.label}</Link> : null}
              </div>
              {heroHome.badges?.length ? <ul className="hero-badges">{heroHome.badges.map((badge) => <li key={badge}>{badge}</li>)}</ul> : null}
            </> : null}
          </div>
          <div className="hero-media">
            <Image className="hero-image" src={page.image} alt={page.alt} width={1200} height={675} priority sizes="(max-width: 960px) 100vw, 52vw" />
            <span className="hero-corner hero-corner-tl" aria-hidden="true" />
            <span className="hero-corner hero-corner-br" aria-hidden="true" />
            {isHome && heroHome?.statChip ? <p className="hero-chip"><strong>{heroHome.statChip.value}</strong><span>{heroHome.statChip.label}</span></p> : null}
          </div>
        </div>
      </header>
      {isHome && stats?.items?.length ? <section className="stats-band" aria-label={stats.ariaLabel}>
        {stats.items.map((stat) => <div key={stat.label} className="stat-tile"><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </section> : null}
      <div className="content-grid">
        <article className="article-body">
          {page.sections.map((section) => <Reveal as="section" key={section.heading} className="prose-section"><h2>{section.heading}</h2><p>{section.body}</p>{section.steps?.length ? <ol>{section.steps.map((item) => <li key={item}>{item}</li>)}</ol> : null}{section.items?.length ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}{section.table?.headers.length ? <div className="overflow-x-auto content-table-wrap"><table><thead><tr>{section.table.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div> : null}</Reveal>)}
          {serviceChildren.length > 0 && <section className="collection"><h2>{content.labels.services}</h2><div className="card-grid">{serviceChildren.map((service) => <Link key={service.path} className="content-card" href={service.path}><span>{service.keyword}</span><h3>{service.h1}</h3><p>{service.summary}</p><strong className="card-cta">{content.labels.read} →</strong></Link>)}</div></section>}
          {articles.length > 0 && <section className="collection"><h2>{content.labels.browse}</h2><div className="card-grid">{articles.map((article) => <Link key={article.path} className="content-card" href={article.path}><span>{article.keyword}</span><h3>{article.h1}</h3><p>{article.summary}</p><strong className="card-cta">{content.labels.read} →</strong></Link>)}</div></section>}
          {page.faq.length > 0 && <section className="faq-block"><h2>{content.labels.questions}</h2><div className="faq-list">{page.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>}
          {page.citations.length > 0 && <section className="sources-block"><h2>{content.labels.sources}</h2><ul className="sources">{page.citations.map((item) => <li key={item.url}><a href={item.url} rel="noopener noreferrer">{item.label}</a></li>)}</ul></section>}
          <section className="page-trust">
            <p className="provenance">{content.labels.authoredBy}: <strong>{page.author ?? content.site.legalEntity.managingDirector}</strong>, {content.site.name} · {content.labels.updated}: <time dateTime={page.dateModified}>{page.dateModified}</time></p>
            <p className="ymyl-note">{content.labels.ymyl}</p>
            <p className="reviews-link">{content.labels.reviewsLabel}: {content.site.reviews.map((href, i) => <span key={href}>{i > 0 ? " · " : ""}<a className="review-link" href={href} rel="noopener noreferrer">{new URL(href).hostname.replace(/^www\./, "")}</a></span>)}</p>
          </section>
        </article>
        <aside className="cta-panel">
          <div className="cta-panel-inner">
            <span className="cta-flourish" aria-hidden="true" />
            <h2>{content.labels.cta}</h2>
            <p>{content.labels.ctaBody}</p>
            <TrackedHubSpotForm siteCode={content.site.code} category={page.category} language={content.site.locale} loadLabel={content.labels.cta} />
            {asideFacts?.length ? <ul className="aside-facts">{asideFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul> : null}
          </div>
        </aside>
      </div>
      {isHome && media?.caseStudies?.length ? <section className="case-studies"><h2>{media.caseStudiesHeading}</h2><p className="case-proof">{media.caseStudies.map((item) => item.title).join(". ")}.</p><div className="case-grid">{media.caseStudies.map((cs) => <figure key={cs.vimeoId} className="case-card"><div className="video-embed"><iframe src={`https://player.vimeo.com/video/${cs.vimeoId}`} title={cs.title} loading="lazy" allow="fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe></div><figcaption><strong>{cs.stat}</strong><span>{cs.title}</span></figcaption></figure>)}</div></section> : null}
      {isHome && gallery?.items?.length ? <section className="creator-gallery"><h2>{gallery.heading}</h2><div className="gallery-grid">{gallery.items.map((g) => <figure key={g.src} className="gallery-item"><Image className="gallery-img" src={g.src} alt={g.alt} width={900} height={1200} loading="lazy" sizes="(max-width: 700px) 45vw, 220px" /></figure>)}</div></section> : null}
      {media?.testimonials?.length ? <section className="testimonials"><h2>{media.testimonialsHeading}</h2><div className="testi-grid">{media.testimonials.map((t) => <figure key={t.vimeoId} className="testi-card"><div className="video-embed"><iframe src={`https://player.vimeo.com/video/${t.vimeoId}`} title={t.name} loading="lazy" allow="fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe></div><figcaption>{t.name}</figcaption></figure>)}</div></section> : null}
      {related.length > 0 && <section className="related"><h2>{content.labels.related}</h2><div className="related-grid">{related.map((item) => <Link key={item.path} href={item.path}><span>{item.keyword}</span><strong>{item.h1}</strong></Link>)}</div></section>}
    </article>
  </>;
}
