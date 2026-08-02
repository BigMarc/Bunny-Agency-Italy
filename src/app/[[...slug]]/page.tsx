import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content, findPage, metadataForPage, pages } from "@/lib/content";
import MarketingPage from "@/components/MarketingPage";

export const dynamicParams = false;
export function generateStaticParams() { return pages.filter((page) => !(content.site.concretePaths as string[]).includes(page.path)).map((page) => ({ slug: page.path === "/" ? [] : page.path.slice(1).split("/") })); }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params; const page = findPage(resolvedParams.slug); if (!page) return {};
  return metadataForPage(page);
}
export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) { const resolvedParams = await params; const page = findPage(resolvedParams.slug); if (!page) notFound(); return <MarketingPage page={page} />; }
