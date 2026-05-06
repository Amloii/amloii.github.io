# Renovation F3b — Blog Scaffolds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seed the blog with 5 draft post scaffolds in EN + ES (10 files), all marked `draft: true`. Each scaffold ships full front matter, a working title, a kicker, a hero illustration suggestion, 4-5 H2 skeleton sections with `<!-- contenido pendiente -->` comments, and one example `{% include sn.html %}` sidenote so the author has a copy-paste template. Add a draft filter to `_layouts/hub-writing.html`, `index.html`, and `es/index.html` so drafts don't leak into listings.

**Architecture:** Pure content + a small Liquid filter on three existing files. No new CSS, JS, or includes.

**Tech Stack:** Jekyll 3.10, Liquid, kramdown.

**Companion spec:** [docs/superpowers/specs/2026-05-06-amloii-riso-forward-renovation-design.md](../specs/2026-05-06-amloii-riso-forward-renovation-design.md) §9
**Predecessors:** F0/F1/F2/F3a (all on `main`).

---

## File structure

**Files modified:**
- `_layouts/hub-writing.html` — filter `bucket_posts` and `unassigned` lists with `where_exp: "p", "p.draft != true"`.
- `index.html` — pre-filter `site.posts` for the Fresh essays loop.
- `es/index.html` — same.

**Files created (10):**

`_posts/` — all dated `2026-05-06` (today's placeholder; user adjusts when publishing) and all marked `draft: true`. Filename convention: EN posts use bare slug; ES posts prefix with `es-`.

| EN file | ES file | Pillar | Slug | Hero illustration |
|---|---|---|---|---|
| `_posts/2026-05-06-eval-harness-as-first-class-dag-node.md` | `_posts/2026-05-06-es-eval-harness-as-first-class-dag-node.md` | building-agents | eval-harness-as-first-class-dag-node | eval-loop |
| `_posts/2026-05-06-from-cajal-rigs-to-agent-fleets.md` | `_posts/2026-05-06-es-from-cajal-rigs-to-agent-fleets.md` | research-to-prod | from-cajal-rigs-to-agent-fleets | rag-stack |
| `_posts/2026-05-06-vendor-vs-build-cheatsheet-for-ai-directors.md` | `_posts/2026-05-06-es-vendor-vs-build-cheatsheet-for-ai-directors.md` | ai-leadership | vendor-vs-build-cheatsheet-for-ai-directors | decision-graph |
| `_posts/2026-05-06-agentic-roadmap-questions-i-ask-cto.md` | `_posts/2026-05-06-es-agentic-roadmap-questions-i-ask-cto.md` | ai-leadership | agentic-roadmap-questions-i-ask-cto | ops-tower |
| `_posts/2026-05-06-til-prompt-cache-vs-retrieval-budget.md` | `_posts/2026-05-06-es-til-prompt-cache-vs-retrieval-budget.md` | operators-notebook | til-prompt-cache-vs-retrieval-budget | agent-pipeline |

---

## Task 1: Add `draft` filter to listing layouts

**Files:**
- Modify: `_layouts/hub-writing.html`
- Modify: `index.html`
- Modify: `es/index.html`

### Step 1: `_layouts/hub-writing.html`

Find this line:
```liquid
      {% assign bucket_posts = site.posts | where: "pillar", pid %}
```
Replace with:
```liquid
      {% assign bucket_posts = site.posts | where: "pillar", pid | where_exp: "p", "p.draft != true" %}
```

Find this line:
```liquid
    {% assign unassigned = site.posts | where_exp: 'p', 'p.pillar == nil' %}
```
Replace with:
```liquid
    {% assign unassigned = site.posts | where_exp: 'p', 'p.pillar == nil' | where_exp: 'p', 'p.draft != true' %}
```

### Step 2: `index.html` (EN home, Fresh essays)

Find this block:
```liquid
      {% for post in site.posts limit:2 %}
```
Replace with:
```liquid
      {% assign published_posts = site.posts | where_exp: 'p', 'p.draft != true' %}
      {% for post in published_posts limit:2 %}
```

### Step 3: `es/index.html` (ES home, Fresh essays)

Same change as Step 2 — find `{% for post in site.posts limit:2 %}` and prepend the `published_posts` assignment.

### Step 4: Build + verify

```
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Clean expected (no scaffolds yet, so no filtering happens; just confirms syntax is valid).

### Step 5: Commit

```
git add _layouts/hub-writing.html index.html es/index.html
git commit -m "writing: filter draft:true posts from home and writing index listings"
```

---

## Task 2: Create the 10 scaffold files (single commit)

**Files:** 10 new `.md` files in `_posts/`.

Create each file with the content shown below. Front-matter conventions:
- `lang`: `en` or `es`
- `draft: true` (required for filter exclusion)
- `pillar`: one of `building-agents`, `research-to-prod`, `ai-leadership`, `operators-notebook`
- `kicker`: a short editorial label
- `hero_illustration`: existing SVG name (no extension)
- `description`: SEO meta — a one-sentence promise
- `image: /assets/img/og/<slug>.svg` (file doesn't exist yet — F5 OG template generates them)

### Step 1: Create EN scaffold #1 — `_posts/2026-05-06-eval-harness-as-first-class-dag-node.md`

```markdown
---
title: "Eval harnesses are graph nodes, not weekend notebooks"
layout: post
lang: en
ref: writing
description: "Why evaluators belong inside your agent DAG with the same SLOs as production tools — and what breaks when they don't."
pillar: building-agents
hero_illustration: eval-loop
kicker: "Issue 02 · Notes from production"
draft: true
comments: true
image: /assets/img/og/eval-harness-as-first-class-dag-node.svg
date: 2026-05-06
---

<!-- contenido pendiente: opening hook — the moment a eval-as-notebook gap bit you in production. 2-3 sentences. -->

## Why evaluators are graph nodes, not weekend notebooks

<!-- contenido pendiente: argue that evaluators must run on the same artifacts as prod (prompt versions, memory snapshots, tool traces) and live in the same orchestration. ~150 words. Add a sidenote like the example below for any "I once saw..." aside. -->

This claim has teeth{% include sn.html n="1" text="The 2025 incident at Multimarkts where a notebook eval missed a multilingual regression because it ran a stale prompt template — production caught it three weeks later." %}.

## The contract: golden datasets + drift policy

<!-- contenido pendiente: define the eval contract — what inputs, what assertions, what tolerance, what cadence. ~150 words. -->

## The promotion gate

<!-- contenido pendiente: how the eval node blocks promotion when drift exceeds policy. Reference: F0 plan post mentioned this. ~120 words. -->

## What goes wrong when evaluators are weekend notebooks

<!-- contenido pendiente: anti-patterns (eval drift from prod, owner-of-record undefined, no rerun on prompt change). 3-5 bullets. ~120 words. -->

---

<!-- contenido pendiente: closing line + CTA. -->
```

### Step 2: Create ES scaffold #1 — `_posts/2026-05-06-es-eval-harness-as-first-class-dag-node.md`

```markdown
---
title: "Los evaluadores son nodos del grafo, no notebooks de fin de semana"
layout: post
lang: es
ref: writing
description: "Por qué los evaluadores deben estar dentro del DAG de agentes con los mismos SLO que las herramientas de producción — y qué se rompe cuando no es así."
pillar: building-agents
hero_illustration: eval-loop
kicker: "Issue 02 · Notas desde producción"
draft: true
comments: true
image: /assets/img/og/es-eval-harness-as-first-class-dag-node.svg
date: 2026-05-06
---

<!-- contenido pendiente: gancho de apertura — el momento en que un eval tipo notebook te falló en producción. 2-3 frases. -->

## Por qué los evaluadores son nodos del grafo, no notebooks de fin de semana

<!-- contenido pendiente: argumentar que los evaluadores deben correr sobre los mismos artefactos de prod (versiones de prompt, snapshots de memoria, trazas de herramientas) y vivir en la misma orquestación. ~150 palabras. -->

Esta afirmación tiene filo{% include sn.html n="1" text="El incidente de 2025 en Multimarkts donde un eval en notebook se perdió una regresión multilingüe porque corría con una plantilla de prompt obsoleta — producción lo detectó tres semanas después." %}.

## El contrato: datasets dorados + política de drift

<!-- contenido pendiente: definir el contrato del eval — qué entradas, qué aserciones, qué tolerancia, qué cadencia. ~150 palabras. -->

## La puerta de promoción

<!-- contenido pendiente: cómo el nodo de eval bloquea la promoción cuando el drift supera la política. ~120 palabras. -->

## Qué falla cuando los evaluadores son notebooks de fin de semana

<!-- contenido pendiente: anti-patrones (drift entre eval y prod, dueño indefinido, sin re-ejecución al cambiar prompt). 3-5 bullets. ~120 palabras. -->

---

<!-- contenido pendiente: línea de cierre + CTA. -->
```

### Step 3: Create EN scaffold #2 — `_posts/2026-05-06-from-cajal-rigs-to-agent-fleets.md`

```markdown
---
title: "From Cajal rigs to agent fleets — the personal arc as a technical argument"
layout: post
lang: en
ref: writing
description: "Twelve years from electrophysiology rigs at Cajal to multi-agent stacks in production. The instincts that transferred and the ones I had to unlearn."
pillar: research-to-prod
hero_illustration: rag-stack
kicker: "Issue 03 · Career as method"
draft: true
comments: true
image: /assets/img/og/from-cajal-rigs-to-agent-fleets.svg
date: 2026-05-06
---

<!-- contenido pendiente: opening — frame the question "what does electrophysiology teach you about agents?" 2-3 sentences. -->

## The Cajal rig habits I kept

<!-- contenido pendiente: rigorous experimental design, signal-vs-noise discipline, "always have a control", reproducibility. Tie each to an agent stack equivalent. ~180 words. -->

## The classical-ML decade that bridged

<!-- contenido pendiente: 2018-2023 working on vision/NLP/RecSys. The shift from "modeling a system" to "modeling a behavior". ~150 words. -->

## Generative AI: same instincts, new substrate

<!-- contenido pendiente: 2023+ at Multimarkts. What stayed identical, what felt foreign. ~150 words. -->

## Agent fleets: where rigorous experimentation pays again

<!-- contenido pendiente: 2025+ at BillionHands. Why agentic systems make experimental discipline matter more, not less. Eval contracts, memory hygiene, drift policy. ~180 words. -->

---

<!-- contenido pendiente: closing — what advice I'd give my younger self at the rig. -->
```

### Step 4: Create ES scaffold #2 — `_posts/2026-05-06-es-from-cajal-rigs-to-agent-fleets.md`

```markdown
---
title: "De los registros de Cajal a las flotas de agentes — la trayectoria personal como argumento técnico"
layout: post
lang: es
ref: writing
description: "Doce años desde los registros de electrofisiología en Cajal hasta los stacks multiagente en producción. Los instintos que se transfirieron y los que tuve que desaprender."
pillar: research-to-prod
hero_illustration: rag-stack
kicker: "Issue 03 · Carrera como método"
draft: true
comments: true
image: /assets/img/og/es-from-cajal-rigs-to-agent-fleets.svg
date: 2026-05-06
---

<!-- contenido pendiente: apertura — plantear la pregunta "¿qué te enseña la electrofisiología sobre agentes?". 2-3 frases. -->

## Los hábitos del Cajal que me llevé

<!-- contenido pendiente: diseño experimental riguroso, disciplina señal-vs-ruido, "siempre ten un control", reproducibilidad. Mapear cada uno a su equivalente en stacks de agentes. ~180 palabras. -->

## La década clásica de ML que tendió el puente

<!-- contenido pendiente: 2018-2023 trabajando en visión/NLP/RecSys. El cambio de "modelar un sistema" a "modelar un comportamiento". ~150 palabras. -->

## IA generativa: mismos instintos, nuevo sustrato

<!-- contenido pendiente: 2023+ en Multimarkts. Qué siguió idéntico, qué se sintió ajeno. ~150 palabras. -->

## Flotas de agentes: donde la experimentación rigurosa vuelve a pagar

<!-- contenido pendiente: 2025+ en BillionHands. Por qué los sistemas agénticos hacen que la disciplina experimental importe más, no menos. Contratos de eval, higiene de memoria, política de drift. ~180 palabras. -->

---

<!-- contenido pendiente: cierre — qué consejo le daría a mi yo más joven en el rig. -->
```

### Step 5: Create EN scaffold #3 — `_posts/2026-05-06-vendor-vs-build-cheatsheet-for-ai-directors.md`

```markdown
---
title: "Vendor vs build for AI directors — a cheatsheet"
layout: post
lang: en
ref: writing
description: "A concrete framework for the vendor-vs-build call in agentic stacks: three questions before signing, the hybrid path most teams should take, and the procurement veto nobody warns you about."
pillar: ai-leadership
hero_illustration: decision-graph
kicker: "Issue 04 · Procurement as architecture"
draft: true
comments: true
image: /assets/img/og/vendor-vs-build-cheatsheet-for-ai-directors.svg
date: 2026-05-06
---

<!-- contenido pendiente: opening — the call most AI directors get wrong (bias either way) and why neither extreme works. 2-3 sentences. -->

## The 3 questions I ask before signing a vendor

<!-- contenido pendiente:
  Q1: Is this on your team's "core differentiation" axis?
  Q2: How fast does the vendor's roadmap match your roadmap?
  Q3: What's the offboard cost in months and dollars?
  ~180 words. -->

## When build wins (and what it costs you)

<!-- contenido pendiente: build wins when offboard cost > 6mo, when your data is the moat, when latency/cost ceilings are non-negotiable. The cost: 30-60% of senior eng quarter. ~150 words. -->

## The hybrid path: rent the runway, own the throughline

<!-- contenido pendiente: rent the boring infra (eval harness, observability, vector DB), own the policy + memory + agent contracts. ~150 words. -->

## Procurement's quiet veto

<!-- contenido pendiente: data residency, security review, AI act compliance. Account for these on day 0 or you eat them on day 60. ~120 words. -->

---

<!-- contenido pendiente: closing line + CTA. -->
```

### Step 6: Create ES scaffold #3 — `_posts/2026-05-06-es-vendor-vs-build-cheatsheet-for-ai-directors.md`

```markdown
---
title: "Vendor vs. build para directores de IA — una hoja resumen"
layout: post
lang: es
ref: writing
description: "Un marco concreto para la decisión vendor-vs-build en stacks agénticos: tres preguntas antes de firmar, el camino híbrido que casi todos los equipos deberían tomar, y el veto de compras del que nadie te avisa."
pillar: ai-leadership
hero_illustration: decision-graph
kicker: "Issue 04 · Compras como arquitectura"
draft: true
comments: true
image: /assets/img/og/es-vendor-vs-build-cheatsheet-for-ai-directors.svg
date: 2026-05-06
---

<!-- contenido pendiente: apertura — la decisión que la mayoría de directores de IA pifian (sesgo en cualquier dirección) y por qué ninguno de los dos extremos funciona. 2-3 frases. -->

## Las 3 preguntas que hago antes de firmar a un vendor

<!-- contenido pendiente:
  P1: ¿Está esto en el eje de "diferenciación core" de tu equipo?
  P2: ¿Cómo de rápido coincide la roadmap del vendor con la tuya?
  P3: ¿Cuál es el coste de salida en meses y euros?
  ~180 palabras. -->

## Cuándo gana build (y qué te cuesta)

<!-- contenido pendiente: build gana cuando el coste de salida > 6 meses, cuando tu dato es el foso, cuando los techos de latencia/coste son innegociables. El coste: 30-60% de un trimestre de un senior. ~150 palabras. -->

## El camino híbrido: alquila la pista, posee la línea maestra

<!-- contenido pendiente: alquila la infra aburrida (eval harness, observabilidad, vector DB), posee la política + memoria + contratos de agentes. ~150 palabras. -->

## El veto silencioso de compras

<!-- contenido pendiente: residencia de datos, revisión de seguridad, cumplimiento del AI Act. Cuéntalos desde el día 0 o te los comes en el día 60. ~120 palabras. -->

---

<!-- contenido pendiente: línea de cierre + CTA. -->
```

### Step 7: Create EN scaffold #4 — `_posts/2026-05-06-agentic-roadmap-questions-i-ask-cto.md`

```markdown
---
title: "The questions I ask a CTO before touching their agent roadmap"
layout: post
lang: en
ref: writing
description: "Five questions that change the conversation when a CTO opens a deck with 'we want to build agents'."
pillar: ai-leadership
hero_illustration: ops-tower
kicker: "Issue 05 · Roadmap as forensics"
draft: true
comments: true
image: /assets/img/og/agentic-roadmap-questions-i-ask-cto.svg
date: 2026-05-06
---

<!-- contenido pendiente: opening — most agent roadmaps fail in the first 5 minutes of conversation; here's how I open. 2-3 sentences. -->

## "What's the unit of value per agent call?"

<!-- contenido pendiente: dollars per successful outcome, not per request. The shift forces them to define "successful outcome". ~120 words. -->

## "Where does memory belong in this graph?"

<!-- contenido pendiente: memory contracts: who writes, who reads, what's the TTL, what's the audit. Without an answer the agent fleet rots. ~150 words. -->

## "Who owns the eval contract?"

<!-- contenido pendiente: not the data team, not the ML team — a single named owner with promotion authority. ~120 words. -->

## "What's the cost ceiling per outcome?"

<!-- contenido pendiente: ceiling > average. Ceiling exposes runaway tool fan-out before it bills. ~120 words. -->

## "How do you know an agent has lost the plot?"

<!-- contenido pendiente: the silent failure modes — confident wrong answers, drift across long-horizon memory, tool misuse. Detection strategies. ~150 words. -->

---

<!-- contenido pendiente: closing — what a good CTO answers and what's an "I'll get back to you". -->
```

### Step 8: Create ES scaffold #4 — `_posts/2026-05-06-es-agentic-roadmap-questions-i-ask-cto.md`

```markdown
---
title: "Las preguntas que hago a un CTO antes de tocar su roadmap de agentes"
layout: post
lang: es
ref: writing
description: "Cinco preguntas que cambian la conversación cuando un CTO abre un deck con 'queremos construir agentes'."
pillar: ai-leadership
hero_illustration: ops-tower
kicker: "Issue 05 · La hoja de ruta como forense"
draft: true
comments: true
image: /assets/img/og/es-agentic-roadmap-questions-i-ask-cto.svg
date: 2026-05-06
---

<!-- contenido pendiente: apertura — la mayoría de las roadmaps de agentes fallan en los primeros 5 minutos de conversación; así abro yo. 2-3 frases. -->

## "¿Cuál es la unidad de valor por llamada de agente?"

<!-- contenido pendiente: euros por resultado exitoso, no por petición. El cambio les obliga a definir "resultado exitoso". ~120 palabras. -->

## "¿Dónde vive la memoria en este grafo?"

<!-- contenido pendiente: contratos de memoria: quién escribe, quién lee, cuál es el TTL, cuál es el audit. Sin respuesta la flota de agentes se pudre. ~150 palabras. -->

## "¿Quién es dueño del contrato de eval?"

<!-- contenido pendiente: no el equipo de datos, no el equipo de ML — un dueño nombrado con autoridad de promoción. ~120 palabras. -->

## "¿Cuál es el techo de coste por resultado?"

<!-- contenido pendiente: techo > media. El techo expone el fan-out descontrolado antes de que facture. ~120 palabras. -->

## "¿Cómo sabéis que un agente ha perdido el hilo?"

<!-- contenido pendiente: los modos de fallo silenciosos — respuestas confiadas e incorrectas, drift en memoria de largo plazo, mal uso de herramientas. Estrategias de detección. ~150 palabras. -->

---

<!-- contenido pendiente: cierre — qué responde un buen CTO y qué es un "te lo digo en otra reunión". -->
```

### Step 9: Create EN scaffold #5 — `_posts/2026-05-06-til-prompt-cache-vs-retrieval-budget.md`

```markdown
---
title: "TIL: prompt cache vs retrieval budget"
layout: post
lang: en
ref: writing
description: "A short field note on the day prompt caching saved a retrieval budget — and the day it nearly cost us one."
pillar: operators-notebook
hero_illustration: agent-pipeline
kicker: "TIL · Field note"
draft: true
comments: true
image: /assets/img/og/til-prompt-cache-vs-retrieval-budget.svg
date: 2026-05-06
---

<!-- contenido pendiente: 1-line opening framing the TIL. -->

## The setup

<!-- contenido pendiente: what the system was, what we expected the cache to do. ~80 words. -->

## What I expected

<!-- contenido pendiente: cache hits would save tokens, retrieval cost stays flat. ~60 words. -->

## What actually happened

<!-- contenido pendiente: cache hits invalidated when the retrieval result changed by even one token, blowing up the cache miss rate. Numbers if you have them. ~120 words. -->

## The fix

<!-- contenido pendiente: stable retrieval ordering, normalize whitespace pre-cache, consider a cache key that's resilient to retrieval reorder. ~100 words. -->

## Open questions

<!-- contenido pendiente: 2-3 things you'd still like to test. ~60 words. -->
```

### Step 10: Create ES scaffold #5 — `_posts/2026-05-06-es-til-prompt-cache-vs-retrieval-budget.md`

```markdown
---
title: "TIL: prompt cache vs presupuesto de retrieval"
layout: post
lang: es
ref: writing
description: "Una nota corta de campo sobre el día en que el prompt caching salvó un presupuesto de retrieval — y el día en que casi nos costó uno."
pillar: operators-notebook
hero_illustration: agent-pipeline
kicker: "TIL · Nota de campo"
draft: true
comments: true
image: /assets/img/og/es-til-prompt-cache-vs-retrieval-budget.svg
date: 2026-05-06
---

<!-- contenido pendiente: apertura de 1 línea encuadrando el TIL. -->

## El setup

<!-- contenido pendiente: qué era el sistema, qué esperábamos que hiciera la cache. ~80 palabras. -->

## Qué esperaba

<!-- contenido pendiente: los hits de cache iban a ahorrar tokens, el coste de retrieval se mantendría plano. ~60 palabras. -->

## Qué pasó realmente

<!-- contenido pendiente: los hits de cache se invalidaban cuando el resultado de retrieval cambiaba por un solo token, disparando el ratio de miss. Números si los tienes. ~120 palabras. -->

## El fix

<!-- contenido pendiente: orden estable del retrieval, normalizar whitespace antes de cache, considerar una clave de cache resistente al reorden. ~100 palabras. -->

## Preguntas abiertas

<!-- contenido pendiente: 2-3 cosas que todavía querrías testar. ~60 palabras. -->
```

### Step 11: Build + verify all 10 files render but don't appear in listings

```
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```
Clean expected.

Confirm all 10 scaffolds rendered as standalone pages:
```
ls _site/2026/05/06/ | wc -l
```
Expected: at least 10 (10 scaffolds + any other pages dated 2026-05-06).

Confirm scaffolds DO NOT appear on writing index (they're filtered):
```
grep 'eval-harness-as-first-class-dag-node' _site/writing/index.html
```
Expected: NO match (scaffold filtered).

Confirm the existing published post `agent-graph-margin-budgets` IS still on the writing index:
```
grep 'agent-graph-margin-budgets' _site/writing/index.html
```
Expected: match.

Confirm scaffolds don't appear in EN home Fresh essays:
```
grep 'eval-harness-as-first-class-dag-node' _site/index.html
```
Expected: NO match.

### Step 12: Commit

```
git add _posts/
git commit -m "scaffolds: 5 draft posts in EN+ES (1 per pillar, all draft:true)"
```

---

## Task 3: Final QA + PR

- [ ] **Step 1: Visit each scaffold by URL and confirm it renders correctly via the F3a post template**

Visit `http://localhost:4000/2026/05/06/eval-harness-as-first-class-dag-node/` (and the other 9 URLs). Each should:
- Show the new F3a hero (pillar tag, hero illustration, double-print title, mono meta row).
- Show TOC on desktop ≥1100 px (4-5 H2s per scaffold).
- Show the example sidenote (where present).
- Render the `<!-- contenido pendiente -->` skeletons as HTML comments (invisible to the reader).
- Inline newsletter injects on scaffolds with ≥3 H2s (most scaffolds qualify).

- [ ] **Step 2: Confirm none of them appear in `/writing/`, `/es/escritos/`, `/`, `/es/`**

Open all four pages — no scaffold titles should be visible anywhere.

- [ ] **Step 3: Confirm the existing post stays visible**

`/writing/` lists "Shipping agent graphs without burning your margin budget" under the building-agents pillar. Home shows it as the latest essay.

- [ ] **Step 4: Push + open PR (after user authorization)**

```
git push -u origin claude/f3b-scaffolds
gh pr create --title "F3b: 5 draft post scaffolds (EN + ES)" --body "..."
```

Body content shipped at execution time.

---

## Self-review

- **Spec coverage** (§9): 5 scaffolds × 2 languages = 10 files, each with full front matter, kicker, hero illustration, 4-5 H2s, `<!-- contenido pendiente -->` markers, and one `{% include sn.html %}` example (where contextually appropriate — TIL scaffolds have terser sections without sidenotes by design). ✅
- **Draft filtering**: 3 layout edits ensure scaffolds don't leak into listings. ✅
- **Placeholder scan**: every code/markdown block is concrete. The `<!-- contenido pendiente -->` markers are themselves the "what to write" guidance for the post author — not a plan failure. ✅
- **Type/name consistency**: pillar IDs, kicker labels, hero illustration filenames, slugs all match. ✅

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| User publishes a scaffold without filling skeletons → readers see `<!-- contenido pendiente -->` HTML comments | Comments are invisible to readers (HTML comment semantics). Cosmetic risk only. The bigger risk is publishing a half-empty post — not this PR's job to police. |
| Date `2026-05-06` is shared by all 10 scaffolds → `site.posts` ordering may be ambiguous | Drafts are filtered out of all listings, so ordering doesn't matter. When the user publishes, they edit the date in front matter and rename the file. |
| OG image paths point to non-existent SVGs | Same pre-existing issue as the existing post (`/assets/img/posts/mi-post.png` was referenced but doesn't exist). F5 OG-template generation creates these. Until then, social previews fall back to `og-default.svg`. |
| Spanish translation drift over time as user edits posts | Translation is the user's responsibility; F3b just provides the parallel scaffold structure. |
| `{% include sn.html n="1" text="..." %}` markup may not be obvious to a future post author | The include comment header in `_includes/sn.html` documents the usage. F3b scaffolds also demonstrate by example. |

---

## What's NOT in this phase

- F4 (Work / Project pages / Speaking / Now structured UI / About / Contact / 404).
- F5 (Pagefind modal, OG image template, real giscus IDs, real headshot, ES audit, Lighthouse 95+, career-arc / hero illustration dark-mode color fix).
