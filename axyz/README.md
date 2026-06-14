# AXYZ — Laboratorio de diseño

Repositorio de **maqueta de referencia** para el rediseño del sitio de [AXYZ](https://www.axyz.cl) (arquitectura y regularización de propiedades, Chile).

> **Importante:** Este repositorio **no se despliega a producción**. Es un laboratorio de diseño donde iteramos el HTML/CSS/JS hasta que el cliente apruebe, y luego portamos sección por sección al sitio Wix vivo en `axyz.cl` siguiendo la estrategia híbrida documentada más abajo. Se puede servir como preview en GitHub Pages (ver "Deploy a GitHub Pages").

---

## Protocolo de trabajo con Claude

**Alinear antes de cambios grandes.** Antes de implementar cambios visuales o estructurales de cierto alcance —rediseño de hero, reemplazo de una sección entera, nuevo bloque destacado, cambio de paleta o tipografía global, refactor multi-archivo— Claude **propone primero** el enfoque en 2-3 líneas (qué, cómo, alternativas si las hay) y **espera la aprobación** antes de tocar código.

**Cambios chicos siguen yendo directo:** ajustes de copy, tweaks de color/spacing, bugfixes puntuales, completar TODOs ya acordados.

**Por qué:** este repo es un laboratorio de diseño iterativo con el cliente. Las decisiones visuales son parte del valor entregado, no solo el código. Implementar un rediseño completo "de una" deja al usuario fuera de la decisión que más le importa.

En duda, preferir alinear. La fricción de una propuesta corta es baja; deshacer un cambio grande no querido es costoso.

---

## Contexto

- **Sitio actual:** `axyz.cl` está publicado en **Wix** (vivo).
- **Plataforma destino:** **Wix Studio** (Editor X discontinuado en enero 2025; Wix Editor clásico es menos capaz para diseños custom).
- **Objetivo:** Reemplazar el diseño actual con la propuesta de este repo, con la **menor pérdida visual posible**.
- **Flujo:** Iterar aquí → revisar visualmente (preview local o GitHub Pages) → portar manualmente a Wix Studio.

### Expectativa realista de fidelidad

Wix **no permite importar HTML/CSS directamente** en ningún editor. El plan de "diseñar fuera + portar a Wix con mínima pérdida" tiene un techo:

| Aspecto | Fidelidad esperada |
|---|---|
| Visual (paleta, tipografía, layout, espaciados) | **70–85 %** |
| Animaciones e interacciones | **50–70 %** |
| SEO/performance (depende de cuánto Embed se use) | Variable |

Cualquier promesa de fidelidad superior implica salir de Wix (Headless con frontend propio en Vercel/Netlify), lo cual no es el plan acá.

---

## Estrategia de portabilidad: **Híbrido por capas**

> **Actualización (junio 2026): reparto CE-heavy.** Para minimizar la configuración manual en el editor, se decidió invertir el balance: nativo solo navbar/footer, títulos de sección, Wix Blog y Wix Forms; **todo lo visual va como Custom Elements** ya generados y verificados en [`wix/`](wix/README.md). Las capas de abajo siguen vigentes como mecanismos; cambió cuánto se usa cada una.

Validada por investigación (mayo 2026). Combina tres mecanismos según el tipo de contenido:

### 1. `global.css` con Tailwind compilado y purgado

- Compilar Tailwind a CSS estático con purga agresiva apuntada a este HTML.
- Pegar el resultado en **Wix Studio → Site → Custom CSS → `global.css`**.
- Objetivo: < 100 KB (actual: 23 KB).
- Renombrar clases utilitarias si chocan con clases semánticas internas de Wix.
- En este repo ya están listos `package.json`, `tailwind.config.js` y `tailwind.input.css`. Para generar:

```powershell
npm install
npm run build:css     # → global.css purgado y minificado
```

### 2. Reconstrucción nativa en Wix Studio

Para todo lo que Wix hace bien sin pelear:

- Navbar, footer, navegación
- Secciones de texto/imágenes (no el hero CAD, que va como Custom Element)
- Formularios → **Wix Forms nativo** (con reCAPTCHA propio de Wix, descartar el captcha matemático del repo)
- Blog → **Wix Blog/CMS nativo** (replicando estilos visuales)
- Animaciones scroll-reveal y parallax → **Animations & Effects → Scroll** nativos de Wix Studio (o las reglas `scroll-driven` que ya están en `global.css`, ver más abajo)

### 3. Custom Elements para piezas complejas

Para los bloques donde reconstruir destruye la fidelidad, encapsular en **Custom Elements** (web components), que corren tu JS en sandbox sin pelear con Wix. En este repo ya están extraídos como archivos autosuficientes:

| Bloque del repo | Archivo standalone | Recomendación |
|---|---|---|
| **Hero CAD wireframe 3D** con cámara fly | [hero.html](hero.html) (playground) + integrado en `index.html` | **Custom Element** (hospedar JS de proyección en Velo `public/`) |
| Mapa Leaflet con 129 marcadores coral | [secciones/mapa.html](secciones/mapa.html) | **Custom Element** (hospedar JS en Velo `public/`) |
| Carrusel marquee de logos | [secciones/marquee.html](secciones/marquee.html) | **Custom Element** |
| Flip cards 3D ("Confianza en AXYZ") | [secciones/flip-cards.html](secciones/flip-cards.html) | **Custom Element** |
| Chat widget scriptado | [secciones/chat.html](secciones/chat.html) | **Custom Element** o reemplazar por Wix Chat / Tidio / Crisp |
| Modales de blog | (no se exporta) | **Lightbox nativo** de Wix (no portar la lógica custom) |

> **Requisitos para Custom Elements en Wix:** plan Premium + dominio propio (ambos ya los tiene el cliente). El JS debe estar hospedado en HTTPS (Velo `public/` o CDN externo).

### Alternativa rápida (no recomendada salvo prototipo): HTML iFrame Embed

Wix también ofrece embeds tipo iframe. Tienen tres problemas que hacen que **no sea la opción recomendada**:

- Sandboxed: comunicación con la página solo vía `postMessage`.
- **SEO degradado**: el contenido del iframe no se indexa como nativo.
- Scroll-jacking y altura fija incómodos con parallax / sticky.

Usar solo como prototipo veloz para demos al cliente, no en producción.

---

## Integración Claude Code ↔ Wix (MCP oficial)

Wix mantiene un servidor MCP oficial (`@wix/mcp`) compatible con Claude Code. Ya está configurado en este repo vía [.mcp.json](.mcp.json) — Claude Code lo cargará automáticamente al abrir el proyecto (pedirá aprobación la primera vez).

### Qué SÍ hace
- Buscar en la documentación oficial de Wix (REST APIs, Velo, Wix Studio).
- Leer artículos completos de docs y esquemas de métodos.
- Listar y consultar sitios Wix asociados a la cuenta.
- Llamar APIs de negocio: productos (stores), reservas (bookings), CMS, blog posts, formularios enviados, miembros, media.

### Qué NO hace
- ❌ Crear o editar páginas en Wix.
- ❌ Empujar HTML/CSS al editor.
- ❌ Desplegar código Velo automáticamente.
- ❌ Modificar el DOM del sitio en vivo.

### Instalación alternativa por CLI
Si prefieres registrarlo globalmente en lugar de project-scoped:

```powershell
claude mcp add wix -- npx -y @wix/mcp --wixCliAuth
```

**Conclusión práctica:** Claude Code sirve como **copiloto** durante la implementación (consulta docs, prepara snippets, valida APIs), pero **el trabajo de pegar y ajustar en Wix Studio es manual**.

---

## Estructura del proyecto

```
AXYZ/
├── README.md
├── .gitignore                  # OS, editor, node_modules, .claude/settings.local.json
├── .mcp.json                   # Wix MCP server (project-scoped)
├── package.json                # Build de Tailwind purgado
├── tailwind.config.js          # Escanea index.html, Paginas/*, secciones/*
├── tailwind.input.css          # Directivas Tailwind + estilos custom
├── global.css                  # Tailwind compilado/purgado (23 KB) — para pegar en Wix
├── index.html                  # Landing principal con hero CAD wireframe 3D integrado
├── hero.html                   # Playground standalone del hero CAD (referencia)
├── LandingMobile.tsx           # Componente React huérfano (ver "Pendientes")
├── LOGO AXYZ.jpeg              # Logo viejo (ya no se referencia, ver "Pendientes")
├── Paginas/
│   ├── blog.html               # Listado completo del blog + modales
│   └── contacto.html           # Formulario + dirección + mapa Google
├── secciones/                  # Bloques autosuficientes listos para Custom Elements
│   ├── marquee.html
│   ├── flip-cards.html
│   ├── mapa.html
│   └── chat.html
├── wix/                        # Kit de traspaso a Wix Studio (estrategia CE-heavy, ver wix/README.md)
│   ├── README.md               # Estado del traspaso + trade-offs
│   ├── 00-fundacion.md         # Sitio staging, theme, global.css, clases custom
│   ├── 01-navbar-footer.md     # Únicos bloques de layout nativos
│   ├── 02-custom-elements.md   # Pipeline + catálogo de los 9 CE + ensamblaje Home
│   ├── ce/                     # Los 9 Custom Elements autosuficientes (.js)
│   └── preview.html            # Banco de pruebas local de los CE
└── assets/                     # ← lowercase para case-sensitivity de Linux/GitHub Pages
    ├── logo-white.png          # Logo activo del sitio
    ├── Respuesta.jpg
    ├── planificación.jpg
    ├── Arquitectura/           # 3 categorías + foto equipo
    ├── Banner home/            # Banner del hero viejo y bandas parallax
    ├── Blog/                   # 15 portadas de artículos
    └── Logos empresas/         # 11 logos clientes para el carrusel
```

> Carpeta y rutas alineadas en lowercase (`assets/`) para case-sensitivity de Linux/GitHub Pages. Las subcarpetas mantienen sus mayúsculas (`Arquitectura/`, `Banner home/`, `Blog/`, `Logos empresas/`) y todas las referencias HTML usan el mismo case.

---

## Stack técnico (laboratorio)

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura |
| **Tailwind CSS** (vía CDN `cdn.tailwindcss.com`) | Estilos utility-first |
| **JS vanilla** | Animaciones, modales, captcha, chat widget, proyección 3D del hero, scroll-reveal |
| **SVG dinámico** | Hero CAD wireframe proyectado (8 volúmenes + bg + grilla) |
| **Leaflet 1.9.4** (vía unpkg) | Mapa de proyectos con CartoDB Dark tiles |
| Google Maps embed | Mapa en página de contacto |

**Para iterar en el repo: sin build step.** Para portar a Wix: `npm run build:css` genera `global.css` (ver "Estrategia").

---

## Sistema de diseño (fuente de verdad para Wix Studio)

### Paleta

| Rol | Token | Hex |
|---|---|---|
| Fondo principal | `bg-zinc-900` | `#18181b` |
| Fondo secundario | `bg-zinc-800` | `#27272a` |
| Fondo de tarjetas | `bg-zinc-700` | `#3f3f46` |
| Header / Footer | `bg-zinc-950` | `#09090b` |
| **Acento brand** | `bg-[#EE7D65]` | `#EE7D65` (coral) |
| Acento hover | `bg-[#F19582]` | `#F19582` (10% más claro) |
| Texto principal | `text-white` | `#ffffff` |
| Texto secundario | `text-white/60` o `text-white/50` | con alpha |
| Texto muted | `text-white/30` o `text-white/40` | con alpha |

### Tipografía

- Familia: `'Avenir', 'Avenir Next', 'Avenir Next LT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Títulos sección (h2): `text-2xl md:text-[2.34rem]` bold
- Eyebrows (sobre títulos): coral, uppercase, `tracking-widest`, semibold
- Cuerpo: `text-sm` mobile / `text-[1.2rem]` desktop

### Layout

- **Contenedor de sección:** `mx-auto max-w-7xl px-5 md:px-6`
  - Ancho máximo 1280px (`max-w-7xl`)
  - Padding lateral: 20px mobile / **24px desktop** (`md:px-6`)
- **Hero CAD (caso especial):** wrapper interno `.cad-content-inner` con `max-width: 1184px; margin: 0 auto` — texto a la izquierda dentro de un container centrado en pantallas anchas.
- **Sin márgenes verticales entre secciones:** las secciones del home no tienen `mt-*` entre ellas — se tocan directamente para evitar franjas oscuras del body.
- **Breakpoint principal:** `md:` (768px). Mobile = stack vertical, acordeones, steppers verticales. Desktop = grid de columnas, flip-cards, steppers horizontales.

### Logo

- Archivo: `assets/logo-white.png` (aspect ratio ~3.43:1, transparente)
- **Tamaños vigentes** (todos achicados 20% respecto al diseño inicial):

| Ubicación | Tailwind class | Altura |
|---|---|---|
| Navbar | `h-[34px] w-auto` | 34px |
| Footer | `h-[51px] w-auto` | 51px |
| Header del chat | `h-[26px] w-auto object-contain` | 26px |
| Avatar bot del chat | `h-[19px] w-[19px] object-contain` | 19×19 |

- Atributo `alt="AXYZ"` en TODOS los usos — esto lo exime del filtro B&N global.

### Tratamiento visual: blanco y negro global

Decisión de diseño: las imágenes del sitio van en blanco y negro, con dos excepciones explícitas.

- `img:not([alt="AXYZ"]) { filter: grayscale(1); }` — aplica a todas las `<img>` excepto el logo.
- Para los `background-image` (bandas parallax del sitio viejo, si quedan), un pseudo-elemento `::before` con `background: hsl(0,0%,50%); mix-blend-mode: saturation;` desatura el fondo sin afectar texto, CTAs ni overlays.
- **Excepción 1 (logo):** se exime por `alt="AXYZ"`.
- **Excepción 2 (logos de clientes del marquee):** regla específica `.logos-track img { filter: none; }` con misma especificidad pero declarada después → gana por cascada. Los 11 logos del carrusel se ven a color.
- Otros elementos coral preservados: CTAs, eyebrows, marcadores del mapa Leaflet, líneas seleccionadas y traza animada del hero CAD.

### Hero CAD wireframe 3D

El hero del `index.html` es una escena CAD generada dinámicamente en SVG. Detalles:

- **Proyección 3D** con cámara virtual en `[0, 30, -600]`, focal length 900, rotación 30°.
- **8 volúmenes principales** del edificio (torre, ala, voladizo frontal, penthouse, extensión trasera, voladizo superior, mecánica de techo, podio) con doble ancho × mitad alto (forma horizontal de complejo arquitectónico, no torre vertical).
- **4 volúmenes de fondo** (contexto urbano desvanecido).
- **Grilla de vereda** en el piso (líneas perpendiculares en X y Z).
- **Trazo coral animado** (`.selected-trace`) recorriendo la losa superior del penthouse en loop.
- **viewBox** `285 75 880 495` (centrado sobre el bounding box del edificio).
- **`preserveAspectRatio="xMidYMid slice"`** — escala uniforme rellenando contenedor.
- **`vector-effect: non-scaling-stroke`** en todas las líneas — grosor constante 1px independiente del zoom.
- **Profundidad → opacidad**: cada tipo de línea (`.edge`, `.slab`, `.mullion`, `.cad-bg`, `.ground`) tiene su propio rango de opacidad calculado por distancia a cámara.

### Animación de cámara (`cadCameraFly`)

One-shot intro de 8s sobre el grupo `#cad-scene-g` del SVG:

| % progreso | Estado | Tiempo |
|---|---|---|
| 0% | `scale(1)` | 0s — inicia |
| 25% | `scale(1.3)` | 2s — peak zoom-in |
| 35% | `scale(1.3)` | 2.8s — hold breve |
| 100% | `scale(1)` | 8s — float out |

Easing `cubic-bezier(0.45, 0.05, 0.55, 0.95)` para sensación flotante. El `<g>` interno permite que `vector-effect: non-scaling-stroke` mantenga los trazos 1px crisp durante el zoom (vs. un transform en el `<svg>` que sí escalaría visualmente los strokes).

Al terminar el intro encadena **`cadBreathe`** (loop infinito de 12s, `scale(1) → 1.02 → 1`, ease-in-out): una respiración sutil para que la escena no quede estática. Bajo `prefers-reduced-motion` se bloquea el movimiento persistente (breathe y traza coral); el intro one-shot se deja pasar.

### Tu tranquilidad — outline coral en hover

Cards con SVG outline animado:

- `path.tranquilidad-outline-path` con `stroke-dasharray: 1500 100000` y `stroke-dashoffset: 1500` (en base, oculto).
- Hover → `stroke-dashoffset: 0` con transición simétrica de 0.8s → el trazo se "dibuja" alrededor del perímetro y al sacar el mouse se "desdibuja" en sentido inverso.
- Drop-shadow coral `rgba(238,125,101,0.5)` y stroke-width 2.5 para presencia visual.
- Lift `translateY(-3px)` del frame + overlay negro se atenúa (50% → 25%) al hover para que la imagen B&N "respire".
- Solo desktop con `@media (hover: hover) and (pointer: fine)`.

### Reveal on scroll (scroll-driven)

Sistema genérico que liga la animación al progreso del elemento en el viewport (no a un evento de entrada). Sentido: cada elemento sube proporcionalmente al scroll.

- CSS moderno: `animation-timeline: view()` + `animation-range: entry 0% entry 60%` con `@keyframes reveal-fade-up`. Soporte: Chrome/Edge 115+, Safari 26+.
- Fallback automático con `@supports not (animation-timeline: view())`: IntersectionObserver agrega `.visible` y dispara `transition` clásica.
- Stagger en grids: JS setea `--reveal-start` / `--reveal-end` por item (offset de 8% por índice) para que cada card se complete más tarde que la anterior.
- Auto-tagger: un script al final del body agrega `.reveal-on-scroll` a títulos, párrafos, CTAs, cards, etc. Excluye `.cad-hero` (el hero tiene su propia animación de cámara).

### Blog images — cortina que sube desde abajo

Animación scroll-driven específica para las 4 imágenes del blog:

- `clip-path: inset(100% 0 0 0)` (oculto) → `inset(0 0 0 0)` (visible).
- `animation-range: entry 10% entry 70%`.
- Coexiste con `.img-zoom-wrap:hover img { transform: scale(1.05); }` porque usan propiedades distintas (clip-path vs transform).

### Microinteracciones (Polish Pass 1)

- **Smooth scroll global** en anclas internas.
- **Botones CTA con `btn-cta`**: hover → translateY(-2px) + sombra coral tintada `rgba(238,125,101,0.45)`. Easing `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Imágenes del blog con `img-zoom-wrap`**: hover → scale(1.05) en 600ms.
- **Flechas "Ver más"**: hover sobre el botón → la flecha desliza 4px a la derecha (Tailwind `group-hover:translate-x-1`).

### Animaciones y estilos custom

Definidos en `<style>` dentro de `index.html`. Los de **secciones nativas** están replicados en `tailwind.input.css` (van al `global.css` de Wix); los del **CAD hero** deliberadamente no — su CSS viaja dentro del Custom Element (ver `wix/`), para que el hero sea autosuficiente:

- `.cad-hero` / `.cad-scene` / `.cad-vignette` / `.cad-content` / `.cad-content-inner` — hero CAD wireframe
- `.edge` / `.slab` / `.mullion` / `.cad-bg` / `.ground` — strokes del wireframe (renombrado: `.bg` → `.cad-bg` para evitar choque con clases Tailwind)
- `.selected-static` / `.selected-trace` — losa coral animada del penthouse
- `#cad-scene-g` — grupo SVG contenedor con la animación de cámara (renombrado desde `#cad-content` para no chocar con la clase `.cad-content` del overlay de texto)
- `.flip-card` / `.flip-card-inner` — rotación 3D para tarjetas de "Confianza en AXYZ"
- `.tranquilidad-frame` / `.tranquilidad-outline-path` — outline coral en hover
- `.step-line` / `.step-line-h` — líneas animadas de los steppers
- `.parallax-bg` / `.parallax-band` — fondos fixed con overlay (bandas parallax viejas, si quedan)
- `.reveal-text` / `.reveal-img` / `.reveal-card` — animaciones de entrada específicas (Tu tranquilidad cards, Arquitectura images, etc.)
- `.reveal-on-scroll` — sistema genérico scroll-driven
- `.blog-modal` — overlay full-screen para artículos
- `.btn-cta` / `.img-zoom-wrap` — polish pass 1
- `.logos-wrapper` / `.logos-track` — marquee de logos (50s, con excepción al filtro B&N)
- Keyframes: `cadFade`, `cadFadeTrace`, `cadDraw`, `cadCameraFly`, `reveal-fade-up`, `blog-img-rise`, `marquee`

### Carrusel marquee

- Animación `marquee` de **50s** (ralentizado desde 22s original — efecto contemplativo).
- Pausa al hover (`animation-play-state: paused`).
- Los logos se ven **a color** (excepción al B&N global).

---

## Secciones del landing (`index.html`)

En orden de aparición:

1. **Navbar** sticky (logo + Regulación/Arquitectura/Contacto) → reconstruir nativo
2. **Hero CAD wireframe 3D** con cámara fly, texto a la izquierda dentro de wrapper max-1184 → **Custom Element**
3. **Empresas que nos respaldan** — carrusel marquee de 11 logos (a color) → **Custom Element**
4. **Tu tranquilidad es nuestra prioridad** — 3 tarjetas con imagen + overlay + outline coral en hover → nativo (con SVG outline como detalle custom CSS)
5. **Confianza en AXYZ** — acordeón mobile / flip-cards desktop → **Custom Element**
6. **Banda parallax 1** — frase impacto → nativo (con efecto scroll de Wix)
7. **Regulación (#servicios)** — 3 pilares + stepper de proceso → nativo
8. **Arquitectura (#arquitectura)** — 3 servicios con imagen → nativo
9. **Banda parallax 2** — "Construimos espacios que perduran" → nativo
10. **Blog** — 4 entradas con modales + cortina scroll-driven en imágenes → **Wix Blog/CMS + Lightbox nativo**
11. **Proyectos en todo Chile** — contadores + mapa Leaflet (~129 marcadores coral) → **Custom Element**
12. **Banda parallax 3 (CTA)** — "¿Listo para regularizar tu propiedad?" → nativo
13. **Contacto inline** — formulario con captcha → **Wix Forms nativo**
14. **Footer** — servicios, dirección, redes → nativo
15. **Botón scroll-to-top** → nativo
16. **Chat widget flotante** → **Custom Element** o Wix Chat / integración

---

## Activos (assets)

### `assets/logo-white.png`
Logo principal (navbar, footer, chat header, chat avatar). Coral sobre transparente. Aspect ratio ~3.43:1.

### `assets/Banner home/`
- `Banner home.jpg` — Bandas parallax del sitio viejo (B&N global aplicado). El hero ya no lo usa (ahora es CAD wireframe).

### `assets/Arquitectura/`
- `Diseño Residencial.jpg` / `Espacios comerciales.jpg` / `Diseño Urbano.jpg` — Sección Arquitectura.
- `Equipo.jpg` — Tarjeta "Equipo Especializado" en "Tu tranquilidad".

### `assets/Blog/`
15 portadas. Las 4 visibles en el landing:
- `habilitación.jpg` — Cómo habilitar un local comercial
- `patente comercial.jpg` — Patentes comerciales en Chile
- `Guía completa.jpg` — Certificaciones de instalaciones
- `Calificación industrial.jpg` — Calificación industrial

El resto se usan en `Paginas/blog.html`.

### `assets/Logos empresas/`
11 logos clientes para el carrusel marquee. Convención: `<N>_<NombreEmpresa>.jpg`. Se ven **a color** (excepción al B&N global).

### `assets/` (raíz)
- `Respuesta.jpg` y `planificación.jpg` — Tarjetas de "Tu tranquilidad".

---

## Historial de decisiones de diseño aplicadas

Iteraciones acordadas con el cliente que deben replicarse en Wix Studio:

| # | Decisión | Estado |
|---|---|---|
| 1 | Color brand cambiado de naranja Tailwind a **coral `#EE7D65`** (hover `#F19582`) | ✅ aplicado en todos los archivos |
| 2 | **Logo nuevo** `assets/logo-white.png` reemplaza al `LOGO AXYZ.jpeg` original | ✅ aplicado |
| 3 | **Logo achicado 20%** en sus 4 ubicaciones (navbar 34px, footer 51px, chat header 26px, avatar 19px) | ✅ aplicado |
| 4 | **Carrusel marquee** ralentizado de 22s a **50s** | ✅ aplicado |
| 5 | **Todas las imágenes en blanco y negro** (excepto logo y logos de clientes del marquee, ver siguiente) | ✅ aplicado |
| 6 | **Excepción B&N: logos del marquee a color** (regla `.logos-track img { filter: none; }`) | ✅ aplicado |
| 7 | **Polish Pass 1**: smooth scroll, botones CTA con lift + sombra coral, imágenes blog con zoom, flechas "Ver más" animadas | ✅ aplicado |
| 8 | **Padding lateral de secciones** reducido de `md:px-12` (48px) a **`md:px-6`** (24px) | ✅ aplicado |
| 9 | **Márgenes verticales entre secciones eliminados** (sin `mt-1 md:mt-3` ni `mt-3` en las 6 secciones del home) — sin franja oscura del body asomando | ✅ aplicado |
| 10 | **Reveal on scroll genérico** (scroll-driven CSS con fallback IntersectionObserver) — elementos suben proporcionalmente al scroll, no en cascada simultánea | ✅ aplicado |
| 11 | **Blog images: cortina scroll-driven** desde abajo (clip-path animado) | ✅ aplicado |
| 12 | **Tu tranquilidad: outline coral animado en hover** (SVG path con stroke-dashoffset) + lift + atenuación del overlay | ✅ aplicado |
| 13 | **Hero rediseñado: CAD wireframe 3D** (proyección JS dinámica) reemplaza al banner parallax con `Banner home.jpg` | ✅ aplicado |
| 14 | **Animación de cámara `cadCameraFly`** en el hero: zoom in 2s + hold + float out 5s, one-shot intro | ✅ aplicado |
| 15 | **Edificio CAD**: doble ancho / mitad alto (forma horizontal, no torre vertical) — más natural para hero widescreen | ✅ aplicado |
| 16 | **viewBox del hero** `285 75 880 495` (zoom apretado centrado sobre el edificio) | ✅ aplicado |
| 17 | **Renames CAD**: `.bg` → `.cad-bg` (evita colisión con Tailwind), `#cad-content` → `#cad-scene-g` (evita confusión con `.cad-content` del overlay de texto) | ✅ aplicado |
| 18 | **Carpeta `Assets/` → `assets/`** (lowercase) para case-sensitivity de Linux/GitHub Pages — incluye 16 refs HTML y todas las entries del git index | ✅ aplicado |
| 19 | **Breathing del hero (`cadBreathe`)**: tras el intro de cámara, la escena pulsa `scale 1→1.02` en loop de 12s; bloqueado bajo `prefers-reduced-motion` | ✅ aplicado |

> La **estructura, copy y posición** de todas las secciones está aprobada por el cliente — no se mueven. Estos cambios son polish visual sobre lo aprobado, excepto el hero que sí se rediseñó (CAD wireframe en vez de banner parallax).

---

## Cómo previsualizar localmente

No requiere instalación para visualizar. Tres opciones:

```powershell
# 1. Abrir directo en el navegador
start index.html

# 2. Servidor estático con Python (recomendado)
python -m http.server 8000
# → http://localhost:8000

# 3. Con Node
npx serve .
```

Para compilar el `global.css` que va a Wix Studio:

```powershell
npm install
npm run build:css     # → genera global.css purgado y minificado
```

---

## Deploy a GitHub Pages (preview público)

El repo se puede servir como preview en GitHub Pages bajo `d10.cl/AXYZ/` (o equivalente). Útil para mostrar al cliente antes de portar a Wix.

### Pre-requisitos ya resueltos en el repo

- ✅ Carpeta `assets/` en lowercase (compatible con Linux case-sensitive).
- ✅ Todas las referencias HTML/CSS apuntan al case correcto del filesystem.
- ✅ Sin paths absolutos (`/foo`) que rompan bajo un subpath.
- ✅ `node_modules/` ignorado.
- ✅ `global.css` trackeado.

### Pasos para activar

1. **Habilitar Pages para el repo `AXYZ`**:
   - GitHub → repo `AXYZ` → Settings → Pages.
   - Source: deploy from branch `main`, folder `/` (root).
2. **Configurar `d10.cl` como custom domain** en el user/org page de GitHub (no en este repo, sino en `<user>.github.io`):
   - Settings → Pages → Custom domain: `d10.cl`.
3. **DNS de `d10.cl`** apuntando a GitHub Pages:
   - 4 A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
4. Esperar ~10 min para aprovisionamiento de GitHub + propagación DNS.

Resultado: el repo se sirve en `d10.cl/AXYZ/` (URLs en GitHub Pages son case-insensitive para el nombre de repo, pero los assets dentro son case-sensitive — por eso fue clave alinear `assets/` lowercase).

### Limitaciones del preview en GitHub Pages

| Tema | Estado |
|---|---|
| Form de contacto | El submit solo hace `alert()` — GitHub Pages no tiene backend. Para una demo está OK; para recibir leads reales hay que integrar Formspree, EmailJS o similar (~10 líneas de JS). |
| Chat widget | Funciona — bot scriptado client-side, sin backend. |
| Mapa Leaflet | Funciona — CDN unpkg + CartoDB tiles. |
| Tailwind CDN | Funciona. |
| Hero CAD wireframe 3D | Funciona — proyección JS pura, sin server. |
| Wix MCP | No aplica al deploy — sigue funcionando local en Claude Code. |

---

## Datos de contacto (referencia para portar)

- **Dirección:** Ramón Carnicer 65, Of. 11, Providencia, Santiago
- **Teléfono:** +56 9 3299 4825
- **Email:** hola@axyz.cl
- **Redes:** [LinkedIn](https://cl.linkedin.com/company/axyz-arq) · [Facebook](https://www.facebook.com/people/axyzarq/100053673380029) · [Instagram](https://www.instagram.com/axyz.arq/)

---

## Pendientes / conocidos

- **`LandingMobile.tsx`** — Componente React aislado, no conectado a build. Decidir: borrarlo o documentar su rol.
- **`LOGO AXYZ.jpeg`** — Logo viejo en root, ya no referenciado por el código. Conservado como backup hasta confirmar; puede borrarse.
- **Avatar del chat (19×19px)** — el logo es muy horizontal (~3.43:1) y dentro del cuadrado queda como una franja delgada. Opciones cuando se decida:
  - Aceptar y dejarlo así.
  - Crear un crop cuadrado del logo (`logo-icon.png` solo con isotipo).
  - Reemplazar por un círculo coral con la "A" inicial.
- **Banner home / bandas parallax viejas** — `assets/Banner home/Banner home.jpg` ya no se usa en el hero (ahora es CAD wireframe). Sigue usándose en las 3 bandas parallax que cortan las secciones. Si se rediseñan esas bandas también, el asset puede borrarse.

---

## Flujo de trabajo recomendado

1. **Iteración de diseño** en este repo (Claude Code + edición directa).
2. **Previsualización** local o capturas/video para el cliente. Opcional: deploy a GitHub Pages bajo `d10.cl/AXYZ/`.
3. **Aprobación** del cliente (estructura ya aprobada; iteramos polish visual + hero rediseñado).
4. **Preparación de assets para portar:**
   - `npm run build:css` → `global.css` purgado.
   - Cada bloque complejo ya está aislado en `secciones/` (+ `hero.html` standalone), listo para envolver como Custom Element.
   - Hospedar JS de Custom Elements en Velo `public/` o CDN.
5. **Wix MCP ya configurado** vía `.mcp.json` — solo aprobarlo al abrir el proyecto en Claude Code.
6. **Implementación en Wix Studio** — módulo por módulo siguiendo las guías de [`wix/`](wix/README.md), primero en un **sitio de prueba (staging)** y luego replicando en el sitio vivo:
   - Pegar `global.css`.
   - Reconstruir secciones nativas.
   - Insertar Custom Elements (hero CAD, mapa, marquee, flip cards, chat).
   - Migrar copy desde el HTML del repo.
   - Configurar Wix Forms y Wix Blog.
7. **QA visual** comparando lado a lado el HTML local (o `d10.cl/AXYZ/`) vs el draft en Wix Studio.
8. **Publicación** en `axyz.cl`.

---

## Referencias

- [Wix Studio MCP Server](https://www.wix.com/studio/developers/mcp-server)
- [@wix/mcp en npm](https://www.npmjs.com/package/@wix/mcp)
- [Custom Element Introduction (Velo)](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction)
- [Studio Editor: About CSS Editing](https://support.wix.com/en/article/studio-editor-about-css-editing)
- [Studio Editor: Adding a Scroll Animation](https://support.wix.com/en/article/studio-editor-adding-a-scroll-animation)
- [Wix Studio FAQs: Transitioning from Editor X](https://support.wix.com/en/article/wix-studio-faqs-transitioning-from-editor-x)
- [Forum: ¿Wix Studio soporta Tailwind?](https://forum.wixstudio.com/t/does-wix-studio-support-tailwind-css/55326)
- [GitHub Pages: configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [CSS animation-timeline (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)
