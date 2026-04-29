/**
 * Lista tipo Mail (iOS): arrastre 1:1, resistencia en bordes, soltar pasado la mitad → abierto,
 * antes de la mitad → cerrado; flick por velocidad; animación de asentamiento spring-like.
 */
(function () {
  /** Ancho del botón rojo (debe coincidir con CSS .inbox-swipe-actions) */
  const DELETE_W = 84;
  const OPEN_X = -DELETE_W;
  /** Punto medio entre cerrado (0) y abierto (OPEN_X): aquí decide iOS */
  const MID_X = OPEN_X * 0.5;
  /** Swipe largo para borrar fila (además del botón) */
  const FULL_DELETE_X = OPEN_X * 2.35;
  /** Resistencia al tirar más allá del botón o a la derecha del cierre */
  const RUBBER_OUT = 0.26;
  const RUBBER_IN = 0.38;
  /** Umbral px/ms (~380 px/s) para completar por inercia */
  const FLICK = 0.32;
  /** Umbral para decidir eje horizontal vs scroll vertical */
  const DIR_LOCK_PX = 10;
  /** Por debajo de esto, el gesto horizontal no bloquea el click en el enlace */
  const MEANINGFUL_DRAG_PX = 16;
  /** Ventana para calcular velocidad */
  const V_MS = 100;

  const SPRING = "transform 0.38s cubic-bezier(0.25, 1, 0.32, 1)";
  const SPRING_SNAP = "transform 0.44s cubic-bezier(0.22, 1.1, 0.36, 1)";

  function setTx(el, x) {
    const v = Math.round(x * 1000) / 1000;
    el.style.transform = v === 0 ? "" : `translate3d(${v}px,0,0)`;
  }

  function readTx(front) {
    const tr = front.style.transform;
    const m = tr && tr.match(/translate3d\((-?\d+(?:\.\d+)?)px/);
    if (m) return parseFloat(m[1]);
    const cs = getComputedStyle(front).transform;
    if (cs && cs !== "none") {
      try {
        return new DOMMatrix(cs).m41;
      } catch (_) {}
    }
    return 0;
  }

  /** Misma idea que UIScrollView: goma al salir del rango [OPEN_X, 0] */
  function rubberize(raw) {
    let x = raw;
    if (x < OPEN_X) {
      x = OPEN_X + (x - OPEN_X) * RUBBER_OUT;
    } else if (x > 0) {
      x = x * RUBBER_IN;
    }
    return x;
  }

  function updateDeleteReveal(wrap, tx) {
    const amount = Math.min(1, Math.max(0, Math.abs(tx) / Math.abs(OPEN_X)));
    wrap.style.setProperty("--delete-reveal", amount.toFixed(4));
    wrap.classList.toggle("inbox-swipe--delete-ready", amount > 0.22);
  }

  function closeOthers(except) {
    document.querySelectorAll("[data-inbox-swipe]").forEach((w) => {
      if (w === except) return;
      const f = w.querySelector(".inbox-swipe-front");
      if (!f) return;
      f.style.transition = SPRING;
      setTx(f, 0);
      updateDeleteReveal(w, 0);
    });
  }

  function settleSpring(front, targetX, strong) {
    front.style.transition = strong ? SPRING_SNAP : SPRING;
    setTx(front, targetX);
  }

  function dismissRow(wrap) {
    const front = wrap.querySelector(".inbox-swipe-front");
    if (!front) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      wrap.remove();
      return;
    }
    const h = wrap.getBoundingClientRect().height;
    wrap.style.maxHeight = `${h}px`;
    wrap.style.overflow = "hidden";
    front.style.transition = "transform 0.34s cubic-bezier(0.25, 1, 0.5, 1)";
    setTx(front, -Math.max(window.innerWidth, 420));

    window.setTimeout(() => {
      wrap.style.transition = "max-height 0.38s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, margin 0.38s ease";
      wrap.style.maxHeight = "0";
      wrap.style.opacity = "0";
      wrap.style.marginBottom = "0";
      window.setTimeout(() => wrap.remove(), 400);
    }, 300);
  }

  /** Velocidad horizontal reciente (px/ms). Negativa = dedo hacia la izquierda. */
  function velocityPxMs(samples) {
    if (samples.length < 2) return 0;
    const a = samples[0];
    const b = samples[samples.length - 1];
    const dt = b.t - a.t;
    if (dt < 4) return 0;
    return (b.x - a.x) / dt;
  }

  function targetFromGesture(x, v, startTx) {
    const wasOpen = startTx < MID_X - 2;

    if (x <= FULL_DELETE_X) {
      return { mode: "dismiss" };
    }

    const flickLeft = v < -FLICK;
    const flickRight = v > FLICK;

    if (!wasOpen) {
      if (flickLeft) return { mode: "snap", x: OPEN_X };
      if (flickRight) return { mode: "snap", x: 0 };
      return { mode: "snap", x: x < MID_X ? OPEN_X : 0 };
    }

    if (flickRight) return { mode: "snap", x: 0 };
    if (flickLeft) return { mode: "snap", x: OPEN_X };
    return { mode: "snap", x: x < MID_X ? OPEN_X : 0 };
  }

  function initWrap(wrap) {
    const front = wrap.querySelector(".inbox-swipe-front");
    const btn = wrap.querySelector(".inbox-swipe-delete-btn");
    const link = wrap.querySelector("a.inbox-row");
    if (!front) return;

    let drag = false;
    let startX = 0;
    let startY = 0;
    let startTx = 0;
    let axis = null;
    let samples = [];
    let maxAbsDx = 0;

    function pushSample(clientX) {
      const t = performance.now();
      samples.push({ t, x: clientX });
      const cut = t - V_MS;
      while (samples.length > 1 && samples[0].t < cut) samples.shift();
    }

    function finish(endX, cancelled) {
      if (!drag) return;
      drag = false;
      wrap.classList.remove("is-dragging");
      front.classList.remove("is-grabbing");

      const x = readTx(front);
      const v = velocityPxMs(samples);

      if (cancelled) {
        const xr = readTx(front);
        settleSpring(front, xr < MID_X ? OPEN_X : 0, false);
        window.requestAnimationFrame(() => updateDeleteReveal(wrap, xr < MID_X ? OPEN_X : 0));
        samples = [];
        return;
      }

      if (axis !== "x") {
        settleSpring(front, startTx, false);
        updateDeleteReveal(wrap, startTx);
        samples = [];
        return;
      }

      const meaningfulHoriz =
        axis === "x" &&
        (maxAbsDx >= MEANINGFUL_DRAG_PX || Math.abs(x - startTx) >= 8);
      if (meaningfulHoriz && link) {
        link.dataset.swipeSuppressClick = "1";
        window.setTimeout(() => delete link.dataset.swipeSuppressClick, 450);
      }

      const decision = targetFromGesture(x, v, startTx);

      if (decision.mode === "dismiss") {
        dismissRow(wrap);
        samples = [];
        return;
      }

      const dest = decision.x;
      const strong = dest === OPEN_X || dest === 0;
      settleSpring(front, dest, strong);
      window.requestAnimationFrame(() => updateDeleteReveal(wrap, dest));
      samples = [];
    }

    function onPointerDown(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag = true;
      axis = null;
      maxAbsDx = 0;
      startX = e.clientX;
      startY = e.clientY;
      startTx = readTx(front);
      samples = [{ t: performance.now(), x: e.clientX }];
      wrap.classList.add("is-dragging");
      front.classList.add("is-grabbing");
      front.style.transition = "none";
      try {
        front.setPointerCapture(e.pointerId);
      } catch (_) {}
    }

    function onPointerMove(e) {
      if (!drag) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (axis === null) {
        const ax = Math.abs(dx);
        const ay = Math.abs(dy);
        if (ax > DIR_LOCK_PX || ay > DIR_LOCK_PX) {
          axis = ax > ay ? "x" : "y";
          if (axis === "x") closeOthers(wrap);
        }
      }

      pushSample(e.clientX);
      maxAbsDx = Math.max(maxAbsDx, Math.abs(e.clientX - startX));

      if (axis === "x") {
        e.preventDefault();
        const raw = startTx + dx;
        const tx = rubberize(raw);
        setTx(front, tx);
        updateDeleteReveal(wrap, tx);
      }
    }

    function onPointerUp(e) {
      if (!drag) return;
      try {
        front.releasePointerCapture(e.pointerId);
      } catch (_) {}
      finish(e.clientX, false);
    }

    function onPointerCancel(e) {
      if (!drag) return;
      finish(e.clientX, true);
    }

    front.addEventListener("pointerdown", onPointerDown);
    front.addEventListener("pointermove", onPointerMove, { passive: false });
    front.addEventListener("pointerup", onPointerUp);
    front.addEventListener("pointercancel", onPointerCancel);
    front.addEventListener("transitionend", (ev) => {
      if (ev.target !== front || ev.propertyName !== "transform") return;
      updateDeleteReveal(wrap, readTx(front));
    });
    front.addEventListener("lostpointercapture", () => {
      if (!drag) return;
      drag = false;
      wrap.classList.remove("is-dragging");
      front.classList.remove("is-grabbing");
      const xr = readTx(front);
      const snap = xr < MID_X ? OPEN_X : 0;
      front.style.transition = SPRING;
      setTx(front, snap);
      updateDeleteReveal(wrap, snap);
      samples = [];
    });

    updateDeleteReveal(wrap, readTx(front));

    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dismissRow(wrap);
      });
    }
  }

  function init() {
    document.querySelectorAll("[data-inbox-swipe]").forEach(initWrap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
