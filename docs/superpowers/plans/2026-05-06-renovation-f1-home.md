# Renovation F1 — Home (proof of direction) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the home page (`/` + `/es/`) with the Riso-forward visual direction: punchy headline with `riso-double-print` keyword, concentrated lead, sub-hero "system status" line driven by `_data/now.yml`, stamp-pack right column, big Riso double-print numerals on the selected-work index, mono kickers on essays/spotlight, and three differentiated lanes (Advisory/Implementation/Speaking) with stat micro-proofs and rotated `N°` stamps.

**Architecture:** All Riso visual primitives are already shipping from F0 (`_riso.scss`). F1 only adds home-specific styles to `_components.scss`, two new Liquid includes (`home-stamp-pack.html`, `home-status.html`), and reshapes the two top-level home pages (`index.html`, `es/index.html`). The portrait slot uses a stamp-pack placeholder until the real photo lands in F5; the same slot will be swapped without layout changes.

**Tech Stack:** Jekyll 3.10 (github-pages gem), SCSS, Liquid, vanilla ES6 (no JS additions in F1). Dockerized dev (see `docker-compose.yml`).

**Companion spec:** [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](../specs/2026-05-06-amloii-riso-forward-renovation-design.md) §6.1
**Predecessor plan (foundations):** [docs/superpowers/plans/2026-05-06-renovation-f0-foundations.md](2026-05-06-renovation-f0-foundations.md)

---

## File structure

**Files created:**
- `_includes/home-stamp-pack.html` — 4 rotated `.riso-stamp` elements; right column of hero.
- `_includes/home-status.html` — sub-hero status line, reads `site.data.now[lg].status`.

**Files modified:**
- `index.html` — full restructure of the EN home.
- `es/index.html` — full restructure of the ES home.
- `_data/i18n.yml` — new EN/ES strings for home (lead, three-lane labels, micro-proofs, status section title).
- `assets/css/_components.scss` — append `.home-hero`, `.home-stamp-pack[__stamp]`, `.home-status[__row|__item|__dot]`, `.home-work-index`, `.home-lanes`, `.home-lane[--n1|--n2|--n3]`, `.home-essay-meta`.

**Files deleted:**
- `_includes/marginalia-home.html` — replaced by `home-stamp-pack.html` + `home-status.html`.

**Files unchanged in this phase:**
- All `_layouts/` (the home uses `layout: home` which inherits from `default`; no template change needed).
- All `_data/now.yml` (introduced in F0; F1 only consumes it).
- All `_data/cv.yml`.
- All `assets/js/main.js` (no JS additions).
- `_includes/newsletter-home.html` (re-used as-is at the bottom of both home pages).

---

## Pre-flight

### Task 0: Confirm starting state

**Files:** none modified.

- [ ] **Step 1: Confirm Docker environment is up**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build in ~6–8 s, no warnings.

- [ ] **Step 2: Confirm F0 commits are all in this branch**

```bash
git log --oneline main..HEAD | head -20
```
Expected: at least 16 commits including `f160395 now: render updated date from data via body liquid` (F0 final state). The new F1 commits will land on top.

- [ ] **Step 3: Capture baseline screenshots of `/` and `/es/`**

Start the dev server in a separate shell:

```bash
docker compose up jekyll
```

In a browser, screenshot `http://localhost:4000/` and `http://localhost:4000/es/` in BOTH light and dark mode (4 screenshots total). Save them somewhere outside the repo. They're the visual reference for what changes after Task 5/6.

- [ ] **Step 4: Confirm clean working tree**

```bash
git status
```
Expected: clean. If anything is uncommitted, sort it before starting F1.

---

## Task 1: i18n keys for home

**Files:**
- Modify: `_data/i18n.yml`

The existing `home:` blocks already have `hero_kicker`, `read_essay`, `selected_work`, `view_all_work`, `writing`, `view_writing_hub`, `work_with_me`, `subs_title`, `subs_blurb`, `marginalia_intro`, `cta_cv`. We add new keys for the lead paragraph, three-lane labels and stat-style micro-proofs, the status section's screen-reader caption, and the work-index lead. We also update `meta.home_title` to the new short headline.

- [ ] **Step 1: Append new keys inside `en.home`**

Open `_data/i18n.yml`. Find the `en.home` block. Add these keys at the end of `en.home` (after the existing `cta_cv: Hiring? View full résumé`):

```yaml
    lead: "AI Director architecting agent fleets, LLM infra, and RAG in production. Madrid · EU-remote."
    status_label: System status
    fresh_essays: Fresh essays
    spotlight_kicker: External spotlight
    spotlight_title: Elsewhere
    work_intro: "Three pieces from the field — agentic platforms, retrieval infra, and an applied transformer pipeline."
    advisory_title: Advisory
    advisory_proof: "7+ years shipping AI · short, sharp cycles."
    advisory_cta: Book a 20-minute intro
    implementation_title: Implementation
    implementation_proof: "0→1 prototyping when slide decks stall."
    implementation_cta: Ping engineering
    speaking_title: Speaking
    speaking_proof: ">10k subs on neuroscience channel · national press columns."
    speaking_cta: Press kit
```

- [ ] **Step 2: Append the parallel keys inside `es.home`**

Inside the `es.home` block (after the existing `cta_cv: ¿Contratar? Ver CV completo`):

```yaml
    lead: "Director de IA · arquitecto de flotas agénticas, infra LLM y RAG en producción. Madrid · EU-remote."
    status_label: Estado del sistema
    fresh_essays: Últimos ensayos
    spotlight_kicker: Destacados externos
    spotlight_title: Fuera del sitio
    work_intro: "Tres piezas del campo — plataformas agénticas, infraestructura de retrieval y un pipeline transformer aplicado."
    advisory_title: Asesoría
    advisory_proof: "+7 años llevando IA a producción · ciclos cortos y precisos."
    advisory_cta: Reservar intro de 20 min
    implementation_title: Implementación
    implementation_proof: "Prototipado 0→1 cuando los decks ya no avanzan."
    implementation_cta: Escribir a ingeniería
    speaking_title: Charlas
    speaking_proof: "+10k suscriptores en divulgación · columnas en prensa nacional."
    speaking_cta: Kit para medios
```

- [ ] **Step 3: Update `meta.home_title` (both languages)**

Find `en.meta` block (top of EN section). The current value is:
```yaml
    home_title: Architecting agentic AI for production organizations
```

Replace with:
```yaml
    home_title: Agentic AI, shipped.
```

Find `es.meta` block. The current value is:
```yaml
    home_title: Diseño sistemas de IA agéntica para organizaciones en producción
```

Replace with:
```yaml
    home_title: IA agéntica, en producción.
```

(The `meta.home_description` keys stay unchanged — they feed the page `<meta name="description">`, not visible chrome.)

- [ ] **Step 4: Build to validate YAML parses**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build, no YAML parse errors, no Liquid warnings.

- [ ] **Step 5: Verify the new keys are accessible**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace > /dev/null
grep -c 'short, sharp cycles' _site/index.html || true
```
Expected: `0` (the home hasn't been restructured yet to consume the new keys; we're just validating they parse).

```bash
grep "Agentic AI, shipped" _site/index.html
```
Expected: at least one match (the existing home renders `meta.home_title` in `<h1>`, so it now shows the new headline).

```bash
grep "IA agéntica, en producción" _site/es/index.html
```
Expected: match.

- [ ] **Step 6: Commit**

```bash
git add _data/i18n.yml
git commit -m "i18n: add home redesign keys (lead, three-lane proofs, status label) + new headline"
```

---

## Task 2: Home-specific CSS

**Files:**
- Modify: `assets/css/_components.scss`

Append new style blocks at the end of the file. We add component classes that the home uses; we do NOT modify any existing classes.

- [ ] **Step 1: Append the home hero, stamp-pack, status, work-index, lanes, and essay-meta blocks**

Open `assets/css/_components.scss`. Append at the very end:

```scss
// Home — hero
.home-hero__headline {
  font-family: var(--font-display);
  font-size: var(--fs-display);
  font-weight: 700;
  line-height: var(--lh-tight);
  letter-spacing: -0.025em;
  margin: 0;
}

.home-hero__lead {
  font-size: 1.25rem;
  line-height: 1.5;
  max-width: 52ch;
  margin: 0;
  color: var(--ink);
  opacity: 0.92;
}

.home-hero__cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.home-hero__cta-secondary {
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid color-mix(in srgb, var(--rule) 40%, transparent);
  padding-bottom: 2px;
}

.home-hero__cta-secondary:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

// Home — stamp pack (placeholder until F5 photo)
.home-stamp-pack {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.75rem 1.25rem;
  align-items: center;
  justify-items: center;
  padding: var(--space-md) var(--space-sm);
  min-height: 14rem;
}

.home-stamp-pack__stamp:nth-child(1) { transform: rotate(-3.5deg); }
.home-stamp-pack__stamp:nth-child(2) { transform: rotate(2.2deg); }
.home-stamp-pack__stamp:nth-child(3) { transform: rotate(-1.5deg); }
.home-stamp-pack__stamp:nth-child(4) { transform: rotate(4deg); }

// Home — sub-hero status
.home-status {
  border-block: 1px solid color-mix(in srgb, var(--rule) 12%, transparent);
  background: color-mix(in srgb, var(--paper) 60%, transparent);
}

.home-status__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem var(--space-md);
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  color: var(--muted);
  padding-block: 0.85rem;
}

.home-status__sr {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

.home-status__item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.home-status__dot { font-size: 0.85em; line-height: 1; }
.home-status__item:nth-child(1) .home-status__dot { color: var(--riso-red); }
.home-status__item:nth-child(2) .home-status__dot { color: var(--accent); }
.home-status__item:nth-child(3) .home-status__dot { color: var(--riso-blue); }

// Home — selected work index
.home-work-index .idx-row__num {
  color: var(--riso-red);
  text-shadow:
    1.5px 1px 0  color-mix(in srgb, var(--riso-red)  88%, transparent),
   -1.5px -1px 0 color-mix(in srgb, var(--riso-blue) 70%, transparent);
}

[data-theme="dark"] .home-work-index .idx-row__num {
  text-shadow:
    1.5px 1px 0  color-mix(in srgb, var(--riso-red)  78%, transparent),
   -1.5px -1px 0 color-mix(in srgb, var(--riso-blue) 60%, transparent);
}

.home-work-index__metric {
  display: inline-block;
  margin-top: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  letter-spacing: 0.02em;
  color: var(--accent);
}

// Home — fresh essays + spotlight kicker
.home-essay-meta {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 0.35rem;
}

.home-essay-meta .pillar-tag {
  display: inline;
  margin: 0;
  font-size: 0.78rem;
}

// Home — three lanes (differentiated)
.home-lanes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
  margin-top: 1.25rem;
}

@media (max-width: 900px) {
  .home-lanes { grid-template-columns: 1fr; }
}

.home-lane {
  position: relative;
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  background: var(--paper);
  border: 1px solid color-mix(in srgb, var(--rule) 14%, transparent);
}

.home-lane__stamp {
  position: absolute;
  top: -0.65rem;
  left: var(--space-md);
}

.home-lane--n1 .home-lane__stamp { transform: rotate(-3deg); }
.home-lane--n2 .home-lane__stamp { transform: rotate(2.5deg); }
.home-lane--n3 .home-lane__stamp { transform: rotate(-1.5deg); }

.home-lane__title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0.5rem 0 0.5rem;
}

.home-lane__proof {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--muted);
  margin: 0 0 var(--space-sm);
}

.home-lane__cta { margin-top: var(--space-sm); }
```

- [ ] **Step 2: Build and confirm the SCSS compiles**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build, no warnings.

- [ ] **Step 3: Verify each new selector is in the compiled CSS**

```bash
grep -E '(home-hero__headline|home-stamp-pack|home-status__row|home-work-index|home-essay-meta|home-lanes|home-lane--n1|home-lane--n2|home-lane--n3)' _site/assets/css/main.css | head -10
```
Expected: matches for every new selector listed.

- [ ] **Step 4: Commit**

```bash
git add assets/css/_components.scss
git commit -m "components(home): add hero, stamp-pack, status, work-index, lanes styles"
```

---

## Task 3: `_includes/home-stamp-pack.html`

**Files:**
- Create: `_includes/home-stamp-pack.html`

The stamp pack replaces the old marginalia in the right column of the hero. Four rotated stamps (two red, two blue) with placeholder content.

- [ ] **Step 1: Create the include**

Create `_includes/home-stamp-pack.html` with this exact content:

```html
{% assign lg = page.lang | default: site.lang %}
{% assign cv = site.data.cv[lg] %}

<aside class="home-stamp-pack" aria-label="{% if lg == 'es' %}Estado del autor{% else %}Author status{% endif %}">
  <span class="riso-stamp home-stamp-pack__stamp">
    {% if lg == 'es' %}Disponible · CET{% else %}Available · CET{% endif %}
  </span>
  <span class="riso-stamp riso-stamp--blue home-stamp-pack__stamp">
    {{ cv.basics.location }}
  </span>
  <span class="riso-stamp home-stamp-pack__stamp">
    EU-remote
  </span>
  <span class="riso-stamp riso-stamp--blue home-stamp-pack__stamp">
    N°{{ site.time | date: "%Y" }}
  </span>
</aside>
```

The `cv.basics.location` resolves to "Madrid, Spain" in EN and "Madrid y alrededores" in ES (both pre-existing in `_data/cv.yml`).

- [ ] **Step 2: Build to confirm it parses**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build (the include is not yet referenced — Jekyll won't render it, but the template must parse if it's eventually included).

- [ ] **Step 3: Commit**

```bash
git add _includes/home-stamp-pack.html
git commit -m "includes: add home-stamp-pack (4 rotated stamps for hero right column)"
```

---

## Task 4: `_includes/home-status.html`

**Files:**
- Create: `_includes/home-status.html`

The sub-hero status line iterates `site.data.now[lg].status` and renders 3 mono-text items, each prefixed by a colored bullet (red / terracotta / blue via the `:nth-child` styles from Task 2).

- [ ] **Step 1: Create the include**

Create `_includes/home-status.html` with this exact content:

```html
{% assign lg = page.lang | default: site.lang %}
{% assign t = site.data.i18n[lg].home %}
{% assign n = site.data.now[lg] %}

{% if n.status and n.status.size > 0 %}
<section class="home-status no-print" aria-labelledby="home-status-label">
  <div class="container">
    <h2 id="home-status-label" class="home-status__sr">{{ t.status_label }}</h2>
    <div class="home-status__row">
      {% for s in n.status %}
        <span class="home-status__item">
          <span class="home-status__dot" aria-hidden="true">●</span>{{ s }}
        </span>
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}
```

Notes:
- The `<h2>` is screen-reader-only (`.home-status__sr`) to give the section an accessible name without adding visible chrome.
- `no-print` hides this row in print preview.
- The whole section is conditional on `n.status` having ≥1 item, so the page degrades gracefully if `_data/now.yml` is ever emptied.

- [ ] **Step 2: Build to confirm parsing**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build.

- [ ] **Step 3: Commit**

```bash
git add _includes/home-status.html
git commit -m "includes: add home-status (sub-hero system-status line from _data/now.yml)"
```

---

## Task 5: Restructure `index.html` (EN home)

**Files:**
- Modify: `index.html`

Full rewrite of the EN home body. Replace the entire content below the front matter.

- [ ] **Step 1: Read the current `index.html`** (front matter + body) so you can confirm the front matter stays intact while the body gets replaced.

The front matter you must preserve (do not modify these 11 lines at the top):

```yaml
---
layout: home
lang: en
ref: home
title: "Daniel Gómez Domínguez · AI Director"
description: "AI Director & systems architect — agentic AI, LLM infrastructure, RAG, multimodal generative systems, and technical leadership from Madrid / EU-remote."
featured_projects:
  - in-a-few-words
  - agentic-knowledge-studio
  - enterprise-rag-gateway
---
```

- [ ] **Step 2: Replace the body**

Replace EVERYTHING below the closing `---` of the front matter with this exact body:

```html

{% assign t = site.data.i18n.en.home %}
{% assign meta_t = site.data.i18n.en.meta %}
{% assign work_t = site.data.i18n.en.work %}

<section class="section">
  <div class="container grid-12" style="align-items:start">
    <div class="col-span-7 stack" style="gap:var(--space-md)">
      <p class="caps-label">{{ t.hero_kicker }}</p>
      <h1 class="home-hero__headline">
        <span class="riso-double-print">Agentic</span> AI, shipped.
      </h1>
      <p class="home-hero__lead">{{ t.lead }}</p>
      <div class="home-hero__cta-row">
        {% assign latest = site.posts | first %}
        {% if latest %}
          <a class="btn btn--accent" href="{{ latest.url | relative_url }}">{{ t.read_essay }} →</a>
        {% endif %}
        <a class="caps-label home-hero__cta-secondary" href="{{ '/cv/' | relative_url }}">{{ t.cta_cv }} →</a>
      </div>
    </div>
    <div class="col-span-5">
      {% include home-stamp-pack.html %}
    </div>
  </div>
</section>

{% include home-status.html %}

<hr class="hairline">

<section class="section section--paper">
  <div class="container">
    <header class="stack" style="gap:.5rem;margin-bottom:1.5rem">
      <span class="caps-label">{{ t.selected_work }}</span>
      <h2 style="margin:0">{{ t.selected_work }}</h2>
      <p class="lead">{{ t.work_intro }}</p>
    </header>

    <div class="stack home-work-index" style="gap:var(--space-md)">
      {% assign slugs = page.featured_projects %}
      {% for slug in slugs %}
        {% assign proj = site.projects | where: 'slug', slug | where: 'lang', 'en' | first %}
        {% if proj %}
          <a class="idx-row" href="{{ proj.url | relative_url }}">
            <span class="idx-row__num">{% assign idx = forloop.index %}{% if idx < 10 %}0{% endif %}{{ idx }}</span>
            <span>
              <span class="idx-row__title">{{ proj.title }}</span><br>
              <span style="opacity:0.75;font-size:var(--fs-small)">{{ proj.summary }}</span>
              {% if proj.featured_metric %}
                <br><span class="home-work-index__metric">{{ proj.featured_metric }}</span>
              {% endif %}
            </span>
            <span class="caps-label">{{ proj.domain }}</span>
            <span class="caps-label">{{ proj.year }}</span>
          </a>
        {% endif %}
      {% endfor %}
    </div>

    <p style="margin-top:1.5rem">
      <a class="btn btn--ghost" href="{{ '/work/' | relative_url }}">{{ t.view_all_work }}</a>
    </p>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div>
      <span class="caps-label">{{ t.writing }}</span>
      <h2 style="margin-top:.35rem">{{ t.fresh_essays }}</h2>
      {% for post in site.posts limit:2 %}
        <article style="margin-top:1rem">
          <p class="home-essay-meta">
            {{ post.date | date: "%Y-%m-%d" }}
            {% if post.pillar %}
              · <span class="pillar-tag">{{ post.pillar }}</span>
            {% else %}
              · essay
            {% endif %}
          </p>
          <h3 style="margin:.25rem 0;font-family:var(--font-display);font-size:1.4rem;font-weight:600;text-transform:none;letter-spacing:0;color:inherit">
            <a href="{{ post.url | relative_url }}" style="color:inherit;text-decoration:none">{{ post.title }}</a>
          </h3>
          <p>{{ post.excerpt | strip_html | truncate: 260 }}</p>
        </article>
      {% endfor %}
      <p style="margin-top:1rem"><a href="{{ '/writing/' | relative_url }}">{{ t.view_writing_hub }} →</a></p>
    </div>
    <div>
      <span class="caps-label">{{ t.spotlight_kicker }}</span>
      <h2 style="margin-top:.35rem">{{ t.spotlight_title }}</h2>
      {% assign spotlight = site.data.external_writing.featured | slice: 0, 2 %}
      {% for item in spotlight %}
        <article style="margin-top:1rem">
          <p class="home-essay-meta">{{ item.outlet }} · {{ item.year }}</p>
          <h3 style="margin:.25rem 0;font-family:var(--font-display);font-size:1.4rem;font-weight:600;text-transform:none;letter-spacing:0;color:inherit">
            <a href="{{ item.url }}" style="color:inherit;text-decoration:none">{{ item.title }}</a>
          </h3>
        </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="container">
    <span class="caps-label">{{ t.work_with_me }}</span>
    <h2 style="margin-top:.35rem">{{ t.work_with_me }}</h2>
    <div class="home-lanes">
      <article class="home-lane home-lane--n1">
        <span class="riso-stamp home-lane__stamp">N°1</span>
        <h3 class="home-lane__title">{{ t.advisory_title }}</h3>
        <p class="home-lane__proof">{{ t.advisory_proof }}</p>
        <p class="home-lane__cta">
          <a class="btn btn--ghost" href="{{ site.book_call_url }}">{{ t.advisory_cta }}</a>
        </p>
      </article>
      <article class="home-lane home-lane--n2">
        <span class="riso-stamp riso-stamp--blue home-lane__stamp">N°2</span>
        <h3 class="home-lane__title">{{ t.implementation_title }}</h3>
        <p class="home-lane__proof">{{ t.implementation_proof }}</p>
        <p class="home-lane__cta">
          <a class="btn btn--ghost" href="mailto:{{ site.author.email }}">{{ t.implementation_cta }}</a>
        </p>
      </article>
      <article class="home-lane home-lane--n3">
        <span class="riso-stamp home-lane__stamp">N°3</span>
        <h3 class="home-lane__title">{{ t.speaking_title }}</h3>
        <p class="home-lane__proof">{{ t.speaking_proof }}</p>
        <p class="home-lane__cta">
          <a class="btn btn--ghost" href="{{ '/speaking-press/' | relative_url }}">{{ t.speaking_cta }}</a>
        </p>
      </article>
    </div>
  </div>
</section>

{% include newsletter-home.html %}
```

The 4 hero `<h2>` headlines are not changed (they're decorative via inline style and are clickable links elsewhere). The `meta_t` and `work_t` assignments at the top are reserved for any future need; if you find them unused at the end of this task, leave them — they cost nothing and document available scopes.

- [ ] **Step 3: Build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build, no warnings.

- [ ] **Step 4: Verify the rendered EN home contains the new content**

```bash
grep '<span class="riso-double-print">Agentic</span>' _site/index.html
```
Expected: match.

```bash
grep 'AI Director architecting agent fleets' _site/index.html
```
Expected: match (the new lead).

```bash
grep 'home-stamp-pack' _site/index.html
```
Expected: match (the include rendered).

```bash
grep 'home-status__row' _site/index.html
```
Expected: match.

```bash
grep -c 'home-lane' _site/index.html
```
Expected: at least 6 (the 3 lanes × 2 class occurrences each, plus stamp positions).

```bash
grep '7+ years shipping AI' _site/index.html
```
Expected: match (Advisory micro-proof).

```bash
grep '0→1 prototyping' _site/index.html
```
Expected: match (Implementation micro-proof).

```bash
grep '>10k subs on neuroscience' _site/index.html
```
Expected: match (Speaking micro-proof).

```bash
grep 'Available · CET' _site/index.html
```
Expected: match (one of the 4 stamp pack stamps).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "home(en): redesign hero, status, work, essays, three lanes (Riso forward)"
```

---

## Task 6: Restructure `es/index.html` (ES home)

**Files:**
- Modify: `es/index.html`

Symmetric restructure for ES. The structure is identical to Task 5; only the language tags, hub link slugs, and the inline H1 (Spanish-specific Riso double-print on `agéntica`) differ.

- [ ] **Step 1: Preserve the front matter**

The first 11 lines (front matter) of `es/index.html` must remain unchanged:

```yaml
---
layout: home
lang: es
ref: home
title: "Daniel Gómez Domínguez · Director de IA"
description: "Director de IA y arquitecto de sistemas — IA agéntica, infra LLM, RAG, IA generativa multimodal y liderazgo técnico desde Madrid / remoto UE."
featured_projects:
  - es-in-a-few-words
  - es-agentic-knowledge-studio
  - es-enterprise-rag-gateway
---
```

- [ ] **Step 2: Replace the body**

Replace EVERYTHING below the closing `---` with this exact body:

```html

{% assign t = site.data.i18n.es.home %}

<section class="section">
  <div class="container grid-12" style="align-items:start">
    <div class="col-span-7 stack" style="gap:var(--space-md)">
      <p class="caps-label">{{ t.hero_kicker }}</p>
      <h1 class="home-hero__headline">
        IA <span class="riso-double-print">agéntica</span>, en producción.
      </h1>
      <p class="home-hero__lead">{{ t.lead }}</p>
      <div class="home-hero__cta-row">
        {% assign latest = site.posts | first %}
        {% if latest %}
          <a class="btn btn--accent" href="{{ latest.url | relative_url }}">{{ t.read_essay }} →</a>
        {% endif %}
        <a class="caps-label home-hero__cta-secondary" href="{{ '/es/trayectoria/' | relative_url }}">{{ t.cta_cv }} →</a>
      </div>
    </div>
    <div class="col-span-5">
      {% include home-stamp-pack.html %}
    </div>
  </div>
</section>

{% include home-status.html %}

<hr class="hairline">

<section class="section section--paper">
  <div class="container">
    <header class="stack" style="gap:.5rem;margin-bottom:1.5rem">
      <span class="caps-label">{{ t.selected_work }}</span>
      <h2 style="margin:0">{{ t.selected_work }}</h2>
      <p class="lead">{{ t.work_intro }}</p>
    </header>

    <div class="stack home-work-index" style="gap:var(--space-md)">
      {% assign slugs = page.featured_projects %}
      {% for slug in slugs %}
        {% assign proj = site.projects | where: 'slug', slug | where: 'lang', 'es' | first %}
        {% if proj %}
          <a class="idx-row" href="{{ proj.url | relative_url }}">
            <span class="idx-row__num">{% assign idx = forloop.index %}{% if idx < 10 %}0{% endif %}{{ idx }}</span>
            <span>
              <span class="idx-row__title">{{ proj.title }}</span><br>
              <span style="opacity:0.75;font-size:var(--fs-small)">{{ proj.summary }}</span>
              {% if proj.featured_metric %}
                <br><span class="home-work-index__metric">{{ proj.featured_metric }}</span>
              {% endif %}
            </span>
            <span class="caps-label">{{ proj.domain }}</span>
            <span class="caps-label">{{ proj.year }}</span>
          </a>
        {% endif %}
      {% endfor %}
    </div>

    <p style="margin-top:1.5rem">
      <a class="btn btn--ghost" href="{{ '/es/trabajo/' | relative_url }}">{{ t.view_all_work }}</a>
    </p>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div>
      <span class="caps-label">{{ t.writing }}</span>
      <h2 style="margin-top:.35rem">{{ t.fresh_essays }}</h2>
      {% for post in site.posts limit:2 %}
        <article style="margin-top:1rem">
          <p class="home-essay-meta">
            {{ post.date | date: "%Y-%m-%d" }}
            {% if post.pillar %}
              · <span class="pillar-tag">{{ post.pillar }}</span>
            {% else %}
              · essay
            {% endif %}
          </p>
          <h3 style="margin:.25rem 0;font-family:var(--font-display);font-size:1.4rem;font-weight:600;text-transform:none;letter-spacing:0;color:inherit">
            <a href="{{ post.url | relative_url }}" style="color:inherit;text-decoration:none">{{ post.title }}</a>
          </h3>
          <p>{{ post.excerpt | strip_html | truncate: 260 }}</p>
        </article>
      {% endfor %}
      <p style="margin-top:1rem"><a href="{{ '/es/escritos/' | relative_url }}">{{ t.view_writing_hub }} →</a></p>
    </div>
    <div>
      <span class="caps-label">{{ t.spotlight_kicker }}</span>
      <h2 style="margin-top:.35rem">{{ t.spotlight_title }}</h2>
      {% assign spotlight = site.data.external_writing.featured | slice: 0, 2 %}
      {% for item in spotlight %}
        <article style="margin-top:1rem">
          <p class="home-essay-meta">{{ item.outlet }} · {{ item.year }}</p>
          <h3 style="margin:.25rem 0;font-family:var(--font-display);font-size:1.4rem;font-weight:600;text-transform:none;letter-spacing:0;color:inherit">
            <a href="{{ item.url }}" style="color:inherit;text-decoration:none">{{ item.title }}</a>
          </h3>
        </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="container">
    <span class="caps-label">{{ t.work_with_me }}</span>
    <h2 style="margin-top:.35rem">{{ t.work_with_me }}</h2>
    <div class="home-lanes">
      <article class="home-lane home-lane--n1">
        <span class="riso-stamp home-lane__stamp">N°1</span>
        <h3 class="home-lane__title">{{ t.advisory_title }}</h3>
        <p class="home-lane__proof">{{ t.advisory_proof }}</p>
        <p class="home-lane__cta">
          <a class="btn btn--ghost" href="{{ site.book_call_url }}">{{ t.advisory_cta }}</a>
        </p>
      </article>
      <article class="home-lane home-lane--n2">
        <span class="riso-stamp riso-stamp--blue home-lane__stamp">N°2</span>
        <h3 class="home-lane__title">{{ t.implementation_title }}</h3>
        <p class="home-lane__proof">{{ t.implementation_proof }}</p>
        <p class="home-lane__cta">
          <a class="btn btn--ghost" href="mailto:{{ site.author.email }}">{{ t.implementation_cta }}</a>
        </p>
      </article>
      <article class="home-lane home-lane--n3">
        <span class="riso-stamp home-lane__stamp">N°3</span>
        <h3 class="home-lane__title">{{ t.speaking_title }}</h3>
        <p class="home-lane__proof">{{ t.speaking_proof }}</p>
        <p class="home-lane__cta">
          <a class="btn btn--ghost" href="{{ '/es/charlas-prensa/' | relative_url }}">{{ t.speaking_cta }}</a>
        </p>
      </article>
    </div>
  </div>
</section>

{% include newsletter-home.html %}
```

- [ ] **Step 3: Build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build.

- [ ] **Step 4: Verify the ES home content**

```bash
grep '<span class="riso-double-print">agéntica</span>' _site/es/index.html
```
Expected: match.

```bash
grep 'Director de IA · arquitecto de flotas agénticas' _site/es/index.html
```
Expected: match (the new ES lead).

```bash
grep 'home-stamp-pack' _site/es/index.html
```
Expected: match.

```bash
grep '+7 años llevando IA a producción' _site/es/index.html
```
Expected: match (Advisory ES micro-proof).

```bash
grep 'Prototipado 0→1' _site/es/index.html
```
Expected: match.

```bash
grep '+10k suscriptores' _site/es/index.html
```
Expected: match.

```bash
grep 'Madrid y alrededores' _site/es/index.html
```
Expected: match (the location stamp from the ES CV data).

- [ ] **Step 5: Commit**

```bash
git add es/index.html
git commit -m "home(es): redesign hero, status, work, essays, three lanes (Riso forward)"
```

---

## Task 7: Delete `_includes/marginalia-home.html`

**Files:**
- Delete: `_includes/marginalia-home.html`

The marginalia include is no longer referenced anywhere after Tasks 5 and 6 swapped it for `home-stamp-pack.html`. Remove it.

- [ ] **Step 1: Confirm there are no remaining references**

```bash
grep -R 'marginalia-home' --include='*.html' --include='*.md' --include='*.yml' --include='*.scss' .
```
Expected: NO matches anywhere in the source tree (excluding `_site/` which is built output and `docs/` which is excluded — but spot-check the result is empty).

If any reference remains, stop and investigate before deleting.

- [ ] **Step 2: Delete the file**

```bash
git rm _includes/marginalia-home.html
```

- [ ] **Step 3: Build to confirm nothing broke**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git commit -m "includes: remove marginalia-home (replaced by home-stamp-pack)"
```

---

## Task 8: Final QA + PR

**Files:** none modified.

- [ ] **Step 1: Quick visual regression vs the F0 baseline**

Open `http://localhost:4000/` and `http://localhost:4000/es/` (with `docker compose up jekyll` running). Compare against the screenshots from Task 0 Step 3.

Expected differences (these are correct):
- The H1 reads "Agentic AI, shipped." (EN) / "IA agéntica, en producción." (ES) with one keyword in `riso-double-print`.
- The lead paragraph is shorter and more concentrated.
- The right column of the hero is a stamp pack (4 rotated stamps) instead of the marginalia text list.
- A new mono "system status" row appears below the hero, between the hero `<section>` and the `<hr class="hairline">`.
- The work index numbers (`01`/`02`/`03`) are red with riso double-print shadow, and the `featured_metric` line under each title is in mono terracotta.
- The fresh-essays kickers are mono uppercase.
- The three lanes are visibly differentiated: each has a rotated `N°1` / `N°2` / `N°3` stamp at the top-left, the body is a stat-style mono micro-proof, and the CTA buttons read different labels (Book a 20-minute intro / Ping engineering / Press kit, plus their ES equivalents).

Anything else changing on the home is a regression — sort it before continuing.

- [ ] **Step 2: Dark-mode sweep**

Toggle to dark. Reload `/` and `/es/`. Confirm:
- Headline keyword still has visible double-print shadow (red+blue pair shifts in dark mode).
- Stamp-pack stamps remain readable (red and blue stamps, not crushed against the warm-coal background).
- Sub-hero status line is legible.
- Three-lane stamps and proofs are legible.
- Work-index big numbers still pop (red + offset blue).

- [ ] **Step 3: Print preview**

Ctrl+P on `/cv/` (still calm-mode from F0). Then Ctrl+P on `/`. The home in print should:
- Hide nav, theme toggle, search trigger, footer, status row, newsletter card.
- Render headline as flat text (no double-print shadow — Riso utilities are silenced in print per F0 Task 8).
- Render lanes without rotated stamps.

- [ ] **Step 4: Mobile breakpoint**

Resize the browser to ~700 px. Confirm:
- The 12-col grid collapses (col-span-7/5 already set to span 1 at < 900 px in `_layout.scss`).
- The home-lanes grid collapses to 1 column (rule added in Task 2 at < 900 px).
- The stamp pack and status row don't overflow.

- [ ] **Step 5: Lighthouse spot check**

Run Lighthouse (Chrome DevTools) on `/` in light mode. Expected: Accessibility ≥ 90 (we deferred a11y polish to F5 but the home should not regress from F0). Performance is OK to be lower because we have iframe (newsletter) and font loading; the F5 pass tightens it.

- [ ] **Step 6: Confirm the F1 commit history**

```bash
git log --oneline main..HEAD | head -20
```

You should see (in this order, with F0 commits before them):
1. F0 commits (16 of them — already in branch).
2. `i18n: add home redesign keys (lead, three-lane proofs, status label) + new headline`
3. `components(home): add hero, stamp-pack, status, work-index, lanes styles`
4. `includes: add home-stamp-pack (4 rotated stamps for hero right column)`
5. `includes: add home-status (sub-hero system-status line from _data/now.yml)`
6. `home(en): redesign hero, status, work, essays, three lanes (Riso forward)`
7. `home(es): redesign hero, status, work, essays, three lanes (Riso forward)`
8. `includes: remove marginalia-home (replaced by home-stamp-pack)`

7 new F1 commits.

- [ ] **Step 7: Push and open the PR (only after explicit user authorization)**

Wait for the user to authorize the push. If they have already merged F0 PR (#1) into main, this F1 work is best landed as its own PR on top of the new main; if F0 hasn't merged yet, this F1 PR will stack on the F0 branch.

When authorized, open the PR with:

```bash
gh pr create --title "F1: home redesign (Riso forward, proof of direction)" --body "$(cat <<'EOF'
## Summary

Home page redesign in the Riso-forward direction. Builds directly on F0 primitives (`riso-double-print`, `riso-stamp`, dark-mode tokens, two-pace contract).

- New hero: punchy `Agentic AI, shipped.` (EN) / `IA agéntica, en producción.` (ES) with one keyword in `riso-double-print`. Concentrated lead. Stamp-pack right column (placeholder for the F5 portrait — same layout slot).
- New sub-hero "system status" line (mono, full width, color-coded dots) reading 3 status strings from `_data/now.yml`.
- Selected-work index gains big red `riso-double-print` numerals and a mono terracotta `featured_metric` line.
- Fresh-essays + External-spotlight kickers move to mono uppercase; pillar tags get the Riso accent.
- Three lanes are visibly differentiated: each gets a rotated `N°1` / `N°2` / `N°3` stamp, a stat-style mono micro-proof, and a distinct CTA (Book a 20-min intro / Ping engineering / Press kit).
- All copy is i18n-keyed; ES is paritary.
- `_includes/marginalia-home.html` removed (replaced by `home-stamp-pack.html` + `home-status.html`).

## Test plan

- [x] EN home renders the new headline, lead, stamp-pack, status, work numerals, lanes (and ES symmetrically).
- [x] Dark mode: keyword `riso-double-print` shadow shifts to attenuated red+blue; stamps remain readable.
- [x] Print preview hides the status row, lanes' rotated stamps render flat, double-print is silenced.
- [x] Mobile (< 900 px): grid collapses cleanly.
- [x] Lighthouse Accessibility ≥ 90 on `/`.
- [x] No JS additions; build clean (~6–8 s, 0 warnings).

## What's NOT in this PR

CV redesign (F2), writing system + post template + scaffolds (F3), Work / Speaking / Now / About / Contact redesign (F4), Pagefind modal + OG template + giscus IDs + real headshot + ES audit + 404 + Lighthouse 95+ pass (F5).

Spec: [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md) §6.1
Plan: [docs/superpowers/plans/2026-05-06-renovation-f1-home.md](docs/superpowers/plans/2026-05-06-renovation-f1-home.md)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review (run before handing off to execution)

After all tasks land:

- **Spec coverage**: every bullet in §6.1 of the design spec is implemented by exactly one F1 task above (hero kicker, headline with double-print, lead, CTAs, sub-hero status, selected-work numerals + featured_metric, three-lanes stamps + micro-proofs, newsletter at end). Bug-fix carry-over: F1 does NOT touch the home `<title>` tag (front matter `title:` field) — only the visible `<h1>`.
- **Placeholder scan**: every code block above is concrete; no "TBD" or "fill in".
- **Type/name consistency**:
  - `home-hero__headline`, `home-hero__lead`, `home-hero__cta-row`, `home-hero__cta-secondary`: defined in Task 2, consumed in Tasks 5 & 6.
  - `home-stamp-pack`, `home-stamp-pack__stamp`: defined in Task 2, consumed in Task 3.
  - `home-status`, `home-status__row`, `home-status__item`, `home-status__dot`, `home-status__sr`: defined in Task 2, consumed in Task 4.
  - `home-work-index`, `home-work-index__metric`: defined in Task 2, consumed in Tasks 5 & 6.
  - `home-essay-meta`: defined in Task 2, consumed in Tasks 5 & 6.
  - `home-lanes`, `home-lane`, `home-lane--n1`, `home-lane--n2`, `home-lane--n3`, `home-lane__stamp`, `home-lane__title`, `home-lane__proof`, `home-lane__cta`: defined in Task 2, consumed in Tasks 5 & 6.
  - i18n keys (`lead`, `status_label`, `fresh_essays`, `spotlight_kicker`, `spotlight_title`, `work_intro`, `advisory_*`, `implementation_*`, `speaking_*`): defined in Task 1, consumed in Tasks 4, 5, 6.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| The `riso-double-print` keyword span breaks line-wrap on a narrow viewport, causing an awkward orphaned word | The headline is short ("Agentic AI, shipped." / "IA agéntica, en producción."); hand-tested at 320 px and 1440 px during Task 8 Step 4. If wrap is awkward, F1 can ship a `<wbr>` hint or `display: inline-block` on the span — leave for follow-up if observed. |
| Stamps render larger than the cell width on small viewports | `.riso-stamp` uses inline padding only; `.home-stamp-pack` is a 2-col grid that collapses naturally; verified at 700 px breakpoint. If any stamp clips, increase the column gap. |
| Three-lane card stamps clip against the card border | `.home-lane__stamp` uses `position: absolute; top: -0.65rem` so it sits half outside the card. Confirmed in Task 8 Step 1. |
| `_data/now.yml` status array could shrink to fewer than 3 items in the future | `home-status.html` iterates whatever's there and the `.home-status__item:nth-child` color rules degrade gracefully (only the first 3 items get colored dots; further items get default text color, none break). |
| Print stylesheet from F0 may not silence the new home-status section properly | The status section has the `no-print` class and F0's `_print.scss` already includes `.no-print { display: none !important }`. Verified during Task 8 Step 3. |
| ES hub link slugs (`/es/trabajo/`, `/es/charlas-prensa/`, `/es/escritos/`) are hardcoded in the ES home | Existing pattern across the site; matches what `_includes/nav.html` and `_data/nav_manifest.yml` use. No change needed. |

---

## What's NOT in this phase (for clarity)

- CV calm-mode treatment, sticky CTA, capability grid, print polish — F2.
- Writing index redesign, post template (TOC, sidenotes, related, prev/next, inline newsletter), blog scaffolds, pillar filter — F3.
- Work / Project pages / Speaking & Press / Now structured UI / About photo / Contact micro-copy / 404 — F4.
- Pagefind modal wiring, OG image template, real giscus IDs, Formspree endpoint, real headshot integration, ES copy audit, Lighthouse 95+ pass — F5.
- The portrait slot stays as a stamp-pack until F5; the F5 task swaps the include without touching the layout.
