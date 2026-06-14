/**
 * AXYZ — Custom Element <axyz-confianza>
 * Sección "Confianza en AXYZ": acordeón en mobile (<768px) y flip cards 3D
 * en desktop, con el copy aprobado hardcodeado. Portado de index.html.
 *
 * Sin atributos obligatorios. El H2 y el párrafo intro van como texto nativo Wix.
 * Altura interna: flip cards de 250px (desktop); acordeón de altura variable (mobile).
 */
class AxyzConfianza extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const ITEMS = [
      {
        title: 'Respuesta ágil en 24 horas',
        titleHtml: 'Respuesta ágil en 24 horas',
        body: 'Porque tu tiempo es valioso, garantizamos que todas tus consultas serán atendidas en menos de 24 horas. Ya sea por WhatsApp, llamada o correo electrónico, obtendrás respuestas rápidas y efectivas para evitar retrasos innecesarios.',
        question: '¿Por qué es clave para tu proyecto?',
        bullets: [
          'Resolverás dudas rápidamente sin perder oportunidades ni tiempo en trámites.',
          'Tendrás el respaldo de un equipo profesional en cada paso del proceso.'
        ]
      },
      {
        title: 'Equipo multidisciplinario y patrocinio completo',
        titleHtml: 'Equipo multidisciplinario<br>y patrocinio completo',
        body: 'Con AXYZ, olvídate de coordinar múltiples profesionales. Nuestro equipo incluye arquitectos, ingenieros y expertos en construcción, trabajando en conjunto para ofrecerte un servicio integral.',
        question: '¿Cómo te beneficia?',
        bullets: [
          'Evitas errores costosos y retrasos en la gestión de permisos y certificaciones.',
          'Optimizas tiempos al contar con todos los especialistas en un solo lugar.'
        ]
      },
      {
        title: 'Asesoría personalizada para resultados óptimos',
        titleHtml: 'Asesoría personalizada<br>para resultados óptimos',
        body: 'Te acompañamos desde la planificación hasta la ejecución, asegurándonos de que cada decisión esté alineada con tus objetivos, presupuesto y plazos.',
        question: '¿Por qué es un diferencial?',
        bullets: [
          'Más que trámites y planos, te ofrecemos una estrategia adaptada a tus necesidades.',
          'Evitas imprevistos gracias a nuestro enfoque proactivo y nuestra experiencia en el sector.'
        ]
      }
    ];

    const bulletsHtml = (item, cls) => item.bullets
      .map((b) => `<li class="${cls}"><span>•</span>${b}</li>`)
      .join('');

    const accordionHtml = ITEMS.map((item, i) => `
      <div class="acc-item">
        <button class="acc-btn" data-i="${i}" type="button">
          <span class="acc-title">${item.title}</span>
          <span class="acc-icon">+</span>
        </button>
        <div class="acc-body">
          <div class="acc-content">
            <p class="body-text">${item.body}</p>
            <p class="question">${item.question}</p>
            <ul>${bulletsHtml(item, '')}</ul>
          </div>
        </div>
      </div>`).join('');

    const flipHtml = ITEMS.map((item, i) => `
      <div class="flip-card" data-i="${i}">
        <div class="flip-inner">
          <div class="flip-front" data-flip="${i}">
            <p class="flip-title">${item.titleHtml}</p>
            <button class="plus" data-flip="${i}" type="button" aria-label="Ver detalle">+</button>
          </div>
          <div class="flip-back">
            <button class="close" data-unflip="${i}" type="button" aria-label="Cerrar">✕</button>
            <p class="body-text back-body">${item.body}</p>
            <p class="question">${item.question}</p>
            <ul>${bulletsHtml(item, '')}</ul>
          </div>
        </div>
      </div>`).join('');

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        /* ── Acordeón (mobile) ── */
        .accordion { display: flex; flex-direction: column; gap: 12px; text-align: left; }
        .acc-item { background: #3f3f46; border-radius: 4px; overflow: hidden; }
        .acc-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          background: none; border: none; cursor: pointer;
          color: #fff; font-family: inherit; text-align: left;
        }
        .acc-title {
          font-size: 0.875rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.025em; line-height: 1.375;
        }
        .acc-icon {
          color: #EE7D65; font-size: 1.25rem; font-weight: 300; line-height: 1;
          transition: transform 0.3s; flex-shrink: 0; margin-left: 12px;
        }
        .acc-body { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out; }
        .acc-content { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 12px; }

        .body-text { margin: 0; font-size: 0.75rem; line-height: 1.625; color: rgba(255,255,255,0.8); }
        .question { margin: 0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em; color: #fff; }
        ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        li { display: flex; gap: 8px; font-size: 0.75rem; line-height: 1.625; color: rgba(255,255,255,0.8); }
        li span { color: #EE7D65; flex-shrink: 0; }

        .flip-grid { display: none; }

        /* ── Flip cards (desktop) ── */
        @media (min-width: 768px) {
          .accordion { display: none; }
          .flip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

          .flip-card { height: 250px; perspective: 1000px; }
          .flip-inner {
            position: relative; width: 100%; height: 100%;
            transition: transform 0.5s; transform-style: preserve-3d;
          }
          .flip-card.flipped .flip-inner { transform: rotateY(180deg); }
          .flip-front, .flip-back {
            position: absolute; inset: 0;
            backface-visibility: hidden; -webkit-backface-visibility: hidden;
            border-radius: 0.25rem;
            background: #3f3f46;
          }
          .flip-front {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 16px;
            padding: 24px 32px; text-align: center;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .flip-front:hover { background: #71717a; }
          .flip-title {
            margin: 0; color: #fff;
            font-size: 1.336rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.025em; line-height: 1.375;
          }
          .plus {
            background: none; border: none; cursor: pointer;
            color: #EE7D65; font-size: 1.5rem; font-weight: 300; line-height: 1;
            font-family: inherit;
          }
          .flip-back {
            transform: rotateY(180deg);
            display: flex; flex-direction: column;
            padding: 24px 32px; text-align: left;
            overflow-y: auto;
          }
          .close {
            position: absolute; right: 16px; top: 16px;
            background: none; border: none; cursor: pointer;
            color: #EE7D65; font-size: 1.25rem; font-weight: 300; line-height: 1;
          }
          .back-body { margin-top: 12px; font-size: 0.831rem; }
          .flip-back .question { margin-top: 16px; font-size: 0.831rem; }
          .flip-back ul { margin-top: 8px; }
          .flip-back li { font-size: 0.831rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .flip-inner, .acc-body, .acc-icon { transition: none; }
        }
      </style>
      <div class="accordion">${accordionHtml}</div>
      <div class="flip-grid">${flipHtml}</div>
    `;

    this._wire();
  }

  _wire() {
    const root = this.shadowRoot;

    // Acordeón: uno abierto a la vez
    root.querySelectorAll('.acc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.acc-item');
        const body = item.querySelector('.acc-body');
        const icon = btn.querySelector('.acc-icon');
        const wasOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
        root.querySelectorAll('.acc-body').forEach((b) => { b.style.maxHeight = '0px'; });
        root.querySelectorAll('.acc-icon').forEach((i) => {
          i.style.transform = 'rotate(0deg)';
          i.textContent = '+';
        });
        if (!wasOpen) {
          body.style.maxHeight = body.scrollHeight + 'px';
          icon.style.transform = 'rotate(45deg)';
        }
      });
    });

    // Flip cards
    root.querySelectorAll('[data-flip]').forEach((el) => {
      el.addEventListener('click', () => {
        root.querySelector('.flip-card[data-i="' + el.getAttribute('data-flip') + '"]').classList.add('flipped');
      });
    });
    root.querySelectorAll('[data-unflip]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        root.querySelector('.flip-card[data-i="' + el.getAttribute('data-unflip') + '"]').classList.remove('flipped');
      });
    });
  }
}

customElements.define('axyz-confianza', AxyzConfianza);
