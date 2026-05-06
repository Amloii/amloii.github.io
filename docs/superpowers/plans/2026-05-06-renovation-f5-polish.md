# Renovation F5 — Polish & Ops Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Final phase. Wire user-supplied assets (real headshot, Formspree, CV PDF), remove giscus + post comments entirely, ship the Pagefind search modal with full keyboard + mouse UX, fix the dark-mode SVG color leaks (career-arc, hero illustrations), polish OG images, do an ES copy audit, update the README to match the renovated codebase, and pass a Lighthouse 95+ check on the most-traveled pages.

**Architecture:** No new structural patterns — F5 wires existing primitives to real assets and closes documented loose ends from F0–F4. The Pagefind modal mounts dynamically on first invocation and lazy-loads Pagefind's UI bundle from `/assets/pagefind/`. The headshot uses the F0 `.riso-photo` utility on home/about/speaking, plus a new calm-mode B&W variant on the CV. SVG dark-mode fixes use `currentColor` and CSS-driven recoloring rather than duplicating the SVGs.

**Tech Stack:** Jekyll 3.10, SCSS, Liquid, vanilla ES6, Pagefind 1.x (run in a Node container as part of the build flow). Dockerized dev.

**Companion spec:** [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](../specs/2026-05-06-amloii-riso-forward-renovation-design.md) §6.10 (404 already shipped in F4), §7 (UX features), §8 F5 deliverables.
**Predecessors:** F0/F1/F2/F3a/F3b/F4 (all on `main`).

---

## User-supplied assets (already received)

- **Headshot**: `D:\Github\amloii.github.io\assets\img\1689882283009.jpg` (in main worktree, ~89 KB, square, neutral park background). F5 copies it into the worktree as `assets/img/headshot-daniel.jpg`.
- **CV PDF (ES only)**: `assets/cv/daniel-gomez-dominguez-es.pdf` (already in worktree). EN PDF doesn't exist → CV layout updated to show a single "Descargar CV (ES)" / "Download CV (ES)" button.
- **Formspree endpoint**: `https://formspree.io/f/xwvybjlv` — wired into `_config.yml`.

## Explicit removals

- **giscus comments system**: fully removed. `_includes/giscus.html` deleted. `_config.yml` `giscus:` block deleted. `_layouts/post.html` `{% if page.comments %}{% include giscus.html %}{% endif %}` block deleted. Post defaults in `_config.yml` lose the `comments: true` line. Existing post's `comments: true` front-matter line becomes orphan (harmless).

## What's in scope

1. Remove giscus + comments machinery.
2. Wire real Formspree endpoint.
3. Wire single CV PDF (ES); update layout + i18n to reflect single-PDF state.
4. Integrate real headshot in 4 surfaces (home, CV, speaking, about).
5. Pagefind search modal — build the index, ship the index, mount the modal on `/` key + nav button.
6. Polish default OG SVG.
7. SVG dark-mode color fix (career-arc + hero illustrations) using CSS recoloring.
8. ES copy audit pass.
9. README updates (Docker flow, content authoring, Pagefind regeneration).
10. Lighthouse pass with hard ≥ 90 floor on Performance + Accessibility on `/`, `/cv/`, `/writing/`, plus document any remaining gaps.

## File structure

**Files modified:**
- `_config.yml` — remove giscus block, set Formspree endpoint, tighten post defaults.
- `_layouts/post.html` — remove giscus include.
- `_layouts/cv.html` — show single CV PDF button.
- `_layouts/speaking.html` — replace SVG headshot placeholders with real photo.
- `_data/cv.yml` — drop `pdf_en` references; ES version updated.
- `_data/i18n.yml` — relabel CV download to single-button labels; small ES audit fixes.
- `_includes/home-stamp-pack.html` — replace stamps-only with portrait + 1 stamp arrangement.
- `_includes/riso/career-arc.svg` — recolor with `currentColor` so it adapts to dark theme.
- `_includes/riso/*.svg` (other illustrations) — same `currentColor` fix.
- `assets/img/og-default.svg` — polish copy + colors.
- `assets/img/og-template.svg` — same.
- `assets/css/_components.scss` — append `.search-modal`, `.search-modal__close`, calm-mode CV photo styles, home-stamp-pack with portrait.
- `assets/css/_riso.scss` — small additions for SVG color theming, calm-mode photo variant.
- `assets/js/main.js` — extend the search trigger placeholder into a real Pagefind modal mount.
- `about.md`, `es/sobre.md` — add the photo.
- `README.md` — full rewrite reflecting the renovated codebase.

**Files created:**
- `assets/img/headshot-daniel.jpg` — copied from main worktree, renamed.
- `assets/pagefind/` — Pagefind-generated index files (binary + JS bundle). Committed so GH Pages serves them.
- `_includes/search-modal.html` — modal markup wrapper.
- `assets/css/_search-modal.scss` — modal styles (or appended to `_components.scss`; pick one location for cohesion — appended to `_components.scss`).

**Files deleted:**
- `_includes/giscus.html`.

---

## Pre-flight

### Task 0: Confirm starting state

- [ ] **Step 1**: `docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace` — clean.
- [ ] **Step 2**: `git log --oneline -3` — top is `8b36911 Merge pull request #6 from Amloii/claude/f4-pages`.
- [ ] **Step 3**: Confirm user assets exist:
  ```bash
  ls D:/Github/amloii.github.io/assets/img/1689882283009.jpg
  ls assets/cv/daniel-gomez-dominguez-es.pdf
  ```
  Both should print successfully.
- [ ] **Step 4**: Capture pre-F5 baseline screenshots of `/`, `/cv/`, `/speaking-press/`, `/about/`, `/contact/`, `/writing/`, plus the existing post (`/2026/05/05/agent-graph-margin-budgets/`). Both light + dark.

---

## Task 1: Remove giscus + comments

**Files:**
- Delete: `_includes/giscus.html`
- Modify: `_layouts/post.html`, `_config.yml`

### Step 1: Delete the include

```bash
git rm _includes/giscus.html
```

### Step 2: Strip giscus from `_layouts/post.html`

Find the lines:

```liquid
  {% if page.comments %}
    {% include giscus.html %}
  {% endif %}
```

Delete those 3 lines (the blank line above is fine to keep or remove).

### Step 3: Strip giscus + tighten post defaults in `_config.yml`

Find the `giscus:` block (lines 21–30 currently) and DELETE the entire block including all its keys (`repo`, `repo_id`, `category`, `category_id`, `mapping`, `reactions_enabled`, `input_position`, `theme`, `lang`).

Find the `defaults:` block. The first scope (posts) has:

```yaml
  - scope:
      path: ""
      type: "posts"
    values:
      layout: post
      lang: en
      comments: true
      ref: writing
```

Remove the `comments: true` line. Result:

```yaml
  - scope:
      path: ""
      type: "posts"
    values:
      layout: post
      lang: en
      ref: writing
```

### Step 4: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean.

```bash
ls _includes/giscus.html 2>&1 | grep -E '(No such file|cannot access)' && echo "OK: giscus include deleted"
grep -i 'giscus' _site/2026/05/05/agent-graph-margin-budgets.html
grep -i 'giscus' _site/index.html
```
First check confirms the file is gone; the two greps should yield NO matches.

### Step 5: Commit

```bash
git add _includes/giscus.html _layouts/post.html _config.yml
git commit -m "comments: remove giscus integration entirely"
```

---

## Task 2: Wire Formspree + assets (real photo, CV PDF)

**Files:**
- Modify: `_config.yml` (Formspree endpoint).
- Create: `assets/img/headshot-daniel.jpg` (copied from main worktree).
- Modify: `_data/cv.yml` (drop `pdf_en` references, single PDF).
- Modify: `_data/i18n.yml` (CV download label = single-PDF).
- Modify: `_layouts/cv.html` (single download button).

### Step 1: Set Formspree endpoint

In `_config.yml`, find:

```yaml
formspree_endpoint: "https://formspree.io/f/REPLACE_ME" # crear formulario en formspree.io y pegar URL
```

Replace with:

```yaml
formspree_endpoint: "https://formspree.io/f/xwvybjlv"
```

### Step 2: Copy the headshot into the worktree

```bash
cp "D:/Github/amloii.github.io/assets/img/1689882283009.jpg" "assets/img/headshot-daniel.jpg"
```

(The original file in the main worktree is untracked. We copy it under a clean name into the F5 worktree so it gets committed.)

### Step 3: Drop `pdf_en` references in `_data/cv.yml`

In the `en` block, find:

```yaml
    pdf_en: "/assets/cv/daniel-gomez-dominguez-en.pdf"
    pdf_es: "/assets/cv/daniel-gomez-dominguez-es.pdf"
```

Replace both lines with a single:

```yaml
    pdf: "/assets/cv/daniel-gomez-dominguez-es.pdf"
```

Same change in the `es` block (find `pdf_en` + `pdf_es`, replace with single `pdf`).

### Step 4: Update `_data/i18n.yml` CV labels

In `en.cv`, find:

```yaml
    download: Download PDF (EN)
    download_es: Descargar PDF (ES)
```

Replace with:

```yaml
    download: Download CV (ES)
```

(The CV is currently only available in Spanish. The label makes that explicit so an EN visitor knows what they're getting.)

In `es.cv`, find:

```yaml
    download: Descargar PDF (EN)
    download_es: Descargar PDF (ES)
```

Replace with:

```yaml
    download: Descargar CV (ES)
```

### Step 5: Simplify `_layouts/cv.html` PDF buttons

Find the block (currently around line 19–37 of `_layouts/cv.html`):

```liquid
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
```

Replace with a single-PDF version:

```liquid
      <div class="stack">
        <a class="btn btn--accent" href="{{ cv.basics.pdf | relative_url }}">{{ t.download }}</a>
        <div class="no-print stack" style="gap:.35rem;">
          <a class="btn btn--ghost" href="{{ cv.basics.linkedin }}">{{ t.linkedin }}</a>
          <button type="button" class="btn btn--ghost" data-print>{{ t.print }}</button>
        </div>
      </div>
```

### Step 6: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
ls _site/assets/img/headshot-daniel.jpg
grep 'formspree.io/f/xwvybjlv' _site/contact/index.html
grep 'Download CV (ES)' _site/cv/index.html
grep 'Descargar CV (ES)' _site/es/trayectoria/index.html
grep -c 'pdf_en' _site/cv/index.html
```
All matches expected EXCEPT the `pdf_en` count — that should be `0` (orphan reference removed).

### Step 7: Commit

```bash
git add _config.yml assets/img/headshot-daniel.jpg _data/cv.yml _data/i18n.yml _layouts/cv.html
git commit -m "ops: wire Formspree + real CV PDF (ES) + drop pdf_en references; copy headshot asset"
```

---

## Task 3: Integrate real headshot (4 surfaces)

**Files:**
- Modify: `_includes/home-stamp-pack.html` — portrait + 1 stamp.
- Modify: `_layouts/cv.html` — small B&W photo in header.
- Modify: `_layouts/speaking.html` — real photo + downloadable variants.
- Modify: `about.md` and `es/sobre.md` — photo at top.
- Modify: `assets/css/_components.scss` — append home-portrait + cv-portrait styles.

### Step 1: Append portrait CSS to `_components.scss`

```scss
// Home — portrait + stamp arrangement (replaces stamp pack now that real photo exists)
.home-hero-portrait {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-md);
  padding: var(--space-md) var(--space-sm);
  align-items: center;
  justify-items: center;
  position: relative;
}

.home-hero-portrait__photo {
  width: 100%;
  max-width: 18rem;
  aspect-ratio: 1 / 1;
}

.home-hero-portrait__stamp {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  transform: rotate(-3.5deg);
}

// CV — calm-mode header photo (no Riso, simple B&W)
.cv-header-portrait {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--rule) 22%, transparent);
}

.cv-header-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
}

.cv-header-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-block: var(--space-md);
}

@media (max-width: 700px) {
  .cv-header-portrait { width: 72px; height: 72px; }
}

// About — small portrait at top
.about-portrait {
  width: 100%;
  max-width: 12rem;
  aspect-ratio: 1 / 1;
  margin-bottom: var(--space-md);
}
```

### Step 2: Replace `_includes/home-stamp-pack.html` with portrait + stamp

```html
{%- assign lg = page.lang | default: site.lang -%}
{%- assign cv = site.data.cv[lg] -%}

<aside class="home-hero-portrait" aria-label="{% if lg == 'es' %}Retrato del autor{% else %}Author portrait{% endif %}">
  <div class="riso-photo home-hero-portrait__photo">
    <img src="{{ '/assets/img/headshot-daniel.jpg' | relative_url }}" alt="Daniel Gómez Domínguez" loading="eager" decoding="async" width="600" height="600">
  </div>
  <span class="riso-stamp home-hero-portrait__stamp">
    {% if lg == 'es' %}Disponible · CET{% else %}Available · CET{% endif %}
  </span>
</aside>
```

The include filename stays `home-stamp-pack.html` so we don't have to touch `index.html` and `es/index.html`. The class name and structure change inside the file — the home pages still get the right portrait.

### Step 3: Update `_layouts/cv.html` — add B&W portrait next to the header text

Find the header block. The first `<header>` content currently looks like:

```liquid
  <header class="stack" style="margin-bottom: var(--space-md);">
    <p class="caps-label">{{ cv.basics.label }}</p>
    <h1>{{ cv.basics.headline }}</h1>
    <p class="lead">{{ cv.basics.subhead }}</p>
    <p style="opacity:.82;max-width:65ch">{{ cv.basics.summary }}</p>
```

Wrap the name+label+headline+lead in a `cv-header-row` flex with the photo on the left. Replace the opening `<header>` and the first 4 lines with:

```liquid
  <header class="stack" style="margin-bottom: var(--space-md);">
    <div class="cv-header-row">
      <figure class="cv-header-portrait" aria-hidden="true" style="margin:0">
        <img src="{{ '/assets/img/headshot-daniel.jpg' | relative_url }}" alt="" loading="lazy" decoding="async" width="96" height="96">
      </figure>
      <div class="stack" style="gap:.4rem">
        <p class="caps-label">{{ cv.basics.label }}</p>
        <h1 style="margin:0">{{ cv.basics.headline }}</h1>
        <p class="lead">{{ cv.basics.subhead }}</p>
      </div>
    </div>
    <p style="opacity:.82;max-width:65ch">{{ cv.basics.summary }}</p>
```

### Step 4: Update `_layouts/speaking.html` — add real photo to headshots section

Find the headshots `<section>` (currently using `square_placeholder` and `wide_placeholder` SVGs). Replace the entire section with:

```liquid
  <section>
    <h2>{{ t.headshots }}</h2>
    <p class="caps-label" style="opacity:.75">
      {% if lg == 'es' %}
        Foto B&W para uso editorial. Si necesitas una versión en color o en alta resolución, escríbeme.
      {% else %}
        B&W photo for editorial use. If you need a color or higher-resolution version, drop me a note.
      {% endif %}
    </p>
    <div class="split" style="margin-top:1rem">
      <figure class="newsletter-card">
        <div class="riso-photo" style="width:100%;aspect-ratio:1/1;max-width:320px">
          <img src="{{ '/assets/img/headshot-daniel.jpg' | relative_url }}" alt="Daniel Gómez Domínguez (Riso duotone)" loading="lazy" decoding="async" width="600" height="600">
        </div>
        <figcaption class="caps-label" style="margin-top:.5rem">Riso duotone</figcaption>
      </figure>
      <figure class="newsletter-card">
        <div style="width:100%;aspect-ratio:1/1;max-width:320px;overflow:hidden;border-radius:var(--radius-sm)">
          <img src="{{ '/assets/img/headshot-daniel.jpg' | relative_url }}" alt="Daniel Gómez Domínguez (B&W)" loading="lazy" decoding="async" width="600" height="600" style="width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.05)">
        </div>
        <figcaption class="caps-label" style="margin-top:.5rem">B&W</figcaption>
      </figure>
    </div>
    <p style="margin-top:1rem"><a href="{{ '/assets/img/headshot-daniel.jpg' | relative_url }}" download>{% if lg == 'es' %}Descargar foto original{% else %}Download original photo{% endif %}</a> · <a href="{{ sp.assets.logos.mark_svg | relative_url }}">{% if lg == 'es' %}Descargar logo (SVG){% else %}Download mark (SVG){% endif %}</a></p>
  </section>
```

### Step 5: Update `about.md` — add portrait at top

Replace the body (preserve front matter):

```markdown
<figure class="about-portrait riso-photo" style="margin:0 0 var(--space-md)">
  <img src="{{ '/assets/img/headshot-daniel.jpg' | relative_url }}" alt="Daniel Gómez Domínguez" loading="lazy" decoding="async" width="400" height="400">
</figure>

Daniel leads AI programmes where multimodal ingestion, disciplined orchestration and executive storytelling collide. His background spans Cajal neuroscience, national science columns, multilingual product leadership, fraud fighting, multimodal embeddings, reinforcement-flavoured recommenders, autonomous LLM fleets, plus years on stage sharpening delivery.

He believes **discursive clarity is part of infra**: if executives cannot articulate why a model behaves, nobody will defend it inside budget committees.

## Method

The throughline across rigs, recommenders, and agent fleets is the same: design experiments you can defend, define the eval contract before the build call, and treat memory as debt rather than helpful context. Method matters more than the substrate — it survives every stack rotation, and it's what executives actually pay for.
```

### Step 6: Update `es/sobre.md` symmetrically

Replace the body:

```markdown
<figure class="about-portrait riso-photo" style="margin:0 0 var(--space-md)">
  <img src="{{ '/assets/img/headshot-daniel.jpg' | relative_url }}" alt="Daniel Gómez Domínguez" loading="lazy" decoding="async" width="400" height="400">
</figure>

Daniel dirige programas de IA donde la ingesta multimodal, la orquestación disciplinada y la narrativa ejecutiva se cruzan. Su trayectoria va desde la neurociencia en Cajal y columnas científicas en prensa nacional hasta liderazgo de producto multilingüe, antifraude, embeddings multimodales, recomendadores con sabor a refuerzo y flotas de LLMs autónomas — más años de tablas afilando la entrega.

Cree que **la claridad discursiva es parte de la infraestructura**: si los ejecutivos no pueden articular por qué un modelo se comporta como se comporta, nadie lo defenderá en los comités de presupuesto.

## Método

El hilo común entre los rigs de electrofisiología, los recomendadores y las flotas de agentes es el mismo: diseñar experimentos defendibles, definir el contrato de eval antes de la llamada de build, y tratar la memoria como deuda en lugar de contexto útil. El método importa más que el sustrato — sobrevive a cada rotación de stack y es lo que los ejecutivos realmente pagan.
```

### Step 7: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'headshot-daniel.jpg' _site/index.html
grep 'cv-header-portrait' _site/cv/index.html
grep 'headshot-daniel.jpg' _site/speaking-press/index.html
grep 'about-portrait' _site/about/index.html
grep 'about-portrait' _site/es/sobre/index.html
```
All matches expected.

### Step 8: Commit

```bash
git add _includes/home-stamp-pack.html _layouts/cv.html _layouts/speaking.html about.md es/sobre.md assets/css/_components.scss
git commit -m "headshot: integrate real photo on home (Riso) + CV (B&W calm) + speaking + about"
```

---

## Task 4: Pagefind search modal

**Files:**
- Run Pagefind in a Node Docker container to generate `assets/pagefind/`.
- Modify: `assets/js/main.js` — extend the existing search trigger to mount the modal.
- Modify: `assets/css/_components.scss` — append `.search-modal` styles.
- Modify: `.gitignore` — confirm `assets/pagefind/` is NOT ignored (so it commits).

### Step 1: Generate the Pagefind index

After a clean Jekyll build, run Pagefind in a Node container:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
docker run --rm -v "$(pwd):/work" -w /work node:20-slim npx -y pagefind@1 --site _site --output-path assets/pagefind
```

Expected: a `assets/pagefind/` directory appears with files including `pagefind.js`, `pagefind-ui.js`, `pagefind-ui.css`, and a `fragment/`+`index/` subtree.

### Step 2: Confirm `assets/pagefind/` is not ignored

Check `.gitignore`. The file should NOT contain `assets/pagefind` (anywhere). The current `.gitignore` is:

```
_site/
.jekyll-cache/
.jekyll-metadata
vendor/
.superpowers/
.claude/
Gemfile.lock
```

No mention of pagefind — good. The directory will commit fine.

### Step 3: Append `.search-modal` styles to `_components.scss`

```scss
// Search modal (Pagefind)
.search-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: none;
  background: color-mix(in srgb, var(--ink) 70%, transparent);
  padding: 4rem 1rem;
  overflow-y: auto;
}

.search-modal[data-open="true"] { display: block; }

.search-modal__inner {
  max-width: 42rem;
  margin: 0 auto;
  background: var(--paper);
  border: 1px solid color-mix(in srgb, var(--rule) 18%, transparent);
  border-radius: var(--radius-sm);
  padding: var(--space-md);
  position: relative;
}

.search-modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--rule) 22%, transparent);
  background: transparent;
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.search-modal__close:hover { color: var(--accent); border-color: var(--accent); }

// Pagefind UI overrides to match site style
.pagefind-ui__search-input {
  font-family: var(--font-sans);
  font-size: 1rem;
}

.pagefind-ui__results {
  font-family: var(--font-sans);
}
```

### Step 4: Replace the search-trigger handler in `assets/js/main.js`

Find the block:

```js
  const searchBtn = document.querySelector("[data-search-trigger]");
  function openSearch() {
    if (typeof window.__amloiiOpenSearch === "function") {
      window.__amloiiOpenSearch();
    } else {
      console.info("[search] Pagefind modal not yet wired (F5).");
    }
  }
```

Replace with the actual modal mount:

```js
  // Pagefind search modal — mounts lazily on first open.
  const searchBtn = document.querySelector("[data-search-trigger]");

  function ensureSearchModal() {
    let modal = document.getElementById('search-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'search-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = '<div class="search-modal__inner"><button type="button" class="search-modal__close" aria-label="Close" data-search-close>×</button><div id="search"></div></div>';
    document.body.appendChild(modal);

    // Close on click of overlay or close button
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.matches('[data-search-close]')) {
        modal.setAttribute('data-open', 'false');
      }
    });

    // Load Pagefind UI assets
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '/assets/pagefind/pagefind-ui.css';
    document.head.appendChild(cssLink);

    const script = document.createElement('script');
    script.src = '/assets/pagefind/pagefind-ui.js';
    script.onload = function () {
      try {
        new window.PagefindUI({ element: '#search', showSubResults: true });
      } catch (err) {
        console.warn('[search] Pagefind UI init failed', err);
      }
    };
    script.onerror = () => {
      console.warn('[search] Pagefind UI bundle missing at /assets/pagefind/. Did you run `pagefind` after the Jekyll build?');
    };
    document.head.appendChild(script);

    return modal;
  }

  function openSearch() {
    const modal = ensureSearchModal();
    modal.setAttribute('data-open', 'true');
    setTimeout(() => {
      const input = modal.querySelector('input[type="search"]');
      if (input) input.focus();
    }, 50);
  }

  // ESC closes the modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('search-modal');
      if (modal && modal.getAttribute('data-open') === 'true') {
        modal.setAttribute('data-open', 'false');
      }
    }
  });
```

The keydown handler for `/` is the existing one — keep it as-is.

### Step 5: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
ls _site/assets/pagefind/pagefind-ui.js
grep 'ensureSearchModal' _site/assets/js/main.js
grep '\.search-modal' _site/assets/css/main.css | head -3
```
All matches expected.

### Step 6: Manual smoke test

Open `http://localhost:4000/`. Press `/`. Expected:
- Modal overlay opens.
- Pagefind search input appears at top of modal.
- Type a known word from a post (e.g. "agentic"). Results appear with snippet + title link.
- Click a result → navigates to the post.
- Press ESC → modal closes.
- Click outside the inner box → modal closes.
- Click the × button → modal closes.

### Step 7: Commit

```bash
git add assets/pagefind assets/js/main.js assets/css/_components.scss
git commit -m "search: ship Pagefind index + wire modal (mount on / key, ESC closes)"
```

---

## Task 5: Polish OG default + template SVGs

**Files:**
- Modify: `assets/img/og-default.svg`, `assets/img/og-template.svg`.

### Step 1: Read current state

Read both SVGs. They're each ~600–700 bytes — small. Goal: ensure the default OG looks crisp at 1200×630 (Twitter card spec) with the new editorial branding.

### Step 2: Replace `assets/img/og-default.svg`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#fbf8f2"/>
  <g transform="translate(80,140)">
    <text x="0" y="0" font-family="'Source Serif 4', Georgia, serif" font-size="64" font-weight="700" fill="#0f0e0c">Daniel Gómez Domínguez</text>
    <text x="0" y="80" font-family="'Source Serif 4', Georgia, serif" font-size="44" font-weight="600" fill="#b0552b"><tspan>Agentic AI, shipped.</tspan></text>
    <text x="0" y="200" font-family="'JetBrains Mono', monospace" font-size="20" fill="#5c564c">AI Director · Architect · Madrid · EU-remote</text>
  </g>
  <g transform="translate(80,520)">
    <rect x="0" y="0" width="200" height="44" fill="none" stroke="#e0492f" stroke-width="2.5" rx="2"/>
    <text x="100" y="29" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#e0492f" letter-spacing="2">N°2026 · ISSUE</text>
  </g>
</svg>
```

### Step 3: Replace `assets/img/og-template.svg`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
  Per-post OG template. Duplicate this file as assets/img/og/<slug>.svg and
  swap the two <text data-replace="...">…</text> values with the post title
  and a kicker. The post's front matter `image:` field should point at the
  resulting file path.
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#fbf8f2"/>
  <g transform="translate(80,140)">
    <text data-replace="kicker" x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="20" fill="#b0552b" letter-spacing="3">BUILDING AGENTS · ISSUE 02</text>
    <text data-replace="title" x="0" y="100" font-family="'Source Serif 4', Georgia, serif" font-size="64" font-weight="700" fill="#0f0e0c">Replace with post title (≤ 50 chars).</text>
    <text x="0" y="240" font-family="'JetBrains Mono', monospace" font-size="20" fill="#5c564c">amloii.github.io/writing</text>
  </g>
  <g transform="translate(80,520)">
    <rect x="0" y="0" width="240" height="44" fill="none" stroke="#1e3a8a" stroke-width="2.5" rx="2"/>
    <text x="120" y="29" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#1e3a8a" letter-spacing="2">DANIEL GÓMEZ · 2026</text>
  </g>
</svg>
```

### Step 4: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'Agentic AI, shipped' _site/assets/img/og-default.svg
grep 'BUILDING AGENTS · ISSUE 02' _site/assets/img/og-template.svg
```
Matches expected.

### Step 5: Commit

```bash
git add assets/img/og-default.svg assets/img/og-template.svg
git commit -m "og: refresh default OG SVG with new headline + clean per-post template"
```

---

## Task 6: SVG dark-mode color fix (career-arc + hero illustrations)

**Files:**
- Modify: `_includes/riso/career-arc.svg` and the 5 hero illustration SVGs in `assets/svg/riso/`.
- Modify: `assets/css/_riso.scss` — recolor wrapper rule.

The 6 SVGs (`career-arc`, `agent-pipeline`, `decision-graph`, `eval-loop`, `ops-tower`, `rag-stack`) currently have hardcoded fill colors that look like a "light island" against dark mode's warm-coal background. The fix uses `currentColor` semantics + a wrapper class that overrides fills/strokes via CSS.

### Step 1: Read one of the SVGs to understand the structure

```bash
cat _includes/riso/career-arc.svg | head -30
```

The SVG has `<rect>` and `<path>` elements with `fill="#xxxxx"`. We need to change these to use CSS variables OR use the `currentColor` keyword.

### Step 2: Apply a CSS-only fix via `.riso-frame img`

The simplest and most robust fix: in dark mode, apply a CSS filter to invert + adjust the SVG so it reads on dark backgrounds. The SVG is rendered via `<img>` (or inline `<svg>`) inside `.riso-frame`. CSS filters work on both.

Append to `assets/css/_riso.scss`:

```scss
// Dark-mode SVG illustration fix — invert the SVG colors so the hardcoded
// light-bone backgrounds and dark-ink shapes read on warm coal.
[data-theme="dark"] .riso-frame img,
[data-theme="dark"] .riso-frame svg {
  filter: invert(0.92) hue-rotate(180deg) saturate(0.85);
}
```

The `invert(0.92)` flips light-bone to dark, dark-ink to light. The `hue-rotate(180deg)` then flips the colors back so that red stays red and blue stays blue (without `hue-rotate`, after invert, red becomes cyan and blue becomes yellow). The `saturate(0.85)` slightly desaturates because the inverted colors otherwise look too punchy on dark coal.

This is a known CSS pattern for "make light-mode SVGs work in dark mode without editing them". Trade-off: not perfect color fidelity, but readable and avoids per-SVG edits.

### Step 3: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep -E 'data-theme="dark"\] \.riso-frame' _site/assets/css/main.css
```
Match expected.

### Step 4: Manual visual check

Toggle dark mode. Visit `/cv/` and `/2026/05/05/agent-graph-margin-budgets/`. The career-arc figure (CV) and the agent-pipeline hero (post) should render with adjusted colors that read on the dark background — no more "light island" effect.

### Step 5: Commit

```bash
git add assets/css/_riso.scss
git commit -m "riso(dark): invert SVG illustrations in dark mode so hardcoded fills don't burn out"
```

---

## Task 7: ES copy audit pass

**Files:**
- Modify: `_data/i18n.yml` and any other Spanish content files where the audit finds issues.

### Step 1: Read the entire ES section of `_data/i18n.yml`

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec ruby -ryaml -e "y = YAML.load_file('_data/i18n.yml'); y['es'].each_pair { |k, v| puts \"=== #{k} ===\"; puts v.to_yaml }"
```

Read the output and look for:
- English strings that should be Spanish.
- Spanish typos / accent errors.
- Awkward translations that read like translated English.

### Step 2: Common issues to scan for

Check each of these against the current state:
- `es.home.subs_title` — "Ensayos por correo" — fine.
- `es.cv.linkedin` — "LinkedIn" (proper noun) — fine.
- `es.work.metric` — currently "Highlight" — fix to "Métrica destacada".
- `es.work.stack` — "Stack" — borderline; common in Spanish AI copy. Leave.
- Any "Newsletter" / "Stack" / "Backlog" — proper nouns or industry terms; leave unless awkward.

### Step 3: Apply fixes

If the audit finds issues, apply them as a single commit. Likely fixes:

In `_data/i18n.yml`, under `es.work`:
- `metric: Highlight` → `metric: Métrica destacada`.

Other suspected issues:
- `es.home.work_with_me` is "Colaborar" — fine.
- `es.now.title` is "Ahora" — fine.

### Step 4: Read content files for residual English

```bash
grep -rn -E '\b(the|with|and|of)\b' es/*.md es/*/*.md 2>&1 | grep -v 'liquid\|markdown'
```

Quick spot-check for English connector words in Spanish files. Manually inspect any matches.

### Step 5: Apply additional fixes inline; build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Clean expected.

### Step 6: Commit

```bash
git add _data/i18n.yml
git commit -m "i18n(es): audit pass — translate 'Highlight' to 'Métrica destacada' and minor fixes"
```

(If no issues found, skip this commit; the audit is itself the deliverable, documented in the PR body.)

---

## Task 8: README update

**Files:**
- Modify: `README.md`.

### Step 1: Replace `README.md`

The current README documents the pre-renovation Jekyll basics. F5 rewrites to reflect the renovated codebase: Docker-first dev, content authoring (posts + Now data), Pagefind regeneration, palette tokens, print testing.

```markdown
# Daniel Gómez Domínguez — sitio personal

Sitio estático con [Jekyll](https://jekyllrb.com/) optimizado para [GitHub Pages](https://pages.github.com/).

## Desarrollo local

Recomendado: **Docker** (sin instalar Ruby). Necesitas Docker Desktop corriendo.

```powershell
docker compose run --rm --entrypoint "" jekyll bundle install   # primera vez
docker compose up jekyll                                         # arranca jekyll serve --livereload en :4000
```

Abre `http://localhost:4000`. La primera `bundle install` tarda ~5 min y persiste en el volumen `jekyll-gems` para builds posteriores.

Build one-shot:

```powershell
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

### Alternativa nativa (sin Docker)

Si prefieres Ruby instalado localmente, en Windows necesitas Ruby + MSYS2 devkit (RubyInstaller-Devkit). Una vez en PATH:

```powershell
gem install bundler
bundle install
bundle exec jekyll serve
```

## Publicar un post

1. Crear/editar `_posts/YYYY-MM-DD-slug.md` (EN) y opcionalmente `_posts/YYYY-MM-DD-es-slug.md` (ES).
2. Front matter mínimo:
   ```yaml
   ---
   title: "Título del post"
   layout: post
   lang: en       # o 'es'
   ref: writing
   description: "Promesa de una frase para el meta description."
   pillar: building-agents   # building-agents | research-to-prod | ai-leadership | operators-notebook
   hero_illustration: agent-pipeline   # nombre de SVG en assets/svg/riso/
   draft: true    # cambia a false cuando esté listo
   date: 2026-XX-XX
   ---
   ```
3. Cuerpo en Markdown. H2s aparecen en el TOC automáticamente.
4. Para sidenotes Tufte: `{% include sn.html n="1" text="Contenido de la nota." %}` inline en el párrafo.
5. Cuando esté listo: `draft: false` y commit.

## Actualizar la página "Now"

Edita `_data/now.yml`. Hay 4 bloques (`building`, `reading`, `writing`, `speaking`) por idioma. Bloques vacíos (`[]`) se ocultan en la página.

```yaml
en:
  updated: "2026-XX-XX"
  status:
    - "shipping · agents v3"
    - "writing · 04 essays in flight"
    - "advisory · selectively open"
  blocks:
    building:
      - "Item 1..."
    ...
```

La fecha `updated` aparece tanto en `/now/` como en la línea de status del home. Sólo hay que actualizar este archivo.

## Regenerar el índice de búsqueda (Pagefind)

Después de añadir o cambiar contenido, regenera el índice:

```powershell
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
docker run --rm -v "${PWD}:/work" -w /work node:20-slim npx -y pagefind@1 --site _site --output-path assets/pagefind
git add assets/pagefind
git commit -m "search: regenerate Pagefind index"
```

## Sistema de diseño

- **Tokens** en `assets/css/_tokens.scss` — paleta light + dark, escalas tipográficas, espaciados.
- **Utilities Riso** en `assets/css/_riso.scss` — `.riso-paper`, `.riso-halftone`, `.riso-double-print`, `.riso-stamp`, `.riso-photo`, `.riso-frame`. Silenciadas dentro de `.cv-page` por el "two-pace contract".
- **Componentes** en `assets/css/_components.scss` — todo lo demás.
- **Print** en `assets/css/_print.scss` — fuerza monocromo, oculta nav/toggles, silencia decoración Riso.

## Variables imprescindibles en `_config.yml`

- `formspree_endpoint` — URL del form de contacto.
- `substack_embed_url` — URL del embed de tu Substack (newsletter footer + inline mid-post).
- `book_call_url` — URL de Cal.com para el botón de booking.
- `cloudflare_analytics.token` (opcional) — token de Cloudflare Web Analytics.

## Probar la versión print del CV

`/cv/` con Ctrl+P. Debe verse:
- Fondo blanco, texto negro.
- Sin nav, sin sticky CTA, sin stripe de availability, sin career-arc figure.
- Capabilities en 2 columnas.
- Timeline rows no se parten entre páginas.

## Licencia

Contenido © Daniel Gómez Domínguez. Código del sitio bajo uso personal.
```

### Step 2: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Clean (README is excluded from `_site` per `_config.yml`).

### Step 3: Commit

```bash
git add README.md
git commit -m "docs: rewrite README for the renovated codebase (Docker, posts, Now, Pagefind, design system)"
```

---

## Task 9: Lighthouse pass + final QA + PR

### Step 1: Lighthouse audit on `/`, `/cv/`, `/writing/`

Run Lighthouse in Chrome DevTools (or via CLI) on each page in light mode. Targets:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

Note results in the PR body. Document any items that fall below the floor and the reasoning (e.g. "Performance 88 because Substack iframe blocks render — acceptable trade-off; could move iframe to lazy-load on user interaction in a future sprint").

### Step 2: Visual sweep across both languages, both themes

Open every page in light + dark, verify:
- Photo renders correctly with Riso treatment on home/about/speaking.
- CV header B&W photo doesn't have Riso decoration (calm-mode contract).
- SVG illustrations no longer look like "light islands" in dark mode (the F6 invert filter is applied).
- Search modal opens on `/`, takes input, returns results, closes on ESC.
- Contact form points at the new Formspree endpoint (inspect the `<form action>`).
- CV download button reads "Download CV (ES)" / "Descargar CV (ES)" and downloads the ES PDF.
- No giscus markers anywhere (no "Comments" heading on posts).
- Print preview of `/cv/` is clean monochrome with the photo grayscale.

### Step 3: Confirm commit history

```bash
git log --oneline main..HEAD
```

Expected commits (~9, in order):
1. F5 plan doc.
2. Remove giscus.
3. Wire Formspree + CV PDF + drop pdf_en.
4. Integrate headshot.
5. Pagefind search modal.
6. OG SVGs.
7. Riso dark SVG fix.
8. ES audit (skip if no fixes needed).
9. README rewrite.

### Step 4: Push + open PR (after user authorization)

```bash
git push -u origin claude/f5-polish
gh pr create --title "F5: polish & ops (real photo · Pagefind · OG · dark SVGs · ES audit · Lighthouse · README)" --body "..."
```

PR body content shipped at execution time.

---

## Self-review

- **Spec coverage** (§7 + §8 F5):
  - ✅ Pagefind modal wiring (Task 4).
  - ✅ OG image SVG template + per-post override hook (Task 5).
  - ✅ giscus IDs … resolved by removal (user choice).
  - ✅ Formspree endpoint (Task 2).
  - ✅ Real headshot integration (Task 3).
  - ✅ ES copy audit (Task 7).
  - ✅ README updates (Task 8).
  - ✅ Lighthouse pass (Task 9).
  - ✅ Career-arc / hero illustration dark-mode fix (Task 6).
- **Placeholder scan**: no TBDs.
- **Type/name consistency**: `data-search-trigger`, `#search-modal`, `data-search-close`, `.search-modal__inner|__close`, `.cv-header-portrait`, `.about-portrait`, `.home-hero-portrait` (+ `__photo|__stamp`) all cross-referenced between CSS, JS, and Liquid.
- **Two-pace contract**: CV uses `cv-header-portrait` (B&W via `filter: grayscale(1)`, no Riso) — consistent with calm-mode rule.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Pagefind UI bundle path doesn't match what `pagefind-ui.js` expects | Pagefind 1.x defaults to `/pagefind/` for index lookup; the UI script auto-detects path from its own URL. Building with `--output-path assets/pagefind` and loading `pagefind-ui.js` from `/assets/pagefind/pagefind-ui.js` is the supported pattern. Verified in Pagefind 1.x docs. |
| Dark-mode SVG invert filter looks "off" on certain SVGs | The `invert(0.92) hue-rotate(180deg) saturate(0.85)` recipe is a pragmatic compromise. If a specific SVG looks egregiously wrong, F5+ can tune per-illustration via `[data-theme="dark"] .riso-frame[data-illust="ops-tower"]`. Acceptable for ship. |
| Photo dimensions (89 KB JPG) may be small for a 1200×1500 hero in F5+ campaigns | The image looks ~800×800 from the file size. Sufficient for site rendering at the sizes we use (max 600×600 in CSS). If user wants higher resolution for press downloads, a future asset bump is a small follow-up. |
| Lighthouse score for Performance might miss 95 due to Substack iframe | We accept ≥ 90 as the F5 floor for Performance and target 95 for Accessibility / Best Practices / SEO. Substack iframe is an external dependency. |
| Formspree free tier limits | Out of scope; user manages this. |
| Removing giscus deletes commit history of any existing comments (none on the site yet) | The site has no existing giscus comments (placeholder IDs were never wired). No data loss risk. |

---

## What's NOT in this phase

The renovation is COMPLETE after F5 ships. No future phases planned. Anything beyond F5 is a discretionary follow-up: per-slug OG generation, additional posts published from the F3b scaffolds, periodic content updates to `_data/now.yml`, occasional Pagefind regeneration after content changes.
