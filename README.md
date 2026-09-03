# Gojo Chat

Aplicación web de chat con una interfaz inspirada en Gojo Satoru, capaz de mantener una conversación con una personalidad configurada mediante la API de Google Gemini.

**Demo:** https://gojo-chat-sage.vercel.app/

## Tecnologías usadas

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Node.js
- Vercel Functions
- Google Gemini API
- Vitest
- localStorage
- History API

## Estructura del proyecto

```text
Gojo chat/
├── api/
│   └── functions.js
├── src/
│   ├── app.js
│   ├── chat.js
│   ├── Gojo.logo.png
│   ├── index.html
│   ├── styles.css
│   └── utils.js
├── tests/
│   ├── app.test.js
│   └── utils.test.js
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── vercel.json
```

## Funcionalidades

- Chat interactivo con Gojo Satoru.
- Personalidad y comportamiento configurados mediante un prompt.
- Persistencia de conversaciones mediante `localStorage`.
- Recuperación de conversaciones al recargar la página.
- Eliminación de la conversación.
- Indicador de que Gojo está escribiendo.
- Manejo de errores y respuestas alternativas.
- Límite de mensajes enviados al modelo para controlar el contexto.
- Timeout para solicitudes a la API.
- Navegación entre Home, Chat y About mediante History API.
- Diseño responsive.
- Tests automatizados con Vitest.

## Funcionamiento

La aplicación funciona como una SPA (Single Page Application) desarrollada con JavaScript Vanilla.

El usuario escribe un mensaje y el frontend mantiene el historial de la conversación. Los mensajes se almacenan localmente mediante `localStorage` y, al enviar una consulta, se realiza una petición `POST` a la Vercel Function ubicada en `api/functions.js`.

La función del backend recibe los mensajes, limita el historial enviado al modelo y realiza la solicitud a Google Gemini utilizando la variable de entorno `GEMINI_API_KEY`.

La respuesta de Gemini se devuelve al frontend y se muestra en el chat. La API key permanece únicamente en el entorno del servidor y no se expone al cliente.

## Seguridad

- La API key de Gemini se almacena como variable de entorno (`GEMINI_API_KEY`).
- La API key no está incluida en el código fuente ni en el repositorio.
- Los archivos de variables de entorno locales están excluidos mediante `.gitignore`.
- La comunicación con la API de Gemini se realiza desde una función backend de Vercel.
- El contenido de los mensajes se maneja como texto para evitar interpretar respuestas del modelo como HTML.
- Se limita la cantidad de mensajes enviados a Gemini para reducir el tamaño del contexto.

## Manejo de errores

La aplicación contempla diferentes situaciones de error:

- Método HTTP no permitido.
- Mensajes recibidos con un formato inválido.
- Falta de `GEMINI_API_KEY`.
- Errores devueltos por Gemini.
- Tiempo de espera agotado mediante `AbortController`.
- Respuestas inesperadas o vacías del modelo.
- Errores internos del backend.

Cuando ocurre un error recuperable, la aplicación puede mostrar una respuesta alternativa para mantener una experiencia de conversación coherente.

## Instalación local

1. Clonar el repositorio:

```bash
git clone <https://github.com/MarianoLovisotto/ProyectoM3_MarianoLovisotto>
cd gojo-chat
```

2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto:

```env
GEMINI_API_KEY=tu_api_key
```

4. Iniciar el entorno de desarrollo de Vercel:

```bash
vercel dev
```

La aplicación quedará disponible en la URL local indicada por Vercel.

> No se recomienda utilizar Live Server para ejecutar el proyecto completo, ya que el frontend necesita la Vercel Function para comunicarse con Gemini.

## Deploy

El proyecto está desplegado en Vercel y conectado a su repositorio de GitHub.

Para realizar un nuevo deploy:

```bash
git add .
git commit -m "mensaje del commit"
git push origin main
```

Vercel detecta automáticamente el nuevo push a la rama `main` y genera el deployment de producción.

La variable `GEMINI_API_KEY` debe estar configurada en las Environment Variables de Vercel para los entornos correspondientes.

## Conceptos aplicados

- HTML semántico.
- CSS moderno y diseño responsive.
- JavaScript Vanilla.
- Manipulación del DOM.
- Eventos.
- Módulos ES.
- `fetch` y consumo de APIs.
- Programación asíncrona con `async/await`.
- `localStorage`.
- SPA y navegación con History API.
- Arquitectura frontend/backend.
- Node.js y Vercel Functions.
- Variables de entorno.
- Manejo de errores.
- `AbortController` y control de timeouts.
- Validación de datos.
- Persistencia de estado.
- Tests unitarios con Vitest.
- Git y GitHub.
- Deploy y variables de entorno en Vercel.

## Uso de IA durante el desarrollo

La IA fue utilizada como herramienta de apoyo durante prácticamente todo el desarrollo del proyecto.

Se utilizó para:

- Pensar y definir la estructura general de la aplicación.
- Diseñar la personalidad, comportamiento y reglas del personaje de Gojo.
- Analizar y revisar el código JavaScript, HTML y CSS.
- Detectar errores y bugs durante el desarrollo.
- Explicar conceptos de JavaScript, APIs, `fetch`, `async/await`, módulos, `localStorage` y SPA.
- Revisar la arquitectura del frontend y backend.
- Ayudar a definir y mejorar la interfaz visual.
- Diseñar la estética visual del proyecto, incluyendo la paleta violeta y el fondo inspirado en la temática de Gojo/Hollow Purple.
- Revisar detalles de CSS, selectores, responsive design y elementos de la interfaz.
- Analizar problemas relacionados con Vercel Functions y el entorno de desarrollo.
- Explicar la configuración de `vercel.json`.
- Revisar la configuración de variables de entorno y las buenas prácticas para proteger la API key.
- Guiar el proceso de deploy y conexión entre GitHub y Vercel.
- Explicar y revisar la configuración de Vitest y los tests.
- Revisar aspectos de seguridad, como evitar exponer la API key y evitar interpretar directamente contenido generado por el modelo como HTML.
- Ayudar a preparar la documentación y estructura de este README.

La IA fue utilizada como asistente durante el proceso de desarrollo, mientras que la implementación, integración, pruebas y decisiones finales del proyecto fueron realizadas sobre el código del proyecto.

## Nota sobre el uso

El funcionamiento de la aplicación puede verse limitado por los límites de uso y la cantidad de tokens disponibles en la API de Google Gemini. Por este motivo, en determinados momentos pueden producirse errores, respuestas alternativas o imposibilidad temporal de generar nuevas respuestas.

## Autor

**Mariano Lovisotto**

## Proyecto

**Gojo Chat**
