---
layout: page
lang: en
ref: now
title: Now
permalink: /now/
intro: "Monthly snapshot · Last updated 2026-05-06"
hide_footer: false
---

{% assign n = site.data.now.en %}
{% assign keys = "building,reading,writing,speaking" | split: "," %}

{% for key in keys %}
  {% assign items = n.blocks[key] %}
  {% if items and items.size > 0 %}
    {% for it in items %}
- {{ it }}
    {% endfor %}
  {% endif %}
{% endfor %}
