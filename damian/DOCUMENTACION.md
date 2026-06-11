# Documentación técnica — Invitación Baby Shower de Damián

Referencia de cómo funciona la invitación por dentro y por qué está construida así.
Para la **guía de instalación y operación** (rellenar datos, conectar la planilla,
publicar), ver [README.md](README.md). Este documento es para entender o modificar
el código.

- **URL pública:** https://d10.cl/damian
- **Hosting:** GitHub Pages, repo `srcstg/srcstg.github.io` (dominio `d10.cl` vía CNAME).
  Publicar = `git push` a `master`; GitHub despliega en ~1 minuto.
- **Evento:** sábado 27 de junio de 2026.

---

## 1. Arquitectura en una mirada

Tres piezas, sin framework ni build. Todo es estático salvo el backend, que es un
script alojado en Google.

```
   NAVEGADOR DEL INVITADO                GOOGLE
  ┌─────────────────────────┐        ┌──────────────────────────────┐
  │  index.html             │        │  Apps Script (doPost/doGet)   │
  │  · HTML + CSS + JS       │  POST  │  URL .../exec                 │
  │    en un solo archivo    │ ─────► │        │                      │
  │  · CONFIG arriba del JS   │        │        ▼                      │
  │                          │        │  Google Sheet                 │
  │  Censo (lee total) ◄─────┼─ GET ──┤  "damian babyshower"          │
  │                          │        │  pestaña "Confirmaciones"      │
  │  localStorage:           │        │  cols: Fecha · Nombre ·        │
  │   damian_rsvp            │        │  Acompañantes · Total ·        │
  │  sessionStorage:         │        │  Declaración · Teléfono · Msg  │
  │   damian_intro           │        └──────────────────────────────┘
  └─────────────────────────┘
              │  WhatsApp (wa.me) para: compartir, dudas,
              ▼  avisos de "No puedo" y plan B si falla el POST
```

- **Frontend:** [`index.html`](index.html) — un único archivo autocontenido (estilos,
  lógica y textos). No hay dependencias externas salvo las fuentes de Google Fonts.
- **Backend:** [`apps-script.gs`](apps-script.gs) — **copia de referencia** del código
  que vive realmente en Google Apps Script (pegado dentro de la planilla). Editar este
  archivo del repo **no** cambia nada en producción hasta re-pegarlo y re-desplegar.
- **Tarjeta social:** [`og.png`](og.png) — imagen 1200×630 que muestra WhatsApp/redes al
  pegar el link (referida por los `<meta property="og:image">`).
- **Planilla de datos:** "damian babyshower", id `1f1LfwXEI5ifb7R_fpPWwyD-XMV1LZcUKMcRZ7rmDGI8`.

---

## 2. El frontend: un "mazo" de tarjetas

La página es un mazo de **5 tarjetas** a pantalla completa. No hay scroll libre: el
`scroll-snap` obliga a detenerse en cada tarjeta.

| # | `id` | Tarjeta | Contenido |
|---|------|---------|-----------|
| 1 | `portada` | Portada | "Barbi y David te invitan", título, tagline, fecha, cuenta regresiva |
| 2 | `ficha` | Los datos | Ficha con Protagonista / Fecha / Hora / Lugar (Hora y Lugar = "Por confirmar") |
| 3 | `rsvp` | La confirmación | Formulario RSVP + censo en vivo + tarjeta post-confirmación |
| 4 | `regalos` | Los regalos | Guía "Nos falta / Ya tenemos" (sin lista externa) |
| 5 | `fin` | Créditos | Créditos (Mamá/Papá/Lugar/Fecha), "FIN*", botón de dudas |

### Navegación

El movimiento entre tarjetas se logra combinando CSS y JS:

- **CSS** (`.deck` + `.card`): `scroll-snap-type: y mandatory` y `scroll-snap-stop: always`
  hacen que el scroll se "pegue" a cada tarjeta y no se puedan saltar de a varias.
- **JS** mantiene una variable `actual` (índice de la tarjeta visible) usando un
  `IntersectionObserver` con `threshold: 0.6` — cuando una tarjeta ocupa >60% del
  viewport, se marca como actual y se ilumina su punto en la navegación lateral.
- Cuatro formas de avanzar, todas llaman a `irA(i)` que hace `scrollIntoView`:
  - **Botones "Continuar"** (`[data-next]`) → `irA(actual + 1)`.
  - **Puntos laterales** (`.dotnav`, generados en JS, uno por tarjeta) → `irA(i)`.
  - **Teclado**: ↓/PageDown/Espacio avanzan, ↑/PageUp retroceden (se ignora si el foco
    está en un `input`/`textarea`).
  - **"Volver al inicio"** (`#backTop`) → `irA(0)`.

### Intro de cine (3 · 2 · 1)

El overlay `.leader` muestra una cuenta regresiva tipo "rollo de película" al abrir.
Detalles de comportamiento (función `intro()`):

- Se muestra **una vez por sesión** (marca `sessionStorage["damian_intro"]`).
- Se puede **saltar** tocándola, o con el parámetro `?nointro` en la URL.
- Se desactiva entera con `prefers-reduced-motion`.

---

## 3. El bloque CONFIG

Todo lo configurable vive en un único objeto al inicio del `<script>`
([index.html](index.html), ~línea 457). Ningún otro lugar debería tocarse para cambios
de datos.

| Campo | Para qué | Estado actual |
|-------|----------|---------------|
| `MAMA` | Nombre en créditos, fila "Mamá" | `"Barbi"` |
| `PAPA` | Nombre en créditos, fila "Papá" | `"David"` |
| `HORA` | Llena "Hora" en la ficha. Vacío = "Por confirmar*" (en rojo) | `""` (pendiente) |
| `LUGAR` | Llena "Lugar" en la ficha. Vacío = "Por confirmar*" (en rojo) | `""` (pendiente) |
| `PLAZO` | Fecha límite que se muestra bajo el botón confirmar | `"viernes 20 de junio"` |
| `WHATSAPP` | Número (formato `569XXXXXXXX`, sin `+`) para dudas, avisos y plan B | `"56993592888"` |
| `APPS_SCRIPT_URL` | Endpoint `/exec` del backend que recibe los RSVP | configurado |

Cuando **ambos** `HORA` y `LUGAR` se rellenan, la nota de la ficha cambia sola de
"el lugar depende de cuántos seamos" a "Las sillas ya están contadas".

El helper `configurado(v)` considera un campo "listo" si tiene valor y no contiene
`"XXXX"` (sirve de placeholder neutro).

---

## 4. Flujo de confirmación (RSVP)

El corazón de la lógica está en el listener `submit` del formulario. El comportamiento
depende de **Sí / No** y de si hay backend configurado.

```
Enviar formulario
   │
   ├─ ¿Nombre vacío? ─► foco al campo, no envía
   │
   ├─ "No puedo"
   │     • NO escribe en la planilla  ← decisión clave (ver §5)
   │     • Avisa a Barbi/David por WhatsApp (si WHATSAPP está configurado)
   │     • Guarda en localStorage y muestra tarjeta "Recibido / Te vamos a extrañar"
   │
   └─ "Sí, voy"
         ├─ Sin APPS_SCRIPT_URL → Plan B: abre WhatsApp con la confirmación pre-escrita
         └─ Con APPS_SCRIPT_URL → POST a la planilla
               • OK    → localStorage + tarjeta "Confirmado" + recarga el censo
               • Error → re-habilita el botón y avisa (sugiere WhatsApp como respaldo)
```

**Persistencia local:** al confirmar se guarda `localStorage["damian_rsvp"]`
(`{nombre, total, asiste}`). Si la persona reabre el link en el mismo dispositivo,
`restaurar()` salta directo a la tarjeta de confirmación en vez de mostrar el formulario
de nuevo. (Es por-dispositivo, no global: no impide que confirme desde otro teléfono.)

**Datos que se envían** (como `URLSearchParams`, no JSON): `nombre`, `acompanantes`,
`actitud`, `telefono`, `mensaje`.

---

## 5. Decisiones de diseño (el "por qué")

Estas son las decisiones no obvias que conviene recordar antes de modificar algo.

### "No puedo" no toca la planilla
La planilla es la fuente del **censo de asistentes**. Si los "No puedo" escribieran
filas, habría que filtrarlas para contar bien — y el script ya desplegado suma sin
filtrar. Solución: los "No puedo" **no hacen POST**; solo avisan por WhatsApp y muestran
su tarjeta localmente. Así la planilla contiene únicamente asistentes y el censo es
correcto sin tocar el backend.
**Implicancia:** los "No puedo" **no quedan registrados de forma persistente** en
ningún lado del servidor — solo llega el aviso de WhatsApp (y queda en el localStorage
de ese dispositivo). Si en algún momento quieres llevar registro de los que no van,
habría que mandarlos a la planilla con una columna que los distinga y ajustar el
`doGet` para excluirlos del conteo.

### Teléfono con prefijo "+56 9" fijo
El `+56 9` es **texto fijo** (`.telprefix`), fuera del input. El campo solo acepta los
8 dígitos (`maxlength="9"`, `inputmode="numeric"`). Al enviar, se limpian no-dígitos
(`replace(/\D/g, "")`) y se normaliza a `"+56 9 " + digitos`. Esto evita el bug previo
donde un placeholder "+56 9" desaparecía al escribir.

### Nota para parejas
Bajo el contador de acompañantes hay un recordatorio ("Si cuentas a tu pareja,
avísale…") para reducir confirmaciones duplicadas de una misma pareja contándose
mutuamente.

### Sin lista de regalos externa
La tarjeta "Los regalos" trae la guía **"Nos falta / Ya tenemos"** directamente en el
HTML (no hay link a un servicio externo). Para cambiar los ítems, se edita el HTML de
la tarjeta `#regalos`.

### Censo en vivo discreto
El contador ("N personas esperando a Damián") aparece **solo** si hay backend
configurado y al menos 1 persona. Lee el total con un `GET` al mismo endpoint.

### Estética sin jerga de cine
La dirección de arte es Wes Anderson (ver §7), pero los **textos** son literales y
tuteados: nada de "estreno", "capítulos", "presentan". Una referencia visual no debería
exigir "captar el chiste" para entender la invitación.

---

## 6. El backend (Apps Script)

Código en [`apps-script.gs`](apps-script.gs). Es un Web App de Google que expone dos
endpoints en la misma URL `/exec`:

### `doPost(e)` — recibe una confirmación
- Toma un lock (`LockService`, 5 s) para evitar que dos envíos simultáneos pisen filas.
- Agrega una fila con: `Fecha` (timestamp), `Nombre`, `Acompañantes` (acotado 0–10),
  `Total personas` (= acompañantes + 1), `Declaración`, `Teléfono`, `Mensaje`.
  Cada texto se recorta a un máximo de caracteres por seguridad.
- Responde `{ok: true}` o `{ok: false, error}`.

### `doGet()` — devuelve el censo
- Suma la **columna D** ("Total personas") de todas las filas.
- Responde `{ok: true, confirmaciones: <nº de filas>, personas: <suma>}`.
- Es lo que alimenta el contador en vivo del frontend.

### `hoja_()` — helper
Obtiene (o adopta) la pestaña "Confirmaciones": si no existe, **renombra la primera
pestaña** de la planilla y le pone encabezados en negrita + fila congelada. Esto hace
que el script funcione sin importar cómo se haya creado la planilla.

> **Importante al editar el backend:** cambiar el `.gs` y guardar **no** publica los
> cambios. Hay que **Implementar → Administrar implementaciones → editar → Nueva versión**.
> Si no, el `/exec` sigue corriendo la versión anterior.

---

## 7. Sistema visual (Wes Anderson)

- **Paleta** (variables CSS en `:root`):

  | Variable | Hex | Uso |
  |----------|-----|-----|
  | `--paper` | `#F3EADA` | Fondo crema |
  | `--paper2` | `#EDE0C8` | Fondo de fichas/cajas |
  | `--ink` | `#2F4A44` | Verde pino (texto, marcos) |
  | `--mustard` | `#BE9233` | Mostaza (acentos, botones) |
  | `--blush` | `#D9A39A` | Rosa (reserva, poco uso) |
  | `--powder` | `#A9C4CD` | Celeste (chip de cuenta regresiva) |
  | `--red` | `#B5503B` | Rojo ladrillo (énfasis, "Por confirmar") |

- **Tipografías** (Google Fonts): **Jost** (sans geométrica, tipo Futura, para títulos)
  y **Courier Prime** (monoespaciada, para textos tipo "ficha/formulario").
- **Marco de afiche:** el `.frame` es un doble borde fijo (`position: fixed`) que enmarca
  toda la pantalla mientras las tarjetas pasan por dentro — da el aire de póster.
- **Simetría y mayúsculas espaciadas:** títulos en mayúsculas con `letter-spacing` alto,
  todo centrado.

### Regenerar `og.png`
La tarjeta social se generó con un script de PowerShell + `System.Drawing` (no quedó en
el repo). Si cambian los textos del afiche, hay que regenerar la imagen 1200×630
respetando la paleta y la tipografía (Century Gothic como sustituto local de Futura/Jost).

---

## 8. Tareas de mantención frecuentes

| Quiero… | Dónde |
|---------|-------|
| Definir hora y lugar | `CONFIG.HORA` y `CONFIG.LUGAR` en `index.html` → push |
| Cambiar el plazo de confirmación | `CONFIG.PLAZO` |
| Editar los regalos | HTML de la tarjeta `#regalos` (clases `.glabel` / `.gitems`) |
| Cambiar el número de WhatsApp | `CONFIG.WHATSAPP` |
| Ver/contar confirmaciones | La planilla "damian babyshower"; total = `=SUM(D2:D)` |
| Cambiar la fecha del evento | `FECHA_EVENTO` en el JS **y** los textos visibles (ficha, créditos, og) |
| Modificar el backend | `apps-script.gs` → pegar en Apps Script → **re-desplegar nueva versión** |

---

## 9. Limitaciones y cosas a vigilar

- **Filas de prueba inflan el censo.** Cualquier confirmación de prueba cuenta en el
  contador público. Borrarlas en la planilla antes de difundir el link.
- **Los "No puedo" no se guardan** en el servidor (ver §5). Solo llega el aviso de WhatsApp.
- **No hay deduplicación.** Si alguien confirma dos veces, quedan dos filas; se limpian a mano.
- **Re-deploy manual del backend** tras cualquier edición del `.gs` (ver §6).
- **`localStorage` es por dispositivo.** "Ya confirmaste" se recuerda solo en el navegador
  donde se confirmó; en otro teléfono volverá a ver el formulario.
- **La confirmación depende de Google Apps Script.** Si el endpoint falla, el frontend
  cae al plan B de WhatsApp (si `WHATSAPP` está configurado) y, si no, avisa del error.

---

## 10. Referencia rápida de URLs e IDs

| Qué | Valor |
|-----|-------|
| Invitación | https://d10.cl/damian |
| Saltar la intro | https://d10.cl/damian?nointro |
| Planilla | https://docs.google.com/spreadsheets/d/1f1LfwXEI5ifb7R_fpPWwyD-XMV1LZcUKMcRZ7rmDGI8/edit |
| Repo | `srcstg/srcstg.github.io` (carpeta `damian/`) |
| Endpoint backend | `CONFIG.APPS_SCRIPT_URL` en `index.html` (termina en `/exec`) |
