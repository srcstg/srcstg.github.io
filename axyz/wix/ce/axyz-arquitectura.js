/**
 * AXYZ — Custom Element <axyz-arquitectura>
 * Las 3 tarjetas de servicios de Arquitectura: imagen B&N + caption.
 * Portado de index.html.
 *
 * Atributos:
 *   images — JSON array de 3 URLs (Wix Media), en orden:
 *            [Diseño Residencial, Espacios Comerciales, Diseño Urbano]
 *   cards  — (opcional) JSON array de 3 {title, text} para override del copy.
 *
 * El H2 y el párrafo intro van como texto nativo Wix.
 */
class AxyzArquitectura extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const DEFAULT_CARDS = [
      { title: 'Diseño Residencial', text: 'Creación de hogares que reflejen la identidad y estilo de vida de sus habitantes.' },
      { title: 'Espacios Comerciales', text: 'Soluciones arquitectónicas innovadoras para negocios y espacios de trabajo.' },
      { title: 'Diseño Urbano', text: 'Desarrollo de proyectos que contribuyan al crecimiento y la revitalización de comunidades.' }
    ];

    let images = [];
    let cards = DEFAULT_CARDS;
    try { images = JSON.parse(this.getAttribute('images') || '[]'); } catch (e) { images = []; }
    try { if (this.hasAttribute('cards')) cards = JSON.parse(this.getAttribute('cards')); } catch (e) { cards = DEFAULT_CARDS; }

    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

    const cardsHtml = cards.map((c, i) => `
      <div class="card">
        ${images[i] ? '<img src="' + esc(images[i]) + '" alt="' + esc(c.title) + '" loading="lazy"/>' : '<div class="img-ph"></div>'}
        <div class="caption">
          <p class="title">${esc(c.title)}</p>
          <p class="text">${esc(c.text)}</p>
        </div>
      </div>`).join('');

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 768px) { .grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

        .card { overflow: hidden; border-radius: 4px; }
        .card img, .img-ph {
          width: 100%; height: 144px;
          object-fit: cover; display: block;
          filter: grayscale(1); /* B&N global del sitio */
          background: #3f3f46;
        }
        @media (min-width: 768px) { .card img, .img-ph { height: 224px; } }

        .caption { background: #3f3f46; padding: 8px 12px 12px; text-align: left; }
        .title {
          margin: 0;
          color: #fff; font-size: 0.875rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.025em;
        }
        .text {
          margin: 4px 0 0;
          color: rgba(255,255,255,0.6); font-size: 0.75rem; line-height: 1.625;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        @media (min-width: 768px) {
          .caption { padding: 12px 16px 16px; }
          .title { font-size: 1.406rem; }
          .text { font-size: 1.05rem; }
        }
      </style>
      <div class="grid">${cardsHtml}</div>
    `;
  }
}

customElements.define('axyz-arquitectura', AxyzArquitectura);
