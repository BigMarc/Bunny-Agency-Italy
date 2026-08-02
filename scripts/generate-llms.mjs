import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "src/content/site-content.json"), "utf8"));
const rating = data.site.aggregateRating;
const keyFacts = [
  `- Legal entity: ${data.site.legalEntity.name}; founded 2019 by ${data.site.legalEntity.managingDirector}.`,
  "- Documented creator results: $0 to $330k in 3.5 months; $2k to $33k/month in 2 months. These are individual case studies, not guarantees.",
  `- Independent Trustpilot profile: ${rating.ratingValue}/${rating.bestRating} from ${rating.reviewCount} reviews, checked ${rating.verifiedAt}.`,
  "- Commission model: the percentage and calculation base are agreed in writing; there is no universal fixed rate or upfront fee.",
  "- Creator control: the creator retains the account, revenue, identity, and data; access and exit terms are documented.",
].join("\n");
const llms = [
  `# ${data.site.name}`, "", data.site.description, "", "## Key facts / proof", "", keyFacts, "", "## Pages", "",
  ...data.pages.filter((page) => page.indexable).map((page) => `- [${page.h1}](${data.site.url}${page.path === "/" ? "" : page.path}): ${page.summary}`),
  "", "## Editorial note", "", data.labels.ymyl, "",
].join("\n");
const full = [
  `# ${data.site.name} — full answer corpus`, "", "## Key facts / proof", "", keyFacts, "",
  ...data.pages.filter((page) => page.indexable).flatMap((page) => [
    `## ${page.h1}`, "", `URL: ${data.site.url}${page.path === "/" ? "" : page.path}`, "", page.summary, "",
    ...page.faq.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
  ]),
  "## Editorial note", "", data.labels.ymyl, "",
].join("\n");
fs.writeFileSync(path.join(root, "public/llms.txt"), llms);
fs.writeFileSync(path.join(root, "public/llms-full.txt"), full);
console.log(`${data.site.code}: generated llms.txt and llms-full.txt`);
