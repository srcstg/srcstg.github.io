/**
 * AXYZ — Custom Element <axyz-chat>
 * Chat widget flotante con bot scriptado (respuestas por keywords) + mini
 * formulario de contacto. Portado de index.html. Posición fixed bottom-right.
 *
 * Atributos:
 *   logo      — URL del logo blanco (Wix Media) para header y avatar. Opcional:
 *               sin logo muestra "AXYZ" como texto.
 *   auto-open — ms hasta auto-abrir el chat al cargar. Default: 500. "0" = no abrir.
 *
 * Colocación en Wix: en cualquier parte de la página (el widget se posiciona
 * solo, fixed). Darle al elemento tamaño mínimo (ej. 10×10) y dejarlo al final.
 */
class AxyzChat extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const logo = this.getAttribute('logo') || '';
    const autoOpen = this.hasAttribute('auto-open') ? parseInt(this.getAttribute('auto-open'), 10) : 500;

    const logoHtml = logo
      ? '<img src="' + esc(logo) + '" alt="AXYZ" class="logo"/>'
      : '<span class="logo-text">AXYZ</span>';

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { font-family: 'Mulish', 'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        * { box-sizing: border-box; }
        .widget {
          position: fixed; bottom: 24px; right: 16px; z-index: 9999;
          display: flex; flex-direction: column; align-items: flex-end;
        }
        @media (min-width: 768px) { .widget { right: 24px; flex-direction: row; } }

        .window {
          margin-bottom: 12px;
          display: none; flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          width: min(320px, calc(100vw - 2rem));
        }
        .window.open { display: flex; }
        @media (min-width: 768px) { .window { margin-bottom: 0; margin-right: 12px; width: 320px; } }

        .header {
          display: flex; align-items: center; gap: 12px;
          background: #09090b; padding: 12px 16px;
        }
        .logo { height: 26px; width: auto; object-fit: contain; }
        .logo-text { color: #fff; font-weight: 700; letter-spacing: 0.1em; }
        .close {
          margin-left: auto;
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.5); font-size: 1.25rem; line-height: 1;
        }
        .close:hover { color: #fff; }

        .messages {
          display: flex; flex-direction: column; gap: 12px;
          overflow-y: auto;
          background: #27272a; padding: 12px 16px;
          height: 240px;
        }
        .row { display: flex; align-items: flex-start; gap: 8px; }
        .row.user { justify-content: flex-end; }
        .avatar { flex-shrink: 0; height: 19px; width: 19px; overflow: hidden; }
        .avatar img { height: 100%; width: 100%; object-fit: contain; }
        .avatar-dot { height: 19px; width: 19px; border-radius: 50%; background: #EE7D65; flex-shrink: 0; }
        .bubble {
          max-width: 85%;
          padding: 8px 12px;
          font-size: 0.875rem; line-height: 1.625;
          white-space: pre-line;
        }
        .bubble.bot { background: #3f3f46; color: rgba(255,255,255,0.9); }
        .bubble.user { background: #EE7D65; color: #fff; }

        .options {
          display: flex; flex-wrap: wrap; gap: 8px;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: #27272a; padding: 12px 16px;
        }
        .opt {
          background: none; cursor: pointer;
          border: 1px solid #EE7D65; color: #EE7D65;
          padding: 4px 12px; font-size: 0.75rem; font-family: inherit;
          transition: background-color 0.2s, color 0.2s;
        }
        .opt:hover { background: #EE7D65; color: #fff; }

        .inputbar {
          display: flex; align-items: center; gap: 8px;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: #09090b; padding: 8px 12px;
        }
        .inputbar input {
          flex: 1;
          border: 1px solid rgba(255,255,255,0.1);
          background: #3f3f46; color: #fff;
          padding: 6px 12px; font-size: 0.875rem; font-family: inherit;
          outline: none;
        }
        .inputbar input::placeholder { color: rgba(255,255,255,0.3); }
        .inputbar input:focus { border-color: #EE7D65; }
        .send {
          background: #EE7D65; border: none; cursor: pointer;
          color: #fff; padding: 6px 12px;
          transition: background-color 0.2s;
        }
        .send:hover { background: #F19582; }
        .send svg { display: block; height: 16px; width: 16px; }

        .toggle {
          flex-shrink: 0;
          width: 47.6px; height: 47.6px;
          display: flex; align-items: center; justify-content: center;
          background: #EE7D65; border: none; cursor: pointer;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
          transition: background-color 0.2s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .toggle:hover { background: #F19582; transform: translateY(-2px); }
        .toggle svg { height: 20px; width: 20px; color: #fff; }

        /* Mini-form dentro del chat */
        .chat-form { display: flex; flex-direction: column; gap: 8px; }
        .chat-form input, .chat-form textarea {
          width: 100%;
          background: #52525b; border: 1px solid rgba(255,255,255,0.1);
          color: #fff; padding: 6px 8px; font-size: 0.75rem; font-family: inherit;
          outline: none; resize: none;
        }
        .chat-form input::placeholder, .chat-form textarea::placeholder { color: rgba(255,255,255,0.3); }
        .chat-form input:focus, .chat-form textarea:focus { border-color: #EE7D65; }
        .chat-form button {
          width: 100%;
          background: #EE7D65; border: none; cursor: pointer;
          color: #fff; padding: 6px;
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; font-family: inherit;
        }
        .chat-form button:hover { background: #F19582; }
        .form-title { margin: 0 0 8px; color: #EE7D65; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em; }
        .form-bubble { flex: 1; background: #3f3f46; padding: 12px; font-size: 0.875rem; color: rgba(255,255,255,0.9); }
      </style>
      <div class="widget">
        <div class="window" id="win">
          <div class="header">
            ${logoHtml}
            <button class="close" id="btn-close" type="button" aria-label="Cerrar chat">&times;</button>
          </div>
          <div class="messages" id="msgs"></div>
          <div class="options" id="opts"></div>
          <div class="inputbar">
            <input type="text" id="input" placeholder="Escribe tu consulta..."/>
            <button class="send" id="btn-send" type="button" aria-label="Enviar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
        <button class="toggle" id="btn-toggle" type="button" aria-label="Abrir chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </button>
      </div>
    `;

    this._logo = logo;
    this._wire(autoOpen);
  }

  _wire(autoOpen) {
    const root = this.shadowRoot;
    const win = root.getElementById('win');
    const msgs = root.getElementById('msgs');
    const opts = root.getElementById('opts');
    const input = root.getElementById('input');
    const logo = this._logo;

    let isOpen = false;
    let greeted = false;

    const INITIAL_OPTS = ['Servicios', 'Contacto'];
    const GREETING = '¡Hola! Bienvenido a Axyz.\n¿En qué podemos ayudarte?\nEstamos aquí para asesorarte.';

    const RESPONSES = {
      servicios:      { text: 'En AXYZ ofrecemos:\n• Regularización de propiedades\n• Diseño arquitectónico\n• Gestión de permisos y patentes\n\n¿Sobre cuál te gustaría saber más?', opts: ['Regularización', 'Arquitectura', 'Contacto'] },
      regularizacion: { text: 'Somos expertos en regularización de propiedades. El proceso incluye:\n\n1. Evaluación de normativas\n2. Seguimiento riguroso\n3. Documentación completa\n\nResultados seguros, rápidos y rentables.', opts: ['¿Cuánto cuesta?', 'Contacto'] },
      arquitectura:   { text: 'Nuestros servicios de arquitectura incluyen:\n\n• Diseño residencial\n• Espacios comerciales\n• Diseño urbano\n\nDe la planificación a la ejecución.', opts: ['¿Cuánto cuesta?', 'Contacto'] },
      ubicacion:      { text: '📍 Ramón Carnicer 65, Of. 11\nProvidencia, Santiago\n\nLunes a viernes, horario de oficina.', opts: ['Contacto'] },
      costo:          { text: 'El costo varía según el tipo y características de tu proyecto. Te ofrecemos una asesoría gratuita y personalizada.', opts: ['Contacto', 'Servicios'] },
      default:        { text: 'Gracias por tu mensaje. Para más información, completa el formulario y te contactamos.', opts: ['Contacto', 'Servicios'] }
    };

    const normalize = (s) => s.toLowerCase()
      .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e')
      .replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o')
      .replace(/[úùü]/g, 'u').replace(/ñ/g, 'n');

    const getResponse = (text) => {
      const t = normalize(text);
      if (/regulariz|propiedad|permiso|patente|terreno/.test(t)) return RESPONSES.regularizacion;
      if (/arquitect|disen|construc|comercial|residencial/.test(t)) return RESPONSES.arquitectura;
      if (/donde|ubicacion|direccion|oficina|lugar/.test(t)) return RESPONSES.ubicacion;
      if (/cuanto|costo|precio|valor|cobr/.test(t)) return RESPONSES.costo;
      if (/servicio|ayuda|hacen|ofrecen/.test(t)) return RESPONSES.servicios;
      if (/hola|buenas|buenos|saludos/.test(t)) return { text: GREETING, opts: INITIAL_OPTS };
      return RESPONSES.default;
    };

    const avatarHtml = () => logo
      ? '<div class="avatar"><img src="' + logo + '" alt="AXYZ"/></div>'
      : '<div class="avatar-dot"></div>';

    const addMsg = (text, isBot) => {
      const wrap = document.createElement('div');
      wrap.className = isBot ? 'row' : 'row user';
      if (isBot) wrap.innerHTML = avatarHtml();
      const bub = document.createElement('div');
      bub.className = 'bubble ' + (isBot ? 'bot' : 'user');
      bub.textContent = text;
      wrap.appendChild(bub);
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    };

    const setOpts = (list) => {
      opts.innerHTML = '';
      (list || INITIAL_OPTS).forEach((o) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.textContent = o;
        b.addEventListener('click', () => handleSend(o));
        opts.appendChild(b);
      });
    };

    const showContactForm = () => {
      opts.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'row';
      wrap.innerHTML = avatarHtml() +
        '<div class="form-bubble">' +
          '<p class="form-title">Completa tus datos</p>' +
          '<form class="chat-form">' +
            '<input name="nombre" type="text" placeholder="Nombre"/>' +
            '<input name="email" type="email" placeholder="Email"/>' +
            '<input name="telefono" type="tel" placeholder="Teléfono"/>' +
            '<input name="comuna" type="text" placeholder="Comuna"/>' +
            '<textarea name="mensaje" rows="2" placeholder="Mensaje"></textarea>' +
            '<button type="submit">Enviar</button>' +
          '</form>' +
        '</div>';
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
      wrap.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        wrap.remove();
        addMsg('¡Gracias! Recibimos tu mensaje. Te contactaremos pronto.', true);
        setOpts(INITIAL_OPTS);
      });
    };

    const handleSend = (text) => {
      if (!text) { text = input.value.trim(); input.value = ''; }
      if (!text) return;
      const t = normalize(text);
      if (/^contacto$/.test(t) || /contact/.test(t)) {
        addMsg(text, false);
        setTimeout(showContactForm, 420);
        return;
      }
      addMsg(text, false);
      const r = getResponse(text);
      setTimeout(() => { addMsg(r.text, true); setOpts(r.opts); }, 420);
    };

    const openChat = () => {
      isOpen = true;
      win.classList.add('open');
      if (!greeted) {
        greeted = true;
        setTimeout(() => { addMsg(GREETING, true); setOpts(INITIAL_OPTS); }, 350);
      }
    };
    const closeChat = () => { isOpen = false; win.classList.remove('open'); };

    root.getElementById('btn-toggle').addEventListener('click', () => (isOpen ? closeChat() : openChat()));
    root.getElementById('btn-close').addEventListener('click', closeChat);
    root.getElementById('btn-send').addEventListener('click', () => handleSend());
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

    if (autoOpen > 0) setTimeout(() => { if (!isOpen) openChat(); }, autoOpen);
  }
}

customElements.define('axyz-chat', AxyzChat);
