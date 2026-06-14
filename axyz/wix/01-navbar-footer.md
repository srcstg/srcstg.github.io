# 01 — Navbar + Footer (reconstrucción nativa)

Referencia en el repo: `index.html` líneas 459–478 (navbar) y 1468–1515 (footer).
Estos dos bloques son 100% nativos de Wix — no llevan JS del repo (el menú mobile y el sticky los maneja Wix).

## Navbar (Header de Studio)

Usar el **Header** nativo del sitio (no una strip suelta) para heredar sticky y el comportamiento mobile.

### Estructura

| Elemento | Configuración |
|---|---|
| Header | Fondo `#09090b` (zinc-950) · **Sticky: "Pinned to top"** (siempre visible, sin efecto de hide/show) |
| Contenedor interno | Máx 1280px centrado · padding lateral 24px desktop / 20px mobile · alto ~66px |
| Logo (izquierda) | `assets/logo-white.png` subido a Wix Media · **alto 34px**, ancho auto · link → Home |
| Menú (derecha, desktop) | 2 links de texto + 1 botón (ver abajo) · gap ~40px |

### Links del menú (desktop)

| Texto | Destino | Estilo |
|---|---|---|
| Regulación | anchor `servicios` (Home) | 15.8px, regular, blanco 70% → blanco al hover |
| Arquitectura | anchor `arquitectura` (Home) | ídem |
| **Contacto** (botón) | página `/contacto` | Fondo `#EE7D65`, texto blanco bold uppercase 14px con letter-spacing amplio, padding 20×8px, **sin** bordes redondeados · hover fondo `#F19582` · asignar clase custom **`btn-cta`** |

### Mobile

- Usar el menú hamburguesa nativo de Wix (icono: 3 líneas blancas delgadas).
- Items del menú expandido: Regulación, Arquitectura, Contacto — texto 16px blanco 80%, separadores `rgba(255,255,255,0.1)`.
- El logo se mantiene a la izquierda, mismo alto 34px.

### No portar

- El JS `onclick` del menú mobile del repo (Wix lo resuelve nativo).
- El hack `translateZ(0)` del header (era para un bug de compositing del lab).

## Footer

### Estructura: grid de 4 columnas (desktop) / stack (mobile)

Fondo `#09090b`, padding vertical 64px desktop / 40px mobile, contenedor máx 1280px.

| Columna | Contenido |
|---|---|
| 1 | Logo `logo-white.png` **alto 51px** |
| 2 — "SERVICIOS" | Título 14px bold uppercase blanco 40% + 4 links 14px blanco 60% → blanco hover: Confianza en axyz (anchor `nosotros`), Regulación (anchor `servicios`), Arquitectura (anchor `arquitectura`), Blog (página `/blog`) |
| 3 — "CONTACTO" | Dirección: `Ramón Carnicer 65, Of. 11, Providencia, Santiago` · Tel link `tel:+56932994825` → `+56 9 3299 4825` · Mail link `mailto:hola@axyz.cl` · Social bar (abajo) |
| 4 | Vacía (respiro visual) — en mobile no existe |

### Social bar

3 iconos 24×24px, blanco 60% → blanco al hover (usar el Social Bar de Wix con iconos monocromos, o 3 botones de icono):

- LinkedIn → `https://cl.linkedin.com/company/axyz-arq`
- Facebook → `https://www.facebook.com/people/axyzarq/100053673380029`
- Instagram → `https://www.instagram.com/axyz.arq/`

### Línea de copyright

Texto `© 2026 AXYZ. Todos los derechos reservados.` — 14px, blanco 20%, con borde superior `rgba(255,255,255,0.1)` y padding-top 32px (solo desktop). En Wix el año se deja fijo (el JS de año dinámico del repo no se porta; actualizarlo una vez al año o usar un texto conectado a dataset si se quiere automatizar después).

## QA del módulo

- [ ] Header queda fijo al hacer scroll, fondo `#09090b` sin transparencia
- [ ] Links navegan a los anchors correctos de Home
- [ ] Botón Contacto: hover cambia a `#F19582` y hace lift (clase `btn-cta` aplicada y global.css activo)
- [ ] Mobile: hamburguesa abre menú con los 3 items y navega bien
- [ ] Footer: 4 columnas desktop, stack mobile, links y social abren correctamente
- [ ] Comparar lado a lado con el repo (`python -m http.server 8000`)
