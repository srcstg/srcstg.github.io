/**
 * Transición tipo SPA al abrir el chat (4 → 4.1) usando View Transitions API cuando existe.
 * Marca el enlace con data-chat-vt en 4.html.
 */
(function () {
  document.querySelectorAll("a[data-chat-vt]").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.dataset.swipeSuppressClick === "1") {
        e.preventDefault();
        return;
      }
      const url = link.getAttribute("href");
      if (!url || typeof document.startViewTransition !== "function") return;
      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = url;
      });
    });
  });
})();
