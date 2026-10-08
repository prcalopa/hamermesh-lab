# Cuaderno de física · Biblioteca del máster

Portal de estudio en español, organizado por material, capítulo y sección. Conserva los dos capítulos de Hamermesh y añade el capítulo 1 de Daniel J. Arrigo, *Symmetry Analysis of Differential Equations: An Introduction*: §§ 1.1–1.4 y ejercicios, páginas impresas 1–14 (PDF: 17–30).

Cada sección ofrece **Explorar**, **Entender paso a paso** y **Practicar**. Las explicaciones, gráficos y preguntas se redactan para esta guía; los PDF y las páginas escaneadas no se distribuyen en la web. El portal es estático, sin dependencias externas. Las respuestas solo se conservan mientras la página está abierta, separadas por material, capítulo y sección.

## Contenido publicado

- **Hamermesh, capítulo 1:** siete laboratorios y 21 preguntas sobre transformaciones, grupos, subgrupos/Cayley, clases laterales/Lagrange, conjugación, cocientes/homomorfismos y productos directos. Páginas impresas 1–31, PDF 7–37.
- **Hamermesh, capítulo 2:** diez laboratorios y 30 preguntas sobre operaciones espaciales, ejes, grupos axiales, redes/Miller, poliedros, reflexiones, grupos completos, 32 grupos cristalográficos y simetría clásica de colores. Páginas impresas 32–67, PDF 38–73.
- **Arrigo, capítulo 1:** cuatro secciones y 21 preguntas. Incluye círculo y dilataciones, un invariante racional, composición de flujos, campos de pendientes y regla de la cadena, prueba de invariancia y un contraejemplo, y tres reducciones con gráficos enlazados en (x,y) y (r,s), parámetros y derivación en cuatro pasos. Los apuntes añaden tres prácticas desarrolladas, comparación con Riccati clásica y recuperación de soluciones excluidas.

## Abrir localmente

Desde este directorio:

```sh
python3 -m http.server 5174 --bind 127.0.0.1 --directory dist
```

La portada es `#biblioteca`. La navegación canónica es `#material/<material>/<capítulo>/<sección>/<pestaña>`, por ejemplo `#material/arrigo/1/3/explorar`. Siguen funcionando los enlaces antiguos `#3/apuntes` y `#capitulo-2/3/apuntes`. Los controles Compartir copian enlaces directos.

## Añadir contenidos en el futuro

El catálogo está en `dist/catalog.mjs`. Cada material tiene un identificador estable, autor, título, fuente, descripción y capítulos. Cada capítulo declara título, secciones, apuntes, preguntas, referencias de páginas, hilo conductor y tipo de laboratorio. La portada, los selectores, los enlaces y los contadores se generan desde este catálogo.

Para añadir un capítulo, crea sus arrays de secciones/apuntes/preguntas e incorpora una entrada a su material en el catálogo. Para un material nuevo, añade una entrada con un identificador único. Conserva los identificadores publicados para mantener los enlaces. Los arrays deben tener la misma longitud; cada pregunta contiene `q`, `a`, `correct` y `why`.

Si necesita laboratorios propios, añade un módulo con una función que reciba la sección y el contenedor; intégralo en la selección de `renderer` de `dist/app.mjs`. Las explicaciones y los ejercicios usan la misma interfaz para todos los materiales. El sitio se publica reutilizando `.openai/hosting.json` y su identidad existente.

## Archivos

- `dist/index.html`, `dist/styles.css`: estructura compartida, biblioteca, presentación adaptable y accesibilidad.
- `dist/catalog.mjs`, `dist/app.mjs`: catálogo, rutas y laboratorios originales de Hamermesh.
- `dist/algebra.mjs`, `dist/content.mjs`: cálculos exactos, apuntes y preguntas del primer capítulo de Hamermesh.
- `dist/symmetry.mjs`, `dist/chapter2.mjs`, `dist/chapter2-content.mjs`: grupos espaciales y contenido del segundo capítulo.
- `dist/lie-math.mjs`: transformaciones, jacobianos, pendientes, coordenadas y soluciones reducidas de Arrigo.
- `dist/arrigo.mjs`, `dist/arrigo-content.mjs`: gráficos SVG calculados, controles, apuntes con MathML nativo y preguntas originales.
- `tests/symmetry.test.mjs`, `tests/lie.test.mjs`: verificaciones matemáticas.

## Convenciones y dominios

Hamermesh usa AB para aplicar B antes de A. D₃ realiza las seis simetrías planas de un triángulo. En el capítulo 2 E es identidad e I inversión; Sₙ denota rotación-reflexión, Y el grupo icosaédrico y Dₙ se realiza con rotaciones propias 3D. Las matrices espaciales usan tolerancia 10⁻⁷. La restricción cristalográfica corresponde a redes periódicas ordinarias. Los colores representan el modelo clásico del libro.

Arrigo usa T_b∘T_a para aplicar a antes de b; ε es un parámetro real. Las fórmulas racionales son flujos locales: no se cruza un polo aunque una fórmula exista al otro lado. Los apuntes justifican las identidades simbólicas y distinguen las pruebas de las ilustraciones numéricas. El círculo usa la misma escala física en ambos ejes. Los gráficos interrumpen las curvas en singularidades y los puntos excluidos.

La gráfica de Riccati muestra x>0 y C>0, además de y=±1/x; la guía explica C general y la carta x<0. En la reducción por cociente se excluyen x=0 y x+y=0; en la de recíprocos se recupera y=0 como solución de la EDO original. Los campos de pendientes y puntos son ilustraciones calculadas con valores redondeados.

## Verificación

```sh
node --test tests/*.test.mjs
```

Las comprobaciones cubren órdenes, cierre, clases, ortogonalidad, poliedros, familias axiales, redes y colores de Hamermesh; identidad, composición e inversos de ocho flujos; invariantes geométricos; regla de la cadena e invariancia de cinco EDO; tres cambios de coordenadas; integración, reconstrucción y soluciones excluidas. El catálogo comprueba capítulos y preguntas completos.

La revisión en navegador recorre las 63 vistas de lectura/laboratorio/práctica a 1440 y 390 px, además de los selectores, contraejemplos, polos, inversos, derivaciones, preguntas y enlaces anteriores. La integración opcional existente con document.modelContext para el triángulo se conserva; no es necesaria para usar la web.
