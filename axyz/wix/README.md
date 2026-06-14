# Kit de traspaso a Wix Studio

**Estrategia: CE-heavy (decidida junio 2026).** Wix actúa como cáscara — nativo solo donde aporta valor real (navbar/footer, títulos de sección, Blog/CMS, Wix Forms = leads al CRM); **todo lo visual va como Custom Elements** generados desde el código ya probado del repo. Esto minimiza la configuración manual en el editor: el grueso del montaje es pegar archivos JS y asignar atributos.

El sitio se monta primero en un **sitio de prueba (staging)** y, aprobado, se replica en el Wix vivo de `axyz.cl`.

## Carpeta

```
wix/
├── README.md               # este archivo: estado del traspaso
├── 00-fundacion.md         # sitio staging, theme, global.css
├── 01-navbar-footer.md     # únicos bloques de layout nativos
├── 02-custom-elements.md   # pipeline + catálogo de los 9 CE + ensamblaje de la Home
├── ce/                     # los 9 Custom Elements (autosuficientes, CSS embebido)
└── preview.html            # banco de pruebas local de los 9 CE
```

## Checklist

| # | Módulo | Mecanismo | Entregable | Estado |
|---|--------|-----------|------------|--------|
| 00 | Fundación (sitio, theme, global.css) | Setup | [00-fundacion.md](00-fundacion.md) | **Kit listo** |
| 01 | Navbar + Footer | Nativo | [01-navbar-footer.md](01-navbar-footer.md) | **Kit listo** |
| 02 | Los 9 Custom Elements + ensamblaje Home | CE | [02-custom-elements.md](02-custom-elements.md) + [ce/](ce/) | **Kit listo y verificado** en [preview.html](preview.html) |
| 03 | Blog (Wix Blog/CMS, migrar 15 artículos) | Nativo + API | pendiente | Pendiente — automatizable por API si el staging está en la cuenta Wix conectada |
| 04 | Contacto (Wix Forms + reCAPTCHA) | Nativo | pendiente | Pendiente |
| 05 | QA lado a lado + publicación | — | pendiente | Pendiente |

**Estados:** Pendiente → Kit listo → Montado en staging → QA ok.

## Verificación de los CE (junio 2026)

Los 9 componentes pasaron QA funcional en `preview.html` (navegador real, sin errores de consola): hero con 295 líneas de wireframe + cámara fly + breathe + traza coral · marquee 11 logos a color en loop · 3 cards tranquilidad con outline coral · flip cards y acordeón · 3 bandas parallax B&N · pilares + stepper animado · 3 cards arquitectura · 4 blog cards · mapa Leaflet con 129 marcadores + contadores animados · chat scriptado completo.

## Advertencia: Custom Elements en el staging

Wix solo **renderiza Custom Elements publicados en sitios con plan Premium + dominio propio**. En un sitio de prueba gratuito:

- En el **Preview del editor** los CE renderizan — usar eso para validar.
- En el staging **publicado** se verá un placeholder. No es un bug del componente.
- El sitio vivo del cliente cumple ambos requisitos.

## Trade-offs aceptados del enfoque CE-heavy

- El **copy dentro de los CE** (confianza, regulación, tarjetas) no se edita desde el editor Wix: se cambia en el repo y se re-pega el archivo.
- El contenido de los CE se **renderiza por JS** (client-side). El SEO crítico queda nativo: H1/H2, intros de sección, blog y formulario.
