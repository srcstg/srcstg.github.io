/**
 * AXYZ — Custom Element <axyz-mapa>
 * Sección "Proyectos en todo Chile": contadores animados + mapa Leaflet
 * con tiles oscuros (CartoDB Dark Matter) y marcadores coral. Portado de index.html.
 * Carga Leaflet 1.9.4 desde unpkg (JS global una sola vez, CSS dentro del shadow).
 *
 * Atributos (opcionales):
 *   stats — JSON {proyectos, comunas, regiones}. Default: {"proyectos":129,"comunas":47,"regiones":4}
 *
 * Altura interna del mapa: 256px mobile / 480px desktop.
 * El eyebrow "Nuestro alcance" y el H2 van como texto nativo Wix.
 */
class AxyzMapa extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    let stats = { proyectos: 129, comunas: 47, regiones: 4 };
    try { if (this.hasAttribute('stats')) stats = JSON.parse(this.getAttribute('stats')); } catch (e) { /* defaults */ }

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <style>
        :host { display: block; font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .stats {
          display: flex; justify-content: center; gap: 24px;
          margin-bottom: 32px;
        }
        @media (min-width: 768px) { .stats { gap: 80px; margin-bottom: 40px; } }
        .stat { text-align: center; }
        .num {
          margin: 0;
          color: #EE7D65;
          font-size: 1.875rem; font-weight: 900;
          font-variant-numeric: tabular-nums;
        }
        .label {
          margin: 4px 0 0;
          color: rgba(255,255,255,0.5);
          font-size: 0.75rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        @media (min-width: 768px) {
          .num { font-size: 3rem; }
          .label { font-size: 0.875rem; }
        }
        #mapa {
          width: 100%; height: 256px;
          border: 1px solid rgba(238, 125, 101, 0.3);
          background: #18181b;
        }
        @media (min-width: 768px) { #mapa { height: 480px; } }
        /* Popup acorde al tema */
        #mapa .leaflet-popup-content b { color: #EE7D65; font-size: 0.75rem; font-family: sans-serif; }
      </style>
      <div class="stats">
        <div class="stat"><p class="num" id="n-proyectos">0</p><p class="label">Proyectos</p></div>
        <div class="stat"><p class="num" id="n-comunas">0</p><p class="label">Comunas</p></div>
        <div class="stat"><p class="num" id="n-regiones">0</p><p class="label">Regiones</p></div>
      </div>
      <div id="mapa"></div>
    `;

    this._initCounters(stats);
    this._loadLeaflet().then(() => this._initMap()).catch(() => {
      this.shadowRoot.getElementById('mapa').innerHTML =
        '<p style="color:rgba(255,255,255,0.4);padding:24px;text-align:center;">No se pudo cargar el mapa.</p>';
    });
  }

  _initCounters(stats) {
    const root = this.shadowRoot;
    const targets = {
      'n-proyectos': stats.proyectos,
      'n-comunas': stats.comunas,
      'n-regiones': stats.regiones
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        Object.entries(targets).forEach(([id, end]) => {
          const el = root.getElementById(id);
          if (!el || el.dataset.done) return;
          el.dataset.done = '1';
          let cur = 0;
          const step = Math.ceil(end / 60);
          const timer = setInterval(() => {
            cur = Math.min(cur + step, end);
            el.textContent = cur + '+';
            if (cur >= end) clearInterval(timer);
          }, 20);
        });
        io.disconnect();
      });
    }, { threshold: 0.3 });
    io.observe(root.getElementById('mapa'));
  }

  _loadLeaflet() {
    if (window.L) return Promise.resolve();
    if (!window._axyzLeafletPromise) {
      window._axyzLeafletPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return window._axyzLeafletPromise;
  }

  _initMap() {
    const L = window.L;
    const proyectos = [
      { name: '01 El Quisco (Colegio El Totoral)', lat: -33.4203867, lng: -71.6256284 },
      { name: '02 Federico Errázuriz, Pudahuel', lat: -33.4361203, lng: -70.7631158 },
      { name: '03 Los Olivos, Pudahuel', lat: -33.4512927, lng: -70.8362846 },
      { name: '04 San Jorge, Rengo', lat: -34.3216293, lng: -70.8923537 },
      { name: '05 Alto Laguna, Paine', lat: -33.8747015, lng: -70.9332273 },
      { name: '06 Santa Teresita, Lampa', lat: -33.2689167, lng: -70.7707393 },
      { name: '07 Manuel de Salas, Ñuñoa', lat: -33.4488326, lng: -70.5932138 },
      { name: '08 Honduras, La Florida', lat: -33.5379672, lng: -70.5738422 },
      { name: '09 Avenida Las Flores, Pudahuel', lat: -33.4546087, lng: -70.8465327 },
      { name: '10 Sergio Saavedra, Pudahuel', lat: -33.43265, lng: -70.7631951 },
      { name: '11 Transversal Uno, Pudahuel', lat: -33.4489176, lng: -70.840421 },
      { name: '12 Río Limarí, Pudahuel', lat: -33.3301663, lng: -70.7495054 },
      { name: '13 Los Senderos, Pudahuel', lat: -33.4464483, lng: -70.8357015 },
      { name: '14 La Cancha, Cuncumen', lat: -33.7326035, lng: -71.4257267 },
      { name: '15 Rodas, Pudahuel', lat: -33.4548299, lng: -70.8199621 },
      { name: '16 Balmaceda, San Bernardo', lat: -33.5942861, lng: -70.678501 },
      { name: '17 Avenida los Molinos, Pudahuel', lat: -33.464254, lng: -70.8570305 },
      { name: '18 Exequiel Fernández, Macul', lat: -33.5082643, lng: -70.6039496 },
      { name: '19 Dardignac, Recoleta', lat: -33.433211, lng: -70.6363936 },
      { name: '20 Belén, Pudahuel', lat: -33.4551804, lng: -70.8224822 },
      { name: '21 Transversal Uno 2, Pudahuel', lat: -33.4490059, lng: -70.8402967 },
      { name: '23 Casas Lo Solar, Lampa', lat: -33.2721799, lng: -70.7594037 },
      { name: '24 Avenida Santa Rosa, La Pintana', lat: -33.5866786, lng: -70.6297363 },
      { name: '25 Avenida Don Luis, Lampa', lat: -33.322688, lng: -70.7301196 },
      { name: '26 Américo Vespucio Norte, Vitacura', lat: -33.3927912, lng: -70.5915875 },
      { name: '27 Pasaje Don José Miguel 2 Sur, Puente Alto', lat: -33.6024708, lng: -70.5862888 },
      { name: '29 Los Mañios, Pudahuel', lat: -33.4595945, lng: -70.8446863 },
      { name: '30 Panguipulli, Pudahuel', lat: -33.4292897, lng: -70.7621679 },
      { name: '31 El Juncal, Quilicura', lat: -33.3287217, lng: -70.7093781 },
      { name: '32 Las Hortensias Oriente, Pudahuel', lat: -33.4504192, lng: -70.8465562 },
      { name: '35 José Miguel Infante, Renca', lat: -33.4067081, lng: -70.7197045 },
      { name: '37 Las Canteras, Colina', lat: -33.3016634, lng: -70.689961 },
      { name: '38 Condell, Providencia', lat: -33.4459742, lng: -70.6262616 },
      { name: '39 Gamero, Independencia', lat: -33.4211924, lng: -70.6617282 },
      { name: '40 Chicureo, Colina', lat: -33.2859849, lng: -70.6747028 },
      { name: '41 Licancabur, Macul', lat: -33.489934, lng: -70.6029052 },
      { name: '42 Santa Rosa, Santiago', lat: -33.4627214, lng: -70.6428704 },
      { name: '43 Laguna Quililo, Pudahuel', lat: -33.4610986, lng: -70.7495411 },
      { name: '44 Avenida el Ventisquero, Renca', lat: -33.4086012, lng: -70.7667425 },
      { name: '45 Pasaje Las Acacias, Estación Central', lat: -33.4618801, lng: -70.7083305 },
      { name: '46 Los Almendros, Pudahuel', lat: -33.4537592, lng: -70.8535495 },
      { name: '47 Arturo Prat, Santiago', lat: -33.4525268, lng: -70.6487068 },
      { name: '48.1 El Aguilucho, Providencia', lat: -33.4431417, lng: -70.5960488 },
      { name: '48.2 Calle Cementerio, Tiltil', lat: -33.089963, lng: -70.9171177 },
      { name: '48.3 Llanquihue, Puerto Montt', lat: -41.2638681, lng: -73.0020266 },
      { name: '48.5 El Totoral, El Quisco', lat: -33.4203867, lng: -71.6256284 },
      { name: '48.6 El Tabo', lat: -33.4968436, lng: -71.6214679 },
      { name: '50 El Trabajo, Conchalí', lat: -33.3825938, lng: -70.689624 },
      { name: '51 Las Hualtatas, Vitacura', lat: -33.3867186, lng: -70.5515697 },
      { name: '52 Paseo Huerfanos, Santiago', lat: -33.4389963, lng: -70.6479585 },
      { name: '53 Los Jardines, Ñuñoa', lat: -33.4647685, lng: -70.590118 },
      { name: '54 Yungay, Renca', lat: -33.3972791, lng: -70.727615 },
      { name: '55 Bascuñán Guerrero, Santiago', lat: -33.4563245, lng: -70.6739404 },
      { name: '57 Las Azaleas Sur, Pudahuel', lat: -33.4564411, lng: -70.8499023 },
      { name: '58 Talcan, Estación Central', lat: -33.4733618, lng: -70.7093430 },
      { name: '59 Avenida Las Flores, Pudahuel', lat: -33.4521075, lng: -70.8490875 },
      { name: '60 Las Tranqueras, Las Condes', lat: -33.3951015, lng: -70.5536353 },
      { name: '61 Miguel Claro, Providencia', lat: -33.4330857, lng: -70.620076 },
      { name: '62 La Cruz', lat: -32.8191435, lng: -71.2772829 },
      { name: '63 Luis Thayer Ojeda, Providencia', lat: -33.4178042, lng: -70.6037203 },
      { name: '64 Los Retamos, El Bosque', lat: -33.5711891, lng: -70.6769330 },
      { name: '65.1 Puerto Vespucio, Pudahuel', lat: -33.4486374, lng: -70.7822171 },
      { name: '65.2 Del Cerro, Curacaví', lat: -33.4074188, lng: -71.1499268 },
      { name: '66 Martin de Solis', lat: -33.5701374, lng: -70.5569846 },
      { name: '67 Los Quénes, La Reina', lat: -33.4547202, lng: -70.5381370 },
      { name: '68 Pasaje Quellón, Maipú', lat: -33.5489079, lng: -70.7616654 },
      { name: '69 Los Cerrillos, Cerrillos', lat: -33.4948302, lng: -70.7071109 },
      { name: '70 Santa Cecilia, Padre Hurtado', lat: -33.5723601, lng: -70.8542066 },
      { name: '71 Avenida Ricardo Lyon, Ñuñoa', lat: -33.4487119, lng: -70.6020906 },
      { name: '72 18 de Septiembre, Arica', lat: -18.4764292, lng: -70.3192927 },
      { name: '73 Barros Arana, San Bernardo', lat: -33.596942, lng: -70.6998766 },
      { name: '74 Los Conquistadores, Providencia', lat: -33.4196207, lng: -70.6163123 },
      { name: '75 Camino El Agua, Pudahuel', lat: -33.4492207, lng: -70.8397909 },
      { name: '76 Punta Graham, Puente Alto', lat: -33.5735417, lng: -70.6018784 },
      { name: '77.1 Almirante Silva Palma, Conchalí', lat: -33.3911253, lng: -70.6823038 },
      { name: '77.2 San Fernando, Conchalí', lat: -33.3924824, lng: -70.6639923 },
      { name: '78 Lo Marcoleta, Quilicura', lat: -33.3619142, lng: -70.7560137 },
      { name: '79 Los Senderos, Pudahuel', lat: -33.4467521, lng: -70.8353821 },
      { name: '80.1 Calle 131, Peñalolén', lat: -33.4657884, lng: -70.5546981 },
      { name: '80.2 Pirque', lat: -33.6118172, lng: -70.4851488 },
      { name: '81 Domingo Santa María, Renca', lat: -33.4137924, lng: -70.6800745 },
      { name: '82 Apoquindo, Las Condes', lat: -33.41467, lng: -70.5887103 },
      { name: '83 Los Patagones, Arica', lat: -18.5186936, lng: -70.1774645 },
      { name: '84 Rivas, San Miguel', lat: -33.4789436, lng: -70.6428939 },
      { name: '86 Los Dominicos, Las Condes', lat: -33.4095974, lng: -70.5445816 },
      { name: '87 Los Almendros 2, La Cisterna', lat: -33.5380741, lng: -70.6791737 },
      { name: '89 Toesca, Santiago', lat: -33.4558965, lng: -70.673599 },
      { name: '90 La Montaña, Colina', lat: -33.3021996, lng: -70.7254786 },
      { name: '91 La Pradera, Peñaflor', lat: -33.6058146, lng: -70.8821242 },
      { name: '93 Apoquindo 2, Las Condes', lat: -33.4077052, lng: -70.5643599 },
      { name: '94.1 Split, Cerro Navia', lat: -33.4261585, lng: -70.74154 },
      { name: '94.2 Jorge Luco, El Bosque', lat: -33.5569492, lng: -70.6737657 },
      { name: '95 La Coruña, Quilicura', lat: -33.3511169, lng: -70.725218 },
      { name: '96 Rodrigo de Araya, Ñuñoa', lat: -33.4735693, lng: -70.5897959 },
      { name: '97 Santa Isabel, Lampa', lat: -33.3123241, lng: -70.7437764 },
      { name: '98 Presidente Kennedy, Las Condes', lat: -33.4018188, lng: -70.5750034 },
      { name: '99 Las Madreselvas, Puente Alto', lat: -33.6074729, lng: -70.5210266 },
      { name: '100 Pedro Mira, San Miguel', lat: -33.4973749, lng: -70.6476875 },
      { name: '101 Calle Dos, Viña del Mar', lat: -33.0009149, lng: -71.499641 },
      { name: '102 Jose Miguel Carrera, El Bosque', lat: -33.5504761, lng: -70.6718836 },
      { name: '103 Luis Thayer Ojeda, Providencia', lat: -33.439105, lng: -70.5959088 },
      { name: '105 Jesús, La Reina', lat: -33.4464594, lng: -70.5683879 },
      { name: '106 Grecia, Rancagua', lat: -34.1594953, lng: -70.7390261 },
      { name: '107 Alvaro Casanova, Peñalolén', lat: -33.4644121, lng: -70.5237223 },
      { name: '108 Santa Lucía, Quilicura', lat: -33.33504, lng: -70.71888 },
      { name: '109 Av. Matta, Santiago', lat: -33.4573317, lng: -70.6376553 },
      { name: '110 Pedro León Gallo, Providencia', lat: -33.4419628, lng: -70.6233577 },
      { name: '111 Zapadores, Recoleta', lat: -33.3908543, lng: -70.6413523 },
      { name: '112 Gran Avenida, San Miguel', lat: -33.513044, lng: -70.6580169 },
      { name: '113 Pizarreño, Maipú', lat: -33.5193855, lng: -70.7426156 },
      { name: '114 Antillas, San Joaquín', lat: -33.5157311, lng: -70.6275905 },
      { name: '115.1 Lupa, Ñuñoa', lat: -33.4524573, lng: -70.6235235 },
      { name: '116 Alvaro Casanova 2, La Reina', lat: -33.4395104, lng: -70.5165099 },
      { name: '117 Longitudinal Ruta 5, Buin', lat: -33.7211445, lng: -70.7271584 },
      { name: '118 Sierra De Bellavista, San Fernando', lat: -34.744808, lng: -70.7759271 },
      { name: '119.1 Juan Andres, Lampa', lat: -33.2857621, lng: -70.7459322 },
      { name: '119.2 Maria Josefina, Lampa', lat: -33.2860541, lng: -70.7469688 },
      { name: '120 Hugo Bravo, Maipú', lat: -33.4741825, lng: -70.7532848 },
      { name: '121 Padre Juan Jaque, Puente Alto', lat: -33.576224, lng: -70.5624974 },
      { name: '122 Carachilla, La Granja', lat: -33.5479929, lng: -70.6149048 },
      { name: '123 Los Paltos, La Pintana', lat: -33.6173449, lng: -70.6420628 },
      { name: '124 Rancagua, Recoleta', lat: -33.3891603, lng: -70.645093 },
      { name: '125 Alejandro Sepúlveda, Peñalolén', lat: -33.4734291, lng: -70.5670849 },
      { name: '126 Puerto Aysen, Pudahuel', lat: -33.462143, lng: -70.7445796 },
      { name: '127 Río Rapel, El Bosque', lat: -33.5817568, lng: -70.6720641 },
      { name: '128 Valle Del Sol, Calera de Tango', lat: -33.6154665, lng: -70.7821391 },
      { name: '129 Lord Cochrane, Santiago', lat: -33.4703929, lng: -70.6522985 },
      { name: '130 Pasaje Cuatro, Peñalolén', lat: -33.502743, lng: -70.5718161 },
      { name: '131 Cerro Castillo, Pudahuel', lat: -33.4360857, lng: -70.7713175 }
    ];

    const orangeIcon = L.divIcon({
      className: '',
      html: '<div style="width:10px;height:10px;background:#EE7D65;border-radius:50%;border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 6px rgba(238,125,101,0.8);"></div>',
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      popupAnchor: [0, -8]
    });

    const map = L.map(this.shadowRoot.getElementById('mapa'), {
      center: [-33.47, -70.65],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    proyectos.forEach((p) => {
      L.marker([p.lat, p.lng], { icon: orangeIcon })
        .addTo(map)
        .bindPopup('<b style="color:#EE7D65;font-size:0.75rem;font-family:sans-serif;">' + p.name + '</b>');
    });

    // El contenedor puede medirse tarde dentro de Wix/shadow DOM
    setTimeout(() => map.invalidateSize(), 200);
    window.addEventListener('resize', () => map.invalidateSize());
  }
}

customElements.define('axyz-mapa', AxyzMapa);
