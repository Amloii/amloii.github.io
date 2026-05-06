# Daniel Gómez Domínguez — sitio personal

Sitio estático con [Jekyll](https://jekyllrb.com/) optimizado para [GitHub Pages](https://pages.github.com/).

## Desarrollo local

Recomendado: **Docker** (sin instalar Ruby). Necesitas Docker Desktop corriendo.

```powershell
docker compose run --rm --entrypoint "" jekyll bundle install   # primera vez
docker compose up jekyll                                         # arranca jekyll serve --livereload en :4000
```

Abre `http://localhost:4000`. La primera `bundle install` tarda ~5 min y persiste en el volumen `jekyll-gems` para builds posteriores.

Build one-shot:

```powershell
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
```

### Alternativa nativa (sin Docker)

Si prefieres Ruby instalado localmente, en Windows necesitas Ruby + MSYS2 devkit (RubyInstaller-Devkit). Una vez en PATH:

```powershell
gem install bundler
bundle install
bundle exec jekyll serve
```

## Publicar un post

1. Crear/editar `_posts/YYYY-MM-DD-slug.md` (EN) y opcionalmente `_posts/YYYY-MM-DD-es-slug.md` (ES).
2. Front matter mínimo:
   ```yaml
   ---
   title: "Título del post"
   layout: post
   lang: en       # o 'es'
   ref: writing
   description: "Promesa de una frase para el meta description."
   pillar: building-agents   # building-agents | research-to-prod | ai-leadership | operators-notebook
   hero_illustration: agent-pipeline   # nombre de SVG en assets/svg/riso/
   draft: true    # cambia a false cuando esté listo
   date: 2026-XX-XX
   ---
   ```
3. Cuerpo en Markdown. Los H2 aparecen en el TOC automáticamente.
4. Para sidenotes Tufte: `{% include sn.html n="1" text="Contenido de la nota." %}` inline en el párrafo.
5. Cuando esté listo: `draft: false` y commit.

## Actualizar la página "Now"

Edita `_data/now.yml`. Hay 4 bloques (`building`, `reading`, `writing`, `speaking`) por idioma. Bloques vacíos (`[]`) se ocultan en la página.

```yaml
en:
  updated: "2026-XX-XX"
  status:
    - "shipping · agents v3"
    - "writing · 04 essays in flight"
    - "advisory · selectively open"
  blocks:
    building:
      - "Item 1..."
```

La fecha `updated` aparece tanto en `/now/` como en la línea de status del home. Sólo hay que actualizar este archivo.

## Regenerar el índice de búsqueda (Pagefind)

Después de añadir o cambiar contenido, regenera el índice:

```powershell
docker compose run --rm --entrypoint "" jekyll bundle exec jekyll build --trace
docker run --rm -v "${PWD}:/work" -w /work node:20-slim npx -y pagefind@1 --site _site --output-path assets/pagefind
git add assets/pagefind
git commit -m "search: regenerate Pagefind index"
```

## Sistema de diseño

- **Tokens** en `assets/css/_tokens.scss` — paleta light + dark, escalas tipográficas, espaciados.
- **Utilities Riso** en `assets/css/_riso.scss` — `.riso-paper`, `.riso-halftone`, `.riso-double-print`, `.riso-stamp`, `.riso-photo`, `.riso-frame`. Silenciadas dentro de `.cv-page` por el "two-pace contract".
- **Componentes** en `assets/css/_components.scss` — todo lo demás.
- **Print** en `assets/css/_print.scss` — fuerza monocromo, oculta nav/toggles, silencia decoración Riso.

## Variables imprescindibles en `_config.yml`

- `formspree_endpoint` — URL del form de contacto.
- `substack_embed_url` — URL del embed de tu Substack (newsletter footer + inline mid-post).
- `book_call_url` — URL de Cal.com para el botón de booking.
- `cloudflare_analytics.token` (opcional) — token de Cloudflare Web Analytics.

## Probar la versión print del CV

`/cv/` con Ctrl+P. Debe verse:
- Fondo blanco, texto negro.
- Sin nav, sin sticky CTA, sin stripe de availability, sin career-arc figure.
- Capabilities en 2 columnas.
- Las filas del timeline no se parten entre páginas.

## Licencia

Contenido © Daniel Gómez Domínguez. Código del sitio bajo uso personal.
