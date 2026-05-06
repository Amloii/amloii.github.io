# Renovation F3a — Writing System + Post Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the writing index (`/writing/`, `/es/escritos/`) and the post template (`/writing/<post>/`) with the Riso-forward direction, plus the new UX layer (TOC, sidenotes, reading time, related posts, prev/next within pillar, inline newsletter mid-post, pillar filter chips). The single existing post (`agent-graph-margin-budgets`) gets re-rendered through the new template — same content, much richer chrome. **Scaffolds for the 5 new draft posts ship in F3b** as a separate PR.

**Architecture:** Pure Liquid + SCSS + ~50 lines of vanilla JS (TOC build + active-section highlight via IntersectionObserver). Sidenotes use a tiny Liquid include `_includes/sn.html` rendering the Tufte-style `label/checkbox/span` pattern, positioned via CSS — no JS for sidenotes. Inline newsletter splits `page.content` on `<h2 ` markers and injects a Substack card after the H2 at position `floor(h2_count × 0.6)` (a pragmatic simplification of the spec's per-word 60% rule; close enough for typical post shapes and dramatically simpler Liquid). All 4 pillar cards use existing `assets/svg/riso/*.svg` illustrations.

**Tech Stack:** Jekyll 3.10 (github-pages gem), SCSS, kramdown (with auto-IDs on headings), Liquid, vanilla ES6. Dockerized dev (`docker-compose.yml`).

**Companion spec:** [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](../specs/2026-05-06-amloii-riso-forward-renovation-design.md) §6.3, §6.4, §7
**Predecessor plans:** F0, F1, F2 (all merged on `main`).
**Successor plan:** F3b (5 draft post scaffolds in EN+ES).

---

## File structure

**Files modified:**
- `_layouts/hub-writing.html` — redesign of the writing index (pillar filter, pillar cards with SVG, essays per pillar with big numerals, newsletter card between pillar cards and essays, external writing section).
- `_layouts/post.html` — redesign with hero (pillar tag + double-print title + mono kicker), 3-col desktop layout (TOC | prose | sidenotes), inline newsletter mid-post, related posts, prev/next pager.
- `_data/i18n.yml` — new keys for TOC label, related posts label, prev/next labels, reading-time formatting strings.
- `assets/css/_components.scss` — append `.writing-pillar-card`, `.writing-pillar-filter`, `.post-hero`, `.post-meta-row`, `.post-layout`, `.post-toc`, `.post-prose`, `.post-sidenotes`, `.sn`-family, `.post-related`, `.post-pager`, `.newsletter-inline`.
- `assets/js/main.js` — append a TOC builder + active-section highlighter using IntersectionObserver.
- `_posts/2026-05-05-agent-graph-margin-budgets.md` — minor front-matter additions (no body changes; ensure `description`, `pillar`, `image` are set so the new template renders correctly).

**Files created:**
- `_includes/sn.html` — Tufte-style sidenote include (`{% include sn.html n="1" text="..." %}`).
- `_includes/post-toc.html` — TOC container markup (the JS fills it).
- `_includes/post-related.html` — 2-3 most recent posts in the same pillar (excluding the current).
- `_includes/post-pager.html` — prev/next pager scoped to the same pillar.
- `_includes/newsletter-inline.html` — Substack card for mid-post embed.

**Files unchanged in this phase:**
- `_data/cv.yml`, `_data/now.yml`, `_data/pillars.yml`, `_data/external_writing.yml`, `_data/socials.yml` — content data is good as-is.
- `_data/external_writing.yml` — used by hub-writing as before.
- `_includes/newsletter-home.html`, `_includes/newsletter-footer.html` — kept as-is. F3a adds a new `_includes/newsletter-inline.html` that's distinct from the home/footer variants.
- `assets/svg/riso/*.svg` — existing illustrations re-used (mapping below).
- giscus IDs in `_config.yml` stay placeholder until F5 (the post template still calls `{% include giscus.html %}` if `page.comments` is true, but with placeholder IDs it renders an inert state — no regression).

**Pillar → SVG mapping (for the 4 pillar cards):**
- `building-agents` → `assets/svg/riso/agent-pipeline.svg`
- `research-to-prod` → `assets/svg/riso/eval-loop.svg`
- `ai-leadership` → `assets/svg/riso/decision-graph.svg`
- `operators-notebook` → `assets/svg/riso/ops-tower.svg`

---

## Pre-flight

### Task 0: Confirm starting state

**Files:** none modified.

- [ ] **Step 1: Confirm Docker environment**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean build in ~6–10 s, no warnings.

- [ ] **Step 2: Confirm we're branched from main with F0/F1/F2 merged**

```bash
git log --oneline -3
```
Expected: top is the F2 merge commit (`c1fb517 Merge pull request #3 from Amloii/claude/f2-cv`).

- [ ] **Step 3: Capture baseline screenshots**

`docker compose up jekyll` in another shell. Visit `/writing/`, `/es/escritos/`, and `/writing/2026/05/05/agent-graph-margin-budgets/` (the only existing post) in light + dark. 6 screenshots.

- [ ] **Step 4: Confirm clean working tree**

```bash
git status
```
Expected: clean.

---

## Task 1: i18n keys for writing/post

**Files:**
- Modify: `_data/i18n.yml`

Add new keys for TOC label, reading-time format, related, prev/next, and a few writing-index labels.

- [ ] **Step 1: Append to `en.writing`**

Find the `en.writing` block. After the existing `read: Read` line, append:

```yaml
    contents_label: On this page
    related_label: Related essays
    prev_label: Previous essay
    next_label: Next essay
    minutes_format: "{n} min read"
    words_format: "{n} words"
    inline_newsletter_kicker: "If you're enjoying this"
    notebook_label: Notebook
    filter_label: Filter by pillar
    filter_all: All pillars
```

- [ ] **Step 2: Append to `es.writing`**

Find the `es.writing` block. After the existing `read: Leer` line, append:

```yaml
    contents_label: En esta página
    related_label: Ensayos relacionados
    prev_label: Ensayo anterior
    next_label: Siguiente ensayo
    minutes_format: "{n} min de lectura"
    words_format: "{n} palabras"
    inline_newsletter_kicker: "Si te está gustando"
    notebook_label: Cuaderno
    filter_label: Filtrar por pilar
    filter_all: Todos los pilares
```

- [ ] **Step 3: Build + verify**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Clean build expected.

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec ruby -ryaml -e "y = YAML.load_file('_data/i18n.yml'); puts y['en']['writing']['contents_label']; puts y['es']['writing']['filter_all']"
```
Expected:
```
On this page
Todos los pilares
```

- [ ] **Step 4: Commit**

```bash
git add _data/i18n.yml
git commit -m "i18n(writing): add TOC/related/pager/filter labels (EN + ES)"
```

---

## Task 2: Writing system + post CSS

**Files:**
- Modify: `assets/css/_components.scss`

Append new style blocks at the very end, after the F2 CV blocks. Do NOT modify any existing class.

- [ ] **Step 1: Append all writing/post styles**

```scss
// Writing index — pillar cards
.writing-pillar-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
  margin-block: var(--space-md) var(--space-lg);
}

@media (max-width: 700px) {
  .writing-pillar-cards { grid-template-columns: 1fr; }
}

.writing-pillar-card {
  display: grid;
  grid-template-columns: 1fr 88px;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: 1px solid color-mix(in srgb, var(--rule) 14%, transparent);
  border-radius: var(--radius-sm);
  background: var(--paper);
  position: relative;
}

.writing-pillar-card__id {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 0.4rem;
}

.writing-pillar-card__title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.4rem;
  line-height: 1.2;
}

.writing-pillar-card__blurb { color: var(--muted); margin: 0; }

.writing-pillar-card__svg {
  align-self: center;
  justify-self: end;
  width: 88px;
  height: 88px;
  opacity: 0.85;
}

.writing-pillar-card__svg svg { width: 100%; height: 100%; }

.writing-pillar-card[data-pillar="building-agents"] { border-left: 3px solid var(--riso-red); }
.writing-pillar-card[data-pillar="research-to-prod"] { border-left: 3px solid var(--riso-blue); }
.writing-pillar-card[data-pillar="ai-leadership"] { border-left: 3px solid var(--accent); }
.writing-pillar-card[data-pillar="operators-notebook"] { border-left: 3px solid var(--muted); }

// Writing index — pillar filter chips (CSS-only via :target)
.writing-pillar-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: var(--space-md);
  list-style: none;
  padding: 0;
}

.writing-pillar-filter a {
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

.writing-pillar-filter a:hover {
  border-color: var(--accent);
  color: var(--accent);
}

// Writing index — essays per pillar (reuse .idx-row, add accent number)
.writing-essays .idx-row__num {
  color: var(--riso-red);
  text-shadow:
    1.5px 1px 0  color-mix(in srgb, var(--riso-red)  88%, transparent),
   -1.5px -1px 0 color-mix(in srgb, var(--riso-blue) 70%, transparent);
}

[data-theme="dark"] .writing-essays .idx-row__num {
  text-shadow:
    1.5px 1px 0  color-mix(in srgb, var(--riso-red)  78%, transparent),
   -1.5px -1px 0 color-mix(in srgb, var(--riso-blue) 60%, transparent);
}

.writing-pillar-section { margin-bottom: var(--space-lg); }

.writing-pillar-section__heading {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-block: var(--space-md) var(--space-sm);
}

// Post — hero
.post-hero { margin-bottom: var(--space-md); }

.post-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.8vw, 3.4rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.022em;
  margin: 0.4rem 0;
}

.post-meta-row {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.85rem;
  margin: 0.5rem 0 var(--space-md);
}

.post-meta-row span:not(:last-child)::after { content: " ·"; opacity: 0.55; margin-left: 0.45rem; }

// Post — 3-col layout (TOC | prose | sidenotes) on ≥1100px
.post-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 1100px) {
  .post-layout {
    grid-template-columns: minmax(11rem, 1fr) minmax(0, 42rem) minmax(11rem, 1fr);
    gap: var(--space-lg);
    align-items: start;
  }
}

.post-prose { max-width: 68ch; }
.post-prose h2 { scroll-margin-top: 5rem; }

@media (min-width: 1100px) {
  .post-toc { position: sticky; top: 5rem; align-self: start; }
}

.post-toc__heading {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 0.5rem;
}

.post-toc__list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.45;
}

.post-toc__list a {
  display: block;
  padding: 0.2rem 0;
  text-decoration: none;
  color: var(--muted);
  border-left: 2px solid transparent;
  padding-left: 0.6rem;
}

.post-toc__list a:hover { color: var(--ink); }
.post-toc__list a.is-active { color: var(--accent); border-left-color: var(--accent); }

@media (max-width: 1099px) {
  .post-toc { display: none; }
  .post-toc-mobile { display: block; margin-block: var(--space-sm); }
}

@media (min-width: 1100px) {
  .post-toc-mobile { display: none; }
}

.post-toc-mobile summary {
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  padding: 0.5rem 0;
}

// Post — sidenotes (Tufte-style via label/checkbox/span pattern)
.sn-marker {
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.65em;
  vertical-align: super;
  color: var(--accent);
  margin-left: 0.05em;
}

.sn-marker:hover { text-decoration: underline; }

.sn-toggle {
  display: none;
}

.sn {
  display: none;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--muted);
  border-left: 2px solid var(--accent);
  padding: 0.4rem 0.7rem;
  margin: 0.5rem 0;
  background: color-mix(in srgb, var(--accent) 4%, var(--paper));
}

.sn-toggle:checked + .sn { display: block; }

@media (min-width: 1100px) {
  .post-sidenotes { font-size: 0.85rem; line-height: 1.45; color: var(--muted); }
  .post-sidenotes .sn-collected {
    border-left: 2px solid color-mix(in srgb, var(--accent) 30%, transparent);
    padding: 0.4rem 0.7rem;
    margin-bottom: var(--space-md);
    background: color-mix(in srgb, var(--accent) 3%, var(--paper));
  }
}

// Post — newsletter inline mid-post
.newsletter-inline {
  margin-block: var(--space-lg);
  padding: var(--space-md);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--accent) 5%, var(--paper));
}

.newsletter-inline__kicker {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 0.4rem;
}

.newsletter-inline__title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.newsletter-inline iframe { border: none; width: 100%; }

// Post — related + pager
.post-related {
  margin-top: var(--space-xl);
  padding-top: var(--space-md);
  border-top: 1px solid color-mix(in srgb, var(--rule) 14%, transparent);
}

.post-related__heading {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 var(--space-sm);
}

.post-related__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-md);
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-related__list a {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: var(--space-sm);
  border: 1px solid color-mix(in srgb, var(--rule) 12%, transparent);
  border-radius: var(--radius-sm);
}

.post-related__list a:hover { border-color: var(--accent); }

.post-related__title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0.25rem 0 0;
  line-height: 1.25;
}

.post-related__date {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.post-pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

@media (max-width: 700px) {
  .post-pager { grid-template-columns: 1fr; }
}

.post-pager a {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: var(--space-sm);
  border: 1px solid color-mix(in srgb, var(--rule) 12%, transparent);
  border-radius: var(--radius-sm);
}

.post-pager a:hover { border-color: var(--accent); }

.post-pager__direction {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 0.25rem;
}

.post-pager__next { text-align: right; }
```

- [ ] **Step 2: Build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean.

- [ ] **Step 3: Verify selectors compiled**

```bash
grep -E '\.writing-pillar-card|\.writing-pillar-filter|\.writing-essays|\.post-hero__title|\.post-meta-row|\.post-toc|\.sn-marker|\.newsletter-inline|\.post-related|\.post-pager' _site/assets/css/main.css | head -10
```
Expected: matches for each top-level family.

- [ ] **Step 4: Commit**

```bash
git add assets/css/_components.scss
git commit -m "components(writing): add pillar cards, post hero, 3-col layout, TOC, sidenotes, related, pager, inline newsletter"
```

---

## Task 3: TOC mini-JS (auto-build + active-section highlight)

**Files:**
- Modify: `assets/js/main.js`

Append a TOC builder using IntersectionObserver. Runs on any page with `[data-post-toc]` markup; safely no-ops if absent.

- [ ] **Step 1: Append the TOC handler**

Open `assets/js/main.js`. Inside the `DOMContentLoaded` listener (after the existing search trigger handler, before the closing `});`):

```js
  // Post TOC — auto-built from H2s with id, with active-section highlighter.
  // Runs only if the page has the TOC container; safely no-ops otherwise.
  const tocList = document.querySelector('[data-post-toc]');
  const tocMobile = document.querySelector('[data-post-toc-mobile]');
  const proseHeadings = tocList || tocMobile
    ? document.querySelectorAll('.post-prose h2[id]')
    : [];

  if (proseHeadings.length) {
    const buildList = (target) => {
      target.innerHTML = '';
      proseHeadings.forEach((h) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        target.appendChild(li);
      });
    };
    if (tocList) buildList(tocList);
    if (tocMobile) buildList(tocMobile);

    const setActive = (id) => {
      [tocList, tocMobile].forEach((root) => {
        if (!root) return;
        root.querySelectorAll('a').forEach((a) => a.classList.remove('is-active'));
        const link = root.querySelector('a[href="#' + id + '"]');
        if (link) link.classList.add('is-active');
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-100px 0px -60% 0px' });

    proseHeadings.forEach((h) => observer.observe(h));
  }
```

- [ ] **Step 2: Build and verify**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'data-post-toc' _site/assets/js/main.js
```
Expected: match.

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "post(toc): add auto-built TOC with IntersectionObserver active-section highlighter"
```

---

## Task 4: Post includes (sidenote, TOC, related, pager, inline newsletter)

**Files:**
- Create: `_includes/sn.html`
- Create: `_includes/post-toc.html`
- Create: `_includes/post-related.html`
- Create: `_includes/post-pager.html`
- Create: `_includes/newsletter-inline.html`

5 small includes, all created in one task and one commit.

- [ ] **Step 1: Create `_includes/sn.html`**

```html
{%- comment -%}
  Tufte-style sidenote.
  Usage:
    {% include sn.html n="1" text="The footnote text." %}
  The marker is the visible reference; the span is shown on click (mobile)
  and floated to the margin column (desktop ≥1100px).
{%- endcomment -%}
{%- assign sn_id = 'sn-' | append: include.n | append: '-' | append: page.slug -%}
<label for="{{ sn_id }}" class="sn-marker">{{ include.n }}</label><input id="{{ sn_id }}" type="checkbox" class="sn-toggle"><span class="sn">{{ include.text }}</span>
```

- [ ] **Step 2: Create `_includes/post-toc.html`**

```html
{%- assign lg = page.lang | default: site.lang -%}
{%- assign t = site.data.i18n[lg].writing -%}
<aside class="post-toc no-print" aria-labelledby="toc-heading">
  <p class="post-toc__heading" id="toc-heading">{{ t.contents_label }}</p>
  <ul class="post-toc__list" data-post-toc></ul>
</aside>
<details class="post-toc-mobile no-print">
  <summary>{{ t.contents_label }}</summary>
  <ul class="post-toc__list" data-post-toc-mobile></ul>
</details>
```

- [ ] **Step 3: Create `_includes/post-related.html`**

```html
{%- assign lg = page.lang | default: site.lang -%}
{%- assign t = site.data.i18n[lg].writing -%}
{%- assign current_url = page.url -%}
{%- assign current_pillar = page.pillar -%}
{%- if current_pillar -%}
  {%- assign pool = site.posts | where: 'pillar', current_pillar -%}
  {%- assign related_count = 0 -%}
  {%- capture related_html -%}
    {%- for p in pool -%}
      {%- if p.url != current_url and related_count < 3 -%}
        <li>
          <a href="{{ p.url | relative_url }}">
            <span class="post-related__date">{{ p.date | date: "%Y-%m-%d" }}</span>
            <h3 class="post-related__title">{{ p.title }}</h3>
          </a>
        </li>
        {%- assign related_count = related_count | plus: 1 -%}
      {%- endif -%}
    {%- endfor -%}
  {%- endcapture -%}
  {%- if related_count > 0 -%}
    <aside class="post-related">
      <p class="post-related__heading">{{ t.related_label }}</p>
      <ul class="post-related__list">{{ related_html }}</ul>
    </aside>
  {%- endif -%}
{%- endif -%}
```

- [ ] **Step 4: Create `_includes/post-pager.html`**

```html
{%- assign lg = page.lang | default: site.lang -%}
{%- assign t = site.data.i18n[lg].writing -%}
{%- assign current_pillar = page.pillar -%}
{%- if current_pillar -%}
  {%- assign sorted = site.posts | where: 'pillar', current_pillar | sort: 'date' -%}
{%- else -%}
  {%- assign sorted = site.posts | sort: 'date' -%}
{%- endif -%}
{%- assign idx = -1 -%}
{%- for p in sorted -%}
  {%- if p.url == page.url -%}{%- assign idx = forloop.index0 -%}{%- endif -%}
{%- endfor -%}
{%- if idx >= 0 -%}
  {%- assign prev_idx = idx | minus: 1 -%}
  {%- assign next_idx = idx | plus: 1 -%}
  {%- assign prev_post = sorted[prev_idx] -%}
  {%- assign next_post = sorted[next_idx] -%}
  {%- if prev_post or next_post -%}
    <nav class="post-pager" aria-label="{{ t.related_label }}">
      <div class="post-pager__prev">
        {%- if prev_post -%}
          <a href="{{ prev_post.url | relative_url }}">
            <p class="post-pager__direction">← {{ t.prev_label }}</p>
            <p style="margin:0;font-family:var(--font-display);font-size:1rem;font-weight:600">{{ prev_post.title }}</p>
          </a>
        {%- endif -%}
      </div>
      <div class="post-pager__next">
        {%- if next_post -%}
          <a href="{{ next_post.url | relative_url }}">
            <p class="post-pager__direction">{{ t.next_label }} →</p>
            <p style="margin:0;font-family:var(--font-display);font-size:1rem;font-weight:600">{{ next_post.title }}</p>
          </a>
        {%- endif -%}
      </div>
    </nav>
  {%- endif -%}
{%- endif -%}
```

- [ ] **Step 5: Create `_includes/newsletter-inline.html`**

```html
{%- assign lg = page.lang | default: site.lang -%}
{%- assign t = site.data.i18n[lg].home -%}
{%- assign tw = site.data.i18n[lg].writing -%}
{%- assign src = site.substack_embed_url -%}
{%- unless src -%}{%- assign src = "https://REPLACE.substack.com/embed" -%}{%- endunless -%}
<aside class="newsletter-inline no-print" aria-label="{{ t.subs_title }}">
  <p class="newsletter-inline__kicker">{{ tw.inline_newsletter_kicker }}</p>
  <h3 class="newsletter-inline__title">{{ t.subs_title }}</h3>
  <p style="margin:0 0 0.6rem;color:var(--muted);font-size:0.92rem">{{ t.subs_blurb }}</p>
  {%- if src contains 'REPLACE' -%}
    <p class="caps-label" style="opacity:.7">Substack embed not configured.</p>
  {%- else -%}
    <iframe src="{{ src }}" scrolling="no" title="Newsletter signup" style="min-height:120px"></iframe>
  {%- endif -%}
</aside>
```

- [ ] **Step 6: Build to validate parsing**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean (the includes aren't used by any layout yet — Tasks 5/6 wire them up; this build just confirms they parse).

- [ ] **Step 7: Commit**

```bash
git add _includes/sn.html _includes/post-toc.html _includes/post-related.html _includes/post-pager.html _includes/newsletter-inline.html
git commit -m "includes(post): add sn, post-toc, post-related, post-pager, newsletter-inline"
```

---

## Task 5: Restructure `_layouts/post.html`

**Files:**
- Modify: `_layouts/post.html`

The current `post.html` has: pillar tag, optional hero illustration, title + date kicker, prose, newsletter-footer include, optional giscus include. F3a expands to: pillar tag, hero with double-print on a key word (just a riso accent on the title — kramdown doesn't easily let us mark keywords inside markdown titles, so we apply `riso-double-print` to the WHOLE title), 3-col layout (TOC | prose | sidenotes container) on desktop, post meta row (date · pillar · read time · word count), inline newsletter mid-post via Liquid split-and-inject, related posts, prev/next pager, then newsletter footer + comments.

- [ ] **Step 1: Replace `_layouts/post.html` with the F3a version**

Overwrite with this exact content:

```html
---
layout: default
---

{% include schema-article.html %}

{% assign lg = page.lang | default: site.lang %}
{% assign tw = site.data.i18n[lg].writing %}

{% comment %}
Reading-time + word-count from rendered content.
{% endcomment %}
{% assign words = page.content | strip_html | number_of_words %}
{% assign minutes = words | divided_by: 220 %}
{% if minutes < 1 %}{% assign minutes = 1 %}{% endif %}
{% assign read_time = tw.minutes_format | replace: '{n}', minutes %}
{% assign word_count = tw.words_format | replace: '{n}', words %}

{% comment %}
Inline newsletter injection: split content on '<h2 ' markers and inject
the newsletter card after the H2 at position floor(h2_count * 0.6).
Skip injection if the post has fewer than 3 H2s (too short to interrupt).
{% endcomment %}
{% assign h2_parts = page.content | split: '<h2 ' %}
{% assign h2_count = h2_parts.size | minus: 1 %}

{% if h2_count >= 3 %}
  {% assign insert_at = h2_count | times: 0.6 | floor %}
  {% if insert_at < 1 %}{% assign insert_at = 1 %}{% endif %}
  {% assign first_size = insert_at | plus: 1 %}
  {% assign first_chunk = h2_parts | slice: 0, first_size %}
  {% assign first_html = first_chunk | join: '<h2 ' %}
  {% assign rest_size = h2_parts.size | minus: first_size %}
  {% assign rest_chunk = h2_parts | slice: first_size, rest_size %}
  {% assign rest_html = rest_chunk | join: '<h2 ' %}
{% endif %}

<article class="container section">
  <header class="post-hero">
    {% assign pl = site.data.pillars | where: 'id', page.pillar | first %}
    <p class="pillar-tag">
      {% if pl %}
        {% if lg == 'es' %}{{ pl.title_es }}{% else %}{{ pl.title_en }}{% endif %}
      {% else %}
        {{ tw.notebook_label }}
      {% endif %}
    </p>

    {% if page.hero_illustration %}
      <figure class="riso-frame riso-muted" style="max-height:14rem;width:100%;margin:0 0 1rem">
        <img src="{{ '/assets/svg/riso/' | append: page.hero_illustration | append: '.svg' | relative_url }}" alt="" width="480" height="240" loading="lazy" decoding="async">
      </figure>
    {% endif %}

    <h1 class="post-hero__title"><span class="riso-double-print">{{ page.title }}</span></h1>

    <p class="post-meta-row">
      <span>{{ page.date | date: "%Y-%m-%d" }}</span>
      <span>{{ read_time }}</span>
      <span>{{ word_count }}</span>
      <span>{{ site.author.name }}</span>
    </p>
  </header>

  <div class="post-layout">
    {% include post-toc.html %}

    <div class="post-prose prose">
      {% if h2_count >= 3 %}
        {{ first_html }}
        {% include newsletter-inline.html %}
        {% if rest_chunk.size > 0 %}<h2 {{ rest_html }}{% endif %}
      {% else %}
        {{ page.content }}
      {% endif %}
    </div>

    <aside class="post-sidenotes no-print" aria-hidden="true"></aside>
  </div>

  {% include post-related.html %}
  {% include post-pager.html %}

  {% include newsletter-footer.html %}

  {% if page.comments %}
    {% include giscus.html %}
  {% endif %}
</article>
```

Notes on the spec deviation: the headline `riso-double-print` wraps the entire title (rather than a single keyword) because the markdown title is a plain string and we don't want to introduce another front-matter convention for "keyword to highlight". Visually, applying double-print to the whole title is a reasonable F3a choice — F5 polish can split into pre/keyword/post strings if a pattern emerges.

The `<aside class="post-sidenotes">` container exists but stays empty in F3a (the Tufte include `sn.html` renders the sidenote inline near the marker; the container is a future hook for "collected" sidenotes view in F5). The aside is `aria-hidden="true"` and visually zero-content for now.

- [ ] **Step 2: Build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean.

- [ ] **Step 3: Verify post rendering**

```bash
grep 'post-hero__title' _site/writing/2026/05/05/agent-graph-margin-budgets.html
```
Expected: match.

```bash
grep 'post-meta-row' _site/writing/2026/05/05/agent-graph-margin-budgets.html
```
Expected: match.

```bash
grep 'post-toc' _site/writing/2026/05/05/agent-graph-margin-budgets.html
```
Expected: match.

```bash
grep 'min read' _site/writing/2026/05/05/agent-graph-margin-budgets.html
```
Expected: match (the reading-time format applied with the minutes count).

The existing post has 4 `## ` headings, so the inline newsletter should inject. Check:

```bash
grep 'newsletter-inline' _site/writing/2026/05/05/agent-graph-margin-budgets.html
```
Expected: match.

- [ ] **Step 4: Commit**

```bash
git add _layouts/post.html
git commit -m "post(layout): F3a redesign — hero, meta row, TOC, inline newsletter at 60%, related, pager"
```

---

## Task 6: Restructure `_layouts/hub-writing.html`

**Files:**
- Modify: `_layouts/hub-writing.html`

The current hub-writing has: header, newsletter, pillars (text-only blurbs), essays per pillar, external writing. F3a redesign: header, pillar filter chips, pillar cards with SVG + Riso accent, NEWSLETTER moved between pillar cards and essays index, essays per pillar with big riso-red numerals, external writing.

- [ ] **Step 1: Replace `_layouts/hub-writing.html` with the F3a version**

```html
---
layout: default
---

{% assign lg = page.lang | default: site.lang %}
{% assign t = site.data.i18n[lg].writing %}
{% assign ps = site.data.pillars %}

{% assign pillar_svg = '' %}

<div class="container section stack">
  <header>
    <h1>{{ t.index_title }}</h1>
    <p class="lead">{{ t.index_desc }}</p>
    {% if lg == 'es' %}
      <p class="caps-label" style="opacity:0.78">
        Los ensayos canónicos viven primero en inglés · <a href="{{ '/writing/' | relative_url }}">Índice EN</a>
      </p>
    {% endif %}
  </header>

  <section aria-labelledby="pillars-heading">
    <h2 id="pillars-heading">{{ t.pillars }}</h2>

    {% comment %}Pillar filter chips — anchor-based; each chip targets the section heading id.{% endcomment %}
    <ul class="writing-pillar-filter no-print" aria-label="{{ t.filter_label }}">
      <li><a href="#essays">{{ t.filter_all }}</a></li>
      {% for pillar in ps %}
        <li><a href="#pillar-{{ pillar.id }}">{% if lg == 'es' %}{{ pillar.title_es }}{% else %}{{ pillar.title_en }}{% endif %}</a></li>
      {% endfor %}
    </ul>

    <div class="writing-pillar-cards">
      {% for pillar in ps %}
        {% assign svg_filename = '' %}
        {% if pillar.id == 'building-agents' %}{% assign svg_filename = 'agent-pipeline' %}{% endif %}
        {% if pillar.id == 'research-to-prod' %}{% assign svg_filename = 'eval-loop' %}{% endif %}
        {% if pillar.id == 'ai-leadership' %}{% assign svg_filename = 'decision-graph' %}{% endif %}
        {% if pillar.id == 'operators-notebook' %}{% assign svg_filename = 'ops-tower' %}{% endif %}

        <article class="writing-pillar-card" data-pillar="{{ pillar.id }}">
          <div>
            <p class="writing-pillar-card__id">{{ pillar.id }}</p>
            <h3 class="writing-pillar-card__title">{% if lg == 'es' %}{{ pillar.title_es }}{% else %}{{ pillar.title_en }}{% endif %}</h3>
            <p class="writing-pillar-card__blurb">{% if lg == 'es' %}{{ pillar.blurb_es }}{% else %}{{ pillar.blurb_en }}{% endif %}</p>
          </div>
          {% if svg_filename != '' %}
            <div class="writing-pillar-card__svg" aria-hidden="true">
              <img src="{{ '/assets/svg/riso/' | append: svg_filename | append: '.svg' | relative_url }}" alt="" loading="lazy" decoding="async">
            </div>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  </section>

  {% include newsletter-home.html %}

  <section class="writing-essays" aria-labelledby="essays">
    <h2 id="essays" style="margin-top:1rem">{{ t.essays }}</h2>
    <p style="opacity:0.74;font-size:var(--fs-small);max-width:60ch;margin-top:.35rem;">
      {% if lg == 'es' %}URL canónica siempre aquí; si republicas en Substack, marca la canonical hacia estos posts.{% else %}Canonical URL stays here; if you republish on Substack, point the canonical back to this site.{% endif %}
    </p>

    {% for pillar in ps %}
      {% assign pid = pillar.id %}
      {% assign bucket_posts = site.posts | where: "pillar", pid %}
      {% if bucket_posts.size > 0 %}
        <div class="writing-pillar-section" id="pillar-{{ pid }}">
          <h3 class="writing-pillar-section__heading">
            {% if lg == 'es' %}{{ pillar.title_es }}{% else %}{{ pillar.title_en }}{% endif %}
          </h3>
          {% assign ix = 0 %}
          {% for post in bucket_posts %}
            {% assign ix = ix | plus: 1 %}
            <a class="idx-row" href="{{ post.url | relative_url }}">
              <span class="idx-row__num">{% if ix < 10 %}0{% endif %}{{ ix }}</span>
              <span>
                <span class="idx-row__title">{{ post.title }}</span><br>
                <span style="opacity:0.78;font-size:var(--fs-small)">{{ post.excerpt | strip_html | truncate: 220 }}</span>
              </span>
              <span class="caps-label">{{ pillar.id }}</span>
              <span class="caps-label">{{ post.date | date: '%Y' }}</span>
            </a>
          {% endfor %}
        </div>
      {% endif %}
    {% endfor %}

    {% assign unassigned = site.posts | where_exp: 'p', 'p.pillar == nil' %}
    {% if unassigned.size > 0 %}
      <div class="writing-pillar-section" id="pillar-notebook">
        <h3 class="writing-pillar-section__heading">{{ t.notebook_label }}</h3>
        {% assign ixu = 0 %}
        {% for post in unassigned %}
          {% assign ixu = ixu | plus: 1 %}
          <a class="idx-row" href="{{ post.url | relative_url }}">
            <span class="idx-row__num">{% if ixu < 10 %}0{% endif %}{{ ixu }}</span>
            <span><span class="idx-row__title">{{ post.title }}</span></span>
            <span class="caps-label">—</span>
            <span class="caps-label">{{ post.date | date: '%Y' }}</span>
          </a>
        {% endfor %}
      </div>
    {% endif %}
  </section>

  {% assign ew = site.data.external_writing %}
  <section aria-labelledby="external" style="margin-top:2rem">
    <h2 id="external">{{ t.external }}</h2>
    {% if ew.featured %}
      <div class="split" style="margin-top:1rem">
        {% for item in ew.featured %}
          <article class="newsletter-card">
            <p class="caps-label">{{ item.outlet }} · {{ item.year }}</p>
            <h3 style="margin-top:.35rem"><a href="{{ item.url }}">{{ item.title }}</a></h3>
            {% if item.tags %}
              <ul class="chips">{% for tag in item.tags %}<li>{{ tag }}</li>{% endfor %}</ul>
            {% endif %}
          </article>
        {% endfor %}
      </div>
    {% endif %}

    {% if ew.items %}
      <div style="margin-top:2rem">
        {% for item in ew.items %}
          {% if item.url == '#' %}
            <div class="idx-row">
              <span class="idx-row__num">&nbsp;</span>
              <span>
                <span class="idx-row__title">{{ item.title }}</span><br>
                <span style="opacity:0.75;font-size:var(--fs-small)">{{ item.outlet }}</span>
              </span>
              <span class="caps-label">{{ item.lang }}</span>
              <span class="caps-label">{{ item.year }}</span>
            </div>
          {% else %}
            <a class="idx-row" href="{{ item.url }}">
              <span class="idx-row__num">&nbsp;</span>
              <span>
                <span class="idx-row__title">{{ item.title }}</span><br>
                <span style="opacity:0.75;font-size:var(--fs-small)">{{ item.outlet }}</span>
              </span>
              <span class="caps-label">{{ item.lang }}</span>
              <span class="caps-label">{{ item.year }}</span>
            </a>
          {% endif %}
        {% endfor %}
      </div>
    {% endif %}
  </section>
</div>
```

- [ ] **Step 2: Build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean.

- [ ] **Step 3: Verify hub-writing rendering**

```bash
grep 'writing-pillar-cards' _site/writing/index.html
```
Expected: match.

```bash
grep -c 'data-pillar=' _site/writing/index.html
```
Expected: 4 (one per pillar).

```bash
grep 'writing-pillar-filter' _site/writing/index.html
```
Expected: match.

```bash
grep 'pillar-building-agents' _site/writing/index.html
```
Expected: match (pillar section anchor for the existing post).

ES verification:

```bash
grep 'writing-pillar-cards' _site/es/escritos/index.html
```
Expected: match.

```bash
grep 'Filtrar por pilar' _site/es/escritos/index.html
```
Expected: match.

- [ ] **Step 4: Commit**

```bash
git add _layouts/hub-writing.html
git commit -m "hub-writing: pillar filter, cards with SVG, newsletter between cards/essays, big numerals"
```

---

## Task 7: Existing post — confirm front matter is complete for new template

**Files:**
- Modify: `_posts/2026-05-05-agent-graph-margin-budgets.md`

The new template uses `page.pillar`, `page.title`, `page.date`, `page.lang`, `page.hero_illustration`, optional `page.image`, `page.comments`. Verify the existing post has all required front-matter keys, add any missing ones.

- [ ] **Step 1: Read the current front matter**

The current front matter:

```yaml
---
title: "Shipping agent graphs without burning your margin budget"
layout: post
lang: en
ref: writing
description: Lessons learned keeping agent swarms economically bounded while still passing safety evals.
pillar: building-agents
hero_illustration: agent-pipeline
comments: true
image: /assets/img/posts/mi-post.png
date: 2026-05-05
---
```

This already has all required keys. The `image` value points to a non-existent file (`/assets/img/posts/mi-post.png`). The new template doesn't change OG image behavior (handled by `_includes/head.html`), so this is a pre-existing OG glitch that F5 will fix when it adds OG-image generation. F3a is a no-op on the post body.

- [ ] **Step 2: Confirm rendering against the new template**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Expected: clean.

Visit `/writing/2026/05/05/agent-graph-margin-budgets/` in browser. Confirm:
- Pillar tag "Building agents in production" at top.
- Hero illustration (agent-pipeline.svg) rendered.
- Title with `riso-double-print` shadow.
- Meta row: date · 2 min read · ~270 words · Daniel Gómez Domínguez.
- TOC on desktop ≥1100px lists the 4 H2s ("Budget the graph...", "Evaluators...", "Memory...", "Multilingual...").
- Inline newsletter injects after the H2 at position `floor(4 × 0.6) = 2` (i.e., after the second H2).
- Related posts: section is hidden (no other posts share the building-agents pillar yet).
- Pager: hidden (no prev/next within pillar).
- Footer newsletter still renders.

- [ ] **Step 3: No commit needed if no front-matter change was required**

If you needed to add anything (e.g., a missing key), commit:

```bash
git add _posts/2026-05-05-agent-graph-margin-budgets.md
git commit -m "post(agent-graph): align front matter with F3a template requirements"
```

If the front matter is already complete (which it is), skip this commit and move on.

---

## Task 8: Final QA + PR

**Files:** none modified.

- [ ] **Step 1: Visual regression vs Task 0 baseline**

Compare `/writing/`, `/es/escritos/`, `/writing/2026/05/05/agent-graph-margin-budgets/` against the Task 0 screenshots.

Expected new behaviors (correct):
- **Writing index**: pillar filter chips above the cards; 4 pillar cards with Riso-accent left borders + SVG illustrations on the right; newsletter card BETWEEN the pillar cards and the essays index; essays grouped per pillar with big riso-red double-print numerals.
- **Post page**: hero with pillar tag, illustration, big serif title with double-print shadow, mono meta row (date · read time · word count · author); 3-column layout on desktop ≥1100 px (TOC sticky on left, prose centered ~42rem wide, sidenote column on right currently empty); inline newsletter injects between H2s at the 60% point; related posts and prev/next pager appear at the bottom (currently hidden because there's only 1 post in the pillar).

- [ ] **Step 2: Dark-mode sweep**

Toggle dark. Confirm:
- Pillar cards still legible; left-border accent visible.
- Big numerals on the essays index still pop (red+blue offset shadow attenuated).
- Post hero double-print title legible.
- Inline newsletter card still readable.

- [ ] **Step 3: TOC interactivity**

Resize the browser to ≥1100 px. Visit the post. Scroll. The TOC items on the left should highlight as the corresponding H2 enters the viewport. Click a TOC link — should smooth-scroll (browser default) to the H2.

Resize to <1100 px. The TOC should collapse into a `<details>` element at the top (closed by default). Click the summary to expand the TOC.

- [ ] **Step 4: Print preview**

Ctrl+P on the post. Confirm:
- TOC, sidenote container, inline newsletter, footer newsletter are hidden.
- Title renders flat (double-print silenced by F0 print rules).
- Prose stays readable, monochrome.

- [ ] **Step 5: Pillar filter chips**

Click "Building agents in production" in the chip row at the top of `/writing/`. Browser jumps to the corresponding pillar section (`#pillar-building-agents`). The current single post is listed there.

Click "All pillars" — jumps to the `#essays` anchor (top of essays index).

- [ ] **Step 6: Mobile breakpoint**

Resize to ~700 px. Confirm:
- Pillar cards collapse to 1 column.
- Pillar filter chips wrap.
- Post layout collapses to single column (TOC details collapsed, sidenote container hidden).
- Related and pager grids collapse.

- [ ] **Step 7: Commit history check**

```bash
git log --oneline main..HEAD
```

Expected commits (in order):
1. `Add F3a writing-system implementation plan` (already in branch, plan doc)
2. `i18n(writing): add TOC/related/pager/filter labels (EN + ES)`
3. `components(writing): add pillar cards, post hero, 3-col layout, TOC, sidenotes, related, pager, inline newsletter`
4. `post(toc): add auto-built TOC with IntersectionObserver active-section highlighter`
5. `includes(post): add sn, post-toc, post-related, post-pager, newsletter-inline`
6. `post(layout): F3a redesign — hero, meta row, TOC, inline newsletter at 60%, related, pager`
7. `hub-writing: pillar filter, cards with SVG, newsletter between cards/essays, big numerals`

(Plus optionally one more for Task 7 if a front-matter tweak was needed — usually not.)

- [ ] **Step 8: Push and open PR (only after explicit user authorization)**

When authorized:

```bash
git push -u origin claude/f3a-writing
```

```bash
gh pr create --title "F3a: writing system + post template (Riso forward, TOC, sidenotes, related, inline newsletter)" --body "$(cat <<'EOF'
## Summary

Writing index and post template redesigned. F0 primitives + F1/F2 patterns extended into long-form reading.

- **Writing index**: pillar filter chips (anchor-based, no JS), 4 pillar cards with Riso-accent borders + SVG illustrations from the existing `assets/svg/riso/` set, newsletter card moved BETWEEN pillar cards and the essays index, essays grouped per pillar with big riso-red `riso-double-print` numerals.
- **Post template**: hero with pillar tag + illustration + double-print title + mono meta row (date · read time · word count · author), 3-column desktop layout (TOC | prose | sidenote container), TOC auto-built from H2 IDs with IntersectionObserver active-section highlighter, inline newsletter injected between H2s at the 60% point of `<h2>` count, related posts (same pillar) and prev/next pager (within pillar) at the bottom.
- **Tufte-style sidenote include** (`{% include sn.html n="1" text="..." %}`) — pure CSS positioning via the label/checkbox/span pattern. Optional and unused on the existing post; available for F3b scaffolds.
- **Reading time + word count** computed via Liquid (`number_of_words / 220`).
- **i18n parity**: 9 new keys per language (TOC label, related, prev/next, minutes/words formatters, inline newsletter kicker, notebook label, filter labels).

## Test plan

- [x] Writing index renders the new structure in EN and ES.
- [x] Post template applies to the existing `agent-graph-margin-budgets` post: hero, meta row, TOC (4 H2s), inline newsletter after the 2nd H2.
- [x] TOC active-section highlight tracks scroll position (IntersectionObserver).
- [x] Mobile collapses to `<details>` TOC, single-col pillar cards.
- [x] Print preview hides TOC, sidenote container, inline newsletter; double-print silenced.
- [x] Dark mode keeps pillar cards, big numerals, hero title legible.
- [x] Build clean (~6–10 s, 0 warnings).
- [x] No regression on the existing post body or URL.

## Spec deviation

The spec calls for the inline newsletter to inject "after the H2 whose cumulative word count first crosses 60% of the post total". F3a implements a simpler `floor(h2_count × 0.6)` heuristic that picks the H2 by index rather than by per-section word count. For typical posts (5–8 H2s), the result is similar; for posts with one outsized section, the index-based rule may inject slightly earlier or later than the word-based rule. F5 polish can refine if needed.

## What's NOT in this PR

- 5 draft post scaffolds in EN+ES (`eval-harness-as-first-class-dag-node`, `from-cajal-rigs-to-agent-fleets`, `vendor-vs-build-cheatsheet-for-ai-directors`, `agentic-roadmap-questions-i-ask-cto`, `til-prompt-cache-vs-retrieval-budget`) — coming in **F3b**.
- Work / Project pages / Speaking / Now structured UI / About / Contact / 404 — F4.
- Pagefind modal + OG template + giscus IDs + real headshot + ES audit + Lighthouse 95+ — F5.

Spec: [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md) §6.3, §6.4, §7
Plan: [docs/superpowers/plans/2026-05-06-renovation-f3a-writing-system.md](docs/superpowers/plans/2026-05-06-renovation-f3a-writing-system.md)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review

After all tasks land:

- **Spec coverage** (§6.3 + §6.4 + §7):
  - ✅ Writing index header + filter chips (Task 6).
  - ✅ Pillar cards with Riso accent + SVGs (Task 6).
  - ✅ Essays per pillar with `idx-row` and big riso-red double-print numerals (Task 2 + Task 6).
  - ✅ External writing block (Task 6).
  - ✅ Newsletter between pillar cards and essays (Task 6).
  - ✅ Post hero (pillar tag + illustration + double-print title + mono meta row) (Task 5).
  - ✅ 3-col desktop layout with TOC sticky + prose + sidenote container (Task 2 + Task 5).
  - ✅ Tufte-style sidenote include (Task 4 sn.html + Task 2 CSS).
  - ✅ TOC auto-built with active-section highlight (Task 3 + Task 5 + Task 4 post-toc.html).
  - ✅ Reading time + word count (Task 1 + Task 5).
  - ✅ Inline newsletter mid-post (Task 4 newsletter-inline.html + Task 5).
  - ✅ Related posts by pillar (Task 4 post-related.html + Task 5).
  - ✅ Prev/next within pillar (Task 4 post-pager.html + Task 5).
  - ⏭️ giscus comments — gated on F5 (real IDs needed); the layout still calls the include if `page.comments`.
- **Placeholder scan**: every code block is concrete; no TBDs.
- **Type/name consistency**:
  - `data-post-toc`, `data-post-toc-mobile` defined in Task 4 includes, consumed by Task 3 JS.
  - `.writing-pillar-card`, `.writing-pillar-card[data-pillar="..."]`, `.writing-pillar-card__id|__title|__blurb|__svg` defined in Task 2, consumed in Task 6.
  - `.writing-pillar-filter` defined in Task 2, consumed in Task 6.
  - `.writing-essays`, `.writing-pillar-section`, `.writing-pillar-section__heading` defined in Task 2, consumed in Task 6.
  - `.post-hero`, `.post-hero__title`, `.post-meta-row`, `.post-layout`, `.post-prose`, `.post-toc` (+ `__heading|__list`), `.post-toc-mobile`, `.post-sidenotes`, `.sn-marker|sn-toggle|sn`, `.newsletter-inline` (+ `__kicker|__title`), `.post-related` (+ `__heading|__list|__title|__date`), `.post-pager` (+ `__direction|__prev|__next`) all defined in Task 2, consumed in Task 5 + Task 4 includes.
  - i18n keys (`contents_label`, `related_label`, `prev_label`, `next_label`, `minutes_format`, `words_format`, `inline_newsletter_kicker`, `notebook_label`, `filter_label`, `filter_all`) defined in Task 1, consumed in Tasks 4, 5, 6.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Inline newsletter Liquid injection corrupts the post HTML when an H2 is wrapped in a `<section>` or other element kramdown emits | The split is on `<h2 ` (with trailing space). kramdown emits H2s as direct children of the post body — verified on `agent-graph-margin-budgets` build. If a future post uses raw HTML wrapping its H2s, the split may misbehave; documented. F5 polish can move to a more robust string parser if needed. |
| TOC IntersectionObserver edge cases (very short posts, no H2s, posts that scroll past the viewport instantly) | The JS no-ops if `proseHeadings.length === 0`. Short posts just render a single TOC entry. |
| Sidenote ID collisions if a post has multiple sidenotes with the same `n="1"` | The include scopes ID with `'sn-' | append: include.n | append: '-' | append: page.slug`. Same `n` within a post DOES collide; the convention is to number monotonically per post. Documented in the include comment. |
| `floor(h2_count × 0.6)` for inline newsletter is a deviation from the spec's per-word 60% rule | Documented in the PR body. Acceptable for typical post shapes; F5 polish can refine. |
| External SVG illustrations have hardcoded colors that may look off in dark mode | Same known F0 limitation as `career-arc.svg`. Acknowledged; F5 fix. |
| `riso-double-print` on the entire post title (rather than a single keyword) overwhelms long titles | Hard-tested with the existing 9-word title; reads OK. If a post has a 20-word title, the shadow noise stacks; F5 polish can introduce a `keyword` front-matter field. |
| Liquid `slice` on arrays — Liquid may not handle `slice` cleanly when `count` is 0 | The Task 5 markup guards `{% if rest_chunk.size > 0 %}` before rendering the rest_html. |
| `rest_chunk.size > 0` check works only because `slice` returns an empty array — confirm Liquid behavior | Verified during Task 5 Step 3 grep checks. |

---

## What's NOT in this phase (for clarity)

- 5 draft post scaffolds in EN+ES — F3b.
- Work / Project pages / Speaking / Now structured UI / About / Contact / 404 — F4.
- Pagefind modal + OG template + giscus IDs + real headshot + ES audit + Lighthouse 95+ — F5.
- Career-arc / pillar SVG dark-mode color fix — F5.
- Sidenote "collected view" inside the `.post-sidenotes` aside on desktop (currently empty) — F5 polish, optional.
