---
layout: project
lang: es
ref: work
ref_pair: ragway
permalink: /es/trabajo/enterprise-rag-gateway/
title: Gateway RAG híbrido enterprise
summary: Fachada de ingesta + retrieval unificando señales léxicas y densas a escala de marketplace (borrador).
domain: Infra de recuperación
year: 2024
role: Arquitecto principal
stack: "OpenSearch k-NN · trabajos Ray · rerank ONNX · pools de GPU"
featured_metric: "Reconstrucción de índices P95 6m12s vs 54m de referencia"
hero_illustration: rag-stack
tags:
  - RAG híbrido
links:
context: |
  Escala tipo Multimarkts: rejillas de inspiración rápidas, pero la reconstrucción nocturna congelaba el catálogo casi una hora.
approach: |
  Pipelines Ray por bloques, rerank ONNX en CPU para amortiguar GPUs, índices sombra antes de cortar producción + observabilidad de recall@k y drift modelado como SLO ejecutivo.
outcomes: |
  - Refresco de embeddings **P95 6m12s** frente a **≈54m** de los monolitos secuenciales.
  - **Recall@10 +0,11** frente a vectores solo densos según paneles QA internos.
---
