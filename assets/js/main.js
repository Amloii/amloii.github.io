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
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy-target");
      const target = sel ? document.querySelector(sel) : null;
      const text = target ? (target.innerText || target.textContent || "") : "";
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text.trim());
        btn.setAttribute("data-copied", "true");
        const original = btn.dataset.label || btn.textContent;
        if (!btn.dataset.label) btn.dataset.label = original;
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.removeAttribute("data-copied");
          btn.textContent = btn.dataset.label;
        }, 1800);
      } catch (_) {
        // Clipboard API blocked; fail silently.
      }
    });
  });
});
