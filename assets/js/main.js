document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle (existing)
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel  = document.querySelector("[data-nav-panel]");
  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.getAttribute("data-open") === "true";
      navPanel.setAttribute("data-open", String(!isOpen));
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  // Print buttons (existing)
  document.querySelectorAll("[data-print]").forEach((btn) => {
    btn.addEventListener("click", () => window.print());
  });

  // Theme toggle (new)
  const themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (_) {}
    });
  }

  // Copy-to-clipboard buttons. Markup contract:
  //   <button data-copy data-copy-target="#bio-short">Copy</button>
  //   <pre id="bio-short">…</pre>
  // Note: text is trimmed. Do not point at code blocks where trailing newline matters.
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy-target");
      const target = sel ? document.querySelector(sel) : null;
      const text = target ? (target.innerText || target.textContent || "") : "";
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text.trim());
        btn.setAttribute("data-copied", "true");
        if (!btn.dataset.label) btn.dataset.label = btn.textContent;
        btn.textContent = "Copied";
        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(() => {
          btn.removeAttribute("data-copied");
          btn.textContent = btn.dataset.label;
        }, 1800);
      } catch (err) {
        console.warn("[copy] clipboard write failed", err);
        btn.textContent = "Copy failed";
        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(() => {
          btn.textContent = btn.dataset.label || "Copy";
        }, 1800);
      }
    });
  });

  // Search trigger placeholder — Pagefind modal lands in F5.
  // Wired now so F1's home redesign doesn't have to revisit the nav.
  const searchBtn = document.querySelector("[data-search-trigger]");
  function openSearch() {
    if (typeof window.__amloiiOpenSearch === "function") {
      window.__amloiiOpenSearch();
    } else {
      console.info("[search] Pagefind modal not yet wired (F5).");
    }
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", openSearch);
  }
  document.addEventListener("keydown", (e) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const t = e.target;
      const tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
      e.preventDefault();
      openSearch();
    }
  });

  // Post TOC — auto-built from H2s with id, with active-section highlighter.
  // Runs only if the page has the TOC container; safely no-ops otherwise.
  const tocList = document.querySelector('[data-post-toc]');
  const tocMobile = document.querySelector('[data-post-toc-mobile]');
  const proseHeadings = tocList || tocMobile
    ? document.querySelectorAll('.post-prose h2[id]')
    : [];

  if (proseHeadings.length) {
    const buildList = (target) => {
      target.innerHTML = '';
      proseHeadings.forEach((h) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        target.appendChild(li);
      });
    };
    if (tocList) buildList(tocList);
    if (tocMobile) buildList(tocMobile);

    const setActive = (id) => {
      [tocList, tocMobile].forEach((root) => {
        if (!root) return;
        root.querySelectorAll('a').forEach((a) => a.classList.remove('is-active'));
        const link = root.querySelector('a[href="#' + id + '"]');
        if (link) link.classList.add('is-active');
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-100px 0px -60% 0px' });

    proseHeadings.forEach((h) => observer.observe(h));
  }
});
