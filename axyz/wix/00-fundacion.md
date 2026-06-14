# 00 — Fundación: sitio de prueba, theme y global.css

Objetivo: dejar el sitio staging listo para recibir módulos. Todo lo de acá se hace una sola vez.

## 1. Crear el sitio de prueba

1. En tu cuenta Wix → **Crear nuevo sitio** → elegir **Wix Studio** (no el editor clásico).
2. Partir de **plantilla en blanco** ("Blank canvas" / lienzo vacío).
3. Nombre sugerido: `AXYZ Staging`.
4. No publicar todavía; se trabaja en el editor y se valida con **Preview**.

> Custom Elements solo renderizan publicados en sitios Premium con dominio — en el staging gratuito se validan vía Preview del editor (ver advertencia en [README](README.md)).

## 2. Theme: colores del sitio

En Studio: **Site Styles (panel izquierdo) → pestaña Colors**. Wix trae 6 roles de color editables por HEX exacto (y permite agregar más, hasta 25). Mapeo AXYZ → roles de Wix:

| Rol de Wix | Función | Hex AXYZ |
|---|---|---|
| Color 1 | Fondo primario (elementos/apps) | `#18181b` (zinc-900) |
| Color 2 | Fondo secundario | `#27272a` (zinc-800) |
| Color 3 | Disabled / tarjetas | `#3f3f46` (zinc-700) |
| Color 4 | Texto secundario | `#a1a1aa` (equivalente sólido de blanco 60% sobre zinc) |
| Color 5 | Texto principal | `#ffffff` |
| Color 6 | Links / acciones (**coral marca**) | `#EE7D65` |

Y **agregar 2 colores custom** (botón + Add color, renombrarlos):

| Nombre sugerido | Hex |
|---|---|
| AXYZ Coral hover | `#F19582` |
| AXYZ Header/Footer | `#09090b` (zinc-950) |

> **Por qué esto va a mano (y no con la IA de Wix ni con Velo):** la IA del editor opera sobre el elemento/módulo seleccionado, no sobre Site Styles — verificado, los prompts de tema no funcionan. Y Velo es código de *runtime* (corre en el navegador del visitante); el theme es configuración de *design-time* del editor, sin API. Son **6 campos HEX, ~2 minutos**: clic en cada color → pegar el HEX → Apply. La tipografía, en cambio, sí viaja por código: ver sección 3.

> **¿Y no puede vivir todo esto en el CSS?** Para la **cáscara, sí** — las clases `axyz-bg-*` y `axyz-*` ya cubren fondos, textos y CTA, así que este panel no afecta lo que montamos con CEs. Se carga igual por una razón concreta: **Wix Forms y Wix Blog** (módulos 03–04) son apps nativas que heredan sus colores del theme — si queda el azul default, esos widgets nacen azules y hay que pelearlos uno a uno. 2 minutos ahora ahorran esa pelea después.

## 3. Theme: tipografía

El repo usa `Avenir` con fallbacks (`Avenir Next`, system, `Segoe UI`). **Avenir es una fuente comercial** (Linotype) — para usarla en Wix hay que subir el webfont y eso requiere licencia.

Opciones (decidir con el cliente):

1. **Si el cliente tiene licencia webfont de Avenir**: subirla como fuente custom (formato `woff2`/`ttf`) y activar fallback fonts para performance. Es la fidelidad máxima.
2. **Revisar qué fuente usa hoy axyz.cl en Wix** — si ya compraron/subieron algo similar, reutilizarla.
3. **Interina recomendada: `Mulish`** (gratuita, en el catálogo de Wix, la más cercana a Avenir). Alternativas: `Nunito Sans`, `Figtree`.

> Nota: en Windows el laboratorio ya se ve con `Segoe UI` (Avenir no viene instalada), así que lo que el cliente aprobó visualmente en un PC Windows es el fallback. No sobre-invertir en Avenir sin confirmar que les importa.

### La tipografía viaja por código: clases `axyz-*` en global.css

**No hay que configurar el panel Typography.** `global.css` trae clases que imponen tamaño, peso, color, espaciado y **uppercase** (que el panel de Wix ni siquiera soporta) sobre cualquier texto nativo, con valores responsive ya calibrados al repo. Solo hay **1 paso de panel**: Site Styles → Typography → sección **Fonts** → cambiar la fuente a **Mulish** (un dropdown; eso hace que Wix cargue la fuente en el sitio — los CE ya la tienen primera en su stack y se alinean solos).

Al montar cada texto nativo, asignarle su clase en **Custom classes**:

| Clase | Uso | Qué impone |
|---|---|---|
| `axyz-h1` | H1 hero (si se usa nativo sobre el CE) | 16→60px, bold, uppercase, blanco |
| `axyz-h2` | Títulos de sección | 24→37px, bold, blanco |
| `axyz-eyebrow` | Eyebrows ("Nuestro alcance", "Empresas que…") | 14→25px, semibold, uppercase, tracking 0.1em, coral |
| `axyz-intro` | Párrafo intro de sección | 14→19px, blanco 60% |
| `axyz-small` | Fechas / notas | 14px, blanco 40% |
| `axyz-cta` + `btn-cta` | Botones Contáctanos | 12→14px bold uppercase, fondo coral + hover `#F19582` + lift |
| `axyz-bg-900` / `axyz-bg-800` / `axyz-bg-950` | Secciones | Fondo `#18181b` / `#27272a` / `#09090b` |

(El primer valor es mobile, el segundo desde 768px. Las clases usan `!important`, así que pisan lo que el theme de Wix traiga por defecto — el elemento de texto se crea con cualquier estilo y la clase lo corrige.)

Sobre Avenir: si el cliente aporta licencia webfont más adelante, se sube la fuente custom y se cambia la primera fuente de las clases en `tailwind.input.css` → `npm run build:css` → re-pegar `global.css`. Un solo punto de cambio.

## 4. Pegar global.css

1. Compilar en el repo (si hubo cambios): `npm run build:css` → genera `global.css` (~25 KB).
2. En Studio: icono **Code (`</>`)** en la barra lateral → **Start Coding** → en el panel de archivos, sección **CSS → global.css**.
3. Pegar **todo el contenido** de [global.css](../global.css) del repo.
4. Cada vez que el repo cambie estilos custom: recompilar y re-pegar (reemplazo completo del archivo — es la fuente de verdad).

> **Regla de oro: nadie más escribe en `global.css`.** El archivo se reemplaza completo con cada actualización del repo, así que cualquier cosa que el **AI Code Assistant** de Wix agregue ahí se perderá en el siguiente re-pegado. Si el asistente ofrece crear clases (ej. `.primary-bg` para fondos), decláralo redundante: ya existen `axyz-bg-900/800/950` y las `axyz-*` de tipografía. Úsalo para lo que sí sirve: navegar el editor o asignar clases a elementos. La asignación manual también es directa: seleccionar el elemento → pestaña **CSS Classes** (panel derecho) → escribir la clase.

## 5. Cómo usar las clases custom en elementos

Wix Studio permite asignar clases CSS a elementos individuales:

1. Seleccionar el elemento en el canvas.
2. En el panel **CSS** (con Code activado) → campo **Custom classes** → escribir el nombre de la clase.
3. La clase debe existir en `global.css` (ya pegado).

**Regla de uso** — qué se estila con cada mecanismo:

- **Clases `axyz-*` de global.css** (tipografía, fondos, CTA — ver sección 3): es el mecanismo principal de estilo de la cáscara. NO intentar replicar utilities Tailwind tipo `bg-[#EE7D65]` vía el campo de clases — para eso están las `axyz-*`.
- **Inspector nativo de Wix**: layout, espaciados, anchos — lo estructural que Wix hace bien.
- **Otras clases útiles de global.css**: `btn-cta` (lift + sombra coral en hover), `reveal-on-scroll` (entrada animada al scroll).
- **Custom Elements** (todo lo visual complejo): llevan su CSS adentro, no dependen de global.css.

## 6. Estructura de páginas

Crear 3 páginas:

| Página | URL slug | Contenido |
|---|---|---|
| Home | `/` | Los 16 bloques del landing (ver orden en [README del repo](../README.md#secciones-del-landing-indexhtml)) |
| Blog | `/blog` | Listado de artículos (módulo 09 — Wix Blog/CMS) |
| Contacto | `/contacto` | Formulario + datos + mapa (módulo 10 — Wix Forms) |

En Home, crear las **secciones vacías** de inmediato (una por bloque) y agregar los **anchors** para la navegación: `servicios` (Regulación), `arquitectura`, `nosotros` (Confianza), `blog`, `proyectos`, `contacto`.

## 7. Breakpoints

Studio usa breakpoints propios (Desktop ≥1001px, Tablet 750–1000px, Mobile <750px). El repo usa un solo corte en 768px (`md:`). Mapeo práctico:

- **Desktop Studio** = diseño `md:` del repo (grids de 3 columnas, flip cards, stepper horizontal).
- **Tablet Studio** = usar el diseño desktop con menos columnas si no cabe (criterio visual).
- **Mobile Studio** = diseño base del repo (stack vertical, acordeones, stepper vertical).

## Checklist de salida

- [ ] Sitio `AXYZ Staging` creado en Wix Studio (blank)
- [ ] Los 6 colores del sitio cargados a mano con los HEX exactos (~2 min) + 2 colores custom
- [ ] Fuente **Mulish** seteada en Site Styles → Typography → Fonts (1 dropdown; el panel de estilos NO se toca)
- [ ] `global.css` pegado en Code → CSS → global.css
- [ ] Clase de prueba verificada: crear un texto, asignarle `axyz-h2` en Custom classes y ver que toma 24/37px bold blanco en Preview
- [ ] 3 páginas creadas + secciones vacías + anchors en Home
