 ____   ___  ____  ______   ____  __  ___  __  __ 
/ ___| / _ \|  _ \|  _ \ \ / /  \/  |/ _ \|  \/  |
\___ \| | | | |_) | |_) \ V /| |\/| | | | | |\/| |
 ___) | |_| |  _ <|  _ < | | | |  | | |_| | |  | |
|____/ \___/|_| \_\_| \_\|_| |_|__|_|\___/|_|  |_|
|  _ \| ____\ \   / / |_   _| ____|  / \  |  \/  |
| | | |  _|  \ \ / /    | | |  _|   / _ \ | |\/| |
| |_| | |___  \ V /     | | | |___ / ___ \| |  | |
|____/|_____|  \_/      |_| |_____/_/   \_\_|  |_|

# 📩 Mailings Pluxee – Opciones de Diseño

Este proyecto contiene **tres versiones de mailing** diseñadas para Pluxee, cada una adaptada a diferentes niveles de compatibilidad y rendimiento en clientes de correo.

---

## ✅ Opción 1 – `opt1.html`: Versión moderna (Poppins)

- **Estilo:** Diseño limpio y moderno
- **Tipografía:** Usa la fuente **Poppins** desde Google Fonts
- **Contenido:** Todo el contenido es texto real (no imágenes con texto)
- **Ventajas:** Accesible, ligero, editable, compatible con la mayoría de clientes modernos
- **Consideración:** En clientes que no soportan fuentes externas (como Outlook en Windows), puede mostrarse una fuente genérica si no se carga correctamente

---

## ✅ Opción 2 – `opt2.html`: Versión compatible (Arial fallback)

- **Estilo:** Misma estructura y diseño que `opt1`
- **Tipografía:** Usa **Arial** como fuente principal, garantizando compatibilidad máxima
- **Contenido:** Todo texto real, igual que `opt1`
- **Ventajas:** Compatible con *todos* los clientes de correo (incluyendo Outlook)
- **Ideal para:** Usuarios donde se prioriza compatibilidad por sobre diseño moderno

---

## ✅ Opción 3 – `opt3.html`: Versión visual (solo imágenes)

- **Estilo:** Todo el contenido (textos incluidos) está contenido dentro de imágenes
- **Tipografía:** Incrustada en las imágenes
- **Contenido:** 100% gráfico
- **Ventajas:** Control visual total del diseño (se ve igual en todos los clientes)
- **Desventajas:** No es accesible para lectores de pantalla, más pesado, no editable sin rehacer las imágenes
- **Ideal para:** Campañas puntuales donde se prioriza el diseño exacto por sobre accesibilidad

---

## 💡 Recomendaciones

- **Probar todos los mails** en clientes como Gmail, Outlook, Apple Mail y en móviles antes del envío masivo.
- Usar `opt1` como opción principal si tu público es mayoritariamente móvil o usa Gmail/Apple.
- Usar `opt2` si hay una base de usuarios relevante en Outlook (PC/empresas).
- Usar `opt3` solo si necesitas control visual extremo y estás dispuesto a perder accesibilidad y texto editable.

---