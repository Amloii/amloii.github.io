---
title: "Shipping agent graphs without burning your margin budget"
layout: post
lang: en
ref: writing
description: Lessons learned keeping agent swarms economically bounded while still passing safety evals.
pillar: building-agents
hero_illustration: agent-pipeline
comments: true
image: /assets/img/og-default.svg
date: 2026-05-05
---

Autonomous agents are cheap to demo and expensive to keep honest. The moment you wire “just one more tool” without a contract, your margin graph looks like a crypto wallet after a bridge hack.

## 1. Budget the graph, not the model

Most cost spikes are not raw token spend — they are **unbounded fan-out** and **orphaned retries**. Before choosing an orchestration library, answer three numbers on paper:

- Max tool calls per user intent
- Max wall-clock per agent hop
- Max dollars per successful outcome (not per request)

If you cannot answer those, you are not ready to productionize — you are cosplaying infrastructure.

## 2. Evaluators are part of the DAG

Treat evaluators as first-class nodes, not weekend notebooks. They should run on the same artifacts as production (prompt versions, memory snapshots, tool traces) and block promotion when drift exceeds your policy.

## 3. Memory is a liability ledger

Persistent memory is not “helpful context” — it is **debt**. Every write needs an owner, TTL, and audit strategy. Otherwise you will spend Q3 hunting silent poisoned entries that only appear on long-horizon tasks.

## 4. Multilingual leadership note

I write in English on this site first because it is the lingua franca of the teams I advise day to day. When I cross-post externally, canonical URLs stay anchored here so Google (and recruiters parsing JSON résumés) always see one source of truth.

---

_Want this delivered with smaller essays? Subscribe via the footer embed._
