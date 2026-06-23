# Multispect · Civic Barometer — marketing homepage

A single, long-scroll, static credibility/positioning page for **Multispect Solutions**, built from the 18-slide *Civic Barometer* deck. No build step, no framework, no runtime dependencies — plain HTML, CSS and a little vanilla JS.

```
multispect-site/
├── index.html      ← all content, one page, 17 sections
├── styles.css      ← design tokens + all styling (palette lives at :root)
├── main.js         ← scroll reveal · sticky nav/scroll-spy · dynamic background
├── README.md       ← this file
└── assets/
    ├── fonts/      ← (optional) drop self-hosted woff2 here
    └── img/        ← drop press photos + OG share image here
```

---

## Preview locally

It's a static site, so any static server works. From inside `multispect-site/`:

```bash
# Python (built in on macOS)
python3 -m http.server 8000
# then open http://localhost:8000

# …or Node, if you prefer
npx serve .
```

Opening `index.html` directly via `file://` also works, but a local server is recommended so relative asset paths behave exactly as they will in production.

---

## Deploy to a static host

Drop the **entire `multispect-site/` folder** on any static host — nothing to build.

- **Netlify / Vercel / Cloudflare Pages:** drag the folder into the dashboard, or point the project at this directory with **no build command** and the folder as the publish/output directory.
- **GitHub Pages:** commit the files and enable Pages on the branch/folder.
- **S3 / any web server:** upload the files; make `index.html` the index document.

---

## Retune the palette (do this in one place)

All colours are CSS custom properties at the top of `styles.css`, under **`:root`** (section *1 · DESIGN TOKENS*). The five spectrum hues — the only "brand" colours — are:

```css
--spec-1: #1f7480;  /* Cultural · Religious — deep teal (coolest) */
--spec-2: #4f93a0;  /* Social · Civic       — aqua             */
--spec-3: #c2a24e;  /* Economic             — muted gold (pivot)*/
--spec-4: #c4742f;  /* Political            — amber            */
--spec-5: #a8392b;  /* Security             — ember (warm edge)*/
```

Change those and the whole site — spectrum bar, motifs, accents, band borders — retunes automatically. Neutral ink/paper tones and the light/dark semantic colours are defined just below.

### Section background colours (the "travelling spectrum")

The background colour shifts as you scroll — cool/light at the top, deepening to a dark warm "security edge" around the Barometer and Case Studies, then resolving back to a calm civic tone at the close. These per-section colours live in **`main.js`**, in the `TONES` object (keys match each `<section id="…">`). Edit a hex there to retune a section's backdrop. Sections that should render light text are marked `class="theme-dark"` in `index.html`; light sections use `class="theme-light"`.

---

## Where to drop press images

The three case studies (Sweden / UK / France) use **empty, captioned, correctly-proportioned (16:9) placeholders** — no imagery is generated. To add a real news photo, drop a file in `assets/img/` and replace the placeholder `<div class="press__ph">` with an `<img>`:

```html
<!-- before -->
<div class="press__ph" role="img" aria-label="News photo placeholder — horizontal format"></div>

<!-- after -->
<img src="assets/img/case-sweden.jpg" alt="…describe the photo…" loading="lazy" width="1600" height="900" />
```

Suggested filenames (referenced in the captions): `case-sweden.jpg`, `case-uk.jpg`, `case-france.jpg`. Keep the `<figcaption>` `SOURCE: …` credit accurate to whatever image you actually license.

**Open Graph share image:** drop a 1200×630 image at `assets/img/og-cover.jpg` — the `<meta property="og:image">` tag in `index.html` already points at it.

---

## The "CLOSING LINE — TBD"

The *Not a platform / house of expertise* section (`#platform`) ends with an intentionally **empty, styled placeholder** — no closing line was invented. Find it in `index.html`:

```html
<p class="closing-tbd" data-reveal data-placeholder="CLOSING LINE — TBD"></p>
```

When you have the line, put the copy inside the `<p>` and delete the `data-placeholder` attribute (the dashed placeholder styling keys off it).

---

## Contact details

Live in the **`#contact`** section near the end of `index.html`:

- Email: `info@multispect.io` (also the `Start a conversation` mailto button)
- Phone: `+972-54-577-5505`

Update them in that one section (the `mailto:`/`tel:` links and the visible text).

---

## Fonts

By default the site uses a refined **system font stack** — a serif for display (Spectral → Iowan/Palatino/Georgia fallback) and a clean sans for body (Inter → system-ui). This renders everywhere with **zero network requests**.

To self-host fonts (recommended for production polish):

1. Put woff2 files in `assets/fonts/` (e.g. `spectral-600.woff2`, `spectral-400.woff2`, `inter-variable.woff2`).
2. Uncomment the `@font-face` block at the top of `styles.css` (section *0*).
3. The `--font-display` / `--font-body` tokens already list `"Display"` / `"Body"` first, so they'll be used automatically once loaded.

---

## Accessibility & motion

- Semantic landmarks, ordered headings, visible focus states, AA-minded contrast, alt text on the meaningful SVG/figures.
- **`prefers-reduced-motion`** is fully respected: scroll reveals, the living gradient and the background colour transitions are all disabled, leaving a clean static page.
- The sticky nav collapses to an accessible toggle menu on small screens.
