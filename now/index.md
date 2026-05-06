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

<div class="now-blocks">
  {% include now-block.html key="building" stamp="N°1" %}
  {% include now-block.html key="reading"  stamp="N°2" %}
  {% include now-block.html key="writing"  stamp="N°3" %}
  {% include now-block.html key="speaking" stamp="N°4" %}
</div>
