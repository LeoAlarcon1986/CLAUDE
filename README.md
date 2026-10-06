# Sonrisa Imperial · Clínica Dental

Landing page minimalista de la clínica dental **Sonrisa Imperial**. Tiene dos objetivos:

1. **Agendar citas:** el paciente llena un formulario y se abre WhatsApp con la solicitud lista para enviar a la clínica.
2. **Recoger opiniones:** el paciente responde *"¿Cómo te ha parecido nuestro servicio?"* (máximo 100 caracteres), marca si su experiencia fue buena o mala, y su comentario aparece en la lista pública con un ícono que lo indica.

## Estructura

| Archivo | Qué contiene |
| --- | --- |
| `index.html` | La página completa (HTML, estilos y JavaScript). |
| `img/` | Ilustración dental e íconos de comentario bueno/malo. |
| `api/comments.js` | Función de Vercel que guarda (`POST`) y lista (`GET`) los comentarios. |
| `package.json` | Dependencia `@vercel/blob`, usada por la función de comentarios. |

## Datos de la clínica

- **WhatsApp:** 320 237 5723 (constante `WHATSAPP_NUMBER` en `index.html`).
- **Dirección:** Calle 123 # 32-4.
- **Horario:** lunes a sábado, 9:00 – 13:00 y 14:00 – 19:00.

## Despliegue

El sitio se publica en **Vercel** automáticamente con cada push a la rama `main`.

Los comentarios se guardan en **Vercel Blob**. Para que funcionen, el proyecto de Vercel necesita un Blob store conectado:

1. En Vercel, abre el proyecto → **Storage** → **Create** → **Blob**.
2. Elige acceso **Private** y conéctalo al proyecto en todos los entornos.
3. Vercel agrega la variable `BLOB_READ_WRITE_TOKEN` automáticamente. Vuelve a desplegar el proyecto.

Si el store se crea con acceso **Public**, agrega también la variable de entorno `BLOB_ACCESS=public`.

> La sección de comentarios solo funciona en Vercel. En GitHub Pages o al abrir `index.html` directamente, la página carga bien pero muestra que no se pudieron cargar los comentarios.
