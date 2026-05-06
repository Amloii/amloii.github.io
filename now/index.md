---
layout: page
lang: en
ref: now
title: Now
permalink: /now/
hide_footer: false
---

{% assign n = site.data.now.en %}

<p class="caps-label" style="margin-top:.5rem">Monthly snapshot · Last updated {{ n.updated }}</p>

{% assign keys = "building,reading,writing,speaking" | split: "," %}

{% for key in keys %}
  {% assign items = n.blocks[key] %}
  {% if items and items.size > 0 %}
    {% for it in items %}
- {{ it }}
    {% endfor %}
  {% endif %}
{% endfor %}
