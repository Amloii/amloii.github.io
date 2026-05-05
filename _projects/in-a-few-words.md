---
layout: project
lang: en
ref: work
ref_pair: infew
title: Text summarization with transformers
summary: Summarization assistant for long-form Spanish newsroom copy with human-in-the-loop review.
domain: NLP · Editor workflow
year: 2021
role: Lead builder
stack: "PyTorch · HuggingFace · FastAPI · bilingual tokenization"
featured_metric: "Latency P95 −62% vs. monolithic baseline · human approval 4.3/5"
hero_illustration: agent-pipeline
tags:
  - Summarization
  - Transformers
links:
  - label: GitHub
    url: https://github.com/Amloii/InAFewWords
context: |
  Editors needed faithful abstractive summaries without hallucinated quotes. The newsroom could not afford a black-box API with zero provenance, and latency during peak hours blew past their CMS timeout.
approach: |
  Fine-tuned transformer stack with constrained decoding, deterministic seeding, extractive pre-filter, and a FastAPI service that streams partials for progressive review. Added lightweight human feedback capture to continuously recalibrate thresholds.
outcomes: |
  - **Latency P95 −62%** against the previous monolithic service by batching token work and caching attention-friendly windows.
  - **Editorial uplift:** qualitative score **4.3 / 5** in pilot with three national desks.
  - **Hallucination incidents ↓** through quote-locking on named entities detected in pre-filter stage.
---
