---
title: "Los evaluadores son nodos del grafo, no notebooks de fin de semana"
layout: post
lang: es
ref: writing
pair_key: eval-harness-as-first-class-dag-node
description: "Por qué los evaluadores deben estar dentro del DAG de agentes con los mismos SLO que las herramientas de producción — y qué se rompe cuando no es así."
pillar: building-agents
hero_illustration: eval-loop
kicker: "Número 02 · Notas desde producción"
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
