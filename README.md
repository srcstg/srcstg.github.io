# D10 SPACE — sitio estático (GitHub Pages)

Repositorio del sitio web de **D10 SPACE**, estudio creativo de diseño y desarrollo digital. El contenido se publica como sitio estático en **GitHub Pages**; el dominio personalizado configurado es [d10.cl](https://d10.cl) (archivo `CNAME`).

## Recursos compartidos (no HTML)

| Ruta | Descripción |
|------|-------------|
| `style.css`, `css/` | Estilos globales y complementarios (`fixed.css`, `lightbox.css`, etc.). |
| `js/` | Scripts del sitio (`custom.js`, `contact.js`, `lightbox.js`, `validator.js`, jQuery). |
| `img/` | Recursos gráficos (SVG, video de fondo, favicon, miniaturas OG). |
| `brutal/img/` | SVG y gráficos usados por `indexbrutal.html`. |
| `bootstrap-4.1.0-dist/` | Distribución Bootstrap 4 en el repo; **ninguna página la enlaza** (legado, se puede eliminar si no la necesitas). |

---

## Páginas HTML (inventario)

### Raíz del repositorio

| Archivo | Título / propósito |
|---------|-------------------|
| [`index.html`](index.html) | **D10 SPACE** — Landing principal: animación en canvas a pantalla completa, logo flotante, pie con `hello@d10.cl` y versión en footer. |
| [`david.html`](david.html) | **HOLA** — Página mínima: fondo verde (`#22c55e`) y el texto “HOLA” centrado. |
| [`harp.html`](harp.html) | **Cuerdas al Viento** — Canvas 2D: líneas tipo cuerdas que reaccionan al puntero y pueden moverse solas tras inactividad. |
| [`indexbrutal.html`](indexbrutal.html) | **BRUTAL flotando con fondo circular animado** — Rejilla de círculos con gradiente y pulso, SVG `brutal.svg` centrado con filtro SVG tipo “líquido” y animación flotante. |

### `empanameter/`

| Archivo | Título / propósito |
|---------|-------------------|
| [`empanameter/index.html`](empanameter/index.html) | **Womganiza v.1.5.8** — Juego/experiencia en canvas pixelado, tipografía Pixelify Sans, botones táctiles (incl. “Jugar”), toasts y lógica de juego en el mismo documento. |

### `3d/`

| Archivo | Título / propósito |
|---------|-------------------|
| [`3d/3d.html`](3d/3d.html) | **Visor GLB con model-viewer** — `<model-viewer>` de Google: carga `/3d/head__d42.glb`, rotación automática, controles de cámara, AR y sombras. |

### `3900/` (display oficina)

| Archivo | Título / propósito |
|---------|-------------------|
| [`3900/display.html`](3900/display.html) | **Display Oficina** — Pantalla tipo “office mood”: fondo en degradado azul claro, orbes difuminados animados, logos **Sorry Mom**, **TWG** y **Brutal** (SVG embebidos + `logos/brutal.svg`), efecto **lava lamp** en canvas (metaballs con blur/contraste) y capas de **vidrio**; enlace “office mood” a `../index.html`. Respeta `prefers-reduced-motion`. |

Recursos en [`3900/logos/`](3900/logos/): `brutal.svg`, `twg.svg`, `sorrymom.svg` (referencias según uso en la página).

### `sm/` (Sorry Mom y demos)

| Archivo | Título / propósito |
|---------|-------------------|
| [`sm/sm.html`](sm/sm.html) | **Video en Loop - Fullscreen** — Vídeo `BACKGROUNDWE.mp4` a pantalla completa, loop, muted, `playsinline` (fondo animado). |
| [`sm/smpixel.html`](sm/smpixel.html) | **Sorry Mom 3D** — Fondo naranja con patrón SVG en scroll infinito + visor **model-viewer** con modelo GLB centrado. |
| [`sm/full.html`](sm/full.html) | **Caída infinita SM** — Fondo naranja: logos `SM.svg` que caen y giran desde posiciones y tamaños aleatorios (animación CSS). |
| [`sm/perdon.html`](sm/perdon.html) | **Sorry Mom Glitch SVG Loop** — Contenedor centrado con imágenes que alternan con efecto glitch RGB sobre fondo naranja. |
| [`sm/failsite.html`](sm/failsite.html) | **Página Trampa con Hero** — Layout tipo sitio con hero y elementos que “caen” (trampa visual interactiva). |
| [`sm/carrusel.html`](sm/carrusel.html) | **Carrusel con Interferencia** — `iframe` que rota entre `smpixel.html`, `full.html` y `perdon.html`, con capa GIF de interferencia que se muestra intermitente. |

### `sm/clave-dinamica/` (plantillas estilo correo)

Todas comparten título de página **“Tu saldo está disponible”** y mensaje de **clave dinámica** (Junaeb / Pluxee): tablas HTML 600px, imágenes locales en `img/` por carpeta.

| Archivo | Notas |
|---------|--------|
| [`sm/clave-dinamica/opt1/clave-dinamica.html`](sm/clave-dinamica/opt1/clave-dinamica.html) | Variante con fuente **Poppins** (Google Fonts). |
| [`sm/clave-dinamica/opt2/clave-dinamica.html`](sm/clave-dinamica/opt2/clave-dinamica.html) | Misma estructura base, tipografía sistema Arial. |
| [`sm/clave-dinamica/opt3/clave-dinamica.html`](sm/clave-dinamica/opt3/clave-dinamica.html) | Variante extendida: bloques extra de imágenes (`texto.png`, `info1–3`), franja azul y footer con redes Pluxee. |

### `sm/mailing/` y `mailing/`

| Archivo | Título / propósito |
|---------|-------------------|
| [`sm/mailing/saldo.html`](sm/mailing/saldo.html) | **Tu saldo está disponible** — Plantilla de correo (contenedor 600px, texto, footer oscuro / marca Pluxee). |
| [`mailing/saldo.html`](mailing/saldo.html) | **Tu saldo está disponible** — Versión alternativa en la raíz de `mailing/` (misma línea temática saldo / CTA, estructura similar con botón destacado). |

---

## Cómo verlo en local

No hace falta build: abre `index.html` en el navegador o sirve la carpeta con un servidor estático, por ejemplo:

```bash
# Python 3
python -m http.server 8080
```

Luego visita `http://localhost:8080`. Algunas rutas usan URLs absolutas que empiezan en `/` (por ejemplo `/img/...`, `/3d/...`); conviene servir desde la raíz del repo para que esos recursos resuelvan bien.

## Despliegue

Al hacer push a la rama configurada para GitHub Pages (habitualmente `master` o `main`), el sitio se actualiza automáticamente. El dominio `d10.cl` debe seguir apuntando a GitHub Pages según la [documentación de dominios personalizados](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Licencia y créditos

© D10 SPACE. El uso del código y los activos depende de la política interna del estudio; para uso externo, contactar en **hello@d10.cl**.
