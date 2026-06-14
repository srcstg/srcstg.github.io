/**
 * AXYZ — Custom Element <axyz-marquee>
 * Carrusel marquee infinito de logos de clientes, portado de index.html
 * (.logos-wrapper / .logos-track) para Wix Studio.
 *
 * CSS embebido en shadow DOM: no depende de global.css.
 * Los logos van A COLOR (excepción al B&N global del sitio — decisión de diseño #6).
 *
 * Atributos:
 *   logos  — JSON array de URLs de imagen (las URLs de Wix Media). Requerido.
 *   speed  — duración del loop en segundos. Default: 50 (decisión de diseño #4).
 *   size   — alto/ancho de cada logo en px. Default: 94.
 *
 * Ejemplo de valor para `logos`:
 *   ["https://static.wixstatic.com/media/aaa.jpg","https://static.wixstatic.com/media/bbb.jpg"]
 */
class AxyzMarquee extends HTMLElement {
  static get observedAttributes() {
    return ['logos', 'speed', 'size'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    let logos = [];
    try {
      logos = JSON.parse(this.getAttribute('logos') || '[]');
    } catch (e) {
      logos = [];
    }
    const speed = parseFloat(this.getAttribute('speed')) || 50;
    const size = parseInt(this.getAttribute('size'), 10) || 94;

    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    if (!logos.length) {
      this.shadowRoot.innerHTML =
        '<p style="color:rgba(255,255,255,0.4);font-size:12px;text-align:center;">' +
        'axyz-marquee: falta el atributo logos (JSON array de URLs)</p>';
      return;
    }

    const imgs = logos
      .map((u) => '<img src="' + u.replace(/"/g, '&quot;') + '" alt="" loading="lazy"/>')
      .join('');

    // Set duplicado para el loop seamless (translateX -50%)
    this.shadowRoot.innerHTML =
      '<style>' +
      ':host { display: block; }' +
      '.wrapper { overflow: hidden; }' +
      '.track {' +
      '  display: flex; gap: 16px; width: max-content;' +
      '  animation: marquee ' + speed + 's linear infinite;' +
      '}' +
      '.track:hover { animation-play-state: paused; }' +
      'img {' +
      '  height: ' + size + 'px; width: ' + size + 'px;' +
      '  flex-shrink: 0; object-fit: contain; display: block;' +
      '}' +
      '@keyframes marquee {' +
      '  0%   { transform: translateX(0); }' +
      '  100% { transform: translateX(-50%); }' +
      '}' +
      '@media (prefers-reduced-motion: reduce) {' +
      '  .track { animation: none; flex-wrap: wrap; justify-content: center; width: auto; }' +
      '}' +
      '</style>' +
      '<div class="wrapper"><div class="track">' + imgs + imgs + '</div></div>';
  }
}

customElements.define('axyz-marquee', AxyzMarquee);
