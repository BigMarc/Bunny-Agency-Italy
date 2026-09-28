import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";
import MobileNav from "@/components/MobileNav";

export function SiteHeader() {
  const labels = content.labels as typeof content.labels & { pricing?: string; navBlog?: string };
  const nav: [string, string][] = [["/", labels.home], ["/servizi", labels.services], ["/prezzi", labels.pricing ?? "Prezzi"], ["/blog", labels.navBlog ?? labels.blog], ["/chi-siamo", labels.about], ["/candidatura", labels.apply]];
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">BA</span>
          <span className="brand-name">{content.site.name}</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className={href === "/candidatura" ? "nav-cta" : "nav-link"}>{label}</Link>
          ))}
        </nav>
        <MobileNav items={nav} applyLabel={content.labels.apply} />
      </div>
    </header>
  );
}

type NetworkItem = { hreflang: string; lang: string; label: string; url: string; current?: boolean };

export function SiteFooter() {
  const labels = content.labels as typeof content.labels & { pricing?: string; navBlog?: string };
  const network = (content as { network?: { heading?: string; note?: string; items?: NetworkItem[] } }).network;
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-identity">
          <Image src="/images/seo/site-identity.webp" alt={content.site.identityAlt} width={480} height={270} sizes="240px" />
          <strong className="footer-name">{content.site.name}</strong>
          <p className="footer-market">{content.site.market} · {content.site.locale}</p>
          <p className="footer-tagline">{content.site.description}</p>
        </div>
        <nav className="footer-col" aria-label="Site">
          <strong className="footer-col-title">{labels.services}</strong>
          <Link href="/">{labels.home}</Link>
          <Link href="/servizi">{labels.services}</Link>
          <Link href="/prezzi">{labels.pricing ?? "Prezzi"}</Link>
          <Link href="/blog">{labels.navBlog ?? labels.blog}</Link>
          <Link href="/faq">{labels.faq}</Link>
          <Link href="/chi-siamo">{labels.about}</Link>
          <Link href="/candidatura">{labels.apply}</Link>
        </nav>
        <nav className="footer-col" aria-label="Legal">
          <strong className="footer-col-title">{(content.core as { imprintH1?: string }).imprintH1 ?? "Legal"}</strong>
          <Link href="/privacy-policy">{content.core.privacyH1}</Link>
          <Link href="/terms-of-service">{content.core.termsH1}</Link>
          <Link href="/cookie-policy">{content.core.cookiesH1}</Link>
          <Link href="/imprint">{(content.core as { imprintH1?: string }).imprintH1 ?? "Imprint"}</Link>
          <Link href="/disclaimer">{(content.core as { disclaimerH1?: string }).disclaimerH1 ?? "Disclaimer"}</Link>
          <Link href="/contatti">{content.labels.contact}</Link>
        </nav>
      </div>
      {network?.items?.length ? (
        <section className="footer-network" aria-labelledby="footer-network-heading">
          <div className="footer-network-inner">
            <div className="footer-network-head">
              <strong className="footer-col-title" id="footer-network-heading">{network.heading}</strong>
              {network.note ? <span className="footer-network-note">{network.note}</span> : null}
            </div>
            <ul className="lang-list">
              {network.items.map((item) => (
                <li key={item.url}>
                  {item.current
                    ? <span className="lang-current" aria-current="true" lang={item.lang}>{item.label}</span>
                    : <a href={item.url} hrefLang={item.hreflang} lang={item.lang} rel="alternate noopener">{item.label}</a>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      <div className="footer-bottom">
        <p className="legal-entity">{content.site.legalEntity.name} · {content.site.legalEntity.managingDirector}, {content.site.legalEntity.managingDirectorRole} · <a href={"mailto:" + content.site.legalEntity.email}>{content.site.legalEntity.email}</a></p>
        <p className="footer-reviews">{content.labels.reviewsLabel}: {content.site.reviews.map((href, i) => <span key={href}>{i > 0 ? " · " : ""}<a href={href} rel="noopener noreferrer">{new URL(href).hostname.replace(/^www\./, "")}</a></span>)}</p>
      </div>
    </footer>
  );
}
