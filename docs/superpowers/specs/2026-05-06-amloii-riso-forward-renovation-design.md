# amloii.github.io — Riso-forward renovation

**Date:** 2026-05-06
**Owner:** Daniel Gómez Domínguez
**Status:** Approved design — ready for implementation planning
**Constraint:** Must remain GitHub Pages compatible (Jekyll + allowlisted plugins only)

---

## 1. Goal

Renovate `amloii.github.io` (personal CV + portfolio + blog) end-to-end with a distinctive editorial / Riso-print visual identity, while keeping the CV scannable enough for recruiters. Add the UX layer the site is currently missing (search UI, TOC, side-notes, related posts, dark mode), seed the empty blog with content scaffolds, and clean up i18n / placeholder configuration debt.

## 2. Audience priority (drives every trade-off)

1. **Recruiters / hiring managers** looking for Director/Head of AI — must scan CV fast, see seniority, stack, metrics, availability, and download a PDF without friction.
2. **Tech thought leadership readers** (peers, AI community) — depth, RSS, editorial identity, side-notes, pillars.
3. **CTOs / advisory clients** — credibility, "how he thinks", easy booking.
4. **Press / event organizers** — bio, photo, topics, press kit.

## 3. Visual direction — "Riso forward, two-pace"

Riso-print fanzine aesthetic (paper textures, halftones, double-print misregistration, rotated stamps, big numerals) on **Home / Writing / Work / Speaking / Now / About / Contact / 404**. **CV and Print stylesheet stay in calm mode** — paper background, one Riso accent, no double-print, no rotated stamps — so recruiters get scannability while the rest of the site carries the identity.

## 4. Non-goals

- Migration off Jekyll / GitHub Pages.
- Custom Ruby plugins (must use the GH-Pages allowlist: `jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-redirect-from`).
- Server-side anything. Pagefind index stays the only "search backend".
- Tone rewrite. The current sharp/punchy English voice is preserved; ES gets quality fixes, not rewriting.
- Rich animations. Reduced-motion is already respected; we keep micro-transitions only.
- Comments system swap. We keep `giscus` (just need real IDs from the user).

## 5. Design system

### 5.1 Tokens (light + dark)

Light (default — "papel"):

```scss
--paper:        #fbf8f2;
--bone:         #f5f1ea;
--paper-warm:   #f3ede0;   // Riso-heavy sections
--ink:          #0f0e0c;
--muted:        #5c564c;
--rule:         #1f1b16;
--accent:       #b0552b;   // terracotta
--riso-red:     #e0492f;
--riso-blue:    #1e3a8a;
```

Dark — "tinta cálida sobre carbón" (NOT pure black; warm coal so Riso reds/blues read):

```scss
--paper-dark:        #14110d;
--bone-dark:         #1c1814;
--paper-warm-dark:   #221d17;
--ink-dark:          #ede6d8;   // warm cream
--muted-dark:        #908874;
--rule-dark:         #d8cdb8;
--accent-dark:       #d97757;
--riso-red-dark:     #d65c44;
--riso-blue-dark:    #5a7bd1;
```

Toggle: manual button in nav, persisted to `localStorage`. Default: `prefers-color-scheme`. Applied via `data-theme="light|dark"` on `<html>`. **Anti-flicker**: a tiny inline `<script>` in `<head>` reads localStorage / prefers-color-scheme and sets `data-theme` *before* the first paint.

### 5.2 Typography

- Display: **Source Serif 4** (already loaded) — add weight 700.
- Sans: **Inter** — weights 400/500/600/700.
- Mono: **JetBrains Mono** — 400.
- Scale shifts (only the display tier grows for editorial impact):
  - `--fs-display: clamp(2.5rem, 6.5vw, 5rem)` (was `4.25rem` max)
  - `--fs-h2: clamp(1.75rem, 3.2vw, 2.5rem)`
  - body / small / lh tokens unchanged.
- `letter-spacing: -0.025em` on display titles (Riso "headline" feel).

### 5.3 Riso utilities (CSS-only — no PNG textures)

Each utility is a class with no JS dependency.

```scss
.riso-paper       // diagonal repeating-linear-gradient noise on bg
.riso-halftone    // pseudo-element radial-gradient dots, 30% opacity
.riso-double-print // text-shadow: rojo offset 1.5px + azul offset -1.5px
.riso-stamp       // rotated -1.5deg, mono caps, border 1.5px riso-red
.riso-photo       // duotone via filter + mix-blend-mode, requires plain photo source
.riso-frame       // existing — kept as-is, polished
```

**Two-pace contract:** in CV layout, only `.riso-paper` is used. Never `.riso-double-print`, `.riso-stamp`, `.riso-halftone`, or rotated decorations on `cv.html` or in `_print.scss`.

### 5.4 Reusable components

| Component | Use | Key behavior |
|---|---|---|
| `<aside class="sidenote">` | Tufte-style margin notes inside posts | Auto-numbered via CSS counter; sticky-positioned aside the prose on desktop ≥1100px; stacks inline below the paragraph on smaller. Hooked from kramdown `[^N]` footnotes. |
| `<nav class="post-toc">` | TOC on long posts | Auto-built by Liquid from `## ` headings via small JS. Sticky on desktop, `<details>` collapsible on mobile. |
| `<button data-search>` | Pagefind trigger | Opens modal. Triggered by click or `/` key. Pagefind UI mounted once on first open. |
| `<aside class="related-posts">` | End of post | 2–3 latest posts in same `pillar`, excluding current. |
| `<nav class="post-pager">` | Prev / next | Within same pillar, fall back to global if pillar size = 1. |
| `<button data-copy>` | Copy bio / citation | Reads `data-copy-target` selector, writes to clipboard, swaps label "Copy → Copied". |
| `<a class="sticky-cta">` | CV-only floating CTA | Bottom-right, hidden on print and on screens < 720px. |
| `riso-double-print` mixin | Inline emphasis on hero titles | Apply to a single keyword (`<em>` or `<span class="rdp">`), not the full headline. |

### 5.5 New frontmatter fields

Posts gain:

```yaml
kicker:        "Issue 02 · Notes from production"   # optional, decorative
hero_illustration: "agent-pipeline"                  # existing, optional
image:         "/assets/img/og/<slug>.svg"           # OG (auto-generated in F5)
draft:         true                                  # for scaffolds; excludes from index + feed
```

`read_time` is computed by a Liquid filter (no Ruby plugin needed: word-count of `content` ÷ 220 wpm).

## 6. Page-level designs

### 6.1 Home (`/`, `/es/`)

- 12-col hero. Cols 1–7: kicker mono, big headline with `riso-double-print` on a single keyword (`agentic`), lead paragraph, two CTAs (Latest essay + CV).
- Cols 8–12: portrait block (Riso-treated photo + rotated `.riso-stamp` "Available · CET"). Replaces the current `marginalia-home.html` text list.
- **Sub-hero status line** (mono, full width below hero): `● shipping · agents v3   ● writing · 04 essays in flight   ● advisory · selectively open`. Sourced from `_data/now.yml` (introduced in F0) — pulls 3 short status strings.
- Selected work: existing `idx-row` pattern, but `.idx-row__num` becomes `.riso-red` with `riso-double-print`, and a `featured_metric` line appears in mono below the title.
- Fresh essays + External spotlight: kept as split, gain `pillar-tag` Riso accent and mono kickers.
- **Three lanes (newsletter-card)**: differentiated. Each gets its own rotated `.riso-stamp` (`N°1` red, `N°2` blue, `N°3` mixed) and a one-line micro-proof (a short quote or a stat).
- Newsletter block at end on `riso-paper` background.

### 6.2 CV (`/cv/`, `/es/trayectoria/`) — calm mode

- Header: name + label, photo small (B&W, no Riso here), `availability-box` repositioned **above the fold** (currently surfaces only mid-page).
- Sticky CTA bottom-right: `Hiring? Book intro call →`. Hidden on print + on `< 720px`.
- Capabilities: 5-column grid on desktop (one column per domain group). Each group title gets a 2px-tall Riso-red bar to its left — visual without being noisy.
- Experience timeline: year solid (no double-print), role + company hierarchy tightened, meta in mono, bullets, chips. More vertical breathing room (`padding-block: var(--space-lg) * 1.25`).
- Education / Certifications / Publications / Beyond: same data, cleaned hierarchy.
- Footer "hire": three-lane micro version with direct links.
- **Print stylesheet** (`_print.scss`) revised: A4 layout, calm, one accent only, sticky-CTA hidden, headers truncated cleanly, page-break-inside: avoid on `.tl-item`.

### 6.3 Writing (`/writing/`, `/es/escritos/`)

- Header with kicker mono + big serif title + lead.
- **Pillar filter**: chips above the index. Implementation: anchor links + `:target` CSS to filter without JS, OR small JS for smoother UX (chosen at F3 implementation time).
- Pillar cards (4): each card has its own Riso accent (red, blue, mixed, terracotta) and a small distinctive SVG illustration in `assets/svg/riso/pillars/`.
- Essays per pillar: existing `idx-row` pattern with mono kicker `(date · read_time)` and big Riso number with double-print.
- External writing block with same `idx-row` pattern.
- Newsletter card placed *between* pillar cards and essays index (not only at the end), so it sits where attention is highest.

### 6.4 Post template (`/writing/<post>/`)

- Hero: `pillar-tag` chip, big serif title with `riso-double-print` on a key word, mono kicker `2026-05-05 · 7 min · 1.4k words · Daniel Gómez`, optional Riso illustration (`hero_illustration`).
- **Three-column desktop layout (≥ 1100px)**: TOC (col 1) — prose (col 2–3) — sidenotes (col 4). On `< 1100px`: TOC becomes `<details>` at top; sidenotes inline beneath the paragraph that referenced them.
- Prose: `max-width: 68ch`, side-notes auto-numbered.
- **Inline newsletter embed** mid-post: injected via a Liquid include that splits `content` on `## ` markers, counts cumulative words, and emits the embed after the H2 whose cumulative word count first crosses 60% of the post total. Falls back to footer-only if post is shorter than 600 words.
- Related posts (2–3 same pillar) + prev/next within same pillar + giscus comments (gated on real IDs being set).

### 6.5 Work index + project pages (`/work/`, `/work/<slug>/`)

- Work index: `idx-row` with big Riso numbers + mono kicker (`domain · year`). Pillar-style filter by `domain`.
- Project page: hero with `.riso-stamp` "Case study N°XX", sections `Context` / `Approach` / `Outcomes` / `Stack` in editorial grid, headline metric in `riso-double-print`. Existing `_layouts/project.html` is the base.

### 6.6 Speaking & Press (`/speaking-press/`, `/es/charlas-prensa/`)

Riso medium (calmer than Home — audience D, but still in the family).

- 3 bios (short / medium / long) in cards, each with a working `<button data-copy>` that puts the bio text on the clipboard.
- 3 downloadable headshots (B&W, Riso duotone, web color) — links pointing to pre-rendered files in `/assets/img/headshots/`.
- Suggested topics in a 2-col grid.
- Booking + email block.

### 6.7 Now (`/now/`, `/es/ahora/`)

Structured into 4 blocks instead of a flat list:

- **Building** — current production work
- **Reading** — current books / papers
- **Writing** — essays in flight
- **Speaking** — upcoming appearances

Each block opens with a small Riso stamp. "Last updated" date on top right.

Source: a new `_data/now.yml` (replaces hardcoded `now/index.md` content), so updates are a one-file edit and the same data feeds the home sub-hero status line.

### 6.8 About (`/about/`, `/es/sobre/`)

- Hero with Riso-treated photo (medium size).
- Existing copy retained.
- One added paragraph on methodology (the neuroscience → ML → agents → comms thread the user already implies in the current copy; just better laid out, not new content).

### 6.9 Contact (`/contact/`, `/es/contacto/`)

- Form (Formspree — needs real endpoint) + book-call button.
- New micro-copy block: "What kind of messages I respond to fastest" — Advisory questions / Implementation pitches / Speaking enquiries / Press. Plus an explicit "what I won't reply to" line (recruiter spam template, vendor pitches without context). Acts as a soft spam filter and sets expectations.

### 6.10 404

Riso-forward with dry humor and useful links (Home, Writing, CV). One of the few places to play visually.

## 7. UX features (the "all" multi-select)

| Feature | Page(s) | Phase |
|---|---|---|
| Pagefind search modal in nav (`/` key + icon) | Global | F5 |
| Sticky TOC on long posts (auto-built from H2) | Post | F3 |
| Reading time + word count | Post | F3 |
| Related posts by pillar | Post | F3 |
| Pillar filter on writing index | Writing | F3 |
| Prev/next within pillar | Post | F3 |
| Tufte-style side-notes from markdown footnotes | Post | F3 |
| Real giscus comments | Post | F5 (needs IDs from user) |
| Capability matrix grid on CV | CV | F2 |
| Sticky "Hiring? Book →" on CV | CV | F2 |
| Structured Now page | Now | F4 |
| Copyable bios (1-click) | Speaking | F4 |
| OG-image SVG template per post | Global | F5 |
| Inline newsletter mid-post | Post | F3 |

## 8. Phasing

Each phase = one PR mergeable to `main`. Each phase ends in a state where the site can ship. Intermediate visual mismatch is accepted and managed (each phase only changes the CSS of pages it owns; older pages keep their current CSS until their phase).

### F0 — Foundations

Surface change: minimal (dark mode appears across existing pages; otherwise visually identical).

- Refactor `_tokens.scss` with the dual palette (5.1).
- Add anti-flicker `<head>` script + nav theme toggle.
- Add `_riso.scss` utilities (5.3) and validate them in both light and dark.
- Add base components: `<button data-copy>` and a placeholder `<button data-search>` (modal wired in F5).
- Refactor `_print.scss` to a clean baseline (CV-specific tweaks come in F2).
- i18n bug fixes (`bilingüe`, ES download labels, label→`Descargar` not "Download" in ES, etc.).
- Move static "now" content out of `now/index.md` into `_data/now.yml`; render unchanged for now.
- **Done when**: dark mode toggles cleanly on every existing page with no regressions; Riso utilities work in both modes; print preview is clean.

### F1 — Home (proof of direction)

- Implement Home redesign per 6.1.
- New `_includes/marginalia-home.html` becomes a portrait block (placeholder illustration until the real photo arrives in F5; the same component just swaps source).
- New `_includes/home-status.html` for the sub-hero status line, sourced from `_data/now.yml`.
- ES home parity (`es/index.html`).
- **Done when**: home looks and feels like the agreed Riso-forward direction in both light and dark; user signs off in a visual checkpoint before F2 starts.

### F2 — CV + Print

- CV calm mode per 6.2 (light + dark).
- Sticky CTA component (`assets/js/main.js` minimal addition).
- Capability grid markup change in `_layouts/cv.html`.
- `_print.scss` revised; print-preview tested in Chrome + Firefox.
- ES parity (`/es/trayectoria/`).
- PDFs of the CV (EN + ES) — placeholder note: provided by user, dropped into `/assets/cv/`.

### F3 — Writing + post template + scaffolds

- `hub-writing.html` redesign per 6.3.
- `post.html` redesign per 6.4 (TOC, side-notes, mono kicker, related, prev/next, inline newsletter).
- New `_includes/post-toc.html`, `_includes/post-related.html`, `_includes/post-pager.html`, `_includes/sidenote-styles.html`.
- 5 new post scaffolds (table in §9), all `draft: true` so they don't appear in feeds; they appear in the writing index when toggled to `false`.
- Reading-time Liquid filter via `{{ content | number_of_words | divided_by: 220 | plus: 1 }}` pattern (no plugin needed).
- ES parity (`/es/escritos/` index + one ES counterpart per scaffold). Implementation note: the site currently has no Spanish post in `_posts/`. F3 picks one of two patterns and applies it consistently — (a) every post is a single `.md` with `lang: en` default and a sibling `es-<slug>.md` with `lang: es` in the same `_posts/`, or (b) a second collection `_posts_es` declared in `_config.yml`. Decision is made at the start of F3 and recorded in the implementation plan.

### F4 — Work + Speaking + Now + About + Contact

- Work index + `project.html` per 6.5.
- Speaking & press per 6.6 (with `data-copy` bios — needs the 3 bios drafted; I'll draft from existing copy and submit for approval inside the F4 PR).
- Now per 6.7 (UI built on the `_data/now.yml` introduced in F0).
- About per 6.8.
- Contact per 6.9.
- ES parity throughout.

### F5 — Polish & ops

- Search modal: mount Pagefind UI on first `/` keypress or button click.
- OG-image SVG template + per-post overrides; build script documented in README.
- giscus IDs (user-supplied) wired in `_config.yml`; theme mapped to `data-theme`.
- Formspree endpoint (user-supplied) wired in `_config.yml`.
- 404 page redesign per 6.10.
- Real headshot integrated (user-supplied), Riso `mix-blend-mode` treatment validated.
- Full ES copy audit pass (any awkward translations or missed strings).
- Performance: `font-display: swap` already there, validate; lazy-load non-hero SVG illustrations; Lighthouse pass with ≥ 95 on Performance and Accessibility.
- README updates: how to add a post, how to update Now, where palette tokens live, how to test print, how to regenerate Pagefind.

## 9. Blog scaffolds (F3 deliverable)

Each scaffold is created as a real `.md` file with full frontmatter, `draft: true`, 3–5 H2 placeholders, `<!-- contenido pendiente: ... -->` comments per section, one example sidenote, and a hero illustration suggestion.

| Slug | Pillar | EN/ES | Working title (placeholder, owner edits) |
|---|---|---|---|
| `agent-graph-margin-budgets` (existing) | building-agents | EN+ES | (already published — F3 just rewires it through the new template) |
| `eval-harness-as-first-class-dag-node` | building-agents | EN+ES | "Eval harnesses are graph nodes, not weekend notebooks" |
| `from-cajal-rigs-to-agent-fleets` | research-to-prod | EN+ES | "From Cajal rigs to agent fleets — the personal arc as a technical argument" |
| `vendor-vs-build-cheatsheet-for-ai-directors` | ai-leadership | EN+ES | "Vendor vs build for AI directors — a cheatsheet" |
| `agentic-roadmap-questions-i-ask-cto` | ai-leadership | EN+ES | "The questions I ask a CTO before touching their agent roadmap" |
| `til-prompt-cache-vs-retrieval-budget` | operators-notebook | EN+ES | "TIL: prompt cache vs retrieval budget" |

## 10. User deliverables (non-blocking, captured here)

| Asset | Phase needed | Spec |
|---|---|---|
| Headshot photo | F1 (placeholder OK) → F5 (final integration) | Medium shot (head + shoulders), neutral background, ≥ 1200×1500 px, PNG/JPG, directional light. CSS Riso treatment applied at runtime. |
| giscus `repo_id` + `category_id` | F5 | Generate at https://giscus.app with `Amloii/amloii.github.io`. |
| Formspree endpoint URL | F5 | Create form at formspree.io. |
| CV PDFs (EN + ES) | F2 | Drop into `/assets/cv/`. |

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Riso `mix-blend-mode` and gradients render differently in dark mode | F0 ends with explicit visual validation of every Riso utility in both palettes before any page is redesigned. |
| Phase-intermediate states look mixed (e.g., new home + old CV) | Each phase only ships CSS for its own pages. No global tokens change between F0 and F5 except in F0. Older pages keep their current SCSS until their phase. |
| Riso effects degrade Lighthouse Performance | Avoid `will-change` on scrolling elements. Use static gradients (cached). F5 includes a Lighthouse pass with a hard ≥ 95 floor. |
| giscus dark theme drift | F5 maps `data-theme` → giscus theme via the official runtime API. |
| Pillar filter without JS may feel fragile (`:target`) | Acceptable fallback; if F3 implementation reveals issues, add minimal JS (≤ 1 KB) to handle pill clicks and `aria-pressed`. |
| Spanish audit blows up scope at F5 | The ES copy is not being rewritten; only fixed for typos / missed translations. Net new ES content (scaffolds, contact micro-copy) is drafted at the same time as the EN sibling. |

## 12. Out of scope (will not happen in this renovation)

- Re-platforming away from Jekyll.
- A CMS / admin UI for posts.
- Analytics beyond optional Cloudflare Web Analytics token (unchanged).
- Email-capture custom backend (Substack embed remains).
- Multilingual SEO beyond canonical-EN-with-ES strategy already in place.
- Animations beyond hover micro-transitions.
- Refactoring `_layouts/default.html` into a component framework. SCSS + Liquid + minimal vanilla JS is the explicit ceiling.
