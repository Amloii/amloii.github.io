---
layout: project
lang: es
ref: work
ref_pair: infew
permalink: /es/trabajo/in-a-few-words/
title: Resumen de textos con transformers
summary: Asistente de resumen para redacciones en español largo con revisión humana en bucle.
domain: NLP · Flujo editorial
year: 2021
role: Lider técnico
stack: "PyTorch · HuggingFace · FastAPI · tokenización bilingüe"
featured_metric: "P95 de latencia −62% vs baseline monolítico · aprobación 4,3/5"
hero_illustration: agent-pipeline
tags:
  - Resúmenes
  - Transformers
links:
  - label: GitHub
    url: https://github.com/Amloii/InAFewWords
context: |
  La redacción necesitaba resúmenes fieles sin citas inventadas. APIs caja negra no cumplían auditoría y el CMS cortaba peticiones en horas pico.
approach: |
  Transformer fine-tuned con decodificación acotada, semillas deterministas y pre-filtro extractivo. Servicio FastAPI con streaming de parciales para revisión progresiva + captura de feedback humano ligero para recalibrar umbrales.
outcomes: |
  - **P95 −62%** vs el servicio monolítico previo mediante batching y ventanas eficientes.
  - **4,3 / 5** percepción cualitativa con tres redes nacionales.
  - Incidentes por alucinación ↓ mediante bloqueo de citas en entidades nombradas.
---
