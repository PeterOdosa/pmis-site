# PMIS NIG. LTD: homepage (static)

Plain HTML, CSS and a little JavaScript. No build step, no dependencies. Desktop and mobile layouts live in the same files (responsive).

```
pmis-site/
├── index.html        the homepage (semantic HTML, icon sprite at the top)
├── about.html, services.html, faq.html, contact.html   (to build, see Pages below)
├── css/styles.css    all styles, design tokens in :root, breakpoints at the bottom
├── js/main.js        mobile menu toggle + footer year
└── images/           logo.png (company logo, used in header, footer and favicon); real photos go here too
```

## Pages (multi-page site, no one-page scrolling)

Navigation links go to separate pages, not to sections of the homepage:

| Link | File | Status |
|------|------|--------|
| Home | `index.html` | built |
| About | `about.html` | to build |
| Services | `services.html` | to build |
| FAQ | `faq.html` | to build |
| Blog | `blog.html` for now | later: point to the WordPress blog URL |
| Contact | `contact.html` | to build |

Links to pages that don't exist yet will 404 until those files are added.

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
On phones, the six service cards hide their photos on purpose (compact layout). Delete the `.service .media { display: none; }` rule in the 720px block to show them.

## TODO before launch

- [ ] Replace the `[00]` stats with real figures (or delete the stats section)
- [ ] Replace the `[Project name]`, `[Service type]`, `[Location] · [Year]` cards and the `[Client testimonial]` with real content (or delete the section)
- [ ] Swap the partner text wordmarks (Imoniyame, Okomu, Rubber Research Institute of Nigeria) for the real logos
- [ ] Replace the blog cards (titles are real, dates are `[Date]`) and point the "Blog" nav link and "View all posts" at the live blog URL
- [ ] Build the other pages (About, Services, FAQ, Contact); "Learn more" currently goes to `services.html`
- [ ] Confirm the four FAQ answers with the client
- [ ] Add the real Telegram, WhatsApp and Facebook links in the footer
- [ ] Check the three phone numbers and the email
- [ ] Remove `<meta name="robots" content="noindex, nofollow">` from `index.html` when the site goes live
- [ ] Make small favicon sizes from the logo (the page currently uses `images/logo.png`) and add a social preview image if wanted

## Deploying

Everything in this folder is the site. Upload the contents (not the folder itself) to the document root of the staging subdomain. Do not use rsync `--delete` against a folder that also holds other sites (for example WordPress).
