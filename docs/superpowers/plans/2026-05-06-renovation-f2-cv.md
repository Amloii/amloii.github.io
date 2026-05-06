# Renovation F2 — CV calm-mode + Print Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CV (`/cv/`, `/es/trayectoria/`) gets the "calm-mode" treatment promised by the two-pace contract — recruiter-priority scannability with one Riso accent, the availability block above the fold, a 5-column capability grid, a tightened experience timeline, a sticky `Hiring? Book intro call →` CTA on desktop, and a CV-specific print stylesheet (clean monochrome A4) that overrides the F0 baseline. No photo until F5; the header carries name + label + summary + contact + PDFs + the existing career-arc figure.

**Architecture:** Pure SCSS + Liquid. The two-pace contract from F0 (`.cv-page` ancestor selector in `_riso.scss`) already silences decorative Riso utilities here; F2 just composes calm-mode chrome on top. No JS additions (sticky CTA is `position: fixed` + media-query gated; F0's `data-print` button continues to work). The print stylesheet adds CV-specific selectors but stays inside the existing `_print.scss` `@media print` block.

**Tech Stack:** Jekyll 3.10 (github-pages gem), SCSS, Liquid. Dockerized dev (`docker-compose.yml`).

**Companion spec:** [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](../specs/2026-05-06-amloii-riso-forward-renovation-design.md) §6.2
**Predecessor plans:** F0 ([2026-05-06-renovation-f0-foundations.md](2026-05-06-renovation-f0-foundations.md)) and F1 ([2026-05-06-renovation-f1-home.md](2026-05-06-renovation-f1-home.md)).

---

## File structure

**Files modified:**
- `_layouts/cv.html` — header reorder, availability-box repositioned above the fold, capability grid, timeline polish, sticky CTA, hire-footer micro variant.
- `_data/i18n.yml` — new keys: `cv.sticky_cta` (EN+ES) and a small caption for the capability grid red-bar accessibility.
- `assets/css/_components.scss` — append `.cv-sticky-cta`, `.cv-availability-stripe`, `.cv-capabilities-grid` (+ `__group`, `__bar`, `__title`, `__list`), refined `.tl-item` modifiers (`.cv-page .tl-item__year`, `.cv-page .tl-item__role`), `.cv-hire-footer-micro`.
- `assets/css/_print.scss` — augment the existing `@media print` block with CV-specific rules (page margins, `.tl-item` page-break behavior, hide the sticky CTA, force serif on body for print).

**Files unchanged in this phase:**
- `_data/cv.yml` (the data is good; F2 only restructures presentation).
- All other `_layouts/`, `_includes/` (the marginalia-career-arc include is reused as-is — the career-arc figure stays in the header but the F0 known limitation about hardcoded SVG colors stays as a follow-up for F5).
- `assets/js/main.js` (no JS additions).
- All home-related files from F1.

---

## Pre-flight

### Task 0: Confirm starting state

**Files:** none modified.

- [ ] **Step 1: Confirm Docker environment is up**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build in ~6–8 s, no warnings.

- [ ] **Step 2: Confirm we're branched from main with F0 + F1 already merged**

```bash
git log --oneline -3
```
Expected: top commit is `9c7192d Merge pull request #2 from Amloii/claude/f1-home` (F1 merge), with `27c1d23 Merge pull request #1` two commits before. Both phases are in.

- [ ] **Step 3: Capture baseline screenshots of `/cv/` and `/es/trayectoria/`**

Start the dev server in a separate shell:

```bash
docker compose up jekyll
```

Screenshot in BOTH light and dark mode (4 screenshots). Also browser-print-preview the EN CV and screenshot. Save outside the repo. These are the visual reference for what changes after Tasks 3–4.

- [ ] **Step 4: Confirm clean working tree**

```bash
git status
```
Expected: clean.

---

## Task 1: i18n keys for CV

**Files:**
- Modify: `_data/i18n.yml`

We add a single new key (`cv.sticky_cta`) per language. The existing `cv.book_call`, `cv.hire`, `cv.download`, `cv.download_es`, `cv.print`, `cv.linkedin`, `cv.capabilities`, `cv.experience`, `cv.education`, `cv.certifications`, `cv.publications`, `cv.beyond` keys are already in place from F0/predecessor; do not modify them.

- [ ] **Step 1: Append `sticky_cta` to `en.cv`**

Open `_data/i18n.yml`. Find the `en.cv` block. After the existing `linkedin: LinkedIn` line (or whatever the last key in `en.cv` is), append:

```yaml
    sticky_cta: "Hiring? Book intro call"
```

- [ ] **Step 2: Append `sticky_cta` to `es.cv`**

Inside the `es.cv` block, after the existing last key, append:

```yaml
    sticky_cta: "¿Contratar? Reserva una intro"
```

- [ ] **Step 3: Build to confirm YAML parses**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build, no YAML errors, no Liquid warnings.

- [ ] **Step 4: Verify the new keys parse**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec ruby -ryaml -e "y = YAML.load_file('_data/i18n.yml'); puts y['en']['cv']['sticky_cta']; puts y['es']['cv']['sticky_cta']"
```
Expected:
```
Hiring? Book intro call
¿Contratar? Reserva una intro
```

- [ ] **Step 5: Commit**

```bash
git add _data/i18n.yml
git commit -m "i18n(cv): add sticky CTA label (EN + ES)"
```

---

## Task 2: CV-specific styles in `_components.scss`

**Files:**
- Modify: `assets/css/_components.scss`

Append CV-specific blocks at the very end of the file (after the F1 home blocks). Do NOT modify any existing class.

- [ ] **Step 1: Append the CV blocks at the end of `_components.scss`**

```scss
// CV — calm-mode chrome
.cv-availability-stripe {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--accent) 8%, var(--paper));
  margin-block: var(--space-md) var(--space-lg);
}

@media (max-width: 700px) {
  .cv-availability-stripe { grid-template-columns: 1fr; }
}

.cv-availability-stripe__headline {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 0.4rem;
}

.cv-availability-stripe__title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  line-height: 1.25;
}

.cv-availability-stripe__meta {
  font-size: var(--fs-small);
  color: var(--muted);
  margin: 0.25rem 0;
}

.cv-availability-stripe__cta {
  align-self: center;
}

// CV — capabilities grid (5-col on desktop)
.cv-capabilities-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-md);
}

@media (max-width: 1100px) {
  .cv-capabilities-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .cv-capabilities-grid { grid-template-columns: 1fr; }
}

.cv-capabilities-grid__group { padding-left: 0.75rem; border-left: 2px solid var(--riso-red); }

.cv-capabilities-grid__title {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.6rem;
  color: var(--ink);
}

.cv-capabilities-grid__list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
}

.cv-capabilities-grid__list li {
  margin-bottom: 0.35rem;
  color: var(--muted);
}

// CV — experience timeline (refinements only; .tl-item base lives in earlier section)
.cv-page .tl-item {
  padding-block: calc(var(--space-lg) * 1.15);
  gap: var(--space-lg);
}

.cv-page .tl-item__year {
  color: var(--ink);
  letter-spacing: -0.02em;
}

.cv-page .tl-item__role {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0.1rem 0 0.25rem;
}

.cv-page .tl-item__company {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent);
  margin: 0 0 0.5rem;
}

.cv-page .tl-item p {
  max-width: 60ch;
}

// CV — sticky CTA (desktop only; hidden on mobile and print)
.cv-sticky-cta {
  position: fixed;
  right: var(--space-md);
  bottom: var(--space-md);
  z-index: 30;
  padding: 0.7rem 1.1rem;
  background: var(--accent);
  color: #fff;
  border: 1px solid var(--accent);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.02em;
  box-shadow: 0 6px 14px color-mix(in srgb, var(--ink) 18%, transparent);
}

.cv-sticky-cta:hover { filter: brightness(1.08); }
.cv-sticky-cta:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

@media (max-width: 720px) { .cv-sticky-cta { display: none; } }

// CV — hire footer micro version (3 thin links instead of bulky cards)
.cv-hire-footer-micro {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-md);
}

@media (max-width: 700px) { .cv-hire-footer-micro { grid-template-columns: 1fr; } }

.cv-hire-footer-micro__lane strong {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.35rem;
}

.cv-hire-footer-micro__lane a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--rule) 40%, transparent);
}

.cv-hire-footer-micro__lane a:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
```

- [ ] **Step 2: Build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean.

- [ ] **Step 3: Verify each new selector compiled**

```bash
grep -E '\.cv-availability-stripe|\.cv-capabilities-grid|\.cv-sticky-cta|\.cv-hire-footer-micro|\.cv-page \.tl-item' _site/assets/css/main.css | head -10
```
Expected: matches for each.

- [ ] **Step 4: Commit**

```bash
git add assets/css/_components.scss
git commit -m "components(cv): add calm-mode chrome (availability stripe, capabilities grid, timeline, sticky CTA, hire micro)"
```

---

## Task 3: Restructure `_layouts/cv.html`

**Files:**
- Modify: `_layouts/cv.html`

Full restructure of the CV layout. Header keeps name + label + summary + contact + PDFs + the career-arc figure (no photo this phase). The `availability-box` is repositioned ABOVE THE FOLD as a calm-mode "stripe" right after the header. Capabilities switch to a 5-col grid with red bars. Timeline gains role+company hierarchy refinements. Hire footer becomes a micro 3-column block. The sticky CTA is added at the end of the article.

- [ ] **Step 1: Read the current `_layouts/cv.html` and confirm starting state**

The current layout starts with `---\nlayout: default\n---` then `{% include schema-profile-page.html %}` then `{% assign lg = page.lang | default: site.lang %}` etc. Confirm before replacing.

- [ ] **Step 2: Replace the entire file with the F2 calm-mode version**

Overwrite `_layouts/cv.html` with this exact content:

```html
---
layout: default
---

{% include schema-profile-page.html %}

{% assign lg = page.lang | default: site.lang %}
{% assign cv = site.data.cv[lg] %}
{% assign t = site.data.i18n[lg].cv %}

<article class="container section cv-page">
  <header class="stack" style="margin-bottom: var(--space-md);">
    <p class="caps-label">{{ cv.basics.label }}</p>
    <h1>{{ cv.basics.headline }}</h1>
    <p class="lead">{{ cv.basics.subhead }}</p>
    <p style="opacity:.82;max-width:65ch">{{ cv.basics.summary }}</p>

    <div class="split" style="align-items:flex-start;margin-top:var(--space-md)">
      <div class="stack" style="gap:.35rem;font-size:var(--fs-small)">
        <p><strong>{{ site.author.email }}</strong> · {{ cv.basics.location }}</p>
        <p>{{ cv.languages[0].name }} — {{ cv.languages[0].level }} · {{ cv.languages[1].name }} — {{ cv.languages[1].level }}</p>
      </div>
      <div class="stack">
        {% if lg == 'es' %}
          {% assign pdf_primary = cv.basics.pdf_es %}
          {% assign primary_label = t.download_es %}
        {% else %}
          {% assign pdf_primary = cv.basics.pdf_en %}
          {% assign primary_label = t.download %}
        {% endif %}
        <a class="btn btn--accent" href="{{ pdf_primary | relative_url }}">{{ primary_label }}</a>
        <div class="no-print stack" style="gap:.35rem;">
          {% if lg == 'es' %}
            <a class="btn btn--ghost" href="{{ cv.basics.pdf_en | relative_url }}">{{ t.download }}</a>
          {% else %}
            <a class="btn btn--ghost" href="{{ cv.basics.pdf_es | relative_url }}">{{ t.download_es }}</a>
          {% endif %}
          <a class="btn btn--ghost" href="{{ cv.basics.linkedin }}">{{ t.linkedin }}</a>
          <button type="button" class="btn btn--ghost" data-print>{{ t.print }}</button>
        </div>
      </div>
    </div>

    <div class="split no-print" style="margin-top:1.75rem;align-items:stretch;">
      {% include marginalia-career-arc.html %}
      <figure class="riso-frame" style="aspect-ratio:4/3;max-height:14rem;margin:0;display:flex;align-items:center;justify-content:center;padding:4px;">
        {% include riso/career-arc.svg %}
      </figure>
    </div>
    <p class="caps-label no-print" style="text-align:right">Research → Agents</p>
  </header>

  {% if cv.availability %}
  <aside class="cv-availability-stripe no-print" aria-labelledby="availability">
    <div>
      <p class="cv-availability-stripe__headline" id="availability">{{ cv.availability.headline }}</p>
      <p class="cv-availability-stripe__title">{% for r in cv.availability.roles %}{{ r }}{% unless forloop.last %} · {% endunless %}{% endfor %}</p>
      <p class="cv-availability-stripe__meta">{% for m in cv.availability.modes %}{{ m }}{% unless forloop.last %} · {% endunless %}{% endfor %} · TZ {{ cv.availability.timezone }}</p>
    </div>
    <div class="cv-availability-stripe__cta">
      <a class="btn btn--accent" href="{{ site.book_call_url }}">{{ t.book_call }}</a>
    </div>
  </aside>
  {% endif %}

  {% if lg == 'es' %}
  <p class="no-print caps-label"><a href="{{ '/resume.json' | relative_url }}"><code>/resume.json</code></a> · JSON Résumé canonical</p>
  {% else %}
  <p class="no-print caps-label">Machine-readable résumé: <a href="{{ '/resume.json' | relative_url }}"><code>/resume.json</code></a></p>
  {% endif %}

  <section aria-labelledby="capabilities">
    <h2 id="capabilities">{{ t.capabilities }}</h2>
    <div class="cv-capabilities-grid">
      {% for grp in cv.capabilities %}
        <section class="cv-capabilities-grid__group">
          <h3 class="cv-capabilities-grid__title">{{ grp.group }}</h3>
          <ul class="cv-capabilities-grid__list">
            {% for it in grp.items %}<li>{{ it }}</li>{% endfor %}
          </ul>
        </section>
      {% endfor %}
    </div>
  </section>

  <section aria-labelledby="experience">
    <h2 id="experience">{{ t.experience }}</h2>
    {% for row in cv.experience %}
      <article class="tl-item">
        <div>
          {% assign ys = row.start | split: '-' | first %}
          <div class="tl-item__year">{{ ys }}</div>
        </div>
        <div>
          <div class="tl-item__meta">
            {{ row.start }} — {{ row.end_display }} {% if row.tenure %}· {{ row.tenure }}{% endif %} · {{ row.location }}
          </div>
          <h3 class="tl-item__role">{{ row.role }}</h3>
          <p class="tl-item__company">{{ row.company }}</p>
          {% if row.summary %}<p>{{ row.summary }}</p>{% endif %}
          {% if row.bullets %}
            <ul style="margin-top:.5rem;margin-bottom:.5rem">
              {% for b in row.bullets %}<li>{{ b }}</li>{% endfor %}
            </ul>
          {% endif %}
          {% if row.tags %}
            <ul class="chips">{% for tag in row.tags %}<li>{{ tag }}</li>{% endfor %}</ul>
          {% endif %}
        </div>
      </article>
    {% endfor %}
  </section>

  <section class="split" aria-labelledby="education">
    <div>
      <h2 id="education">{{ t.education }}</h2>
      {% for edu in cv.education %}
        <div style="margin-bottom:1rem">
          <p style="margin:0;font-weight:600">{{ edu.degree }}</p>
          <p style="margin:0;font-size:var(--fs-small);opacity:.8">{{ edu.school }} · {{ edu.start }}–{{ edu.end }}</p>
        </div>
      {% endfor %}
    </div>
    <div>
      <h2 id="certifications">{{ t.certifications }}</h2>
      {% for cert in cv.certifications %}
        <p style="margin:0 0 .25rem">{{ cert.issuer }}</p>
        <ul style="margin-top:0">
          {% for c in cert.items %}<li>{{ c }}</li>{% endfor %}
        </ul>
      {% endfor %}
    </div>
  </section>

  <section aria-labelledby="pubs">
    <h2 id="pubs">{{ t.publications }}</h2>
    <ul style="columns: 1;">
      {% for bk in cv.publications.books %}<li>{{ bk }}</li>{% endfor %}
    </ul>
    {% for note in cv.publications.notes %}
      <p style="opacity:.85">{{ note }}</p>
    {% endfor %}
  </section>

  <section aria-labelledby="beyond">
    <h2 id="beyond">{{ t.beyond }}</h2>
    <p>{{ cv.beyond.body }}</p>
  </section>

  <footer class="cv-hire-footer-micro section--tight" style="margin-top:var(--space-lg)">
    <div class="cv-hire-footer-micro__lane">
      <strong>Advisory</strong>
      <a href="{{ site.book_call_url }}">{{ site.book_call_url | replace: 'https://', '' | replace: 'http://', '' }}</a>
    </div>
    <div class="cv-hire-footer-micro__lane">
      <strong>Implementation</strong>
      <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>
    </div>
    <div class="cv-hire-footer-micro__lane">
      <strong>Speaking</strong>
      <a href="{% if lg == 'es' %}{{ '/es/charlas-prensa/' | relative_url }}{% else %}{{ '/speaking-press/' | relative_url }}{% endif %}">{% if lg == 'es' %}Kit para medios →{% else %}Press kit →{% endif %}</a>
    </div>
  </footer>

  <a class="cv-sticky-cta no-print" href="{{ site.book_call_url }}">{{ t.sticky_cta }} →</a>
</article>
```

Notable structural changes from the previous version:
- The standalone `<section class="availability-box">` is gone; replaced by `<aside class="cv-availability-stripe">` placed ABOVE the capabilities (above the fold).
- `<div class="split">` for capabilities → `<div class="cv-capabilities-grid">` 5-col.
- `tl-item__role` and a NEW `tl-item__company` element separate role from company (previously they were in raw `<h3>`+`<p class="lead">`).
- Old `<footer class="availability-box">` (three-lane) → `<footer class="cv-hire-footer-micro">`.
- New `<a class="cv-sticky-cta">` at the very end of the `<article>`.

- [ ] **Step 3: Build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build.

- [ ] **Step 4: Verify rendered EN CV**

```bash
grep 'cv-availability-stripe' _site/cv/index.html
```
Expected: match (the stripe rendered).

```bash
grep 'cv-capabilities-grid' _site/cv/index.html
```
Expected: match.

```bash
grep -c 'cv-capabilities-grid__group' _site/cv/index.html
```
Expected: 5 (one per capability group in EN data).

```bash
grep 'tl-item__company' _site/cv/index.html
```
Expected: match (company rendered as a separate element).

```bash
grep 'cv-hire-footer-micro' _site/cv/index.html
```
Expected: match.

```bash
grep 'cv-sticky-cta' _site/cv/index.html
```
Expected: match.

```bash
grep 'Hiring? Book intro call' _site/cv/index.html
```
Expected: match (the sticky CTA label rendered).

- [ ] **Step 5: Verify rendered ES CV**

```bash
grep 'cv-availability-stripe' _site/es/trayectoria/index.html
```
Expected: match.

```bash
grep '¿Contratar? Reserva una intro' _site/es/trayectoria/index.html
```
Expected: match (ES sticky CTA label).

```bash
grep -c 'cv-capabilities-grid__group' _site/es/trayectoria/index.html
```
Expected: 5.

- [ ] **Step 6: Commit**

```bash
git add _layouts/cv.html
git commit -m "cv: restructure layout for calm-mode (availability stripe, 5-col capabilities, timeline polish, sticky CTA, hire micro)"
```

---

## Task 4: CV-aware print refinement in `_print.scss`

**Files:**
- Modify: `assets/css/_print.scss`

The F0 print baseline forces white surface, hides nav/toggles, and silences all Riso decorations. F2 augments it with CV-specific rules: hide the sticky CTA, hide the career-arc figure (it's already inside `.no-print` but we add a defensive rule), hide the availability stripe in print (it's screen-only chrome with link to a booking page), tighten the page margins, and add `break-inside: avoid` to `.tl-item` so timeline rows don't split across pages.

- [ ] **Step 1: Read the current `_print.scss` to confirm starting state**

Open `assets/css/_print.scss`. The current file (from F0) has the baseline `@media print { ... }` block with custom-property resets, body force-white, hide nav/footer/skip-link/no-print/nav-search/theme-toggle, link styling, section padding, Riso silencing.

- [ ] **Step 2: Append CV-specific rules to the existing `@media print` block**

Find the closing `}` of `.riso-photo::before, .riso-photo::after { display: none !important; }` near the end of the `@media print { ... }` block. Insert the following BEFORE the closing `}` of `@media print`:

```scss

  // CV-specific print refinements (F2)
  @page { margin: 16mm 14mm 14mm; }

  .cv-page {
    font-size: 10.5pt;
    line-height: 1.42;
  }

  .cv-page h1 { font-size: 22pt; line-height: 1.05; }
  .cv-page h2 { font-size: 13pt; margin-top: 12pt; margin-bottom: 4pt; }
  .cv-page h3 { font-size: 10.5pt; }

  .cv-sticky-cta,
  .cv-availability-stripe { display: none !important; }

  .tl-item {
    break-inside: avoid;
    page-break-inside: avoid;
    padding-block: 8pt !important;
    gap: 6mm !important;
  }

  .tl-item__year { font-size: 22pt !important; line-height: 1; }

  .cv-capabilities-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 8pt !important;
  }

  .cv-capabilities-grid__group { border-left-color: #000 !important; }

  .cv-hire-footer-micro {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 8pt !important;
  }
```

The whole `@media print` block now ends with these CV rules followed by the existing block-closing `}`. Be careful to preserve the existing rules above; only insert the new block.

- [ ] **Step 3: Build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean.

- [ ] **Step 4: Verify the new print rules compiled**

```bash
grep '@media print' _site/assets/css/main.css
```
Expected: match (single occurrence — the F0 baseline + F2 additions are inside the same block).

```bash
grep -E '\.cv-sticky-cta\{display:none|\.cv-availability-stripe\{display:none|\.tl-item\{break-inside:avoid|\.cv-capabilities-grid\{grid-template-columns:repeat\(2' _site/assets/css/main.css | head -5
```
Expected: matches showing the CV print rules compiled.

- [ ] **Step 5: Manual print-preview check**

In a browser tab pointed at `http://localhost:4000/cv/`, hit Ctrl+P. The preview should show:
- White surface, black ink.
- No nav, no theme toggle, no search trigger, no footer, no sticky CTA, no availability stripe.
- The career-arc figure hidden (it has `.no-print` already; defensive rule covers a future stray copy).
- Timeline rows do not split across page breaks.
- Capability grid in 2 columns.
- Hire footer micro in 3 thin columns at the very end.

If anything still leaks Riso shadow or color, inspect the element in DevTools and confirm the `@media print` rule is overriding. Report DONE_WITH_CONCERNS if you find a stubborn rule we missed.

- [ ] **Step 6: Commit**

```bash
git add assets/css/_print.scss
git commit -m "print(cv): page margins, timeline page-breaks, hide sticky/stripe, monochrome capabilities grid"
```

---

## Task 5: Final QA + PR

**Files:** none modified.

- [ ] **Step 1: Visual regression vs Task 0 baseline**

Open `http://localhost:4000/cv/` and `/es/trayectoria/`. Compare against the Task 0 screenshots.

Expected differences (these are correct):
- Header: same name/label/summary, plus the contact + PDFs row, and the career-arc figure (no photo this phase — that arrives in F5).
- A new amber-bordered "availability stripe" sits ABOVE the fold (between header and capabilities), with a `Book a 20-minute intro` button on the right.
- Capabilities now in a 5-column grid (2 cols on tablet, 1 on phone), each group has a 2px riso-red bar on its left.
- Experience timeline: roles in display serif, companies in accent terracotta as a thin line below, more vertical breathing room between rows.
- The bottom "Working together" three-lane `<footer>` is now a thin 3-column micro block (mono-uppercase labels + plain links) instead of three big cards.
- A small terracotta floating button labelled `Hiring? Book intro call →` appears at the bottom-right on desktop. Clicking it opens the booking URL.

ES is paritary; only language differs.

- [ ] **Step 2: Dark-mode sweep**

Toggle to dark. Reload `/cv/`. Confirm:
- The availability stripe still pops (border + cream background mix darken correctly).
- The capability grid red bars remain visible.
- Timeline year + role + company hierarchy still legible.
- The sticky CTA still readable (filled accent button).
- No Riso decoration leaks (the `.cv-page` two-pace contract from F0 holds).

- [ ] **Step 3: Print preview**

Ctrl+P on `/cv/`. Confirm:
- Single A4-friendly column.
- Sticky CTA, availability stripe, career-arc figure all hidden.
- Timeline rows do not split mid-row.
- Capabilities in 2 columns.
- Hire footer micro at the end.
- All ink monochrome (no terracotta or riso-red in print).

- [ ] **Step 4: Mobile breakpoint**

Resize the browser to ~700 px. Confirm:
- The availability stripe collapses to a single column.
- Capabilities grid drops to 1 column.
- Timeline `tl-item` 2-col → 1-col (already handled in F0 base).
- Sticky CTA disappears (hidden via media query).
- Hire footer micro collapses to 1 column.

- [ ] **Step 5: Lighthouse spot check**

Run Lighthouse on `/cv/` in light mode.
Expected: Accessibility ≥ 90 (we deferred the F5 a11y polish but the CV must not regress).
Performance is OK to be lower; F5 tightens it.

- [ ] **Step 6: Verify the F2 commit history**

```bash
git log --oneline main..HEAD
```
Expected (in order):

1. `i18n(cv): add sticky CTA label (EN + ES)`
2. `components(cv): add calm-mode chrome (availability stripe, capabilities grid, timeline, sticky CTA, hire micro)`
3. `cv: restructure layout for calm-mode (availability stripe, 5-col capabilities, timeline polish, sticky CTA, hire micro)`
4. `print(cv): page margins, timeline page-breaks, hide sticky/stripe, monochrome capabilities grid`

(Plus the F2 plan doc commit if it was committed before Task 1 — depending on flow that may or may not be in the branch.)

- [ ] **Step 7: Push and open the PR (only after explicit user authorization)**

Wait for the user to authorize the push. When authorized:

```bash
git push -u origin claude/f2-cv
```

Then open the PR:

```bash
gh pr create --title "F2: CV calm-mode + print refinement" --body "$(cat <<'EOF'
## Summary

CV gets the calm-mode treatment promised by the two-pace contract — recruiter-priority scannability, one Riso accent, availability above the fold.

- **Availability stripe** repositioned above the fold (between header and capabilities) with the `Book a 20-minute intro` CTA.
- **Capabilities** switch to a 5-column grid on desktop (2-col tablet, 1-col mobile). Each group title gains a 2px `riso-red` left bar — the only visible Riso accent on the CV.
- **Experience timeline** tightened: role in display serif, company in accent terracotta as its own line, more vertical breathing room.
- **Hire footer** shrinks to a thin 3-column micro block (mono caps labels + plain links) instead of three big cards.
- **Sticky CTA** `Hiring? Book intro call →` floats bottom-right on desktop, hidden on mobile and in print.
- **Print stylesheet** refined for the CV: A4 page margins, 10.5pt body, `break-inside: avoid` on timeline rows, monochrome capability grid in 2 columns, sticky CTA + availability stripe hidden.
- **No photo this phase** — header keeps name + label + summary + contact + PDFs + the career-arc figure. The photo slot arrives in F5.

## Test plan

- [x] EN/ES CV both render the new structure (availability stripe, 5-col capabilities, timeline with role/company hierarchy, hire micro, sticky CTA).
- [x] Dark mode keeps everything legible (availability stripe pops, sticky CTA contrasts).
- [x] Print preview is clean monochrome A4: sticky CTA + stripe hidden, timeline rows don't split, capabilities in 2 cols.
- [x] Mobile (< 720 px): sticky CTA hidden; (< 700 px) availability stripe + hire micro collapse to 1 col.
- [x] Lighthouse Accessibility ≥ 90 on `/cv/`.
- [x] Build clean (~6–10 s, 0 warnings).
- [x] Two-pace contract from F0 still holds — no decorative Riso utilities (`riso-double-print`, `riso-stamp`, `riso-halftone`) appear inside `.cv-page`.

## What's NOT in this PR

Writing index + post template + blog scaffolds — F3.
Work / Project pages / Speaking / Now structured UI / About / Contact / 404 — F4.
Pagefind modal + OG template + giscus IDs + real headshot + ES audit + Lighthouse 95+ — F5.

The career-arc SVG in the CV header still has hardcoded light-mode colors (known F0 limitation) and looks slightly off in dark mode. Out of scope for F2; addressed in F5 polish.

Spec: [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md) §6.2
Plan: [docs/superpowers/plans/2026-05-06-renovation-f2-cv.md](docs/superpowers/plans/2026-05-06-renovation-f2-cv.md)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review (run before handing off to execution)

After all tasks land:

- **Spec coverage**: every bullet in §6.2 of the design spec is implemented:
  - ✅ Header without photo (F2.1 decision: skip until F5).
  - ✅ Availability box repositioned above the fold (Task 3 — `cv-availability-stripe` placed before capabilities).
  - ✅ Sticky CTA bottom-right desktop, hidden on print + < 720 px (Task 2 + Task 3 + Task 4).
  - ✅ Capabilities 5-col grid with red bar (Task 2 + Task 3).
  - ✅ Timeline year + role + company + meta + bullets + chips with tightened hierarchy and more breathing (Task 2 + Task 3).
  - ✅ Education / Certifications / Publications / Beyond unchanged structurally (data was good).
  - ✅ Footer hire as three-lane micro (Task 2 + Task 3).
  - ✅ Print stylesheet revised, A4, calm, sticky-CTA hidden, timeline `break-inside: avoid` (Task 4).
- **Placeholder scan**: every code block is concrete; no "TBD" or "fill in".
- **Type/name consistency**:
  - `cv-availability-stripe` (+ `__headline`, `__title`, `__meta`, `__cta`) defined in Task 2, consumed in Task 3, hidden in Task 4.
  - `cv-capabilities-grid` (+ `__group`, `__title`, `__list`) defined in Task 2, consumed in Task 3, restyled in Task 4 (print).
  - `cv-sticky-cta` defined in Task 2, consumed in Task 3, hidden in Task 4.
  - `cv-hire-footer-micro` (+ `__lane`) defined in Task 2, consumed in Task 3, restyled in Task 4 (print).
  - `cv-page .tl-item__role`, `cv-page .tl-item__company` defined in Task 2, consumed in Task 3, sized in Task 4.
  - i18n keys `cv.sticky_cta` defined in Task 1, consumed in Task 3.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| The career-arc SVG in the header has hardcoded light-mode colors and looks like a "light island" in dark mode | Known F0 limitation. Acknowledged in the PR body; out of scope for F2. F5 will address either by parameterizing the SVG or duplicating it as a dark variant. |
| Sticky CTA overlaps page content on short viewports or tall scrollbars | Hidden on `< 720 px`; on desktop the CV is dense enough that the bottom-right corner is rarely the focal point of meaningful content. F5 may add `prefers-reduced-motion` consideration. |
| Print: `@page { margin }` does not work in Firefox without `-moz-` prefix in some older versions | Modern Firefox 60+ supports `@page` without prefix. If a print user reports a regression, F5 can add a `-moz-` fallback. Accepted risk for F2. |
| The availability-stripe color (cream-on-paper) blends in dark mode | The stripe uses `color-mix(in srgb, var(--accent) 8%, var(--paper))` which adapts: in light it's a warm cream; in dark it's a warm coal-tinted mix that still has visible 35% accent border. Confirmed in Task 5 dark sweep. |
| Capability grid 5 columns assume EXACTLY 5 capability groups | The CV currently has exactly 5 EN groups and 5 ES groups (verified in `_data/cv.yml`). If a 6th is ever added, the grid auto-flows to a second row of 1 — acceptable. If 4, a column grows; also acceptable. Not a hard constraint. |
| `tl-item__company` is a NEW class consumed in Task 3 but only styled in Task 2 — no fallback if Task 2 fails to ship | All tasks ship in the same PR; no intermediate state. |
| Cross-task: `marginalia-career-arc.html` include is reused but the layout removed the `<div class="split no-print">` wrapper around it? | We KEEP the wrapper (Task 3 Step 2 preserves the split with marginalia + riso-frame). Just confirming for the reviewer. |

---

## What's NOT in this phase (for clarity)

- Writing index redesign, post template (TOC, sidenotes, related, prev/next, inline newsletter), blog scaffolds, pillar filter — F3.
- Work / Project pages / Speaking & Press / Now structured UI / About photo / Contact micro-copy / 404 — F4.
- Pagefind modal wiring, OG image template, real giscus IDs, Formspree endpoint, real headshot integration, ES copy audit, Lighthouse 95+ pass — F5.
- The career-arc SVG dark-mode fix (hardcoded colors): F5.
