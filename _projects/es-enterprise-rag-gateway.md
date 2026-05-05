---
layout: project
lang: es
ref: work
ref_pair: ragway
permalink: /es/trabajo/enterprise-rag-gateway/
title: Gateway RAG híbrido enterprise
summary: Fachada de ingesta + retrieval unificando señales léxicas y densas a escala de marketplace (stub).
domain: Infra de recuperación
year: 2024
role: Arquitecto principal
stack: "OpenSearch k-NN · jobs Ray · rerank ONNX · pools GPU"
featured_metric: "Rebuild índices P95 6m12s vs 54m baseline"
hero_illustration: rag-stack
tags:
  - RAG híbrido
links:
context: |
  Escala tipo Multimarkts: grids de inspiración rápidos pero rebuilding nocturno congelaba catálogo casi una hora.
approach: |
  Pipelines Ray por chunks, rerank ONNX en CPU para amortiguar GPUs, índices sombra antes de cortar producción + observabilidad de recall@k y drift modelado como SLO ejecutivo.
outcomes: |
  - Refresh embedding **P95 6m12s** contra **≈54m** monolitos secuenciales.
  - **Recall@10 +0,11** vs sólo vectores densos según paneles QA internos.
---
