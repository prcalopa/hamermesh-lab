# Laboratorio de grupos · Hamermesh

Web en español para estudiar los capítulos 1 y 2 de *Group Theory and Its Application to Physical Problems*. El capítulo 1 cubre §§ 1-1 a 1-7, páginas impresas 1–31 (PDF: 7–37); el capítulo 2, §§ 2-1 a 2-10, páginas impresas 32–67 (PDF: 38–73).

Los siete laboratorios cubren composición, axiomas de grupo, subgrupos y acción regular de Cayley, clases laterales y Lagrange, conjugación y clases de Sₙ, normalidad/cocientes/paridad, y productos directos. Incluye ejemplos de matrices y razón doble, apuntes y 21 preguntas originales con respuestas razonadas.

El capítulo 2 añade diez laboratorios y 30 preguntas razonadas: operaciones espaciales y proyección estereográfica, equivalencia de ejes, grupos Cₙ y Dₙ, redes periódicas e índices de Miller, los cinco sólidos regulares, reflexiones en las familias Cₙ y Dₙ, grupos poliédricos completos, catálogo de los 32 grupos cristalográficos y simetría clásica de dos colores.

El selector permite cambiar de capítulo. Los enlaces originales, como `#3/apuntes`, se conservan. El capítulo 2 usa `#capitulo-2/3/apuntes`. La web sigue siendo estática y compartible en la misma dirección.

El material adapta las ideas y las desarrolla con ejemplos propios. No incorpora el PDF ni sus páginas escaneadas al sitio publicado. Todo funciona en el navegador, sin dependencias externas. Las respuestas de los ejercicios se mantienen únicamente mientras la página permanece abierta. Los enlaces con fragmentos permiten compartir sección y pestaña.

## Vista local

Desde este directorio: `python3 -m http.server 5173 --bind 127.0.0.1 --directory dist`.

## Estructura

- `dist/index.html`: estructura, metadatos, referencias y convención.
- `dist/styles.css`: presentación adaptable y accesibilidad.
- `dist/algebra.mjs`: cálculos exactos de las permutaciones de S₃ y clases de Sₙ.
- `dist/content.mjs`: apuntes y ejercicios.
- `dist/app.mjs`: laboratorios y navegación.
- `dist/symmetry.mjs`: matrices ortogonales 3D, generación de grupos, órbitas, clases, sólidos y redes.
- `dist/chapter2.mjs`: diez laboratorios de simetría espacial y catálogo cristalográfico.
- `dist/chapter2-content.mjs`: explicaciones y preguntas del segundo capítulo.
- `tests/symmetry.test.mjs`: comprobaciones matemáticas del segundo capítulo.
- `.openai/hosting.json`: identidad del sitio y salida estática.

Convención única: AB aplica B primero y A después. Las simetrías planas de un triángulo se identifican con S₃. La acción de Cayley sobre los seis elementos del grupo se distingue explícitamente de la acción sobre los tres vértices.

En el capítulo 2 E indica identidad e I inversión espacial; Sₙ es rotación-reflexión, mientras que en el primero Sₙ denota permutaciones. Dₙ se realiza con rotaciones propias 3D. Y conserva el nombre de Hamermesh para el grupo icosaédrico. Se distingue la operación Sₙ del grupo que genera y la rotoinversión de Hermann–Mauguin de la rotación-reflexión. Las matrices 3D usan tolerancia numérica 10⁻⁷; se muestran tres decimales. La restricción cristalográfica se refiere a redes periódicas ordinarias. La simetría de colores es el modelo clásico del libro, sin extrapolar R²=E a todos los sistemas cuánticos.

## Verificación

Se comprobó la asociatividad en los 216 triples de S₃, los 64 subconjuntos posibles (seis subgrupos), las particiones en clases laterales y los tamaños de las clases de S₃ a S₇. En navegador se recorrieron las 21 vistas y los siete laboratorios a ancho móvil, con pruebas de los controles y los ejercicios. No hubo errores de ejecución ni desbordamiento horizontal.

Para el capítulo 2: `node --test tests/symmetry.test.mjs`. Comprueba órdenes y clases de T/Td/Th/O/Oh/Y/Yh, cierre y ortogonalidad, conservación de los cinco poliedros, familias axiales, presencia de inversión según paridad, conservación de los modelos de anillos, conjugación, proyección de polos, restricciones de ambas redes, clasificación en siete sistemas, preguntas y asignación de colores. En navegador se verificaron las 51 vistas de ambos capítulos a 390 px, los diez laboratorios nuevos a 1280 px y controles de conjugación, redes, Miller, D₃d, catálogo, colores y ejercicios. No se detectaron errores de ejecución ni desbordamientos horizontales. Las respuestas de los dos capítulos se mantienen separadas.

Se incluye una integración opcional con `document.modelContext` para configurar la composición del triángulo. El navegador de verificación no implementa WebMCP nativo; su validación nativa no está disponible. Un contexto de prueba verificó registro, actualización de la interfaz e inputs inválidos. Esta integración no es necesaria para usar la web.
