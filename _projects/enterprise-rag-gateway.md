---
layout: project
lang: en
ref: work
ref_pair: ragway
title: Enterprise grade hybrid RAG gateway
summary: Opinionated ingestion + retrieval façade unifying lexical + dense signals for marketplace scale (stub brief).
domain: Retrieval infrastructure
year: 2024
role: Principal architect
stack: "OpenSearch k-NN · Ray batch jobs · ONNX rerank · GPU pools"
featured_metric: "Rolling index rebuild P95 6m12s vs 54m baseline"
hero_illustration: rag-stack
tags:
  - Hybrid RAG
  - Observability
links:
context: |
  Multimarkts-scale scenario: creatives expect millisecond-ranked inspiration grids but legacy rebuild jobs froze catalogs for almost an hour when refreshing embeddings nightly.
approach: |
  Introduced chunked Ray pipelines, ONNX CPU rerank to shed GPU bursts, staged shadow indices with traffic mirroring before cutover, structured observability dashboards for recall@k and drift.
outcomes: |
  - Embedding refresh **P95 6m12s** vs legacy **≈54m** wall clock (shadow index + parallelism).
  - Human eval **recall@10 +0.11** vs dense-only retrieval on multilingual inventory.
---
