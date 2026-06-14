/**
 * AXYZ — Custom Element <axyz-hero-cad>
 * Hero CAD wireframe 3D portado de index.html: proyección dinámica de 8 volúmenes
 * + 4 edificios de fondo + grilla, cámara fly (intro 8s) + breathing infinito,
 * vignette y overlay de texto opcional. CSS y JS autosuficientes (shadow DOM).
 *
 * Atributos (todos opcionales):
 *   headline — título del hero; usar "|" como salto de línea.
 *              Default: "Expertos en regularización|y arquitectura".
 *              Pasar headline="" para modo solo-escena (texto nativo Wix encima).
 *   cta-text — texto del botón. Default: "Contáctanos". Vacío = sin botón.
 *   cta-link — destino del botón. Default: "/contacto".
 *
 * Altura: el componente mide 224px en mobile (<768px) y 640px en desktop,
 * igual que el repo. Configurar el elemento en Wix con esas alturas.
 */
class AxyzHeroCad extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const headline = this.hasAttribute('headline')
      ? this.getAttribute('headline')
      : 'Expertos en regularización|y arquitectura';
    const ctaText = this.hasAttribute('cta-text') ? this.getAttribute('cta-text') : 'Contáctanos';
    const ctaLink = this.getAttribute('cta-link') || '/contacto';

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = this._template(headline, ctaText, ctaLink);
    this._drawScene();
  }

  _template(headline, ctaText, ctaLink) {
    const headlineHtml = headline
      ? '<h1>' + headline.split('|').map((s) => this._esc(s)).join('<br>') + '</h1>'
      : '';
    const ctaHtml = ctaText
      ? '<a class="cta" href="' + this._esc(ctaLink) + '">' + this._esc(ctaText) + '</a>'
      : '';
    return `
      <style>
        :host { display: block; font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .cad-hero {
          position: relative;
          height: 14rem;
          background:
            radial-gradient(ellipse 80% 60% at 55% 45%, rgba(238,125,101,0.06) 0%, transparent 65%),
            radial-gradient(ellipse at 0% 100%, rgba(255,255,255,0.025) 0%, transparent 50%),
            #0a0a0a;
          overflow: hidden;
        }
        @media (min-width: 768px) { .cad-hero { height: 640px; } }

        .cad-scene { position: absolute; inset: 0; pointer-events: none; }
        .cad-scene svg { width: 100%; height: 100%; display: block; }

        .edge            { stroke: #fff;    stroke-width: 1;    fill: none; vector-effect: non-scaling-stroke; }
        .slab            { stroke: #fff;    stroke-width: 0.85; fill: none; vector-effect: non-scaling-stroke; }
        .mullion         { stroke: #fff;    stroke-width: 0.55; fill: none; vector-effect: non-scaling-stroke; }
        .cad-bg          { stroke: #fff;    stroke-width: 0.6;  fill: none; vector-effect: non-scaling-stroke; }
        .ground          { stroke: #fff;    stroke-width: 0.55; fill: none; vector-effect: non-scaling-stroke; }
        .selected-static { stroke: #EE7D65; stroke-opacity: 0.88; stroke-width: 1.5; fill: none; stroke-linejoin: miter; vector-effect: non-scaling-stroke; }
        .selected-trace  { stroke: #FFD2BC; stroke-width: 2;     fill: none; stroke-linecap: round; vector-effect: non-scaling-stroke; opacity: 0; }

        @keyframes cadFade      { to { opacity: 1; } }
        @keyframes cadFadeTrace { to { opacity: 1; } }
        @keyframes cadDraw      { to { stroke-dashoffset: 0; } }
        @keyframes cadCameraFly {
          0%   { transform: scale(1); }
          25%  { transform: scale(1.3); }
          35%  { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes cadBreathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.02); }
        }
        #cad-scene-g {
          transform-origin: 50% 50%;
          animation: cadCameraFly 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards,
                     cadBreathe 12s ease-in-out 8s infinite;
        }

        .cad-vignette {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background:
            radial-gradient(ellipse 55% 50% at 28% 50%, rgba(10,10,10,0.74) 0%, rgba(10,10,10,0) 65%),
            linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 22%, transparent 70%, rgba(0,0,0,0.48) 100%);
        }
        @media (max-width: 767px) {
          .cad-vignette {
            background:
              radial-gradient(ellipse at 50% 50%, rgba(10,10,10,0.74) 0%, rgba(10,10,10,0.08) 68%),
              linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 30%);
          }
        }

        .cad-content { position: absolute; inset: 0; z-index: 4; display: flex; }
        .cad-content-inner {
          width: 100%;
          max-width: 1184px;
          margin: 0 auto;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 0 20px; text-align: center;
        }
        h1 {
          margin: 0 0 16px;
          color: #fff;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 1rem;
          line-height: 1.25;
          letter-spacing: 0;
          text-shadow: 0 2px 24px rgba(0,0,0,0.75), 0 0 60px rgba(0,0,0,0.55);
        }
        .cta {
          display: inline-block;
          background: #EE7D65;
          color: #fff;
          padding: 8px 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
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
        @media (min-width: 768px) {
          .cad-content-inner { align-items: flex-start; padding-left: 80px; text-align: left; }
          h1 { font-size: 3.75rem; line-height: 1.25; letter-spacing: 0.025em; margin-bottom: 24px; }
          .cta { padding: 12px 32px; font-size: 0.875rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .selected-trace { display: none !important; }
          #cad-scene-g {
            animation: cadCameraFly 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
          }
        }
      </style>
      <section class="cad-hero">
        <div class="cad-scene">
          <svg id="cad-svg" viewBox="285 75 880 495" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"></svg>
        </div>
        <div class="cad-vignette"></div>
        <div class="cad-content">
          <div class="cad-content-inner">${headlineHtml}${ctaHtml}</div>
        </div>
      </section>
    `;
  }

  _esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  _drawScene() {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const root = this.shadowRoot;
    const svg = root.getElementById('cad-svg');

    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id', 'cad-scene-g');
    svg.appendChild(g);

    const camera = { pos: [0, 30, -600], f: 900, cx: 640, cy: 360, rotY: (30 * Math.PI) / 180 };

    function project([x, y, z]) {
      const c = Math.cos(camera.rotY), s = Math.sin(camera.rotY);
      const xr = x * c + z * s;
      const zr = -x * s + z * c;
      const camZ = zr - camera.pos[2];
      return {
        x: (xr * camera.f) / camZ + camera.cx,
        y: ((camera.pos[1] - y) * camera.f) / camZ + camera.cy,
        d: camZ
      };
    }

    function depthOpacity(d, type) {
      const t = Math.max(0, Math.min(1, (d - 460) / 460));
      const ranges = {
        edge:     [0.92, 0.36],
        slab:     [0.68, 0.22],
        mullion:  [0.42, 0.10],
        'cad-bg': [0.24, 0.07],
        ground:   [0.28, 0.10]
      };
      const r = ranges[type] || ranges.edge;
      return (r[0] - (r[0] - r[1]) * t).toFixed(3);
    }

    function makeLine(p1, p2, cls, delay, draw) {
      const ln = document.createElementNS(SVG_NS, 'line');
      ln.setAttribute('x1', p1.x.toFixed(2));
      ln.setAttribute('y1', p1.y.toFixed(2));
      ln.setAttribute('x2', p2.x.toFixed(2));
      ln.setAttribute('y2', p2.y.toFixed(2));
      ln.setAttribute('class', cls);
      ln.style.strokeOpacity = depthOpacity((p1.d + p2.d) / 2, cls);
      ln.style.opacity = '0';
      if (draw) {
        const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        ln.style.strokeDasharray = len.toFixed(2);
        ln.style.strokeDashoffset = len.toFixed(2);
        ln.style.animation =
          'cadDraw 1.0s ease-out ' + delay.toFixed(2) + 's forwards, ' +
          'cadFade 0.4s ease-out ' + delay.toFixed(2) + 's forwards';
      } else {
        ln.style.animation = 'cadFade 0.5s ease-out ' + delay.toFixed(2) + 's forwards';
      }
      g.appendChild(ln);
    }

    const edgeIdx = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];

    function makeBox(x0, x1, y0, y1, z0, z1) {
      return [
        [x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],
        [x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]
      ].map(project);
    }

    function drawBox(verts, baseDelay, type) {
      const cls = type || 'edge';
      edgeIdx.forEach(([i, j], k) => {
        makeLine(verts[i], verts[j], cls, baseDelay + k * 0.022, true);
      });
    }

    function drawSlab(y, xR, zR, baseDelay) {
      const c = [[xR[0], y, zR[0]], [xR[1], y, zR[0]], [xR[1], y, zR[1]], [xR[0], y, zR[1]]].map(project);
      for (let i = 0; i < 4; i++) {
        makeLine(c[i], c[(i + 1) % 4], 'slab', baseDelay + i * 0.018, true);
      }
    }

    function drawMullion(x, z, y0, y1, delay) {
      makeLine(project([x, y0, z]), project([x, y1, z]), 'mullion', delay, true);
    }

    function drawGround(p1w, p2w, delay) {
      makeLine(project(p1w), project(p2w), 'ground', delay, true);
    }

    // Edificios de fondo (contexto urbano)
    const bgVolumes = [
      { x: [ 180,  280], y: [0, 100], z: [180, 320] },
      { x: [-260, -180], y: [0,  75], z: [200, 340] },
      { x: [-110,   30], y: [0,  60], z: [260, 400] },
      { x: [ 290,  380], y: [0,  85], z: [100, 240] }
    ];
    bgVolumes.forEach((v, vi) => {
      drawBox(makeBox(v.x[0], v.x[1], v.y[0], v.y[1], v.z[0], v.z[1]), 0.05 + vi * 0.04, 'cad-bg');
    });

    // Grilla de vereda
    [-150, -90, -30, 30, 90, 150, 210].forEach((z, i) =>
      drawGround([-320, 0, z], [320, 0, z], 0.05 + i * 0.02)
    );
    [-220, -150, -80, -10, 60, 130, 200, 270].forEach((x, i) =>
      drawGround([x, 0, -260], [x, 0, 320], 0.18 + i * 0.02)
    );

    // Volúmenes principales — doble ancho, mitad alto
    const volumes = [
      { name: 'A', x: [-100,  100], y: [    0,  87.5], z: [ -50,   50], floorStep: 12.5, mullionStep: 14 },
      { name: 'B', x: [ 100,  280], y: [    0,  37.5], z: [ -30,   60], floorStep: 12.5, mullionStep: 14 },
      { name: 'C', x: [ -60,   60], y: [ 37.5,  62.5], z: [-100,  -50], floorStep: 12.5, mullionStep: 13 },
      { name: 'D', x: [ -70,   70], y: [ 87.5, 112.5], z: [ -40,   40], floorStep: 12.5, mullionStep: 16 },
      { name: 'E', x: [ -80,   80], y: [    0,    50], z: [  50,  130], floorStep: 12.5, mullionStep: 16 },
      { name: 'F', x: [-220, -100], y: [ 62.5,    75], z: [ -20,   30], floorStep: null, mullionStep: 18 },
      { name: 'G', x: [ -30,   30], y: [112.5,   125], z: [ -15,   15], floorStep: null, mullionStep: null },
      { name: 'H', x: [-160,  300], y: [   -4,     0], z: [ -60,  140], floorStep: null, mullionStep: null }
    ];

    let volDverts = null;

    volumes.forEach((v, vi) => {
      const base = 0.30 + vi * 0.10;
      const verts = makeBox(v.x[0], v.x[1], v.y[0], v.y[1], v.z[0], v.z[1]);
      if (v.name === 'D') volDverts = verts;
      drawBox(verts, base, 'edge');

      if (v.floorStep) {
        let fi = 0;
        for (let y = v.y[0] + v.floorStep; y < v.y[1]; y += v.floorStep) {
          drawSlab(y, v.x, v.z, base + 1.10 + fi * 0.04);
          fi++;
        }
      }

      if (v.mullionStep) {
        let mi = 0;
        const md = base + 1.55;
        for (let x = v.x[0] + v.mullionStep; x < v.x[1]; x += v.mullionStep) {
          drawMullion(x, v.z[0], v.y[0], v.y[1], md + mi * 0.012);
          mi++;
        }
        for (let z = v.z[0] + v.mullionStep; z < v.z[1]; z += v.mullionStep) {
          drawMullion(v.x[1], z, v.y[0], v.y[1], md + mi * 0.012);
          mi++;
        }
      }
    });

    // Losa superior seleccionada en el penthouse (Vol D)
    const drawSelectedTop = (verts, delay) => {
      const top = [verts[4], verts[5], verts[6], verts[7], verts[4]];
      const d = top.map((p, i) => (i ? 'L' : 'M') + ' ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2)).join(' ') + ' Z';
      let perim = 0;
      for (let i = 1; i < top.length; i++) {
        perim += Math.hypot(top[i].x - top[i - 1].x, top[i].y - top[i - 1].y);
      }

      const stat = document.createElementNS(SVG_NS, 'path');
      stat.setAttribute('d', d);
      stat.setAttribute('class', 'selected-static');
      stat.style.opacity = '0';
      stat.style.strokeDasharray = perim.toFixed(2);
      stat.style.strokeDashoffset = perim.toFixed(2);
      stat.style.animation =
        'cadDraw 1.4s ease-out ' + delay.toFixed(2) + 's forwards, ' +
        'cadFade 0.45s ease-out ' + delay.toFixed(2) + 's forwards';
      g.appendChild(stat);

      const trace = document.createElementNS(SVG_NS, 'path');
      trace.setAttribute('d', d);
      trace.setAttribute('class', 'selected-trace');
      const seg = 42;
      trace.style.strokeDasharray = seg + ' ' + (perim - seg).toFixed(2);
      trace.style.strokeDashoffset = '0';
      const cycle = (perim / 75).toFixed(2);
      trace.style.animation =
        'cadFadeTrace 0.5s ease-out ' + (delay + 1.4).toFixed(2) + 's forwards, ' +
        'cadTraceTop ' + cycle + 's linear ' + (delay + 1.6).toFixed(2) + 's infinite';
      g.appendChild(trace);

      // El keyframe dinámico vive en el shadow root (no en document.head)
      const sty = document.createElement('style');
      sty.textContent = '@keyframes cadTraceTop { to { stroke-dashoffset: -' + perim.toFixed(2) + '; } }';
      root.appendChild(sty);
    };

    drawSelectedTop(volDverts, 3.30);
  }
}

customElements.define('axyz-hero-cad', AxyzHeroCad);
