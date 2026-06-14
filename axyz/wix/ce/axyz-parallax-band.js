/**
 * AXYZ — Custom Element <axyz-parallax-band>
 * Banda parallax con frase de impacto: fondo fixed (desktop) desaturado a B&N
 * + overlay oscuro + texto centrado + CTA opcional. Portado de index.html.
 * Se usa 3 veces en el landing con distintos atributos.
 *
 * Atributos:
 *   image      — URL del fondo (Wix Media). Requerido.
 *   text       — frase de impacto. Requerido.
 *   cta-text   — texto del botón (opcional; sin valor = sin botón).
 *   cta-link   — destino del botón. Default: "/contacto".
 *   min-height — alto mínimo desktop en px. Default: 480 (la banda CTA usa 240).
 */
class AxyzParallaxBand extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const image = this.getAttribute('image') || '';
    const text = this.getAttribute('text') || '';
    const ctaText = this.getAttribute('cta-text') || '';
    const ctaLink = this.getAttribute('cta-link') || '/contacto';
    const minH = parseInt(this.getAttribute('min-height'), 10) || 480;
    const minHMobile = Math.min(280, minH);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .band {
          position: relative;
          min-height: ${minHMobile}px;
          display: flex; align-items: center; justify-content: center;
          text-align: center;
          background-image: url('${esc(image)}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }
        @media (min-width: 768px) { .band { min-height: ${minH}px; } }
        /* En táctiles, fixed produce jank/bugs: fallback a scroll */
        @media (max-width: 767px), (hover: none) and (pointer: coarse) {
          .band { background-attachment: scroll; }
        }
        /* Desaturado B&N sin filtrar el elemento (filter rompería el attachment fixed) */
        .band::before {
          content: '';
          position: absolute; inset: 0;
          background: hsl(0, 0%, 50%);
          mix-blend-mode: saturation;
          pointer-events: none;
          z-index: 1;
        }
        .overlay {
          position: absolute; inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 2;
        }
        .content {
          position: relative; z-index: 3;
          padding: 0 20px;
          max-width: 80rem;
          margin: 0 auto;
        }
        .phrase {
          margin: 0;
          color: #fff;
          font-size: 1.5rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.025em;
          line-height: 1.375;
        }
        @media (min-width: 768px) { .phrase { font-size: 2.25rem; } }
        .cta {
          display: inline-block;
          margin-top: 24px;
          background: #EE7D65;
          color: #fff;
          padding: 8px 20px;
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          text-decoration: none;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      background-color 0.2s ease,
                      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cta:hover {
          background: #F19582;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -8px rgba(238, 125, 101, 0.45),
                      0 4px 10px -2px rgba(238, 125, 101, 0.15);
        }
        .cta:active { transform: translateY(0); }
        @media (min-width: 768px) { .cta { padding: 12px 32px; font-size: 0.875rem; } }
        @media (prefers-reduced-motion: reduce) { .cta { transition: none; } }
      </style>
      <div class="band">
        <div class="overlay"></div>
        <div class="content">
          <p class="phrase">${esc(text)}</p>
          ${ctaText ? '<a class="cta" href="' + esc(ctaLink) + '">' + esc(ctaText) + '</a>' : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('axyz-parallax-band', AxyzParallaxBand);
