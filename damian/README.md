# Baby Shower de Damián — d10.cl/damian

Invitación estilo Wes Anderson en formato de tarjetas a pantalla completa (se avanza
con swipe, botón "Continuar", flechas del teclado o los puntos del costado), con
confirmación de asistencia (RSVP) a una planilla de Google.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `index.html` | La invitación. Todo (estilos, lógica, textos) vive en este archivo. |
| `apps-script.gs` | Código del backend para pegar en Google Apps Script (recibe los RSVP). |
| `og.png` | Imagen de la tarjeta que muestra WhatsApp al compartir el link. |

## ✏️ Paso 1 — Rellenar los espacios (2 min)

Abre `index.html` y busca el bloque `CONFIG` (está al inicio del `<script>`, marcado con ✏️):

- `MAMA` / `PAPA` — nombres para los créditos (Dirección / Producción); ya vienen como "Barbi" y "David"
- `PLAZO` — fecha límite para confirmar (sugerido: viernes 20 de junio)
- `LISTA_REGALOS_URL` — link a tu lista de regalos
- `WHATSAPP` — tu número formato `569XXXXXXXX` (dudas + respaldo si falla el form)
- `HORA` y `LUGAR` — déjalos vacíos por ahora; cuando los definas, los rellenas,
  haces push, y la página cambia sola de "POR CONFIRMAR" al dato real.

## 🔌 Paso 2 — Conectar la planilla de Google (2 min)

1. La planilla ya existe en tu Drive (la creó Claude): **"Baby Shower Damián — Confirmaciones"**
   → https://docs.google.com/spreadsheets/d/1QjheiAInfl4r5-kkPNdu0YX-9r8Jo6kWqnIip67YKiQ/edit
2. Ábrela y entra al menú **Extensiones → Apps Script**.
3. Borra lo que aparezca y pega el contenido completo de `apps-script.gs`. Guarda (💾).
4. Botón **Implementar → Nueva implementación**.
5. En el engranaje ⚙️ elige tipo **Aplicación web**, y configura:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier persona** (necesario para que el form publique sin login)
6. **Implementar** → autoriza con tu cuenta → copia la **URL de la aplicación web**
   (termina en `/exec`).
7. Pega esa URL en `CONFIG.APPS_SCRIPT_URL` dentro de `index.html`.

Cada confirmación llega como fila: fecha, nombre, acompañantes, **total de personas**,
declaración, teléfono y mensaje. Para el headcount total: suma la columna D
(`=SUM(D2:D)` en una celda libre).

> Si después editas el código del script, recuerda **Implementar → Administrar
> implementaciones → editar → Nueva versión**, si no, los cambios no se publican.

## 🧪 Paso 3 — Probar antes de mandar

1. Abre `https://d10.cl/damian` en tu teléfono.
2. Confirma con un nombre de prueba → debe aparecer la fila en la planilla.
3. Borra la fila de prueba.
4. Mándate el link por WhatsApp a ti mismo para revisar que la tarjeta (imagen +
   título) se vea bien antes de difundirlo.

## 📍 Cuando definas hora y lugar

1. Rellena `HORA` y `LUGAR` en el CONFIG y haz push.
2. La ficha técnica muestra los datos reales y la nota del comité cambia sola.
3. Avisa por WhatsApp; quienes reabran el link verán la página actualizada.

## Notas

- Si alguien confirma dos veces con el mismo nombre, borra la fila duplicada a mano.
- El "censo en vivo" (contador público) aparece solo cuando `APPS_SCRIPT_URL` está
  configurada y hay al menos 1 persona confirmada.
- Mientras no haya backend configurado, el formulario usa el plan B: abre WhatsApp
  con la confirmación pre-escrita (requiere `WHATSAPP` configurado).
- La intro de cine (3·2·1) se muestra una vez por sesión; para probarla de nuevo,
  abre en incógnito. Para saltarla siempre: `d10.cl/damian?nointro`.
