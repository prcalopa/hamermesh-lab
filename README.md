# Laboratorio de grupos · Hamermesh

Web en español para estudiar el capítulo 1 de *Group Theory and Its Application to Physical Problems*, §§ 1-1 a 1-7, páginas impresas 1–31 (PDF proporcionado: páginas 7–37).

Los siete laboratorios cubren composición, axiomas de grupo, subgrupos y acción regular de Cayley, clases laterales y Lagrange, conjugación y clases de Sₙ, normalidad/cocientes/paridad, y productos directos. Incluye ejemplos de matrices y razón doble, apuntes y 21 preguntas originales con respuestas razonadas.

El material adapta las ideas y las desarrolla con ejemplos propios. No incorpora el PDF ni sus páginas escaneadas al sitio publicado. Todo funciona en el navegador, sin dependencias externas. Las respuestas de los ejercicios se mantienen únicamente mientras la página permanece abierta. Los enlaces con fragmentos permiten compartir sección y pestaña.

## Vista local

Desde este directorio: `python3 -m http.server 5173 --bind 127.0.0.1 --directory dist`.

## Estructura

- `dist/index.html`: estructura, metadatos, referencias y convención.
- `dist/styles.css`: presentación adaptable y accesibilidad.
- `dist/algebra.mjs`: cálculos exactos de las permutaciones de S₃ y clases de Sₙ.
- `dist/content.mjs`: apuntes y ejercicios.
- `dist/app.mjs`: laboratorios y navegación.
- `.openai/hosting.json`: identidad del sitio y salida estática.

Convención única: AB aplica B primero y A después. Las simetrías planas de un triángulo se identifican con S₃. La acción de Cayley sobre los seis elementos del grupo se distingue explícitamente de la acción sobre los tres vértices.

## Verificación

Se comprobó la asociatividad en los 216 triples de S₃, los 64 subconjuntos posibles (seis subgrupos), las particiones en clases laterales y los tamaños de las clases de S₃ a S₇. En navegador se recorrieron las 21 vistas y los siete laboratorios a ancho móvil, con pruebas de los controles y los ejercicios. No hubo errores de ejecución ni desbordamiento horizontal.

Se incluye una integración opcional con `document.modelContext` para configurar la composición del triángulo. El navegador de verificación no implementa WebMCP nativo; su validación nativa no está disponible. Un contexto de prueba verificó registro, actualización de la interfaz e inputs inválidos. Esta integración no es necesaria para usar la web.
