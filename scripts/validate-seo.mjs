import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function validateContent(data, root) {
  const errors = [];
  const marketing = data.pages.filter((page) => page.category !== "legal");
  const moneyPaths = new Set(["/", "/services/account-management", "/pricing", "/blog/questions/creator-taxes-guide", "/blog/questions/how-to-start-onlyfans", "/blog/questions/how-to-choose-a-creator-agency"]);
  const paths = new Set(data.pages.map((page) => page.path));
  const segmenter = new Intl.Segmenter(data.site.locale, { granularity: "word" });
  if (marketing.length < 38) errors.push("fewer than 38 marketing/content pages");
  for (const field of ["path", "title", "description", "h1"]) {
    const seen = new Map();
    for (const page of data.pages) {
      const key = String(page[field] ?? "").trim().toLocaleLowerCase();
      if (seen.has(key)) errors.push(`duplicate ${field}: ${page.path} and ${seen.get(key)}`);
      seen.set(key, page.path);
    }
  }
  for (const page of data.pages) {
    for (const field of ["path", "title", "description", "h1", "summary", "image", "alt", "keyword"]) {
      if (!page[field]) errors.push(`${page.path} missing ${field}`);
    }
    for (const [field, value] of [["summary", page.summary], ["title", page.title], ...page.faq.map((faq) => ["FAQ answer", faq.answer])]) {
      if (/LLC: 2019/.test(value) || /\| Bunny\.$/.test(value.trim()) || value.startsWith(`${data.site.name} —`)) {
        errors.push(`${page.path} ${field} contains generated filler`);
      }
    }
    if (!page.faq?.length) errors.push(`${page.path} missing visible FAQ`);
    if (new Set(page.faq.map((faq) => faq.question.trim().toLocaleLowerCase())).size !== page.faq.length) errors.push(`${page.path} duplicate FAQ question`);
    if (page.title.length > 60) errors.push(`${page.path} title exceeds 60 characters`);
    if (page.description.length > 155) errors.push(`${page.path} description exceeds 155 characters`);
    if (/[….] \| Bunny\.$|…/.test(page.title)) errors.push(`${page.path} truncated title`);
    if (page.citations.length < 2) errors.push(`${page.path} has fewer than 2 citations`);
    if (page.category === "service" && !page.h1.toLocaleLowerCase().includes(page.keyword.toLocaleLowerCase())) errors.push(`${page.path} service keyword missing from H1`);
    if (page.category === "blog" && ![page.h1, ...page.sections.map((section) => section.heading)].some((value) => value.toLocaleLowerCase().includes(page.keyword.toLocaleLowerCase()))) errors.push(`${page.path} blog keyword missing from H1/H2`);
    for (const related of page.relatedPaths ?? []) if (!paths.has(related)) errors.push(`${page.path} broken related path ${related}`);
    if (moneyPaths.has(page.alternatePath ?? page.path)) {
      if (page.sections.length < 5 || page.sections.length > 7) errors.push(`${page.path} money page needs 5-7 sections`);
      if (page.faq.length < 5) errors.push(`${page.path} money page needs at least 5 FAQs`);
      const rendered = [page.summary, ...page.sections.flatMap((section) => [section.heading, section.body, ...(section.items ?? []), ...(section.steps ?? []), ...(section.table?.headers ?? []), ...(section.table?.rows.flat() ?? [])]), ...page.faq.flatMap((faq) => [faq.question, faq.answer])].join(" ");
      if (["zh-TW", "th-TH", "ko-KR"].includes(data.site.locale)) {
        if (rendered.length < 1400) errors.push(`${page.path} money page is too short`);
      } else {
        const words = [...segmenter.segment(rendered)].filter((item) => item.isWordLike).length;
        if (words < 580) errors.push(`${page.path} money page needs at least 580 words: ${words}`);
      }
    }
    if (root && !fs.existsSync(path.join(root, "public", page.image))) errors.push(`${page.path} missing image ${page.image}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(page.datePublished) || !/^\d{4}-\d{2}-\d{2}$/.test(page.dateModified) || page.datePublished > page.dateModified) errors.push(`${page.path} invalid publication/modification dates`);
  }
  if (data.site.hreflang?.["it-IT"]) errors.push("unlaunched Italian hreflang target");
  for (const url of data.site.schemaSameAs ?? []) {
    if (url.replace(/\/+$/, "") === data.site.url.replace(/\/+$/, "")) errors.push("sameAs points to this site");
    if (new URL(url).hostname === "www.bunny-agency.it") errors.push("unlaunched Italian sameAs target");
  }
  if (root) {
    for (const file of ["public/llms.txt", "public/llms-full.txt", "src/app/robots.ts", "src/app/sitemap.ts", "src/components/TrackedHubSpotForm.tsx", "src/components/SiteJsonLd.tsx", "src/components/Breadcrumbs.tsx"]) if (!fs.existsSync(path.join(root, file))) errors.push(`missing ${file}`);
    for (const file of ["SiteJsonLd.tsx", "PageJsonLd.tsx"]) {
      const schema = fs.readFileSync(path.join(root, "src/components", file), "utf8");
      if (/"@type": "HowTo"/.test(schema)) errors.push(`${file} contains HowTo schema`);
      if (file === "SiteJsonLd.tsx" && (!schema.includes("aggregateRating:") || !schema.includes("review:"))) errors.push(`${file} must retain the existing rating and testimonial markup`);
    }
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const data = JSON.parse(fs.readFileSync(path.join(root, "src/content/site-content.json"), "utf8"));
  const errors = validateContent(data, root);
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log(`${data.site.code}: ${data.pages.filter((page) => page.category !== "legal").length} marketing pages, ${data.pages.length} total pages; SEO registry valid`);
}
