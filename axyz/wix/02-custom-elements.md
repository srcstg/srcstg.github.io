# 02 — Custom Elements: pipeline y catálogo

Los 9 componentes de [`wix/ce/`](ce/) cubren todo lo visual del landing. Se montan todos con el **mismo pipeline de 5 pasos**; lo único que cambia por componente son tag, atributos y altura (tabla abajo).

## Preview local (antes de tocar Wix)

```powershell
python -m http.server 8000
# → http://localhost:8000/wix/preview.html
```

Esa página carga los 9 CE con assets locales y simula el texto nativo de Wix. Verificada: wireframe del hero (295 líneas + traza coral), marquee 11 logos, mapa con 129 marcadores, contadores, flips, acordeón, chat.

## Pipeline (igual para todos)

1. **Code (`</>`) → Start Coding → Public & Backend → Public** → crear carpeta `custom-elements`.
2. Crear el archivo (ej. `custom-elements/axyz-hero-cad.js`) y pegar el contenido del `.js` del repo.
3. **Add Elements (+) → Embed & Social → Custom Element** → arrastrar a su sección.
4. Settings del elemento → **Choose Source → Velo file** → el archivo → **Tag name** exacto de la tabla.
5. **Attributes** → agregar los de la tabla → ajustar **tamaño** (ancho generalmente 100% del contenedor; alto según tabla).

> Los CE renderizan en el **Preview** del editor. Publicados solo se ven con plan Premium + dominio (el sitio del cliente cumple; un staging gratuito muestra placeholder).

## Catálogo

| Tag | Archivo | Atributos | Alto interno (mobile/desktop) |
|---|---|---|---|
| `axyz-hero-cad` | [axyz-hero-cad.js](ce/axyz-hero-cad.js) | `headline` (con `\|` como salto de línea), `cta-text`, `cta-link` — todos opcionales, traen defaults. `headline=""` = solo escena para poner H1 nativo encima | 224 / 640 px |
| `axyz-marquee` | [axyz-marquee.js](ce/axyz-marquee.js) | `logos` (JSON array de 11 URLs Wix Media, requerido), `speed` (50), `size` (94) | 94 / 94 px |
| `axyz-tranquilidad` | [axyz-tranquilidad.js](ce/axyz-tranquilidad.js) | `images` (JSON 3 URLs: Respuesta, Equipo, Planificación), `cards` (opcional, override copy) | ~690 / ~265 px (stack/grid) |
| `axyz-confianza` | [axyz-confianza.js](ce/axyz-confianza.js) | — (copy aprobado hardcodeado) | variable / 250 px |
| `axyz-parallax-band` ×3 | [axyz-parallax-band.js](ce/axyz-parallax-band.js) | `image` (URL banner), `text`, `cta-text` + `cta-link` (solo banda 3), `min-height` (480; banda 3: 240) | 280 / 480 px (banda 3: 240) |
| `axyz-regulacion` | [axyz-regulacion.js](ce/axyz-regulacion.js) | — | ~900 / ~835 px |
| `axyz-arquitectura` | [axyz-arquitectura.js](ce/axyz-arquitectura.js) | `images` (JSON 3 URLs: Residencial, Comerciales, Urbano) | ~750 / ~370 px |
| `axyz-blog-cards` | [axyz-blog-cards.js](ce/axyz-blog-cards.js) | `cards` (JSON de 4: `{img, date, title, sub, url}`; `url` = link al post del Wix Blog) | ~1600 / ~870 px |
| `axyz-mapa` | [axyz-mapa.js](ce/axyz-mapa.js) | `stats` (opcional, default `{"proyectos":129,"comunas":47,"regiones":4}`) | ~620 / ~610 px |
| `axyz-chat` | [axyz-chat.js](ce/axyz-chat.js) | `logo` (URL logo-white), `auto-open` (ms; default 500, `0` = off) | 0 (flotante; darle 10×10 y dejarlo al final de la página) |

Las alturas `~` son de referencia (medidas en el preview a 833px de ancho): el contenido interno fluye; en Wix conviene dejar el alto del elemento en "auto"/ajustado al contenido donde Studio lo permita, o usar estos valores como punto de partida.

## Assets que hay que subir a Wix Media (una vez)

| Grupo | Archivos del repo | Para |
|---|---|---|
| Logos clientes (11) | `assets/Logos empresas/*.jpg` | `axyz-marquee` |
| Tranquilidad (3) | `assets/Respuesta.jpg`, `assets/Arquitectura/Equipo.jpg`, `assets/planificación.jpg` | `axyz-tranquilidad` |
| Arquitectura (3) | `assets/Arquitectura/Diseño Residencial.jpg`, `Espacios comerciales.jpg`, `Diseño Urbano.jpg` | `axyz-arquitectura` |
| Banner (1) | `assets/Banner home/Banner home.jpg` | las 3 `axyz-parallax-band` |
| Blog (4) | `assets/Blog/habilitación.jpg`, `patente comercial.jpg`, `Guía completa.jpg`, `Calificación industrial.jpg` | `axyz-blog-cards` |
| Logo (1) | `assets/logo-white.png` | navbar/footer nativos + `axyz-chat` |

> Si el staging se crea en la cuenta Wix conectada a Claude Code, la subida de estos archivos y la captura de URLs se puede automatizar por API — pedirlo en la sesión.

## Ensamblaje de la Home (orden de secciones)

Cada sección nativa lleva: fondo del color indicado (clase `axyz-bg-*`) + H2/intro como **texto nativo** (SEO, editable) + el CE + CTA nativo "Contáctanos" (link a `/contacto`). Los textos nativos NO se estilan a mano: se les asigna su clase en Custom classes — `axyz-h2` (títulos), `axyz-intro` (párrafos), `axyz-eyebrow` (eyebrows), `axyz-cta` + `btn-cta` (botones). Ver tabla en [00-fundacion.md](00-fundacion.md).

| # | Sección (anchor) | Fondo | Texto nativo | CE |
|---|---|---|---|---|
| 1 | Hero | — | (el CE trae el H1; o `headline=""` y H1 nativo encima) | `axyz-hero-cad` |
| 2 | Empresas | `#18181b` | eyebrow "Empresas que nos respaldan" | `axyz-marquee` |
| 3 | Tu tranquilidad | `#27272a` | H2 + intro + CTA | `axyz-tranquilidad` |
| 4 | Confianza (`nosotros`) | `#18181b` | H2 + intro + CTA + frase garantías | `axyz-confianza` |
| 5 | Banda 1 | — | — | `axyz-parallax-band` ("Expertos en regularización y arquitectura") |
| 6 | Regulación (`servicios`) | `#27272a` | H2 + intro + CTA | `axyz-regulacion` |
| 7 | Arquitectura (`arquitectura`) | `#09090b` | H2 + intro + CTA | `axyz-arquitectura` |
| 8 | Banda 2 | — | — | `axyz-parallax-band` ("Construimos espacios que perduran") |
| 9 | Blog (`blog`) | `#27272a` | H2 + intro + CTA "Ver todas las entradas" → `/blog` | `axyz-blog-cards` |
| 10 | Proyectos (`proyectos`) | `#18181b` | eyebrow "Nuestro alcance" + H2 | `axyz-mapa` |
| 11 | Banda 3 (CTA) | — | — | `axyz-parallax-band` (cta-text="Contáctanos", min-height="240") |
| 12 | Contacto (`contacto`) | `#27272a` | H2 + intro + **Wix Forms** (módulo 04) | — |
| 13 | (flotante) | — | — | `axyz-chat` |

## Notas y decisiones pendientes

- **`axyz-blog-cards` depende del módulo Blog**: las `url` de las 4 tarjetas apuntan a posts del Wix Blog — crearlos primero (módulo 03) y luego pegar las URLs.
- **Chat `auto-open`**: hoy 500ms (igual que el repo). Decidir si se sube a ~3000ms o se desactiva; es un atributo, se cambia sin tocar código.
- **Copy dentro de los CE** (confianza, regulación, tarjetas): el cliente no lo edita desde Wix — los cambios se hacen en el repo y se re-pega el archivo. Es el trade-off aceptado del enfoque CE-heavy.
