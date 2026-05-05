# Daniel Gómez Domínguez — sitio personal

Sitio estático con [Jekyll](https://jekyllrb.com/) optimizado para [GitHub Pages](https://pages.github.com/).

## Requisitos locales (opcional)

En Windows necesitas **Ruby + MSYS2 devkit** o WSL / Docker. Ejemplo rápido:

```powershell
gem install bundler
bundle install
bundle exec jekyll serve
```

Si `bundle` no está en PATH, usa la terminal del instalador Ruby o WSL.

## Desarrollo

```powershell
bundle install
bundle exec jekyll serve
```

Abre `http://localhost:4000`.

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
