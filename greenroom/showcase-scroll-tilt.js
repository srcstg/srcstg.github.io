/**
 * Inclina el contenido del scroll con rotateX + skewY según la velocidad de scroll (sutil).
 * Requiere: .scroll.scroll--tilt > .scroll-tilt-inner
 *
 * Desactivado por defecto; pon a `true` para volver a activar el efecto.
 */
(function () {
  const SCROLL_TILT_ENABLED = false;
  if (!SCROLL_TILT_ENABLED) return;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function setup(scrollEl) {
    const inner = scrollEl.querySelector(".scroll-tilt-inner");
    if (!inner) return;

    let lastY = scrollEl.scrollTop;
    let vel = 0;
    let rafId = 0;

    function tick() {
      vel *= 0.9;
      const rx = clamp(vel * 0.055, -3.2, 3.2);
      const sk = clamp(vel * 0.018, -1.1, 1.1);

      if (Math.abs(rx) < 0.04 && Math.abs(sk) < 0.03 && Math.abs(vel) < 0.08) {
        inner.style.transform = "";
        vel = 0;
        return;
      }

      inner.style.transform = `perspective(1000px) rotateX(${rx}deg) skewY(${sk}deg)`;
      rafId = requestAnimationFrame(tick);
    }

    scrollEl.addEventListener(
      "scroll",
      () => {
        const y = scrollEl.scrollTop;
        vel += (y - lastY) * 0.22;
        lastY = y;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
      },
      { passive: true }
    );
  }

  document.querySelectorAll(".scroll--tilt").forEach(setup);
})();
