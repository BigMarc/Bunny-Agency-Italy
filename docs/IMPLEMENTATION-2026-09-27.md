# Italy implementation — 27 September 2026

## Changed

`src/content/site-content.json`: direct Italian answers, complete metadata and the requested agenzia OnlyFans wording on pricing/services; expanded operational sections and FAQs on core money pages. The original 85.000 creator, 150–180 euro and 0,8% material remains, as do all case figures, testimonials and images. The 25–50% commission is explicit. Proof moved below direct answers stays on the same page and in both llms exports.

Shared template changes fix filler, duplicate FAQ, route-first-publication dates, language schema, hero priority, page landmarks and pricing/FAQ navigation. Organization reviews and rating are unchanged. Retired it-IT alternates were removed throughout the network.

## Verification

Build and validator pass: 49 marketing / 54 total registered pages. All original image references, alts, galleries, videos, people, rating and case amounts pass the baseline preservation check. Final build logs live in the network implementation directory.

## Skipped / needs owner approval

Domain registration, project reassignment and deployment cannot be performed as source edits. Italian slug and main-site migrations are concrete proposals in `URL-CHANGES-PROPOSED.md`; none is applied. The shared instruction to leave x-default pending takes precedence over the site-specific request to change it immediately. Current canonical hosts remain until a migration is approved.

## Owner input needed

Owner of the unrelated Italia Agentur deployment; publishable Italian-speaking staff details. Additional Italian cases and a source link for the existing market figure are optional additions; existing proof is confirmed and remains published. Legal-policy review is listed in the network lawyer inventory.

## Owner actions

Register bunny-agency.it, attach apex/www to the intended Vercel project and set the chosen primary host. Reassign it.bunny-agency.com only after the reviewed redirect plan is approved. Verify GSC/Bing and the destination canonical responses, resolve billing, then rerun IndexNow. Do not restore Italy to the reciprocal cluster until its host serves the intended pages.

## Source locations

- `src/content/site-content.json:684`
- `src/components/MarketingPage.tsx:32`
- `src/components/PageJsonLd.tsx:16`
- `scripts/validate-seo.mjs:26`
