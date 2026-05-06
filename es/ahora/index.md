---
layout: page
lang: es
ref: now
title: Ahora
permalink: /es/ahora/
intro: "Ritmo mensual · Última actualización 2026-05-06"
---

{% assign n = site.data.now.es %}
{% assign keys = "building,reading,writing,speaking" | split: "," %}

{% for key in keys %}
  {% assign items = n.blocks[key] %}
  {% if items and items.size > 0 %}
    {% for it in items %}
- {{ it }}
    {% endfor %}
  {% endif %}
{% endfor %}
