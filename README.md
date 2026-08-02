# Bunny Agency Italia — bunny-agency.it

Italian-market creator-management site (`it-IT`), part of the Bunny Agency network.
Next.js App Router, statically generated, content-driven from a single JSON registry.

## Stack

- Next.js 16 (App Router) + React 19, fully static (SSG)
- No CSS framework — one hand-written stylesheet (`src/app/globals.css`, "Milanese Editoriale")
- All page content lives in `src/content/site-content.json`; components are presentational

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # runs prebuild (llms.txt) + next build
npm run validate:seo # SEO invariants — must pass before deploy
```

Node 22 is required (see `engines` in `package.json`).

## Content model

`src/content/site-content.json` holds:

| Key | Purpose |
|---|---|
| `site` | locale, URLs, hreflang cluster, legal entity, ratings, IndexNow key |
| `labels` / `core` | all UI strings and page H1/summaries (Italian) |
| `pages[]` | every route: path, title, description, H1, sections, FAQ, citations, image, author |
| `people`, `videos`, `creatorGallery` | E-E-A-T entities, Vimeo case studies, creator photos |
| `network` | footer language switcher — all sibling language sites |

Routing is a single catch-all (`src/app/[[...slug]]/page.tsx`) that resolves a path
against `pages[]`, so **adding a page = adding an object to `pages[]`** (plus an image).

### Page invariants enforced by `scripts/validate-seo.mjs`

- title ≤ 60 chars, description ≤ 155 chars, unique across the site
- ≥ 2 citations per page; a quotable number in the summary and in **every** FAQ answer
- blog keyword present in the H1 or a section heading; service keyword in the H1
- money pages (`/`, `/pricing`, `/services/account-management`, and 3 blog pages)
  need 5–7 sections, ≥ 5 FAQs, and 580–1000 words
- the referenced image file must exist in `public/`

Pages that exist only on this site carry `"italyOnly": true`, which suppresses the
network hreflang alternates (siblings have no equivalent URL).

## Images

Per-page WebP assets are generated deterministically by the network tool:

```bash
cd ../_seo-tools && ONLY_REPO=Bunny-Agency-Italy node generate-images.mjs
```

Creator photos in `public/images/creators/` are the shared network pool.

## SEO / AEO / GEO

- `sitemap.xml` and `robots.txt` are generated from `pages[]` (AI crawlers allowed)
- `llms.txt` / `llms-full.txt` regenerate on `prebuild` (`scripts/generate-llms.mjs`)
- JSON-LD: Organization, WebSite, WebPage/Article/Service, FAQPage, BreadcrumbList,
  Review, AggregateRating, VideoObject, Person
- IndexNow: key file in `public/`, submitted by `scripts/submit-indexnow.mjs`
  (`npm run postdeploy`) and by `.github/workflows/indexnow-production.yml`

## Deployment (Vercel)

Framework preset `nextjs`; config in `vercel.json` (security headers, immutable
image caching, `fra1` region). Set in Vercel project settings:

| Env var | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.bunny-agency.it` |

Domain `bunny-agency.it` must be registered and pointed at Vercel (`.it` requires an
EU/EEA registrant). Until then the production build serves on the `*.vercel.app` URL;
canonicals and hreflang already point at the final domain.

After the domain is live: verify in Google Search Console and Bing Webmaster Tools,
submit the sitemap, and add `https://www.bunny-agency.it` to the sibling sites'
`schemaSameAs` + `it-IT` hreflang (already done in this repo's network config).
