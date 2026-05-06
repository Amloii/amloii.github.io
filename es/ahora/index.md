---
layout: page
lang: es
ref: now
title: Ahora
permalink: /es/ahora/
---

{% assign n = site.data.now.es %}

<p class="caps-label" style="margin-top:.5rem">Ritmo mensual · Última actualización {{ n.updated }}</p>

<div class="now-blocks">
  {% include now-block.html key="building" stamp="N°1" %}
  {% include now-block.html key="reading"  stamp="N°2" %}
  {% include now-block.html key="writing"  stamp="N°3" %}
  {% include now-block.html key="speaking" stamp="N°4" %}
</div>
