/**
 * Asigna clase gr-enter-item y --enter-delay escalonado a contenidos bajo [data-content-enter].
 * data-content-enter="..." optional: lista CSS de selectores (si no, usa el default).
 */
(function () {
  const DEFAULT_SEL =
    ".card, article.card, a.card, .pcard, a.pcard, [data-inbox-swipe]";

  function run() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-content-enter]").forEach((scope) => {
      const custom = scope.getAttribute("data-content-enter");
      const selector = custom && custom.trim().length > 0 ? custom.trim() : DEFAULT_SEL;

      let items;
      try {
        items = scope.querySelectorAll(selector);
      } catch (_) {
        items = scope.querySelectorAll(DEFAULT_SEL);
      }

      let i = 0;
      items.forEach((el) => {
        if (el.closest("[hidden]")) return;
        if (el.closest(".panel:not(.is-visible)")) return;
        if (el.classList.contains("gr-enter-skip")) return;

        if (reduce) {
          el.style.opacity = "1";
          el.style.transform = "";
          return;
        }

        el.classList.add("gr-enter-item");
        el.style.setProperty("--enter-delay", `${0.055 + i * 0.072}s`);
        i += 1;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
