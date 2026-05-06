# Renovation F0 — Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the foundational layer of the Riso-forward renovation: dual-palette tokens (light + dark), anti-flicker theme switching, the Riso CSS utility set, base components (`data-copy`, `data-search` placeholder), a clean `_print.scss` baseline, i18n bug fixes, and the `_data/now.yml` data move. No page redesigns yet — all existing pages must look unchanged in light mode and gain a clean dark mode.

**Architecture:** Pure SCSS + Liquid + minimal vanilla JS, GitHub-Pages compatible. Tokens via CSS custom properties, theme switching by setting `data-theme="light|dark"` on `<html>` (no class soup, no SSR concerns). Riso utilities are CSS-only (no PNG textures). Anti-flicker is a tiny inline `<script>` in `<head>` that runs before first paint.

**Tech Stack:** Jekyll 3.10 (github-pages gem), SCSS (compressed), kramdown, vanilla ES6 (no bundler), Pagefind index (already built).

**Companion spec:** [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](../specs/2026-05-06-amloii-riso-forward-renovation-design.md)

---

## File structure

**Files modified:**
- `assets/css/_tokens.scss` — dual palette
- `assets/css/_riso.scss` — full utility rewrite
- `assets/css/_print.scss` — clean baseline
- `assets/css/_components.scss` — theme toggle styles, copy/search button styles
- `assets/css/main.scss` — confirm import order
- `_includes/head.html` — anti-flicker script
- `_includes/nav.html` — theme toggle button + search placeholder button
- `assets/js/main.js` — theme toggle handler, copy handler, search trigger handler
- `_data/i18n.yml` — toggle labels EN+ES, download label fix in ES
- `_data/cv.yml` — `bilingual` typo → `bilingüe`
- `now/index.md` — render from `_data/now.yml`
- `es/ahora/index.md` — render from `_data/now.yml`

**Files created:**
- `_data/now.yml` — structured "now" data
- `_includes/theme-toggle.html` — toggle markup
- `_dev/riso-utilities.html` — temporary visual validation page (deleted before PR)

**Files unchanged (this phase):** all `_layouts/`, all `_posts/`, all `_projects/`, content `.md` files except those listed above.

---

## Pre-flight: verify the environment

### Task 0: Build baseline

**Files:**
- Read: `Gemfile.lock` (if present), `_config.yml`

- [ ] **Step 1: Confirm the Dockerized Jekyll toolchain works**

This project uses a Dockerized Jekyll for local development (see `docker-compose.yml`). Confirm Docker Desktop is running, then from the worktree root:

```bash
docker compose run --rm --entrypoint "" jekyll bundle install
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Expected: `bundle install` succeeds and persists gems to the `jekyll-gems` named volume (only happens fresh once or after a `Gemfile` change). The build then completes without errors and `_site/` is populated.

**Subagent execution note:** every command in this plan that starts with `docker compose run --rm --entrypoint "" jekyll bundle exec jekyll …` is run by the subagent that owns that task. The dev server (Step 3 below, used by the human reviewer) is run from a separate shell.

- [ ] **Step 2: Note the current asset hashes for regression check**

Run:

```bash
ls _site/assets/css/main.css
ls _site/assets/js/main.js
```

Expected: both files exist. Capture their byte sizes — at the end of F0, `main.css` will grow (new utilities, dark palette) and `main.js` will grow (toggle/copy handlers). No other built file should change byte-for-byte except the affected SCSS imports cascading through.

- [ ] **Step 3: Take screenshots of every page in the current state for visual regression**

Start the dev server in a separate shell:

```bash
bundle exec jekyll serve --livereload
```

Open `http://localhost:4000/` and screenshot:

1. `/` (home, light)
2. `/cv/`
3. `/work/`
4. `/writing/`
5. `/writing/2026/05/05/agent-graph-margin-budgets/` (post)
6. `/speaking-press/`
7. `/now/`
8. `/about/`
9. `/contact/`
10. `/es/` (ES home)
11. `/es/trayectoria/` (ES CV)
12. Print preview of `/cv/` (browser Ctrl+P)

Save the screenshots somewhere outside the repo (e.g. `~/amloii-baseline-2026-05-06/`). They're the visual regression reference for the rest of F0.

- [ ] **Step 4: Verify clean working tree**

Run:

```bash
git status
```

Expected: working tree clean (no staged or unstaged changes other than what may already be in this worktree).

---

## Task 1: Refactor `_tokens.scss` to dual palette

**Files:**
- Modify: `assets/css/_tokens.scss`

- [ ] **Step 1: Read the current `_tokens.scss` to confirm starting state**

Open `assets/css/_tokens.scss`. Confirm it currently defines tokens at `:root` only with `color-scheme: light`.

- [ ] **Step 2: Replace the file with the dual-palette version**

Overwrite `assets/css/_tokens.scss` with:

```scss
// Design tokens — Editorial Swiss + Riso, dual palette

:root {
  // Surfaces
  --paper:        #fbf8f2;
  --bone:         #f5f1ea;
  --paper-warm:   #f3ede0;   // Riso-heavy section background

  // Ink
  --ink:          #0f0e0c;
  --muted:        #5c564c;
  --rule:         #1f1b16;

  // Accents
  --accent:       #b0552b;   // terracotta
  --riso-red:     #e0492f;
  --riso-blue:    #1e3a8a;

  // Type
  --font-display: "Source Serif 4", "GT Sectra", Georgia, "Times New Roman", serif;
  --font-sans:    Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  // Scale (display tier nudged up for editorial impact)
  --fs-display:   clamp(2.5rem, 6.5vw, 5rem);
  --fs-h2:        clamp(1.75rem, 3.2vw, 2.5rem);
  --fs-body:      clamp(1rem, 2vw, 1.125rem);
  --fs-small:     clamp(0.8125rem, 1.6vw, 0.9375rem);
  --lh-tight:     1.12;
  --lh-body:      1.55;

  // Spacing
  --space-xs: clamp(0.375rem, 1vw, 0.5rem);
  --space-sm: clamp(0.75rem, 2vw, 1rem);
  --space-md: clamp(1.25rem, 3vw, 2rem);
  --space-lg: clamp(2rem, 5vw, 4rem);
  --space-xl: clamp(3rem, 8vw, 7rem);

  --container: 76rem;
  --gutter:    clamp(16px, 2vw, 28px);

  --radius-sm: 4px;

  color-scheme: light;
}

[data-theme="dark"] {
  // Warm coal — never pure black, so Riso reds/blues read on it
  --paper:        #14110d;
  --bone:         #1c1814;
  --paper-warm:   #221d17;

  --ink:          #ede6d8;   // warm cream
  --muted:        #908874;
  --rule:         #d8cdb8;

  --accent:       #d97757;
  --riso-red:     #d65c44;
  --riso-blue:    #5a7bd1;

  color-scheme: dark;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Build and confirm light mode looks identical to baseline**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Expected: build clean. Visit each baseline URL and compare to the screenshots from Task 0. Light mode should look pixel-identical (only the typographic display scale changed; that affects only `h1` sizes which is intentional and small).

- [ ] **Step 4: Manually toggle dark mode in DevTools to test palette**

In Chrome DevTools, set `<html data-theme="dark">` via the Elements panel. Open the home page. Expected: background turns warm coal (#14110d), text turns warm cream (#ede6d8), no element looks broken or unreadable. Some Riso decorations may not render correctly yet — that's fine, they get rebuilt in Task 4.

- [ ] **Step 5: Commit**

```bash
git add assets/css/_tokens.scss
git commit -m "tokens: introduce dual light/dark palette and bump display scale"
```

---

## Task 2: Anti-flicker `<head>` script

**Files:**
- Modify: `_includes/head.html`

- [ ] **Step 1: Read the current `_includes/head.html` to find the right insertion point**

Open `_includes/head.html`. The script must run **before** `<link rel="stylesheet">` so the stylesheet's first paint already has the right `data-theme` attribute on `<html>`.

- [ ] **Step 2: Insert the inline anti-flicker script**

Edit `_includes/head.html`. Find the line `<link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">` and insert this block **immediately before it**:

```html
<script>
  // Theme bootstrap — must run before stylesheet to avoid flicker.
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = stored || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (_) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
</script>
```

- [ ] **Step 3: Build and verify the script is in the rendered HTML**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Then check the rendered home page:

```bash
grep -A 12 'Theme bootstrap' _site/index.html
```

Expected: the inline script appears in the output, on the line before the stylesheet `<link>`.

- [ ] **Step 4: Verify no flicker in the browser**

Reload the home in the browser with DevTools "Disable cache" enabled. Throttle CPU to "Slow 4×". Reload. Expected: no white flash before the page paints; the right theme is applied on the first paint.

If your system theme is dark, the page should load in dark mode without flicker. Toggle system theme to light, reload — should load in light mode without flicker.

- [ ] **Step 5: Commit**

```bash
git add _includes/head.html
git commit -m "head: add anti-flicker theme bootstrap script"
```

---

## Task 3: Theme toggle component (markup + JS + i18n)

**Files:**
- Create: `_includes/theme-toggle.html`
- Modify: `_includes/nav.html`, `assets/js/main.js`, `_data/i18n.yml`, `assets/css/_components.scss`

- [ ] **Step 1: Add toggle labels to `_data/i18n.yml`**

Open `_data/i18n.yml`. Inside the existing `en.nav` block, add a new key `theme_toggle: Theme`. Inside `es.nav`, add `theme_toggle: Tema`.

The diff for the EN section:

```yaml
en:
  nav:
    skip_main: Skip to content
    work: Work
    writing: Writing
    cv: CV
    speaking: Speaking & Press
    now: Now
    about: About
    contact: Contact
    theme_toggle: Theme
```

The diff for the ES section:

```yaml
es:
  nav:
    skip_main: Saltar al contenido
    work: Trabajo
    writing: Escritos
    cv: Trayectoria
    speaking: Charlas & prensa
    now: Ahora
    about: Sobre mí
    contact: Contacto
    theme_toggle: Tema
```

- [ ] **Step 2: Create `_includes/theme-toggle.html`**

Create the file with:

```html
{% assign lg = page.lang | default: site.lang %}
{% assign t = site.data.i18n[lg] %}

<button
  type="button"
  class="theme-toggle"
  data-theme-toggle
  aria-label="{{ t.nav.theme_toggle }}"
  title="{{ t.nav.theme_toggle }}"
>
  <span class="theme-toggle__icon" aria-hidden="true" data-theme-icon="light">☼</span>
  <span class="theme-toggle__icon" aria-hidden="true" data-theme-icon="dark">☾</span>
</button>
```

- [ ] **Step 3: Wire the include into `_includes/nav.html`**

Open `_includes/nav.html`. Find the line `{% include lang-toggle.html %}` (currently the last child of `.site-nav__panel`). Insert the theme toggle immediately before it:

```html
      {% include theme-toggle.html %}
      {% include lang-toggle.html %}
```

- [ ] **Step 4: Add toggle styles to `_components.scss`**

Open `assets/css/_components.scss`. Append at the end of the file:

```scss
// Theme toggle
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border: 1px solid color-mix(in srgb, var(--rule) 22%, transparent);
  background: transparent;
  border-radius: 999px;
  cursor: pointer;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

.theme-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.theme-toggle__icon { display: none; }
[data-theme="light"] .theme-toggle__icon[data-theme-icon="dark"] { display: inline; }
[data-theme="dark"]  .theme-toggle__icon[data-theme-icon="light"] { display: inline; }
```

The icon shown is the one for the *target* state (light theme shows the moon, because clicking moves you to dark).

- [ ] **Step 5: Wire the toggle handler in `assets/js/main.js`**

Open `assets/js/main.js`. Replace the current contents with:

```js
document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle (existing)
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel  = document.querySelector("[data-nav-panel]");
  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.getAttribute("data-open") === "true";
      navPanel.setAttribute("data-open", String(!isOpen));
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  // Print buttons (existing)
  document.querySelectorAll("[data-print]").forEach((btn) => {
    btn.addEventListener("click", () => window.print());
  });

  // Theme toggle (new)
  const themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (_) {}
    });
  }
});
```

- [ ] **Step 6: Build and verify the toggle ships**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'data-theme-toggle' _site/index.html
```

Expected: the toggle button markup appears in the rendered nav.

- [ ] **Step 7: Manual verification in browser**

Reload `http://localhost:4000/`. Click the theme toggle in the nav. Expected:
- Page switches between light and dark instantly without reload.
- Reloading the page keeps the chosen theme (localStorage).
- The icon swaps (sun in dark mode, moon in light mode).
- Toggle is keyboard-focusable; pressing Enter or Space activates it.

- [ ] **Step 8: Commit**

```bash
git add _includes/theme-toggle.html _includes/nav.html _data/i18n.yml assets/js/main.js assets/css/_components.scss
git commit -m "nav: add theme toggle (light/dark with localStorage persistence)"
```

---

## Task 4: Riso utilities — full rewrite of `_riso.scss`

**Files:**
- Modify: `assets/css/_riso.scss`

- [ ] **Step 1: Replace `_riso.scss` with the full utility set**

Overwrite `assets/css/_riso.scss` with:

```scss
// Risograph-inspired utilities — CSS-only, no PNG textures.
// Two-pace contract: ONLY .riso-paper is allowed inside .cv-page and in print.

// 1. Paper texture — subtle diagonal noise on the background.
.riso-paper {
  background-image:
    repeating-linear-gradient(
      135deg,
      color-mix(in srgb, var(--rule) 4%, transparent) 0 1px,
      transparent 1px 4px
    );
}

// 2. Halftone — radial-gradient dot pattern, 30% opacity, used as decorative overlay.
.riso-halftone {
  position: relative;
}

.riso-halftone::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(
      color-mix(in srgb, var(--riso-red) 28%, transparent) 1.5px,
      transparent 2px
    );
  background-size: 10px 10px;
  pointer-events: none;
  mix-blend-mode: multiply;
  opacity: 0.6;
}

[data-theme="dark"] .riso-halftone::before { mix-blend-mode: screen; }

// 3. Double-print — text-shadow misregistration. Apply to a single keyword, not full headlines.
.riso-double-print {
  text-shadow:
    1.5px 1px 0  color-mix(in srgb, var(--riso-red)  88%, transparent),
   -1.5px -1px 0 color-mix(in srgb, var(--riso-blue) 70%, transparent);
}

[data-theme="dark"] .riso-double-print {
  text-shadow:
    1.5px 1px 0  color-mix(in srgb, var(--riso-red)  78%, transparent),
   -1.5px -1px 0 color-mix(in srgb, var(--riso-blue) 60%, transparent);
}

// 4. Stamp — rotated mono caps, used for "N°07 · Issue Q2 26" style decorations.
.riso-stamp {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border: 1.5px solid var(--riso-red);
  color: var(--riso-red);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transform: rotate(-1.5deg);
  background: transparent;
}

.riso-stamp--blue { border-color: var(--riso-blue); color: var(--riso-blue); }

// 5. Photo duotone — apply via mix-blend-mode + filters.
// Source image must be a normal photo (color or grayscale).
.riso-photo {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.riso-photo > img,
.riso-photo > picture > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
}

.riso-photo::before,
.riso-photo::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.riso-photo::before {
  background: var(--riso-red);
  mix-blend-mode: lighten;
  opacity: 0.55;
}

.riso-photo::after {
  background: var(--riso-blue);
  mix-blend-mode: multiply;
  opacity: 0.32;
}

[data-theme="dark"] .riso-photo::before { mix-blend-mode: screen; opacity: 0.4; }
[data-theme="dark"] .riso-photo::after  { mix-blend-mode: lighten; opacity: 0.28; }

// 6. Frame (kept from previous version, refined).
.riso-frame {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  max-height: 18rem;
  background:
    repeating-radial-gradient(
      circle at 20% 30%,
      color-mix(in srgb, var(--riso-red) 11%, transparent) 0 1px,
      transparent 2px 4px
    );
  border: 1px solid color-mix(in srgb, var(--riso-blue) 35%, transparent);
}

.riso-frame svg,
.riso-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.riso-muted  { color: var(--riso-blue); }
.riso-accent { color: var(--riso-red); }

// Two-pace enforcement: silence decorative Riso utilities inside .cv-page.
.cv-page .riso-double-print,
.cv-page .riso-stamp,
.cv-page .riso-halftone {
  text-shadow: none !important;
  border: none !important;
  transform: none !important;
}

.cv-page .riso-halftone::before { display: none !important; }
```

- [ ] **Step 2: Build**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Expected: clean build.

- [ ] **Step 3: Confirm existing pages that use `.riso-frame` still render**

Visit the CV page (`/cv/`). The `.riso-frame` block (career arc) should still render correctly in light mode. Toggle to dark mode — the frame should still render with adjusted contrast.

If anything is broken, fix it before continuing. The CV is the only page currently using a Riso utility (`.riso-frame`).

- [ ] **Step 4: Commit**

```bash
git add assets/css/_riso.scss
git commit -m "riso: full utility set (paper, halftone, double-print, stamp, photo, frame)"
```

---

## Task 5: Visual validation page for Riso utilities (uncommitted scratch file)

**Files:**
- Create (uncommitted, deleted at end of task): `dev-riso-utilities.html` at the worktree root.

This page is a local QA harness for Task 4's utilities. It does **not** enter git history — create it, validate the utilities in the browser, then delete it before moving on. No `_config.yml` change required: the file lives at the root with a custom `permalink`.

- [ ] **Step 1: Create the validation page (uncommitted)**

Create `dev-riso-utilities.html` at the worktree root with:

```html
---
layout: page
title: Riso utilities QA
permalink: /dev-riso-utilities/
hide_footer: true
sitemap: false
---

<style>
  .vutil { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
  .vutil > .box { padding: 1.25rem; border: 1px solid color-mix(in srgb, var(--rule) 18%, transparent); border-radius: 6px; background: var(--paper); min-height: 160px; }
  .vutil h3 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 0.75rem; color: var(--muted); font-family: var(--font-mono); }
</style>

<h1>Riso utilities — QA</h1>
<p class="caps-label">Visit in light AND dark mode. Each block must render without breaking layout.</p>

<div class="vutil">
  <div class="box riso-paper">
    <h3>.riso-paper</h3>
    <p>Subtle diagonal noise behind text. Background should look like newsprint.</p>
  </div>

  <div class="box riso-halftone">
    <h3>.riso-halftone</h3>
    <p>Red dot pattern overlay. Multiply blend in light, screen in dark.</p>
  </div>

  <div class="box">
    <h3>.riso-double-print</h3>
    <p>Apply to a single keyword like <span class="riso-double-print">agentic</span> for misregistration effect.</p>
  </div>

  <div class="box">
    <h3>.riso-stamp</h3>
    <p><span class="riso-stamp">N°07 · Issue Q2 26</span> &nbsp; <span class="riso-stamp riso-stamp--blue">Available · CET</span></p>
  </div>

  <div class="box">
    <h3>.riso-photo (placeholder)</h3>
    <div class="riso-photo" style="aspect-ratio: 4/5; max-width: 200px;">
      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=500&fit=crop" alt="placeholder portrait" loading="lazy" decoding="async">
    </div>
  </div>

  <div class="box">
    <h3>.riso-frame (existing)</h3>
    <figure class="riso-frame" style="max-height: 8rem;">
      {% include riso/career-arc.svg %}
    </figure>
  </div>
</div>

<hr class="hairline" style="margin: 3rem 0">
<h2>Two-pace contract</h2>
<p>The block below has the class <code>cv-page</code>. Decorative Riso utilities should be silenced — no double-print, no stamps, no halftones.</p>
<div class="cv-page" style="margin-top: 1rem; padding: 1rem; border: 1px dashed color-mix(in srgb, var(--rule) 30%, transparent);">
  <p>This <span class="riso-double-print">word</span> must NOT have shadow.</p>
  <p><span class="riso-stamp">no transform</span> — must NOT rotate.</p>
  <div class="riso-halftone" style="height: 60px; border: 1px solid var(--rule);">No dot pattern visible above this border.</div>
</div>
```

- [ ] **Step 2: Build and visit `/dev-riso-utilities/`**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Visit `http://localhost:4000/dev-riso-utilities/`. Inspect every utility block.

Expected (light mode):
- `.riso-paper` shows subtle diagonal lines.
- `.riso-halftone` shows red dots overlaid on the box, multiply blend.
- `.riso-double-print` shows the word "agentic" with red+blue offset shadows.
- Both `.riso-stamp` variants render rotated, with mono caps inside a bordered pill.
- `.riso-photo` shows the Unsplash portrait in red+blue duotone.
- `.riso-frame` shows the existing career arc.
- Inside `.cv-page`: no shadow on "word", no rotation on the stamp, no dots on the halftone block.

Toggle dark mode (nav toggle from Task 3). Expected: all blocks remain legible, blends adjust (halftone uses screen, photo uses screen+lighten), nothing disappears.

If any block looks broken, go back to Task 4 and fix the SCSS, rebuild, re-verify.

- [ ] **Step 3: Confirm the file is NOT staged**

The validation page must not enter git history. Run:

```bash
git status --short
```

Expected: `dev-riso-utilities.html` shown as untracked (`??`). It must remain untracked through Task 11, where we delete it.

---

## Task 6: Copy-button utility (`data-copy`)

**Files:**
- Modify: `assets/js/main.js`, `assets/css/_components.scss`

- [ ] **Step 1: Append the copy-button styles to `_components.scss`**

Open `assets/css/_components.scss`. Append at the end:

```scss
// Copy-to-clipboard button (used for bios, citations, etc.)
.btn--copy[data-copied="true"] {
  border-color: var(--riso-blue);
  color: var(--riso-blue);
}

.btn--copy[data-copied="true"]::after {
  content: " ✓";
}
```

- [ ] **Step 2: Add the copy handler in `assets/js/main.js`**

Open `assets/js/main.js`. Inside the existing `DOMContentLoaded` listener, append (before the closing `});`):

```js
  // Copy-to-clipboard buttons. Markup contract:
  //   <button data-copy data-copy-target="#bio-short">Copy</button>
  //   <pre id="bio-short">…</pre>
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy-target");
      const target = sel ? document.querySelector(sel) : null;
      const text = target ? (target.innerText || target.textContent || "") : "";
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text.trim());
        btn.setAttribute("data-copied", "true");
        const original = btn.dataset.label || btn.textContent;
        if (!btn.dataset.label) btn.dataset.label = original;
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.removeAttribute("data-copied");
          btn.textContent = btn.dataset.label;
        }, 1800);
      } catch (_) {
        // Clipboard API blocked; fail silently.
      }
    });
  });
```

- [ ] **Step 3: Add a smoke-test block to the (uncommitted) QA page**

Open `dev-riso-utilities.html` (created in Task 5, still untracked). Append before the closing of the last `<div class="vutil">` block:

```html
<hr class="hairline" style="margin: 3rem 0">
<h2>Copy button smoke test</h2>
<p>Click the button — it should switch to "Copied" for ~2s, and the clipboard should contain the bio.</p>
<button class="btn btn--ghost btn--copy" data-copy data-copy-target="#smoke-bio">Copy bio</button>
<pre id="smoke-bio" style="margin-top: 1rem; max-width: 60ch; white-space: pre-wrap;">Daniel Gómez Domínguez — Architect & Director of AI. Madrid · EU-remote.</pre>
```

- [ ] **Step 4: Build and verify**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Visit `http://localhost:4000/dev-riso-utilities/`. Click "Copy bio". Expected:
- Button label changes to "Copied" with a check mark.
- After ~1.8s, label restores to "Copy bio".
- Pasting (`Ctrl+V`) into a text field yields the bio text.

- [ ] **Step 5: Commit (only the JS + SCSS — not the QA page)**

The QA page stays untracked. Stage only the real changes:

```bash
git add assets/js/main.js assets/css/_components.scss
git commit -m "components: add data-copy utility with feedback state"
```

Verify the QA file is still untracked:

```bash
git status --short
```

Expected: `dev-riso-utilities.html` still shown as `??`.

---

## Task 7: Search trigger placeholder (`data-search`)

**Files:**
- Modify: `_includes/nav.html`, `assets/js/main.js`, `_data/i18n.yml`, `assets/css/_components.scss`

The placeholder ships in F0; the modal is wired to Pagefind in F5. Until then, clicking the button emits a console message and does nothing user-visible — it's a structural placeholder so F1's home doesn't have to revisit the nav.

- [ ] **Step 1: Add search labels to i18n**

Open `_data/i18n.yml`. Inside `en.nav`, add:

```yaml
    search: Search
```

Inside `es.nav`:

```yaml
    search: Buscar
```

- [ ] **Step 2: Add the search button to nav**

Open `_includes/nav.html`. Find the existing inserted line `{% include theme-toggle.html %}` (from Task 3). Insert the search button immediately before it:

```html
      <button
        type="button"
        class="nav-search"
        data-search-trigger
        aria-label="{{ t.nav.search }}"
        title="{{ t.nav.search }} (/)"
      >
        <span aria-hidden="true">⌕</span>
      </button>
      {% include theme-toggle.html %}
```

- [ ] **Step 3: Add nav-search styles**

Open `assets/css/_components.scss`. Append:

```scss
.nav-search {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border: 1px solid color-mix(in srgb, var(--rule) 22%, transparent);
  background: transparent;
  border-radius: 999px;
  cursor: pointer;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

.nav-search:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.nav-search:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```

- [ ] **Step 4: Add the placeholder JS handler**

Open `assets/js/main.js`. Inside the `DOMContentLoaded` listener, append:

```js
  // Search trigger placeholder — Pagefind modal lands in F5.
  // Wired now so F1's home redesign doesn't have to revisit the nav.
  const searchBtn = document.querySelector("[data-search-trigger]");
  function openSearch() {
    if (typeof window.__amloiiOpenSearch === "function") {
      window.__amloiiOpenSearch();
    } else {
      console.info("[search] Pagefind modal not yet wired (F5).");
    }
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", openSearch);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const t = e.target;
      const tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
      e.preventDefault();
      openSearch();
    }
  });
```

- [ ] **Step 5: Build and verify**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
grep 'data-search-trigger' _site/index.html
```

Expected: the search button is present in the rendered nav.

- [ ] **Step 6: Manual smoke test**

Visit `http://localhost:4000/`. Open the browser console. Press `/`. Expected: the console logs `[search] Pagefind modal not yet wired (F5).`. Click the search icon — same console message. Type `/` while focused on a text input — no console message (don't intercept inside form fields).

- [ ] **Step 7: Commit**

```bash
git add _includes/nav.html assets/js/main.js _data/i18n.yml assets/css/_components.scss
git commit -m "nav: add search trigger placeholder (Pagefind modal lands in F5)"
```

---

## Task 8: Refactor `_print.scss` to clean baseline

**Files:**
- Modify: `assets/css/_print.scss`

The print stylesheet currently bakes in CV-specific styles (`.tl-item`, `.availability-box`). Those return in F2 with a CV-specific override. F0 leaves a minimal, theme-agnostic baseline.

- [ ] **Step 1: Replace `_print.scss` with a clean baseline**

Overwrite `assets/css/_print.scss` with:

```scss
// Print-friendly baseline — page-specific overrides land in their own phase
// (CV calm-mode in F2, post layout in F3).

@media print {
  // Force light surface; never print warm coal.
  :root,
  [data-theme="dark"] {
    --paper:        #ffffff;
    --bone:         #ffffff;
    --paper-warm:   #ffffff;
    --ink:          #000000;
    --muted:        #333333;
    --rule:         #000000;
    --accent:       #000000;
    --riso-red:     #000000;
    --riso-blue:    #000000;
  }

  body {
    background: #fff !important;
    color: #000 !important;
    font-size: 11pt;
  }

  .site-nav,
  .site-footer,
  .skip-link,
  .no-print,
  .nav-search,
  .theme-toggle,
  [data-search-trigger],
  [data-theme-toggle] {
    display: none !important;
  }

  a {
    color: #000 !important;
    text-decoration: none !important;
  }

  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 9pt;
    word-break: break-all;
  }

  .section { padding-block: 1rem !important; break-inside: avoid; }

  // Silence ALL Riso decoration in print, regardless of two-pace contract.
  .riso-paper,
  .riso-halftone,
  .riso-double-print,
  .riso-stamp,
  .riso-photo,
  .riso-frame {
    background: none !important;
    text-shadow: none !important;
    border: none !important;
    transform: none !important;
  }

  .riso-halftone::before,
  .riso-photo::before,
  .riso-photo::after { display: none !important; }
}
```

- [ ] **Step 2: Build and check print preview**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Open `http://localhost:4000/cv/` and trigger browser print preview (Ctrl+P).

Expected:
- Background white.
- Text black.
- Nav, theme toggle, search trigger, footer, skip-link all hidden.
- Riso decorations silenced.
- The CV is still readable; experience timeline still has bullet structure (CV-specific print polish lands in F2).

- [ ] **Step 3: Commit**

```bash
git add assets/css/_print.scss
git commit -m "print: clean baseline (CV-specific polish moves to F2)"
```

---

## Task 9: i18n bug fixes — ES copy

**Files:**
- Modify: `_data/i18n.yml`, `_data/cv.yml`

Two known bugs in the existing data files:
- `_data/i18n.yml` — ES section: `cv.download` is `"Download PDF (EN)"` (English copy in a Spanish UI).
- `_data/cv.yml` — ES section: `languages[1].level` is `"Nativo / bilingual"` (typo: `bilingual` should be `bilingüe`).

- [ ] **Step 1: Fix the ES download label**

Open `_data/i18n.yml`. Find the ES section. The current ES `cv` block has:

```yaml
  cv:
    download: Download PDF (EN)
    download_es: Descargar PDF (ES)
    print: Imprimir esta página
```

Replace `download: Download PDF (EN)` with `download: Descargar PDF (EN)`. The result:

```yaml
  cv:
    download: Descargar PDF (EN)
    download_es: Descargar PDF (ES)
    print: Imprimir esta página
```

The English-language `en.cv.download: Download PDF (EN)` stays unchanged.

- [ ] **Step 2: Fix the `bilingual` typo in CV data**

Open `_data/cv.yml`. Find the ES `languages` block (around line 269):

```yaml
  languages:
    - { name: "Inglés", level: "Profesional completo" }
    - { name: "Español", level: "Nativo / bilingual" }
```

Replace `Nativo / bilingual` with `Nativo / bilingüe`. The result:

```yaml
  languages:
    - { name: "Inglés", level: "Profesional completo" }
    - { name: "Español", level: "Nativo / bilingüe" }
```

- [ ] **Step 3: Quick audit of remaining ES strings**

Open `_data/i18n.yml`. Read the entire ES block top to bottom, looking for English remnants. Document any other strings that need fixing in this commit.

Known acceptable English-in-ES strings (do NOT change):
- `home.subs_title: Ensayos por correo` — fine
- `cv.linkedin: LinkedIn` — proper noun
- `speaking.copy: Copiar` — fine
- The `cross-post rule` line in `home.subs_blurb` — Spanish copy, fine

Any string you find that's still English where it shouldn't be: fix in the same edit.

- [ ] **Step 4: Build, then verify the ES CV page**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Visit `http://localhost:4000/es/trayectoria/`. Confirm:
- The "Descargar PDF (EN)" / "Descargar PDF (ES)" buttons both read in Spanish.
- The languages line reads `Inglés — Profesional completo · Español — Nativo / bilingüe`.

- [ ] **Step 5: Commit**

```bash
git add _data/i18n.yml _data/cv.yml
git commit -m "i18n(es): fix download label and bilingüe typo"
```

---

## Task 10: Move "now" content to `_data/now.yml`

**Files:**
- Create: `_data/now.yml`
- Modify: `now/index.md`, `es/ahora/index.md`

F0 puts the data file in place and converts the existing flat-list rendering to read from it. F1 will pull 3 status strings from this file for the home sub-hero. F4 will rebuild the Now page UI into 4 structured blocks. The data shape must support both.

- [ ] **Step 1: Create `_data/now.yml`**

Create the file with:

```yaml
en:
  updated: "2026-05-06"
  status:
    - "shipping · agents v3"
    - "writing · 04 essays in flight"
    - "advisory · selectively open"
  blocks:
    building:
      - "Architecting multimodal ingestion hardening experiments for BillionHands-scale agent stacks — memory contracts + deterministic evaluators."
      - "Prototyping evaluator-in-the-middle dashboards for hallucination hotspots (internal pilots only)."
    reading:
      - "Melanie Mitchell · *Artificial Intelligence* (second pass, Spanish edition for nuance swaps)."
      - "Re-reading Russell & Norvig for teaching analogies aimed at CTO audiences."
    writing:
      - "Margin budgets for agent graphs — published 2026-05-05."
    speaking: []

es:
  updated: "2026-05-06"
  status:
    - "shipping · agentes v3"
    - "writing · 04 ensayos en marcha"
    - "advisory · abierto selectivamente"
  blocks:
    building:
      - "Diseño de ingestas multimodales y contratos observables sobre agentes corporativos (piloto interno)."
      - "Paneles evaluator-in-the-middle para hotspots de alucinaciones (sólo labs internos)."
    reading:
      - "Mitchell · *Inteligencia artificial: un enfoque moderno*."
      - "Reinterpretando Russell & Norvig para comunicación ejecutiva bilingüe."
    writing:
      - "Margin budgets para grafos de agentes — publicado 2026-05-05."
    speaking: []
```

- [ ] **Step 2: Update `now/index.md` to render from data**

Open `now/index.md`. Replace its entire body (the 4 bullet items below the front matter) so the file reads:

```markdown
---
layout: page
lang: en
ref: now
title: Now
permalink: /now/
intro: "Monthly snapshot · Last updated {{ site.data.now.en.updated }}"
hide_footer: false
---

{% assign n = site.data.now.en %}

{% for key in "building,reading,writing,speaking" | split: "," %}
  {% assign items = n.blocks[key] %}
  {% if items and items.size > 0 %}
    {% for it in items %}
- {{ it }}
    {% endfor %}
  {% endif %}
{% endfor %}
```

Note: this preserves the current flat-list look; F4 reshapes into 4 distinct blocks.

- [ ] **Step 3: Update `es/ahora/index.md` symmetrically**

Open `es/ahora/index.md`. Replace its body so it reads:

```markdown
---
layout: page
lang: es
ref: now
title: Ahora
permalink: /es/ahora/
intro: "Ritmo mensual · Última actualización {{ site.data.now.es.updated }}"
---

{% assign n = site.data.now.es %}

{% for key in "building,reading,writing,speaking" | split: "," %}
  {% assign items = n.blocks[key] %}
  {% if items and items.size > 0 %}
    {% for it in items %}
- {{ it }}
    {% endfor %}
  {% endif %}
{% endfor %}
```

- [ ] **Step 4: Build and verify both Now pages**

Run:

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Visit `http://localhost:4000/now/`. Expected:
- Title "Now"
- Subtitle "Monthly snapshot · Last updated 2026-05-06"
- 5 bullet items (2 building, 2 reading, 1 writing, 0 speaking).

Visit `http://localhost:4000/es/ahora/`. Expected: equivalent in Spanish.

The visual output is intentionally near-identical to baseline — the structural change is in the data layer.

- [ ] **Step 5: Commit**

```bash
git add _data/now.yml now/index.md es/ahora/index.md
git commit -m "data: move now content to _data/now.yml (structured for F1 + F4)"
```

---

## Task 11: Delete the QA scratch file

**Files:**
- Delete (untracked): `dev-riso-utilities.html`

The QA page was never staged. We just remove the local file.

- [ ] **Step 1: Delete the validation page**

```bash
rm dev-riso-utilities.html
```

- [ ] **Step 2: Confirm git is clean**

```bash
git status --short
```

Expected: nothing — the worktree is clean (no staged, unstaged, or untracked changes).

- [ ] **Step 3: Build and confirm the page is gone from `_site`**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Then:

```bash
ls _site/dev-riso-utilities 2>/dev/null && echo "REGRESSION: page still exists" || echo "OK: page is gone"
```

Expected: `OK: page is gone`.

- [ ] **Step 4: Spot-check baseline pages still render**

Visit `http://localhost:4000/`, `/cv/`, `/writing/`, `/now/`. All should render normally.

This task does not produce a commit (nothing changed in tracked files).

---

## Task 12: Final QA sweep

**Files:** none modified — verification only.

- [ ] **Step 1: Visual regression vs Task 0 baseline screenshots**

Compare each screenshot from Task 0 with the current rendering at `http://localhost:4000/`:

1. `/` — should be visually identical except for: nav now has theme + search icons; `<h1>` slightly larger (display scale bumped).
2. `/cv/` — same as home re. nav. CV body unchanged.
3. `/work/` — same.
4. `/writing/` — same.
5. The single existing post — same.
6. `/speaking-press/` — same.
7. `/now/` — body looks identical (5 bullets); subtitle now reads "Last updated 2026-05-06".
8. `/about/` — same.
9. `/contact/` — same.
10. `/es/` — same.
11. `/es/trayectoria/` — `bilingüe` correct; ES download label correct.
12. Print preview of `/cv/` — clean baseline; nav/footer/toggles hidden.

If any page has unexpected differences (broken layout, missing element, color shift in light mode), open the browser DevTools and find the cause before continuing.

- [ ] **Step 2: Dark mode sweep**

Click the theme toggle. Visit each page from Step 1 in dark mode. Expected:
- All text legible (warm cream on warm coal).
- No invisible elements (e.g., a button border that disappears in dark).
- Riso decorations adjust appropriately (verified earlier on QA page; spot-check `/cv/` since it has `.riso-frame`).
- Code blocks and `<pre>` blocks readable.

- [ ] **Step 3: Theme persistence**

Toggle to dark. Reload. Expected: page loads in dark immediately, no flicker.

Open in a private/incognito window. Expected: the window respects `prefers-color-scheme` (system theme), not the localStorage from the other window.

- [ ] **Step 4: Accessibility quick check**

In the browser, run Lighthouse on `/` and `/cv/`:

```
Lighthouse → Accessibility audit
```

Expected: ≥ 95 score on both pages, both modes. Document any new issues introduced by F0 (theme toggle aria-label, search aria-label) and fix them. Pre-existing issues from before F0 are out of scope for this phase — note them for F5.

- [ ] **Step 5: Run a final build**

```bash
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

Expected: clean, no warnings related to our changes.

---

## Task 13: Open the F0 PR

**Files:** none modified.

- [ ] **Step 1: Confirm the commit history of this branch**

```bash
git log --oneline main..HEAD
```

Expected commits (in this order):

1. `tokens: introduce dual light/dark palette and bump display scale`
2. `head: add anti-flicker theme bootstrap script`
3. `nav: add theme toggle (light/dark with localStorage persistence)`
4. `riso: full utility set (paper, halftone, double-print, stamp, photo, frame)`
5. `components: add data-copy utility with feedback state`
6. `nav: add search trigger placeholder (Pagefind modal lands in F5)`
7. `print: clean baseline (CV-specific polish moves to F2)`
8. `i18n(es): fix download label and bilingüe typo`
9. `data: move now content to _data/now.yml (structured for F1 + F4)`

(No commit for the QA scratch file — it stayed untracked and was deleted in Task 11.)

- [ ] **Step 2: Push the branch (when the user explicitly authorizes the push)**

Wait for explicit user authorization before pushing. When authorized:

```bash
git push -u origin claude/recursing-blackburn-a3fce3
```

- [ ] **Step 3: Open the PR (when the user explicitly authorizes)**

Wait for explicit user authorization before opening the PR. When authorized:

```bash
gh pr create --title "F0: dark mode + Riso utilities + foundations" --body "$(cat <<'EOF'
## Summary
- Dual-palette tokens (light + warm-coal dark) with `data-theme` switching and an inline anti-flicker bootstrap.
- Theme toggle in nav with localStorage persistence; Pagefind search trigger placeholder (modal lands in F5).
- Full Riso utility set as CSS-only: `.riso-paper`, `.riso-halftone`, `.riso-double-print`, `.riso-stamp`, `.riso-photo`, refined `.riso-frame`. Two-pace contract enforced inside `.cv-page`.
- `data-copy` button utility for clipboard actions.
- Clean print baseline; CV-specific polish lands in F2.
- ES copy fixes (`bilingüe`, `Descargar PDF (EN)`).
- `_data/now.yml` introduced; both `/now/` and `/es/ahora/` render from data with no visual change yet.

## Test plan
- [ ] Light mode: every page renders identical to baseline (modulo slightly larger H1 from display scale bump).
- [ ] Dark mode: every page is legible; no invisible elements; Riso decorations adjust blends.
- [ ] Theme toggle persists across reloads; respects `prefers-color-scheme` on first visit.
- [ ] No flicker on slow CPU.
- [ ] `/` keyboard shortcut opens search placeholder; ignored inside form fields.
- [ ] Copy button feedback works on QA page (already removed; tested locally).
- [ ] Print preview of `/cv/` is clean monochrome.
- [ ] Lighthouse Accessibility ≥ 95 on `/` and `/cv/`, both modes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review (run before handing off to execution)

After all tasks land, do one pass with fresh eyes:

- **Spec coverage**: every F0 bullet in §8 of the spec is addressed by exactly one task above.
- **Placeholder scan**: no "TBD", no "etc.", every code block is complete.
- **Type consistency**: data-attribute names (`data-theme-toggle`, `data-search-trigger`, `data-copy`, `data-copy-target`) are spelled the same in markup and JS.
- **i18n**: every new English string has a Spanish counterpart in `_data/i18n.yml`.
- **Test discipline**: every visual change has a verification step (build + screenshot/spot-check). Where a real test framework would have unit tests, this Jekyll site uses build-and-render verification — that's the pragmatic ceiling.

---

## What's NOT in this phase (for clarity)

- Home redesign — F1.
- CV calm-mode treatment, sticky CTA, capability grid — F2.
- Writing index redesign, post template (TOC, sidenotes, related, prev/next, inline newsletter), blog scaffolds — F3.
- Work pages, speaking bios, structured Now page UI, contact micro-copy — F4.
- Pagefind modal wiring, OG image template, real giscus IDs, Formspree endpoint, real headshot integration, ES copy audit, 404 redesign, Lighthouse 95+ pass — F5.
