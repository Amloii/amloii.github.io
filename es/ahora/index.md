---
layout: page
lang: es
ref: now
title: Ahora
permalink: /es/ahora/
---

{% assign n = site.data.now.es %}

<p class="caps-label" style="margin-top:.5rem">Ritmo mensual · Última actualización {{ n.updated }}</p>

{% assign keys = "building,reading,writing,speaking" | split: "," %}

{% for key in keys %}
  {% assign items = n.blocks[key] %}
  {% if items and items.size > 0 %}
    {% for it in items %}
- {{ it }}
    {% endfor %}
  {% endif %}
{% endfor %}
