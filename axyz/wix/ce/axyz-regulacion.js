/**
 * AXYZ — Custom Element <axyz-regulacion>
 * Cuerpo de la sección Regulación: eyebrow "Nuestros pilares" + 3 pilares,
 * eyebrow "Proceso de aprobación" + stepper (vertical mobile / horizontal desktop)
 * con líneas animadas al entrar al viewport. Portado de index.html.
 *
 * Sin atributos obligatorios. El H2 y el párrafo intro van como texto nativo Wix.
 */
class AxyzRegulacion extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const PILARES = [
      { title: 'Cumplimiento normativo', text: 'Nos aseguramos de cumplir con todas las regulaciones y códigos de construcción aplicables en cada fase de nuestros proyectos.' },
      { title: 'Ética profesional', text: 'Actuamos con integridad y honestidad en todas nuestras interacciones, manteniendo la confianza de nuestros clientes y socios.' },
      { title: 'Responsabilidad social', text: 'Contribuimos al desarrollo sostenible de las comunidades en las que operamos, respetando su cultura, historia y medio ambiente.' }
    ];
    const PASOS = [
      { title: 'Evaluación de normativas', text: 'Realizamos un análisis exhaustivo de las regulaciones pertinentes al inicio de cada proyecto.' },
      { title: 'Seguimiento riguroso', text: 'Supervisamos de cerca el cumplimiento de las normativas durante todas las etapas del proceso de diseño y construcción.' },
      { title: 'Documentación completa', text: 'Mantenemos registros detallados de todos los aspectos relacionados con el cumplimiento normativo, garantizando la trazabilidad y la transparencia.' }
    ];

    const pilaresHtml = PILARES.map((p) => `
      <div class="pilar">
        <span class="check">✓</span>
        <div>
          <p class="pilar-title">${p.title}</p>
          <p class="pilar-text">${p.text}</p>
        </div>
      </div>`).join('');

    const stepsMobileHtml = PASOS.map((p, i) => `
      <div class="step-row">
        <div class="step-rail">
          <div class="circle">${i + 1}</div>
          ${i < PASOS.length - 1 ? '<div class="step-line"></div>' : ''}
        </div>
        <div class="step-copy${i < PASOS.length - 1 ? '' : ' last'}">
          <p class="step-title">${p.title}</p>
          <p class="step-text">${p.text}</p>
        </div>
      </div>`).join('');

    const stepsDesktopHtml = PASOS.map((p, i) => `
      <div class="col">
        <div class="circle-lg">${i + 1}</div>
        <p class="step-title-lg">${p.title}</p>
        <p class="step-text-lg">${p.text}</p>
      </div>`).join('');

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .eyebrow {
          margin: 0 0 16px;
          color: #EE7D65;
          font-size: 0.875rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em;
          text-align: center;
        }
        .eyebrow.proceso { margin: 24px 0 16px; }
        @media (min-width: 768px) {
          .eyebrow { font-size: 1.5625rem; margin-bottom: 24px; }
          .eyebrow.proceso { margin: 48px 0 32px; }
        }

        /* ── Pilares ── */
        .pilares { display: flex; flex-direction: column; gap: 8px; }
        .pilar {
          display: flex; align-items: flex-start; gap: 12px;
          border-left: 4px solid #EE7D65;
          background: #3f3f46;
          padding: 12px 16px;
          text-align: left;
          border-radius: 0 4px 4px 0;
        }
        .check {
          margin-top: 2px;
          width: 28px; height: 28px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: #EE7D65;
          color: #fff; font-size: 0.75rem; font-weight: 900;
        }
        .pilar-title {
          margin: 0;
          color: #fff; font-size: 0.875rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.025em;
        }
        .pilar-text { margin: 0; color: rgba(255,255,255,0.6); font-size: 0.75rem; line-height: 1.625; }
        @media (min-width: 768px) {
          .pilares { flex-direction: row; gap: 24px; }
          .pilar {
            flex: 1; flex-direction: column; align-items: center;
            min-height: 250px; border-left: none; border-radius: 4px;
            padding: 32px 24px 24px; text-align: center;
          }
          .check { display: none; }
          .pilar-title { font-size: 1.406rem; margin-bottom: 12px; }
          .pilar-text { font-size: 1.2rem; }
        }

        /* ── Stepper mobile ── */
        .steps-mobile { text-align: left; }
        .step-row { display: flex; gap: 12px; }
        .step-rail { display: flex; flex-direction: column; align-items: center; }
        .circle {
          width: 40px; height: 40px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; border: 1px solid #EE7D65;
          color: #EE7D65; font-size: 0.875rem; font-weight: 700;
        }
        .step-line {
          width: 2px; flex: 1; margin-top: 6px;
          background: rgba(255,255,255,0.10);
          position: relative; overflow: hidden;
        }
        .step-line::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 100%; height: 0%;
          background: #EE7D65;
          transition: height 0.8s ease;
        }
        .step-line.animate::after { height: 100%; }
        .step-copy { padding: 4px 0 20px; }
        .step-copy.last { padding-bottom: 0; }
        .step-title {
          margin: 0 0 4px;
          color: #fff; font-size: 1rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.025em;
        }
        .step-text { margin: 0; color: rgba(255,255,255,0.6); font-size: 0.75rem; line-height: 1.625; }

        /* ── Stepper desktop ── */
        .steps-desktop { display: none; }
        @media (min-width: 768px) {
          .steps-mobile { display: none; }
          .steps-desktop { display: block; }
          .steps-grid { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); }
          .step-line-h {
            height: 2px;
            background: rgba(255,255,255,0.10);
            position: absolute; top: 32px;
            overflow: hidden;
          }
          .step-line-h::after {
            content: '';
            position: absolute; top: 0; left: 0;
            height: 100%; width: 0%;
            background: #EE7D65;
            transition: width 0.9s ease;
          }
          .step-line-h.animate::after { width: 100%; }
          #line-1-2 { left: calc(100%/6 + 32px); right: calc(50% + 32px); }
          #line-2-3 { left: calc(50% + 32px); right: calc(100%/6 + 32px); }
          .col {
            position: relative; z-index: 10;
            display: flex; flex-direction: column; align-items: center;
            padding: 0 16px; text-align: center;
          }
          .circle-lg {
            width: 64px; height: 64px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%; border: 2px solid #EE7D65;
            background: #27272a;
            color: #EE7D65; font-size: 1.25rem; font-weight: 700;
          }
          .step-title-lg {
            margin: 24px 0 8px;
            color: #fff; font-size: 1.25rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.025em;
          }
          .step-text-lg { margin: 0; color: rgba(255,255,255,0.6); font-size: 1.05rem; line-height: 1.625; }
        }

        @media (prefers-reduced-motion: reduce) {
          .step-line::after, .step-line-h::after { transition: none; }
        }
      </style>
      <p class="eyebrow">Nuestros pilares</p>
      <div class="pilares">${pilaresHtml}</div>
      <p class="eyebrow proceso">Proceso de aprobación</p>
      <div class="steps-mobile">${stepsMobileHtml}</div>
      <div class="steps-desktop">
        <div class="steps-grid">
          <div class="step-line-h" id="line-1-2"></div>
          <div class="step-line-h" id="line-2-3"></div>
          ${stepsDesktopHtml}
        </div>
      </div>
    `;

    this._animate();
  }

  _animate() {
    const root = this.shadowRoot;

    // Líneas verticales (mobile): se animan al entrar al viewport
    const lines = root.querySelectorAll('.step-line');
    if (lines.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('animate'), 100);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      lines.forEach((l) => io.observe(l));
    }

    // Líneas horizontales (desktop): secuencia 1→2 luego 2→3
    const grid = root.querySelector('.steps-desktop');
    if (grid) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => root.getElementById('line-1-2').classList.add('animate'), 300);
            setTimeout(() => root.getElementById('line-2-3').classList.add('animate'), 1100);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      io.observe(grid);
    }
  }
}

customElements.define('axyz-regulacion', AxyzRegulacion);
