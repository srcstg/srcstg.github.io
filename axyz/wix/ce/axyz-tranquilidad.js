/**
 * AXYZ — Custom Element <axyz-tranquilidad>
 * Las 3 tarjetas de "Tu tranquilidad es nuestra prioridad": imagen B&N + overlay
 * + outline coral que se dibuja al hover (desktop). Portado de index.html.
 *
 * Atributos:
 *   images — JSON array de 3 URLs de imagen (Wix Media), en orden:
 *            [Respuesta ágil, Equipo especializado, Asesoría integral]
 *   cards  — (opcional) JSON array de 3 {title, text} para override del copy.
 *
 * El H2 y el párrafo intro de la sección van como texto nativo Wix (no acá).
 * Altura interna: cards de 224px (mobile) / 263px (desktop).
 */
class AxyzTranquilidad extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const DEFAULT_CARDS = [
      { title: 'Respuesta Ágil en 24 Horas', text: 'Atendemos tus consultas sin demoras.' },
      { title: 'Equipo Especializado', text: 'Arquitectos e ingenieros trabajando juntos para tu éxito.' },
      { title: 'Asesoría Integral', text: 'Te guiamos desde la planificación hasta la ejecución.' }
    ];

    let images = [];
    let cards = DEFAULT_CARDS;
    try { images = JSON.parse(this.getAttribute('images') || '[]'); } catch (e) { images = []; }
    try { if (this.hasAttribute('cards')) cards = JSON.parse(this.getAttribute('cards')); } catch (e) { cards = DEFAULT_CARDS; }

    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

    const cardsHtml = cards.map((c, i) => `
      <div class="frame">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="outline" d="M 0 0 L 100 0 L 100 100 L 0 100 L 0 0"/>
        </svg>
        <div class="inner">
          <div class="media">
            ${images[i] ? '<img src="' + esc(images[i]) + '" alt="" loading="lazy"/>' : ''}
            <div class="overlay"></div>
          </div>
          <div class="copy">
            <p class="title">${esc(c.title)}</p>
            <p class="text">${esc(c.text)}</p>
          </div>
        </div>
      </div>`).join('');

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 768px) { .grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

        .frame {
          position: relative;
          min-height: 224px;
          background-color: #27272a;
          transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
        }
        @media (min-width: 768px) { .frame { min-height: 263px; } }

        .frame > svg {
          pointer-events: none;
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          z-index: 0;
        }
        .outline {
          fill: none;
          stroke: #ee7d65;
          stroke-width: 2.5;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          vector-effect: non-scaling-stroke;
          stroke-dasharray: 1500 100000;
          stroke-dashoffset: 1500;
          stroke-opacity: 0;
          filter: drop-shadow(0 0 6px rgba(238, 125, 101, 0.5));
          transition: stroke-dashoffset 0.8s cubic-bezier(0.33, 1, 0.68, 1),
                      stroke-opacity 0.4s ease;
        }

        .inner {
          position: relative; z-index: 1;
          margin: 2px;
          min-height: calc(224px - 4px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow: hidden;
          padding: 16px;
          text-align: center;
        }
        @media (min-width: 768px) { .inner { min-height: calc(263px - 4px); padding: 24px; } }

        .media { position: absolute; inset: 0; overflow: hidden; }
        .media img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          filter: grayscale(1); /* B&N global del sitio */
          display: block;
        }
        .overlay {
          position: absolute; inset: 0;
          background: rgba(0, 0, 0, 0.5);
          transition: background-color 0.5s ease;
        }

        .copy { position: relative; z-index: 10; }
        .title {
          margin: 0 0 4px;
          color: #fff;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        .text {
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.75rem;
          line-height: 1.625;
        }
        @media (min-width: 768px) {
          .title { font-size: 1.406rem; margin-bottom: 8px; }
          .text { font-size: 1.2rem; }
        }

        @media (hover: hover) and (pointer: fine) {
          .frame:hover { transform: translateY(-3px); }
          .frame:hover .outline { stroke-dashoffset: 0; stroke-opacity: 1; }
          .frame:hover .overlay { background-color: rgba(0, 0, 0, 0.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          .frame, .outline, .overlay { transition: none; }
        }
      </style>
      <div class="grid">${cardsHtml}</div>
    `;
  }
}

customElements.define('axyz-tranquilidad', AxyzTranquilidad);
