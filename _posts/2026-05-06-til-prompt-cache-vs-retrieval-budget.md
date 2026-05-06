---
title: "TIL: prompt cache vs retrieval budget"
layout: post
lang: en
ref: writing
pair_key: til-prompt-cache-vs-retrieval-budget
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
