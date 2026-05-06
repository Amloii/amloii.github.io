---
title: "Eval harnesses are graph nodes, not weekend notebooks"
layout: post
lang: en
ref: writing
pair_key: eval-harness-as-first-class-dag-node
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
