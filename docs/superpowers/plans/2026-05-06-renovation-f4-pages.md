# Renovation F4 — Work / Speaking / Now / About / Contact / 404 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the remaining content pages with the Riso-forward direction. Work index gains domain filter chips + big riso-red double-print numerals. Project pages gain a `riso-stamp` "Case study · YEAR" header and a double-print `featured_metric`. Speaking & Press gets copyable bios via the F0 `data-copy` utility. The Now page restructures into 4 blocks (Building / Reading / Writing / Speaking) with small Riso stamps per block. About gains a methodology paragraph. Contact gains a "what I respond to" micro-copy block. The 404 page gets Riso-forward dry humor.

**Architecture:** Pure SCSS + Liquid. No new JS (the F0 `data-copy` handler covers Speaking). All page-level changes are inside existing layouts/pages — no new layouts. Two new includes (`now-block.html`, `contact-microcopy.html`) keep the page bodies clean.

**Tech Stack:** Jekyll 3.10, SCSS, Liquid, kramdown.

**Companion spec:** [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](../specs/2026-05-06-amloii-riso-forward-renovation-design.md) §6.5–§6.10
**Predecessors:** F0/F1/F2/F3a/F3b (all on `main`).
**Successor:** F5 polish (search modal, OG template, real giscus IDs, real headshot, ES audit, Lighthouse 95+).

---

## File structure

**Files modified:**
- `_layouts/hub-work.html` — domain filter chips + big riso-red numerals.
- `_layouts/project.html` — `riso-stamp` header + double-print on featured_metric + tightened typography.
- `_layouts/speaking.html` — copyable bios via `data-copy`, small layout cleanup.
- `now/index.md` — render 4 structured blocks with Riso stamps via the new `now-block.html` include.
- `es/ahora/index.md` — same.
- `about.md` — add a methodology paragraph.
- `es/sobre.md` — same.
- `contact.md` — add the "what I respond to" micro-copy block.
- `es/contacto.md` — same.
- `404.html` — rewrite with Riso-forward copy.
- `_data/i18n.yml` — new keys for work filter, now block titles, contact micro-copy labels.
- `assets/css/_components.scss` — append `.work-domain-filter`, `.work-index .idx-row__num` (riso double-print), `.project-stamp`, `.project-metric-headline`, `.now-blocks`, `.now-block` (+ `__stamp|__heading|__items`), `.contact-microcopy` (+ `__heading|__list`), `.error-404` (+ `__title|__lead|__links`), `.speaking-bio-card` (+ `__copy-row`).

**Files created:**
- `_includes/now-block.html` — renders one Now block with stamp + heading + items list.
- `_includes/contact-microcopy.html` — renders the "what I respond to / what I won't" block.

**Files unchanged:**
- All F0-F3 work (tokens, riso utilities, theme toggle, search placeholder, post template, etc.).
- `_data/now.yml` — already has the 4-block structure from F0; F4 only changes how it's rendered.
- `_data/speaking.yml` — bios already there; F4 just wires copy buttons.
- `_data/cv.yml`, `_data/pillars.yml`, `_data/external_writing.yml`, `_data/socials.yml`.

---

## Decisions baked into this plan

- **Project "Case study" stamp**: uses `page.year` (e.g. "Case study · 2025") rather than a sequential index, since projects already declare their year in front matter. Cleaner, no risk of sequence drift.
- **Work domain filter**: anchor-based `:target`-style chips, matching the F3a writing pillar filter pattern. No JS.
- **Now blocks**: only render a block if its `items` array is non-empty (e.g. `speaking: []` in `_data/now.yml` skips the section).
- **Speaking copy buttons**: one button per bio. Markup uses the F0 `data-copy` + `data-copy-target` contract.
- **Contact "what I won't reply to"**: explicit but tactful — recruiter spam templates and vendor pitches without context. Acts as a soft spam filter.
- **404 humor**: dry, Riso-forward. Includes a sub-hero with a `riso-stamp` and a small set of useful links.

---

## Pre-flight

### Task 0: Confirm starting state

- [ ] **Step 1**: `docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace` — clean.
- [ ] **Step 2**: `git log --oneline -3` — top is `d5acce7 Merge pull request #5 from Amloii/claude/f3b-scaffolds`.
- [ ] **Step 3**: Capture baseline screenshots of `/work/`, `/work/in-a-few-words/` (or any project), `/speaking-press/`, `/now/`, `/about/`, `/contact/`, `/404.html`, plus the ES counterparts (`/es/trabajo/`, `/es/charlas-prensa/`, `/es/ahora/`, `/es/sobre/`, `/es/contacto/`). 12 screenshots total.
- [ ] **Step 4**: `git status` — clean.

---

## Task 1: i18n keys

**Files:** Modify `_data/i18n.yml`.

### Step 1: Append to `en.work`

Find `en.work` block. After existing `related_posts: Related writing` line, append:

```yaml
    case_study_label: "Case study"
    domain_filter_label: Filter by domain
    domain_filter_all: All domains
```

### Step 2: Append to `es.work`

Inside `es.work`:

```yaml
    case_study_label: "Caso de estudio"
    domain_filter_label: Filtrar por dominio
    domain_filter_all: Todos los dominios
```

### Step 3: Append to `en.now`

Inside `en.now` (after `updated: Last updated`):

```yaml
    block_building: Building
    block_reading: Reading
    block_writing: Writing
    block_speaking: Speaking
```

### Step 4: Append to `es.now`

Inside `es.now`:

```yaml
    block_building: En curso
    block_reading: Leyendo
    block_writing: Escribiendo
    block_speaking: Charlas
```

### Step 5: Add new top-level `contact` blocks

If `en.contact` and `es.contact` blocks don't exist, append them at the bottom of each language section. The `_data/i18n.yml` doesn't currently have a contact block.

Append inside `en` (alongside `home`, `cv`, `now`, etc.):

```yaml
  contact:
    microcopy_heading_yes: "What I respond to fastest"
    microcopy_heading_no: "What I won't reply to"
    yes_advisory: Advisory questions with concrete context
    yes_implementation: Implementation pitches with timelines
    yes_speaking: Speaking enquiries with audience size and topic
    yes_press: Press requests with deadlines
    no_recruiter: Recruiter templates without role specifics
    no_vendor: Vendor pitches without context
    no_unsolicited: Unsolicited cold proposals
```

Append inside `es`:

```yaml
  contact:
    microcopy_heading_yes: "A qué respondo rápido"
    microcopy_heading_no: "A qué no respondo"
    yes_advisory: Consultas de asesoría con contexto concreto
    yes_implementation: Propuestas de implementación con plazos
    yes_speaking: Solicitudes de charla con tamaño de audiencia y tema
    yes_press: Peticiones de prensa con deadline
    no_recruiter: Plantillas de recruiter sin detalles del rol
    no_vendor: Propuestas comerciales sin contexto
    no_unsolicited: Cold proposals no solicitadas
```

### Step 6: Append to `en` and `es` top-level a `error` block

Append inside `en`:

```yaml
  error:
    title_404: "404 · You drifted outside the retrieval index"
    lead_404: "The page you reached isn't in any feed I'm running. Let's get you back to a known anchor."
    stamp_404: "HTTP 404 · No route"
    link_home: Home port
    link_writing: Essay feed
    link_cv: CV
    link_contact: Send a note instead
```

Append inside `es`:

```yaml
  error:
    title_404: "404 · Has salido del índice de recuperación"
    lead_404: "La página a la que has llegado no está en ningún feed que esté corriendo. Te llevo a un ancla conocido."
    stamp_404: "HTTP 404 · Sin ruta"
    link_home: Puerto base
    link_writing: Feed de ensayos
    link_cv: Trayectoria
    link_contact: Enviar mensaje
```

### Step 7: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Clean expected.

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec ruby -ryaml -e "y = YAML.load_file('_data/i18n.yml'); puts y['en']['error']['stamp_404']; puts y['es']['contact']['microcopy_heading_yes']; puts y['en']['now']['block_building']"
```
Expected:
```
HTTP 404 · No route
A qué respondo rápido
Building
```

### Step 8: Commit

```bash
git add _data/i18n.yml
git commit -m "i18n(f4): add work/now/contact/error keys (EN + ES)"
```

---

## Task 2: F4 CSS

**Files:** Modify `assets/css/_components.scss`.

Append at the very end:

```scss
// Work — domain filter chips
.work-domain-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: var(--space-md);
  list-style: none;
  padding: 0;
}

.work-domain-filter a {
  display: inline-block;
  padding: 0.4rem 0.85rem;
  border: 1px solid color-mix(in srgb, var(--rule) 25%, transparent);
  border-radius: 999px;
  text-decoration: none;
  color: inherit;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.work-domain-filter a:hover {
  border-color: var(--accent);
  color: var(--accent);
}

// Work index — big riso-red numerals
.work-index .idx-row__num {
  color: var(--riso-red);
  text-shadow:
    1.5px 1px 0  color-mix(in srgb, var(--riso-red)  88%, transparent),
   -1.5px -1px 0 color-mix(in srgb, var(--riso-blue) 70%, transparent);
}

[data-theme="dark"] .work-index .idx-row__num {
  text-shadow:
    1.5px 1px 0  color-mix(in srgb, var(--riso-red)  78%, transparent),
   -1.5px -1px 0 color-mix(in srgb, var(--riso-blue) 60%, transparent);
}

// Project — header stamp + featured-metric headline
.project-stamp { margin-bottom: 0.75rem; }

.project-metric-headline {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.8vw, 1.9rem);
  font-weight: 700;
  line-height: 1.15;
  margin: 0.5rem 0 var(--space-md);
}

// Now — 4-block layout
.now-blocks {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-md);
}

@media (max-width: 700px) {
  .now-blocks { grid-template-columns: 1fr; }
}

.now-block {
  position: relative;
  padding: var(--space-md);
  border: 1px solid color-mix(in srgb, var(--rule) 14%, transparent);
  border-radius: var(--radius-sm);
  background: var(--paper);
}

.now-block__stamp {
  position: absolute;
  top: -0.65rem;
  left: var(--space-md);
}

.now-block:nth-child(1) .now-block__stamp { transform: rotate(-2.5deg); }
.now-block:nth-child(2) .now-block__stamp { transform: rotate(2deg); }
.now-block:nth-child(3) .now-block__stamp { transform: rotate(-1.5deg); }
.now-block:nth-child(4) .now-block__stamp { transform: rotate(3deg); }

.now-block__heading {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.4rem 0 0.6rem;
}

.now-block__items {
  list-style: disc;
  padding-left: 1.1rem;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ink);
}

.now-block__items li { margin-bottom: 0.4rem; }

// Contact — "what I respond to" / "what I won't" blocks
.contact-microcopy {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-block: var(--space-md);
}

@media (max-width: 700px) {
  .contact-microcopy { grid-template-columns: 1fr; }
}

.contact-microcopy__col { padding: var(--space-md); border-radius: var(--radius-sm); }
.contact-microcopy__col--yes { border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); background: color-mix(in srgb, var(--accent) 5%, var(--paper)); }
.contact-microcopy__col--no  { border: 1px solid color-mix(in srgb, var(--rule)   18%, transparent); background: var(--paper); }

.contact-microcopy__heading {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.contact-microcopy__col--yes .contact-microcopy__heading { color: var(--accent); }
.contact-microcopy__col--no  .contact-microcopy__heading { color: var(--muted); }

.contact-microcopy__list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
}

.contact-microcopy__list li { margin-bottom: 0.35rem; }

// Speaking — bio card with copy button
.speaking-bio-card {
  position: relative;
  padding: var(--space-md);
  border: 1px solid color-mix(in srgb, var(--rule) 16%, transparent);
  border-radius: var(--radius-sm);
  background: var(--paper);
  margin-bottom: var(--space-md);
}

.speaking-bio-card__heading {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 0.5rem;
}

.speaking-bio-card__copy-row {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-sm);
}

.speaking-bio-card pre {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  white-space: pre-wrap;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 1.5;
}

// Error 404 — Riso-forward dry humor
.error-404 {
  text-align: center;
  padding-block: var(--space-xl);
  min-height: 60vh;
  display: grid;
  align-content: center;
  gap: var(--space-md);
}

.error-404__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.error-404__lead {
  font-size: 1.15rem;
  max-width: 50ch;
  margin-inline: auto;
  color: var(--muted);
}

.error-404__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: var(--space-md) auto 0;
}

.error-404__links a {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--rule) 35%, transparent);
}

.error-404__links a:hover { color: var(--accent); border-bottom-color: var(--accent); }
```

### Step 2: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep -E '\.work-domain-filter|\.work-index \.idx-row__num|\.project-stamp|\.project-metric-headline|\.now-blocks|\.now-block__stamp|\.contact-microcopy|\.speaking-bio-card|\.error-404__title' _site/assets/css/main.css | head -10
```
Expected: matches for each.

### Step 3: Commit

```bash
git add assets/css/_components.scss
git commit -m "components(f4): add work filter, project stamp, now blocks, contact microcopy, speaking bio cards, 404 styles"
```

---

## Task 3: Work index (`_layouts/hub-work.html`)

**Files:** Modify `_layouts/hub-work.html`.

### Step 1: Replace the file

```html
---
layout: default
---

{% assign t = site.data.i18n[page.lang].work %}
{% assign list = site.projects | where: "lang", page.lang | sort: "year" | reverse %}

{% comment %}Collect unique domains for filter chips.{% endcomment %}
{% assign domains = '' %}
{% for proj in list %}
  {% unless domains contains proj.domain %}
    {% assign domains = domains | append: proj.domain | append: '|' %}
  {% endunless %}
{% endfor %}
{% assign domain_array = domains | split: '|' %}

<div class="container section">
  <header>
    <h1>{{ t.index_title }}</h1>
    <p class="lead">{{ t.index_desc }}</p>
  </header>

  <ul class="work-domain-filter no-print" aria-label="{{ t.domain_filter_label }}">
    <li><a href="#work-index">{{ t.domain_filter_all }}</a></li>
    {% for d in domain_array %}
      {% if d != '' %}
        {% assign anchor = d | downcase | replace: ' ', '-' | replace: '·', '' | replace: '/', '' | replace: '--', '-' %}
        <li><a href="#domain-{{ anchor }}">{{ d }}</a></li>
      {% endif %}
    {% endfor %}
  </ul>

  <div id="work-index" class="work-index" style="margin-top:2rem">
    {% for proj in list %}
      {% assign anchor = proj.domain | downcase | replace: ' ', '-' | replace: '·', '' | replace: '/', '' | replace: '--', '-' %}
      <a class="idx-row" href="{{ proj.url | relative_url }}" id="domain-{{ anchor }}">
        <span class="idx-row__num">{% assign idx = forloop.index %}{% if idx < 10 %}0{% endif %}{{ idx }}</span>
        <span>
          <span class="idx-row__title">{{ proj.title }}</span><br>
          <span style="opacity:.76;font-size:var(--fs-small)">{{ proj.summary }}</span>
          {% if proj.featured_metric %}
            <br><span style="font-family:var(--font-mono);font-size:0.82rem;color:var(--accent);margin-top:0.35rem;display:inline-block">{{ proj.featured_metric }}</span>
          {% endif %}
        </span>
        <span class="caps-label">{{ proj.domain }}</span>
        <span class="caps-label">{{ proj.year }}</span>
      </a>
    {% endfor %}
  </div>
</div>
```

The `id="domain-{anchor}"` lives on the `idx-row` (anchored to the FIRST project of each domain — when the user clicks a chip, the browser jumps to that project's row and subsequent same-domain rows naturally appear in scroll order). It's not perfectly precise (the chip jumps to the first match), but it's anchor-based and JS-free, matching the writing-pillar pattern.

### Step 2: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'work-domain-filter' _site/work/index.html
grep 'work-index' _site/work/index.html
grep 'work-domain-filter' _site/es/trabajo/index.html
```
All matches expected.

### Step 3: Commit

```bash
git add _layouts/hub-work.html
git commit -m "hub-work: domain filter chips + big riso-red numerals + featured_metric line"
```

---

## Task 4: Project page (`_layouts/project.html`)

**Files:** Modify `_layouts/project.html`.

### Step 1: Replace the file

```html
---
layout: default
---

{% include schema-project.html %}

{% assign lg = page.lang | default: 'en' %}
{% assign t = site.data.i18n[lg].work %}

<article class="container section">
  {% if page.hero_illustration %}
    <figure class="riso-frame" style="margin:0 0 1.75rem">
      <img src="{{ '/assets/svg/riso/' | append: page.hero_illustration | append: '.svg' | relative_url }}" alt="" width="480" height="240" loading="eager" decoding="async">
    </figure>
  {% endif %}

  <header>
    <p class="project-stamp"><span class="riso-stamp">{{ t.case_study_label }} · {{ page.year }}</span></p>
    <p class="caps-label">{{ page.domain }}</p>
    <h1>{{ page.title }}</h1>
    {% if page.summary %}
      <p class="lead" style="max-width:none">{{ page.summary }}</p>
    {% endif %}
    {% if page.featured_metric %}
      <p class="project-metric-headline"><span class="riso-double-print">{{ page.featured_metric }}</span></p>
    {% endif %}
  </header>

  <dl class="stack" style="margin-top:1.5rem;font-size:var(--fs-small)">
    {% if page.role %}<dt class="caps-label">{{ t.role }}</dt><dd>{{ page.role }}</dd>{% endif %}
    {% if page.stack %}<dt class="caps-label">{{ t.stack }}</dt><dd>{{ page.stack }}</dd>{% endif %}
  </dl>

  <hr class="hairline">

  <section>
    <h2>{{ t.context }}</h2>
    {{ page.context | markdownify }}
  </section>
  <section>
    <h2>{{ t.approach }}</h2>
    {{ page.approach | markdownify }}
  </section>
  <section>
    <h2>{{ t.outcomes }}</h2>
    {{ page.outcomes | markdownify }}
  </section>

  {% if page.links %}
    <section>
      <h2>{{ t.links }}</h2>
      <ul>
        {% for link in page.links %}
          <li><a href="{{ link.url }}">{{ link.label }}</a></li>
        {% endfor %}
      </ul>
    </section>
  {% endif %}

  {% if page.tags %}
    <ul class="chips" aria-label="tags">
      {% for tag in page.tags %}
        <li>{{ tag }}</li>
      {% endfor %}
    </ul>
  {% endif %}
</article>
```

Notable changes from the previous version:
- Added `<p class="project-stamp"><span class="riso-stamp">{{ t.case_study_label }} · {{ page.year }}</span></p>` at the top of the header.
- Domain moved to its own caps-label line below the stamp.
- `featured_metric` promoted from a `<dl>` row to a top-level `project-metric-headline` with `riso-double-print`.
- Removed the `featured_metric` from the `<dl>` (now top-level so it's prominent).

### Step 2: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'project-stamp' _site/work/in-a-few-words/index.html
grep 'project-metric-headline' _site/work/in-a-few-words/index.html
grep 'riso-double-print' _site/work/in-a-few-words/index.html
grep 'Caso de estudio' _site/es/trabajo/in-a-few-words/index.html
```
All matches expected (the ES variant has the localized "Caso de estudio" stamp text).

### Step 3: Commit

```bash
git add _layouts/project.html
git commit -m "project: add Riso case-study stamp + double-print featured metric headline"
```

---

## Task 5: Speaking layout (`_layouts/speaking.html`)

**Files:** Modify `_layouts/speaking.html`.

### Step 1: Replace the file

```html
---
layout: default
---

{% assign lg = page.lang | default: site.lang %}
{% assign sp = site.data.speaking %}
{% if lg == 'es' %}
  {% assign bio = sp.bios.es %}
  {% assign topics = sp.topics.es %}
  {% assign talks = sp.speaking_press.talks.es %}
{% else %}
  {% assign bio = sp.bios.en %}
  {% assign topics = sp.topics.en %}
  {% assign talks = sp.speaking_press.talks.en %}
{% endif %}
{% assign t = site.data.i18n[lg].speaking %}

<div class="container section stack">
  <header>
    <h1>{{ t.index_title }}</h1>
    <p class="lead">
      {% if lg == 'es' %}
        Bio descargable, temas sugeridos y kit mínimo para producción de eventos.
      {% else %}
        Speaker kit for briefings, panels, and technical keynotes — bios, topics, and assets.
      {% endif %}
    </p>
  </header>

  <section aria-labelledby="bios-heading">
    <h2 id="bios-heading" class="caps-label">Bios</h2>

    <article class="speaking-bio-card">
      <p class="speaking-bio-card__heading">{{ t.bio_short }} · ~50 words</p>
      <pre id="bio-short">{{ bio.fifty }}</pre>
      <div class="speaking-bio-card__copy-row no-print">
        <button type="button" class="btn btn--ghost btn--copy" data-copy data-copy-target="#bio-short">{{ t.copy }}</button>
      </div>
    </article>

    <article class="speaking-bio-card">
      <p class="speaking-bio-card__heading">{{ t.bio_medium }} · ~120 words</p>
      <pre id="bio-medium">{{ bio.one_twenty }}</pre>
      <div class="speaking-bio-card__copy-row no-print">
        <button type="button" class="btn btn--ghost btn--copy" data-copy data-copy-target="#bio-medium">{{ t.copy }}</button>
      </div>
    </article>

    <article class="speaking-bio-card">
      <p class="speaking-bio-card__heading">{{ t.bio_long }} · ~280 words</p>
      <pre id="bio-long">{{ bio.two_eighty }}</pre>
      <div class="speaking-bio-card__copy-row no-print">
        <button type="button" class="btn btn--ghost btn--copy" data-copy data-copy-target="#bio-long">{{ t.copy }}</button>
      </div>
    </article>
  </section>

  <section class="split">
    <div>
      <h2>{{ t.topics }}</h2>
      <ul>
        {% for topic in topics %}
          <li>{{ topic }}</li>
        {% endfor %}
      </ul>
    </div>
    <div>
      <h2>{{ t.booking }}</h2>
      <p><a class="btn btn--accent" href="{{ site.book_call_url }}">{{ site.data.i18n[lg].cv.book_call }}</a></p>
      <p><a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a></p>
    </div>
  </section>

  <section>
    <h2>{{ t.headshots }}</h2>
    <p class="caps-label" style="opacity:.75">{{ sp.assets.headshots.placeholder_note }}</p>
    <div class="split" style="margin-top:1rem">
      <figure class="newsletter-card">
        <img src="{{ sp.assets.headshots.square_placeholder | relative_url }}" width="320" height="320" alt="Headshot square placeholder" loading="lazy">
        <figcaption class="caps-label">Square</figcaption>
      </figure>
      <figure class="newsletter-card">
        <img src="{{ sp.assets.headshots.wide_placeholder | relative_url }}" width="480" height="270" alt="Headshot wide placeholder" loading="lazy">
        <figcaption class="caps-label">Horizontal</figcaption>
      </figure>
    </div>
    <p><a href="{{ sp.assets.logos.mark_svg | relative_url }}">Download mark (SVG)</a></p>
  </section>

  <section>
    <h2 class="caps-label">Talks / sessions</h2>
    <ul>
      {% for row in talks %}
        <li><strong>{{ row.title }}</strong> — {{ row.event }} · <em>{{ row.status }}</em></li>
      {% endfor %}
    </ul>
  </section>

  {{ content }}
</div>
```

Notable changes:
- Three bios are each in their own `.speaking-bio-card` with a heading + `<pre id="...">` + copy button.
- The F0 `data-copy` utility wires the buttons (no new JS).
- The previous `<pre>`-with-styles approach is gone (cleaner card).

### Step 2: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'speaking-bio-card' _site/speaking-press/index.html
grep -c 'data-copy-target=' _site/speaking-press/index.html
grep 'speaking-bio-card' _site/es/charlas-prensa/index.html
```
The count should be 3 (one button per bio).

### Step 3: Commit

```bash
git add _layouts/speaking.html
git commit -m "speaking: copyable bios via data-copy utility, card layout"
```

---

## Task 6: Now structured (4 blocks)

**Files:** Create `_includes/now-block.html`. Modify `now/index.md` and `es/ahora/index.md`.

### Step 1: Create `_includes/now-block.html`

```html
{%- comment -%}
  Single block on the Now page.
  Usage: {% include now-block.html key="building" stamp="N°1" %}
  Reads items from site.data.now[lg].blocks[key]; renders a card with a
  rotated stamp, localized heading, and bullet list. Skips if items is empty.
{%- endcomment -%}
{%- assign lg = page.lang | default: site.lang -%}
{%- assign tn = site.data.i18n[lg].now -%}
{%- assign items = site.data.now[lg].blocks[include.key] -%}
{%- if items and items.size > 0 -%}
{%- assign heading_key = 'block_' | append: include.key -%}
<section class="now-block">
  <span class="riso-stamp now-block__stamp">{{ include.stamp }}</span>
  <h2 class="now-block__heading">{{ tn[heading_key] }}</h2>
  <ul class="now-block__items">
    {%- for it in items -%}
      <li>{{ it | markdownify | strip }}</li>
    {%- endfor -%}
  </ul>
</section>
{%- endif -%}
```

The `markdownify | strip` lets the data file include inline markdown (`*emphasis*`, `[link](url)`) which renders correctly. The `strip` removes the wrapping `<p>` kramdown adds when given inline markdown.

Wait — `markdownify` on a single line of text wraps it in `<p>...</p>`. We're inside an `<li>`, so `<p>` inside `<li>` is technically valid HTML but messes with line-height. Use `strip_html` and accept that inline markdown in the data won't render. OR keep the `markdownify` and accept the extra `<p>` tag.

Decision: render WITHOUT markdownify. The data file currently has plain strings (no markdown). If user adds markdown, they should put it in a separate post — Now items stay simple bullets.

Updated include:

```html
{%- comment -%}
  Single block on the Now page.
  Usage: {% include now-block.html key="building" stamp="N°1" %}
{%- endcomment -%}
{%- assign lg = page.lang | default: site.lang -%}
{%- assign tn = site.data.i18n[lg].now -%}
{%- assign items = site.data.now[lg].blocks[include.key] -%}
{%- if items and items.size > 0 -%}
{%- assign heading_key = 'block_' | append: include.key -%}
<section class="now-block">
  <span class="riso-stamp now-block__stamp">{{ include.stamp }}</span>
  <h2 class="now-block__heading">{{ tn[heading_key] }}</h2>
  <ul class="now-block__items">
    {%- for it in items -%}
      <li>{{ it }}</li>
    {%- endfor -%}
  </ul>
</section>
{%- endif -%}
```

### Step 2: Replace `now/index.md`

```markdown
---
layout: page
lang: en
ref: now
title: Now
permalink: /now/
hide_footer: false
---

{% assign n = site.data.now.en %}

<p class="caps-label" style="margin-top:.5rem">Monthly snapshot · Last updated {{ n.updated }}</p>

<div class="now-blocks">
  {% include now-block.html key="building" stamp="N°1" %}
  {% include now-block.html key="reading"  stamp="N°2" %}
  {% include now-block.html key="writing"  stamp="N°3" %}
  {% include now-block.html key="speaking" stamp="N°4" %}
</div>
```

### Step 3: Replace `es/ahora/index.md`

```markdown
---
layout: page
lang: es
ref: now
title: Ahora
permalink: /es/ahora/
---

{% assign n = site.data.now.es %}

<p class="caps-label" style="margin-top:.5rem">Ritmo mensual · Última actualización {{ n.updated }}</p>

<div class="now-blocks">
  {% include now-block.html key="building" stamp="N°1" %}
  {% include now-block.html key="reading"  stamp="N°2" %}
  {% include now-block.html key="writing"  stamp="N°3" %}
  {% include now-block.html key="speaking" stamp="N°4" %}
</div>
```

### Step 4: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'now-blocks' _site/now/index.html
grep -c 'now-block__heading' _site/now/index.html
grep 'now-blocks' _site/es/ahora/index.html
grep -c 'now-block__heading' _site/es/ahora/index.html
```
The current `_data/now.yml` has 3 non-empty blocks (building, reading, writing) — the speaking block is `[]` so it's skipped. Both EN and ES counts should be 3.

### Step 5: Commit

```bash
git add _includes/now-block.html now/index.md es/ahora/index.md
git commit -m "now: 4-block structured layout with Riso stamps (Building/Reading/Writing/Speaking)"
```

---

## Task 7: About + Contact polish

**Files:** Modify `about.md`, `es/sobre.md`, `contact.md`, `es/contacto.md`. Create `_includes/contact-microcopy.html`.

### Step 1: Update `about.md` (EN) — append a methodology paragraph

Replace `about.md` with:

```markdown
---
layout: page
lang: en
ref: about
title: About
permalink: /about/
---

Daniel leads AI programmes where multimodal ingestion, disciplined orchestration and executive storytelling collide. His background spans Cajal neuroscience, national science columns, multilingual product leadership, fraud fighting, multimodal embeddings, reinforcement-flavoured recommenders, autonomous LLM fleets, plus years on stage sharpening delivery.

He believes **discursive clarity is part of infra**: if executives cannot articulate why a model behaves, nobody will defend it inside budget committees.

## Method

The throughline across rigs, recommenders, and agent fleets is the same: design experiments you can defend, define the eval contract before the build call, and treat memory as debt rather than helpful context. Method matters more than the substrate — it survives every stack rotation, and it's what executives actually pay for.
```

### Step 2: Update `es/sobre.md`

Replace with:

```markdown
---
layout: page
lang: es
ref: about
title: Sobre mí
permalink: /es/sobre/
---

Daniel dirige programas de IA donde la ingesta multimodal, la orquestación disciplinada y la narrativa ejecutiva se cruzan. Su trayectoria va desde la neurociencia en Cajal y columnas científicas en prensa nacional hasta liderazgo de producto multilingüe, antifraude, embeddings multimodales, recomendadores con sabor a refuerzo y flotas de LLMs autónomas — más años de tablas afilando la entrega.

Cree que **la claridad discursiva es parte de la infraestructura**: si los ejecutivos no pueden articular por qué un modelo se comporta como se comporta, nadie lo defenderá en los comités de presupuesto.

## Método

El hilo común entre los rigs de electrofisiología, los recomendadores y las flotas de agentes es el mismo: diseñar experimentos defendibles, definir el contrato de eval antes de la llamada de build, y tratar la memoria como deuda en lugar de contexto útil. El método importa más que el sustrato — sobrevive a cada rotación de stack y es lo que los ejecutivos realmente pagan.
```

### Step 3: Create `_includes/contact-microcopy.html`

```html
{%- assign lg = page.lang | default: site.lang -%}
{%- assign t = site.data.i18n[lg].contact -%}
<div class="contact-microcopy">
  <div class="contact-microcopy__col contact-microcopy__col--yes">
    <p class="contact-microcopy__heading">{{ t.microcopy_heading_yes }}</p>
    <ul class="contact-microcopy__list">
      <li>{{ t.yes_advisory }}</li>
      <li>{{ t.yes_implementation }}</li>
      <li>{{ t.yes_speaking }}</li>
      <li>{{ t.yes_press }}</li>
    </ul>
  </div>
  <div class="contact-microcopy__col contact-microcopy__col--no">
    <p class="contact-microcopy__heading">{{ t.microcopy_heading_no }}</p>
    <ul class="contact-microcopy__list">
      <li>{{ t.no_recruiter }}</li>
      <li>{{ t.no_vendor }}</li>
      <li>{{ t.no_unsolicited }}</li>
    </ul>
  </div>
</div>
```

### Step 4: Update `contact.md` (EN)

Replace with:

```markdown
---
layout: page
lang: en
ref: contact
title: Contact
permalink: /contact/
---

Need to reach me about **agent fleets**, **infra reviews**, **evaluator design**, or **speaking**? Drop a structured note:

{% include contact-microcopy.html %}

{% include contact-form.html name_label="Name" email_label="Email" message_label="Message" submit="Send message" note="Powered by Formspree — spam honeypot included. Prefer low-latency voice? Booking link below." %}

<p><a class="btn btn--accent" href="{{ site.book_call_url }}">{{ site.book_call_url }}</a></p>
```

### Step 5: Update `es/contacto.md`

Replace with:

```markdown
---
layout: page
lang: es
ref: contact
title: Contacto
permalink: /es/contacto/
---

¿Quieres hablar de **flotas de agentes**, **revisión de infra**, **diseño de evaluadores** o **charlas**? Deja un mensaje estructurado:

{% include contact-microcopy.html %}

{% include contact-form.html name_label="Nombre" email_label="Correo" message_label="Mensaje" submit="Enviar" note="Formspree gestiona spam + honeypot. Para llamadas rápidas: enlace de Cal.com debajo." %}

<p><a class="btn btn--accent" href="{{ site.book_call_url }}">{{ site.book_call_url }}</a></p>
```

### Step 6: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'Method' _site/about/index.html
grep 'Método' _site/es/sobre/index.html
grep 'contact-microcopy' _site/contact/index.html
grep 'contact-microcopy' _site/es/contacto/index.html
grep 'What I respond to fastest' _site/contact/index.html
grep 'A qué respondo rápido' _site/es/contacto/index.html
```
All matches expected.

### Step 7: Commit

```bash
git add about.md es/sobre.md contact.md es/contacto.md _includes/contact-microcopy.html
git commit -m "about+contact: methodology paragraph + 'what I respond to' microcopy block"
```

---

## Task 8: 404 redesign

**Files:** Modify `404.html`.

### Step 1: Replace `404.html`

```html
---
layout: default
permalink: /404.html
lang: en
ref: home
title: "404 · Page not found"
description: Lost in hyperspace retrieval index.
comments: false
---

{% assign t = site.data.i18n[page.lang].error %}

<div class="container">
  <div class="error-404">
    <p class="caps-label"><span class="riso-stamp">{{ t.stamp_404 }}</span></p>
    <h1 class="error-404__title"><span class="riso-double-print">{{ t.title_404 }}</span></h1>
    <p class="error-404__lead">{{ t.lead_404 }}</p>
    <ul class="error-404__links">
      <li>← <a href="{{ '/' | relative_url }}">{{ t.link_home }}</a></li>
      <li>→ <a href="{{ '/writing/' | relative_url }}">{{ t.link_writing }}</a></li>
      <li>→ <a href="{{ '/cv/' | relative_url }}">{{ t.link_cv }}</a></li>
      <li>↗ <a href="{{ '/contact/' | relative_url }}">{{ t.link_contact }}</a></li>
    </ul>
  </div>
</div>
```

GitHub Pages serves the EN 404 globally; ES users hitting an invalid `/es/...` URL still see the EN 404. Acceptable trade-off (GH Pages doesn't support locale-aware 404 routing without a custom plugin).

### Step 2: Build + verify

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'error-404__title' _site/404.html
grep 'You drifted outside the retrieval index' _site/404.html
grep 'riso-double-print' _site/404.html
grep 'riso-stamp' _site/404.html
```
All matches expected.

### Step 3: Commit

```bash
git add 404.html
git commit -m "404: Riso-forward redesign with stamp, double-print title, useful links"
```

---

## Task 9: Final QA + PR

- [ ] **Step 1**: Visual regression vs Task 0 baselines.
- [ ] **Step 2**: Dark-mode sweep on each F4 page.
- [ ] **Step 3**: Print preview spot-check on `/work/`, `/speaking-press/`, `/now/`.
- [ ] **Step 4**: Click each work-domain-filter chip — browser jumps to the first project of that domain.
- [ ] **Step 5**: Click each Speaking copy button — clipboard contains the bio, button shows "Copied" for ~2s.
- [ ] **Step 6**: Visit a non-existent URL like `/foo-bar/` — 404 page renders with Riso stamp + double-print title.
- [ ] **Step 7**: Mobile breakpoint check (~700 px) — Now blocks collapse to 1 col, contact microcopy 1 col, work index unchanged (already responsive).
- [ ] **Step 8**: Push + open PR (after user authorization).

```bash
git push -u origin claude/f4-pages
gh pr create --title "F4: Work / Speaking / Now / About / Contact / 404 (Riso forward)" ...
```

PR body content shipped at execution time.

---

## Self-review

- **Spec coverage** (§6.5–§6.10):
  - ✅ Work index with `idx-row` + big riso-red numerals + domain filter (Task 3).
  - ✅ Project page with `Case study N°YYYY` stamp + double-print metric headline (Task 4).
  - ✅ Speaking with copyable bios via `data-copy` (Task 5).
  - ✅ Now structured into 4 blocks with stamps (Task 6).
  - ✅ About with methodology paragraph (Task 7).
  - ✅ Contact with "what I respond to" / "what I won't" microcopy (Task 7).
  - ✅ 404 with Riso humor (Task 8).
- **Placeholder scan**: no TBDs.
- **Type/name consistency**: all new selectors / i18n keys cross-referenced.
- **Riso two-pace contract**: still holds — no `.cv-page` decorations broken.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Work-domain-filter anchors only target the FIRST project of a domain | Acceptable — same JS-free trade-off as the writing pillar filter. Subsequent projects in the domain appear in scroll order below. F5 polish could add real filter behavior if a use case emerges. |
| Contact i18n `error` and `contact` blocks didn't exist before | Task 1 adds them. If any other page references these keys before Task 1 runs, the build still succeeds (Liquid renders empty for missing keys). |
| 404 only renders EN copy globally | GH Pages limitation; acceptable. Could be addressed in F5 if user wants. |
| Speaking `<pre>` styles changed substantially — old "newsletter-card" border is gone | Intentional. The new card is cleaner. The bios are still inside `<pre>` so whitespace is preserved. |

---

## What's NOT in this phase

- F5: Pagefind search modal, OG image template, real giscus IDs, Formspree endpoint, real headshot integration, full ES copy audit, 404 ES locale routing (if pursued), Lighthouse 95+ pass, career-arc / hero illustration dark-mode color fix.
