---
layout: project
lang: es
ref: work
ref_pair: agentstudio
permalink: /es/trabajo/agentic-knowledge-studio/
title: Estudio de adquisición de conocimiento agéntico
summary: Panel de control interno para grafos multiagente + RAG endurecido (borrador inicial).
domain: Plataformas agénticas
year: 2025
role: Director de IA
stack: "Gateways LLM · Postgres · OpenSearch · workers asíncronos · políticas como código"
featured_metric: "<11 min de cold-start de swarm (mediana en staging)"
hero_illustration: ops-tower
tags:
  - Agentes
  - Orquestación
links:
context: |
  Caso alineado a BillionHands: ingestas heterogéneas semanales, cero tolerancia para merges alucinados en cumplimiento posterior.
approach: |
  Agentes especialistas con memorias locales/durables, herramientas con contratos explícitos, evaluadores ejecutando suites doradas cada hora y promoción estilo CI.
outcomes: |
  - Conector en verde a swarm endurecido en menos de once minutos medianos en VPC de staging mediante plantillas IaC.
  - Incidentes ligados al mal uso en herramientas ↓ 41 puntos porcentuales durante el uso interno.
---
