import Link from "next/link";
import { content, pages, type SeoPage } from "@/lib/content";

export function breadcrumbPages(page: SeoPage): SeoPage[] {
  if (page.path === "/") return [];
  const parentPath = page.path.startsWith("/services/") ? "/services" : page.path.startsWith("/blog/") ? "/blog" : null;
  const parent = parentPath ? pages.find((candidate) => candidate.path === parentPath) : undefined;
  return [...(parent ? [parent] : []), page];
}

type LegacyItem = { label: string; href?: string };

export default function Breadcrumbs({ page, items }: { page?: SeoPage; items?: LegacyItem[] }) {
  if (items) return <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>
    <li><Link href="/">{content.labels.home}</Link></li>
    {items.filter((item) => item.href !== "/").map((item, index, list) => <li key={`${item.href ?? "current"}-${item.label}`} aria-current={index === list.length - 1 ? "page" : undefined}>
      {item.href && index !== list.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
    </li>)}
  </ol></nav>;
  if (!page) return null;
  const crumbs = breadcrumbPages(page);
  if (!crumbs.length) return null;
  return <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><Link href="/">{content.labels.home}</Link></li>
      {crumbs.map((crumb, index) => <li key={crumb.path} aria-current={index === crumbs.length - 1 ? "page" : undefined}>
        {index === crumbs.length - 1 ? <span>{crumb.h1}</span> : <Link href={crumb.path}>{crumb.h1}</Link>}
      </li>)}
    </ol>
  </nav>;
}
