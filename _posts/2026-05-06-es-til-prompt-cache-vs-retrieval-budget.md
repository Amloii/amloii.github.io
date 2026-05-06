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
