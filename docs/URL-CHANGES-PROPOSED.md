> Superseded by the owner-delegated decisions on 28 September 2026 in [OWNER-DECISIONS.md](../../Docs/implementation-2026-09-27/OWNER-DECISIONS.md). This is the original proposal inventory, not an outstanding approval request. Italian core paths and NL/Czech/Israel aliases are selected; the men's blanket map and optional country/article migrations are declined.

# Italian URL proposal — approval required

No route, redirect or canonical has changed. Preserve every figure, testimonial, image and image alt on its destination before applying a migration. Keep /, /blog, /faq and all current article paths in this first proposal; the requested core pages receive Italian paths below.

| Current route | Proposed route | Response from old route |
| --- | --- | --- |
| `/services` | `/servizi` | 301 |
| `/services/account-management` | `/servizi/gestione-account-onlyfans` | 301 |
| `/services/marketing` | `/servizi/marketing-onlyfans` | 301 |
| `/services/chat-management` | `/servizi/gestione-chat-onlyfans` | 301 |
| `/services/content-strategy` | `/servizi/strategia-contenuti-onlyfans` | 301 |
| `/services/privacy-dmca` | `/servizi/privacy-dmca` | 301 |
| `/pricing` | `/prezzi` | 301 |
| `/about` | `/chi-siamo` | 301 |
| `/apply` | `/candidatura` | 301 |
| `/contact` | `/contatti` | 301 |

After approval, update navigation, internal links, canonical URLs, sitemap, llms exports and matching language-cluster paths together. Verify destination 200/self-canonical and exactly one redirect from each old path. Do not send every article to the homepage.

Host plan: register and attach `www.bunny-agency.it` before activation; apex → www 308. Move `it.bunny-agency.com` away from the unrelated deployment and map its reviewed paths only after owner confirmation. The preview host must not become a second indexable canonical copy.

Main-site plan: `https://bunny-agency.com/it/` → `https://www.bunny-agency.it/` after its figures, testimonials and images are carried over. The exact second source is `https://bunny-agency.com/it/guida-onlyfans-twitter-a-comprehensive-guide-to-engage-with-fans/`, confirmed in the main repository at `src/app/it/guida-onlyfans-twitter-a-comprehensive-guide-to-engage-with-fans/page.tsx`. Proposed target: `https://www.bunny-agency.it/blog/questions/how-to-promote-without-spam`. Carry its original social image `/wp-content/uploads/2023/03/jane-sundried-dcJoWqRaWsg-unsplash-scaled.webp` and all figures to the destination before enabling a 301. The main home also carries 400+, $55K, 112+, $15M+, 90% and 24/7; preserve them in the destination home. This cross-repository merge remains a proposal, with no source deletion.

Hreflang: keep the existing x-default until approval under 00-network.md. Options are omission or `https://bunny-agency.com` joining with equivalent reciprocal pages; the Italian prompt's x-default/en request does not justify pointing every article to a non-equivalent homepage. Other site hosts use the current source canonical map. Domain launch must precede restoring it-IT.
