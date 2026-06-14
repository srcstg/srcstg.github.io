/**
 * AXYZ — Custom Element <axyz-blog-cards>
 * Grilla de tarjetas de blog del landing (imagen B&N con zoom al hover + fecha
 * + título + bajada + "Ver más →"). Portado de index.html, con un cambio:
 * "Ver más" navega a la URL del post (página del Wix Blog) en vez de abrir
 * el modal custom — mejor SEO y el cliente edita los artículos en Wix.
 *
 * Atributos:
 *   cards — JSON array de {img, date, title, sub, url}. Requerido.
 *           img: URL Wix Media · url: URL del post en el Wix Blog.
 */
class AxyzBlogCards extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    let cards = [];
    try { cards = JSON.parse(this.getAttribute('cards') || '[]'); } catch (e) { cards = []; }

    const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

    const cardsHtml = cards.map((c) => `
      <div class="card">
        <a class="img-wrap" href="${esc(c.url)}" aria-label="${esc(c.title)}">
          ${c.img ? '<img src="' + esc(c.img) + '" alt="' + esc(c.title) + '" loading="lazy"/>' : ''}
        </a>
        <div class="meta">
          <p class="date">${esc(c.date)}</p>
          <h3 class="title">${esc(c.title)}</h3>
          <p class="sub">${esc(c.sub)}</p>
          <a class="more" href="${esc(c.url)}">Ver más <span class="arrow">→</span></a>
        </div>
      </div>`).join('');

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .grid { display: grid; grid-template-columns: 1fr; gap: 20px; text-align: left; }
        @media (min-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 40px; } }

        .img-wrap {
          display: block;
          width: 100%;
          aspect-ratio: 1250 / 700;
          overflow: hidden;
          border-radius: 4px;
          background: #3f3f46;
        }
        .img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: grayscale(1); /* B&N global del sitio */
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .img-wrap:hover img { transform: scale(1.05); }

        .meta { margin-top: 12px; }
        .date { margin: 0; color: rgba(255,255,255,0.4); font-size: 0.875rem; }
        .title {
          margin: 4px 0 0;
          color: #fff; font-size: 1rem; font-weight: 700;
          text-transform: uppercase; line-height: 1.375;
        }
        .sub { margin: 4px 0 0; color: rgba(255,255,255,0.5); font-size: 0.75rem; line-height: 1.625; }
        @media (min-width: 768px) {
          .title { font-size: 1.25rem; }
          .sub { font-size: 1.05rem; }
        }
        .more {
          display: inline-flex; align-items: center; gap: 4px;
          margin-top: 8px; padding: 8px 0;
          color: #EE7D65; font-size: 0.875rem; font-weight: 600;
          text-decoration: none;
        }
        .arrow { display: inline-block; transition: transform 0.3s; }
        .more:hover .arrow { transform: translateX(4px); }

        @media (prefers-reduced-motion: reduce) {
          .img-wrap img, .arrow { transition: none; }
        }
      </style>
      <div class="grid">${cardsHtml}</div>
    `;
  }
}

customElements.define('axyz-blog-cards', AxyzBlogCards);
