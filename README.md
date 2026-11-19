# PMIS NIG. LTD: homepage (static)

Plain HTML, CSS and a little JavaScript. No build step, no dependencies. Desktop and mobile layouts live in the same files (responsive).

```
pmis-site/
├── index.html        the homepage (semantic HTML, icon sprite at the top)
├── about.html        About Us and Our History (built); team.html, gallery.html, services.html, faq.html, contact.html still to build, see Pages below
├── book.php          EUDR booking handler (PHP)
├── send.php          contact form handler (PHP, runs on cPanel)
├── css/styles.css    all styles, design tokens in :root, breakpoints at the bottom
├── js/main.js        mobile menu toggle + footer year
└── images/           logo.png (company logo, used in header, footer and favicon); real photos go here too
```

## Pages (multi-page site, no one-page scrolling)

Navigation links go to separate pages, not to sections of the homepage:

| Link | File | Status |
|------|------|--------|
| Home | `index.html` | built |
| About, About Us | `about.html` | built |
| About, Our History | `history.html` | built |
| About, Our Team | `team.html` | built |
| About, Our Work | `gallery.html` | built (EUDR training and audit portfolio; nav label is "Our Work") |
| Services | `services.html` | built |
| EUDR Training & Audit (booking) | `eudr.html`, `eudr-thanks.html`, `book.php` | built, not in the main nav (linked from Services, homepage and footer) |
| FAQ | `faq.html` | built |
| Blog | `blog.html` for now | later: point to the WordPress blog URL |
| Contact | `contact.html` + `send.php` | built |

Links to pages that don't exist yet will 404 until those files are added.

A bullet that holds a sub-list needs `class="dots__parent"` on its `<li>` (see the 2023 and 2025 rows in `about.html`), otherwise the sub-list sits beside the text.

Each page repeats the same `<header>`, `<footer>` and icon sprite from `index.html`. Copy them into every new page, and move `aria-current="page"` to that page's own nav link (it gets the gold underline). Keep the `<head>` links to `css/styles.css` and `js/main.js` on every page. If copy-pasting the header and footer gets tiring, a small static site generator (Eleventy or Astro) can share them and still output plain HTML for the server.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000

## Design tokens (css/styles.css, `:root`)

Forest green `--g900/--g800/--g700`, harvest gold `--gold`, page background `--ground`.
Fonts: Bricolage Grotesque (headings) and Figtree (body), loaded from Google Fonts in `<head>`.

Breakpoints: 1024px (3 to 2 columns), 900px (nav collapses to a menu button, two-column sections stack), 720px (single column, compact service cards), 600px (full-width buttons, stacked footer).

## Replacing the placeholder photos

Every photo is a `.media` box with gradient classes (`ph ph--a` etc.) and a label chip. To use a real photo:

```html
<!-- before -->
<div class="media ph ph--a" role="img" aria-label="Young crop rows">
  <span class="ph__tag">Photo · Young crop rows</span>
</div>

<!-- after -->
<div class="media">
  <img src="images/farm-establishment.jpg" alt="Young maize rows on a plantation" loading="lazy" width="800" height="500">
</div>
```

Use `loading="lazy"` on everything except the hero image. Compress photos first (around 200 KB each, WebP or JPG).
On phones the service cards show a shorter photo (160px).

Homepage hero photo is done as a worked example: `images/hero-tractor-{640,960,1280}.{webp,jpg}` served through `<picture>` with `srcset`, `width`/`height` set, `fetchpriority="high"` (it is the first thing on screen, so no lazy loading). Reuse that pattern for other photos. Focus point is set with `object-position` on `.hero__img`.

## TODO before launch

- [ ] Homepage stats: 40+ projects, 1,000+ hectares, 16+ years (counted from 2010, automatic) and 560+ farmers trained. Confirm the 40+ projects figure with the client. The About page says founded 2017, History says 2010: make them agree
- [ ] Project cards are filled (labour line 2012, Okomu field training 2026, Imoniyame EUDR audit 2026). Confirm consent from people shown in the photos. Replace the `[Client testimonial]` placeholder with a real quote (or delete it)
- [ ] Swap the partner text wordmarks (Imoniyame, Okomu, Rubber Research Institute of Nigeria) for the real logos
- [ ] Replace the blog cards (titles are real, dates are `[Date]`) and point the "Blog" nav link and "View all posts" at the live blog URL
- [ ] Build the other pages (About, Services, FAQ, Contact); "Learn more" currently goes to `services.html`
- [ ] Confirm the four FAQ answers with the client
- [ ] About page: confirm spellings (Cemilia Resorts and Farms Ltd, Luckyfad Enterprises) and the figures that differ between sections (560 farmers across four states in 2020, vs "over 500 agro-workers across 10 states" under Community Impact, vs "1,000+" and "1000" hectares)
- [ ] About page: replace the hero photo, the founder photo and the partner wordmarks with real images
- [ ] History page: make it agree with the About page. About says "2017: founded" and "2020: trained over 560 farmers"; History says created August 2010 and 560 farmers trained 2016 to 2018
- [ ] History page: confirm every box of the rebuilt organogram (it replaces the old ORGANO.png), especially "Outsourcing / agency services"
- [ ] History page: replace the hero, intro and civil-works photos and the six gallery placeholders; (the 3 other old gallery photos now sit at the bottom of `gallery.html`)
- [ ] Team page: bios were transcribed from a screenshot of the old page, so proofread them; add real photos (same crop for everyone, 4:5 for the Chairman, square for the cards; one old photo has a watermark); confirm titles ("Legal Services" is a department, and "Company Architect" here vs "Architect" on History)
- [ ] Services page: written from the homepage, About and History pages (not the old services page). Check each service's bullet list, the "Best for" lines, the placeholder "How we work" steps, and Agro Land Sourcing (only one line of source copy)
- [ ] EUDR Training & Audit (service 07): first-draft copy, confirm scope and bullets with the client. It spans the full last row of the homepage and About grids (`span-last`)
- [ ] FAQ page: answers are the old ones plus new EUDR, training and "Where do you work?" answers. Confirm with the client. The old "500+ projects / 99%" stats were dropped (unverified). Keep the FAQPage JSON-LD in sync if questions change
- [ ] Contact page: `send.php` emails the form to info@p-man.com.ng and needs PHP on the server (standard on cPanel; it will not run in `python3 -m http.server`). Create no-reply@p-man.com.ng in cPanel, send a test message, and check it is not in spam. Page shows info@p-man.com.ng, so confirm which email to publish. Add real WhatsApp, hours or map if wanted
- [ ] Our Work page: dates, locations and participant counts are `[placeholders]` on all 7 cards. Get permission to name Okomu, Ilusin and Imoniyame and to show participants. Add each engagement's real photos as `<a href="full.jpg" data-lightbox><img ...></a>` for the enlarge view. The EU's EUDR logo from the old page was deliberately not reused
- [ ] EUDR booking: prices are placeholders (from N200,000 each); confirm what they cover (per participant, session or site). Put the two real Payaza payment links in `eudr-thanks.html` (the `#` hrefs). Until then the page says an invoice will follow. `book.php` emails bookings to info@p-man.com.ng (needs PHP and the no-reply@p-man.com.ng mailbox). Matching payments to bookings is manual until a Payaza webhook is added. Add refund terms, a privacy note and USD pricing before advertising abroad. Do not hard-code EUDR dates
- [ ] Homepage and Services page service photos are stock images (some foreign: US tractor, European houses in the land-sourcing photo; the building is a 3D render; the training scene is AI-generated). Replace with real PMIS photos when available, same pattern as `images/svc-*`. The EUDR image is AI-generated (plantation with location pins): swap for a real EUDR training photo when the client has one
- [ ] Services page hero is a stock photo of tractors (US/European machinery, partial brand text on the trailer). Replace with a real PMIS photo when available; use the `.page-hero--photo` markup in `services.html` for any other page hero
- [ ] Phone number: the old site shows +234 (0) 8158506528 on the home page and 8158505628 on Our History. Confirm which is right
- [ ] Add the real Telegram, WhatsApp and Facebook links in the footer
- [ ] Check the three phone numbers and the email
- [ ] Remove `<meta name="robots" content="noindex, nofollow">` from `index.html` when the site goes live
- [ ] Make small favicon sizes from the logo (the page currently uses `images/logo.png`) and add a social preview image if wanted

## Deploying

Everything in this folder is the site. Upload the contents (not the folder itself) to the document root of the staging subdomain. Do not use rsync `--delete` against a folder that also holds other sites (for example WordPress).
