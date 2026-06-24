# Multispect · Civic Barometer — marketing site

A static, multi-page credibility/positioning site for **Multispect Solutions**, built from the 18-slide *Civic Barometer* deck. No build step, no framework, no runtime dependencies — plain HTML, CSS and a little vanilla JS. Deployable by dropping the folder on any static host.

```
multispect-site/
├── index.html      ← landing "spine": hero · spectrum · condensed challenge ·
│                      stack at-a-glance · condensed why · close + contact
├── method.html     ← Method: challenge · executive summary · blind-spot · cultural depth
├── products.html   ← Products: Polygon · Deep-Dive · Barometer · Command Altitudes
├── cases.html      ← Case Studies: Sweden / UK / France (collapsed by default)
├── why.html        ← Why Us: differentiators · platform-vs-expertise comparison
├── about.html      ← About: house of expertise · ethics & governance
├── styles.css      ← design tokens + all styling (palette lives at :root)
├── main.js         ← scroll reveal · sticky nav · dynamic background · accordions · legacy redirects
└── assets/         ← drop press photos + OG share image here
```

## Information architecture

The landing page (`index.html`) is the lean narrative spine — roughly a third of the
content. The detail lives on five menu-reachable destination pages, with deeper
material behind expand/collapse (`<details>` accordions). The nav is identical on
every page; the current page is highlighted (`data-page` on `<body>` → `data-nav`
link). Case studies are **collapsed by default** and expand to the full read.

**Legacy links:** the site was originally a single page. `main.js` maps old in-page
anchors (e.g. `/#barometer`, `/#cases`) to their new pages, so existing deep links
still resolve. Deep links to a specific accordion (e.g. `cases.html#case-uk`) open
that panel automatically.

## Preview locally

```bash
# from inside multispect-site/
python3 -m http.server 8000      # → http://localhost:8000
# or:  npx serve .
```

`npx serve` strips `.html` from URLs locally (cosmetic); GitHub Pages serves the
`.html` files directly, which is what every internal link uses.

## Deploy to a static host

Drop the whole `multispect-site/` folder on any static host — no build command.
GitHub Pages / Netlify / Vercel / Cloudflare Pages / S3 all work; make `index.html`
the index document.

## Retune the palette (one place)

All colours are CSS custom properties at the top of `styles.css` (`:root`). The five
spectrum hues are the only "brand" colours:

```css
--spec-1:#1f7480; /* Cultural · Religious — deep teal (coolest) */
--spec-2:#4f93a0; /* Social · Civic       — aqua             */
--spec-3:#c2a24e; /* Economic             — muted gold (pivot)*/
--spec-4:#c4742f; /* Political            — amber            */
--spec-5:#a8392b; /* Security             — ember (warm edge)*/
```

Change those and the whole site retunes — spectrum bars, the graphics, accents, band
borders. Neutral ink/paper tones sit just below.

### Section background colours (the "travelling spectrum")

The background shifts as you scroll — cool/light at the top of a page, deepening to a
dark warm "security edge" around the Barometer / Case Studies, then resolving back to
a calm civic tone. Per-section colours live in `main.js` → the `TONES` object (keys
match each `<section id="…">`). Sections that render light text carry
`class="theme-dark"` and paint their own dark background (so their text is always
readable); light sections are transparent and show the travelling layer.

## Graphics

All visuals are inline SVG in the brand palette (no libraries; responsive; each has a
`<title>`/aria label; all animation respects `prefers-reduced-motion`):

- **Spectrum scale** (landing) — civic→security gradient with a "where tension is moving" marker
- **Stack diagram** (landing) — three layers crossing the civic→security axis
- **Blind-spot chart** (method) — confidence vs. actual knowledge, with the gap shaded
- **Cultural-depth strata** (method) — surface text → deep context, five layers
- **Actor-network** (products · Polygon) — digital / human / institutional nodes
- **Barometer** (products) — 30-day baseline → threshold → alert, plus six metric sparklines
- **Command Altitudes** (products) — vertical tactical → operational → strategic axis
- **Case escalation curves** (cases) — slow erosion / hours-to-spike / years-then-spark

## Press images (case studies)

Each case has an empty, captioned 16:9 slot — no imagery is generated. To add a real
photo, drop a file in `assets/img/` and replace the placeholder `<div class="press__ph">`
with an `<img loading="lazy" …>`. Suggested names: `case-sweden.jpg`, `case-uk.jpg`,
`case-france.jpg`. Keep the `<figcaption>` source credit accurate to whatever you license.

**OG share image:** drop a 1200×630 image at `assets/img/og-cover.jpg` (already
referenced by the `og:image` meta tag on every page).

## The "CLOSING LINE — TBD"

The platform-vs-expertise section on `why.html` ends with an intentionally **empty,
styled placeholder** — no closing line was invented:

```html
<p class="closing-tbd" data-reveal data-placeholder="CLOSING LINE — TBD"></p>
```

Put the copy inside the `<p>` and delete `data-placeholder` when ready.

## Contact details

In the `#contact` section of `index.html` (and linked from every page's CTA):

- Email: `info@multispect.io` (also the `Start a conversation` mailto)
- Phone: `+972-54-577-5505`

## Accessibility & motion

Semantic landmarks, ordered headings, visible focus states, AA-minded contrast, alt
text. `prefers-reduced-motion` disables scroll reveals, the living gradient and the
background transitions, leaving a clean static page. The sticky nav collapses to an
accessible toggle menu on small screens.

## Fonts

Default is a refined system stack (serif display + clean sans) — zero network
requests. To self-host, add woff2 files to `assets/fonts/` and uncomment the
`@font-face` block at the top of `styles.css`.
