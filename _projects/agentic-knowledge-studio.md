---
layout: project
lang: en
ref: work
ref_pair: agentstudio
title: Agentic knowledge acquisition studio
summary: Internal control plane tying multi-agent task graphs, retrieval, and evaluator hooks for regulated dossiers (stub brief).
domain: Agentic platforms
year: 2025
role: Director of AI · architecture + implementation
stack: "LLM gateways · Postgres · OpenSearch · async workers · policy-as-code guards"
featured_metric: "Cold-start agent swarm <11 min median (staging)"
hero_illustration: ops-tower
tags:
  - Agents
  - Orchestration
links:
context: |
  BillionHands-aligned scenario: SMEs must ingest heterogenous dossiers weekly. Manual copy/paste dominates; hallucinated merge proposals are unacceptable for downstream compliance tooling.
approach: |
  Decompose dossier ingestion into specialist agents with explicit memory tiers, deterministic tool contracts, evaluator agents that rerun golden datasets hourly, and a CI-like promotion flow from sandbox to prod clusters.
outcomes: |
  - From greenfield connector to swarm online in **< 11 minutes median** in hardened staging VPCs — mostly Terraform + IaC templating.
  - Evaluator hooks reduced tool misuse incidents **−41%** during dogfood week (classification by safety bot).
---
