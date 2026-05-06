# Daniel Gómez Domínguez — sitio personal

Sitio estático con [Jekyll](https://jekyllrb.com/) optimizado para [GitHub Pages](https://pages.github.com/).

## Desarrollo local

Recomendado: **Docker** (sin instalar Ruby). Necesitas Docker Desktop corriendo.

```powershell
docker compose run --rm --entrypoint "" jekyll bundle install   # primera vez
docker compose up jekyll                                         # arranca jekyll serve --livereload en :4000
```

Abre `http://localhost:4000`. La primera `bundle install` tarda ~5 min y persiste en el volumen `jekyll-gems` para builds posteriores.

Build one-shot (lo que usa el subagent durante el desarrollo):

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

## Variables imprescindibles

1. **`_config.yml`**: `formspree_endpoint`, `substack_embed_url`, `book_call_url`, IDs reales en **giscus**, token opcional de **Cloudflare Web Analytics** (`cloudflare_analytics.token`).
2. **`assets/cv/`**: añadir `daniel-gomez-dominguez-en.pdf` y `daniel-gomez-dominguez-es.pdf` (ver `README.txt` allí).

GitHub Pages compila el sitio automáticamente al hacer push; no necesitas Ruby local salvo desarrollo offline.

## Pagefind (búsqueda)

Tras construir el sitio:

```powershell
bundle exec jekyll build
npx pagefind --site _site --output-path assets/pagefind
```

Vuelve a construir si cambias contenido y commitea la carpeta `assets/pagefind/` para que GH Pages sirva el índice.

## OG images por post

Opcional: añade `image: /assets/img/posts/mi-post.png` en el front matter del post. Plantilla SVG de referencia: `assets/img/og-template.svg`.

## Licencia

Contenido © Daniel Gómez Domínguez. Código del sitio bajo uso personal.
