# Cuaderno de física · Biblioteca del máster

Portal de estudio en español, organizado por material, capítulo y sección. Incluye dos capítulos de Hamermesh y los capítulos 1 y 2 de Daniel J. Arrigo, *Symmetry Analysis of Differential Equations: An Introduction*. La biblioteca ofrece 33 secciones interactivas y 120 preguntas razonadas.

Cada sección ofrece **Explorar**, **Paso a paso** y **Practicar**. Las explicaciones, gráficos y preguntas se redactan para esta guía; los PDF y las páginas escaneadas no se distribuyen en la web. El portal es estático. KaTeX 0.19.0 y sus fuentes se sirven desde el propio repositorio, sin CDN ni servicios externos para las fórmulas. Las respuestas solo se conservan mientras la página está abierta, separadas por material, capítulo y sección.

## Contenido publicado

- **Hamermesh, capítulo 1:** siete laboratorios y 21 preguntas sobre transformaciones, grupos, subgrupos/Cayley, clases laterales/Lagrange, conjugación, cocientes/homomorfismos y productos directos. Páginas impresas 1–31, PDF 7–37.
- **Hamermesh, capítulo 2:** diez laboratorios y 30 preguntas sobre operaciones espaciales, ejes, grupos axiales, redes/Miller, poliedros, reflexiones, grupos completos, 32 grupos cristalográficos y simetría clásica de colores. Páginas impresas 32–67, PDF 38–73.
- **Arrigo, capítulo 1:** cuatro secciones y 21 preguntas. Incluye círculo y dilataciones, un invariante racional, composición de flujos, campos de pendientes y regla de la cadena, prueba de invariancia y un contraejemplo, y tres reducciones con gráficos enlazados en (x,y) y (r,s), parámetros y derivación en cuatro pasos. Los apuntes añaden tres prácticas desarrolladas, comparación con Riccati clásica y recuperación de soluciones excluidas.
- **Arrigo, capítulo 2:** doce laboratorios y 48 preguntas sobre infinitesimales/coordenadas canónicas, condición de Lie, EDO lineales, Bernoulli, homogéneas, exactas y Riccati, operadores/prolongaciones, segundo orden, Blasius, sistemas de primer orden y fuerza central. Páginas impresas 15–72, PDF 31–88. Cada laboratorio tiene apuntes con derivaciones y una práctica guiada. Los modelos incluyen solución exacta frente a aproximación tangente, búsqueda de pesos, gráficos enlazados, contornos implícitos, jets, reducción a s″=1, disparo numérico y órbitas rotables.

## Abrir localmente

Desde este directorio:

```sh
python3 -m http.server 5174 --bind 127.0.0.1 --directory dist
```

La portada es `#biblioteca`. La navegación canónica es `#material/<material>/<capítulo>/<sección>/<pestaña>`, por ejemplo `#material/arrigo/1/3/explorar`. Siguen funcionando los enlaces antiguos `#3/apuntes` y `#capitulo-2/3/apuntes`. Los controles Compartir copian enlaces directos.

## Añadir contenidos en el futuro

El catálogo está en `dist/catalog.mjs`. Cada material tiene un identificador estable, autor, título, fuente, descripción y capítulos. Cada capítulo declara título, secciones, apuntes, preguntas, referencias de páginas, hilo conductor y tipo de laboratorio. La portada, los selectores, los enlaces y los contadores se generan desde este catálogo.

Para añadir un capítulo, crea sus arrays de secciones/apuntes/preguntas e incorpora una entrada a su material en el catálogo. Para un material nuevo, añade una entrada con un identificador único. Conserva los identificadores publicados para mantener los enlaces. Los arrays deben tener la misma longitud; cada pregunta contiene `q`, `a`, `correct` y `why`.

Si necesita laboratorios propios, añade un módulo con una función que reciba la sección y el contenedor; intégralo en la selección de `renderer` de `dist/app.mjs`. Las explicaciones y los ejercicios usan la misma interfaz para todos los materiales. El manifiesto `.openai/hosting.json` conserva la identidad de la publicación original en Sites.

## Archivos

- `dist/index.html`, `dist/styles.css`: estructura compartida, biblioteca, presentación adaptable y accesibilidad.
- `dist/catalog.mjs`, `dist/app.mjs`: catálogo, rutas y laboratorios originales de Hamermesh.
- `dist/algebra.mjs`, `dist/content.mjs`: cálculos exactos, apuntes y preguntas del primer capítulo de Hamermesh.
- `dist/symmetry.mjs`, `dist/chapter2.mjs`, `dist/chapter2-content.mjs`: grupos espaciales y contenido del segundo capítulo.
- `dist/lie-math.mjs`: transformaciones, jacobianos, pendientes, coordenadas y soluciones reducidas de Arrigo.
- `dist/arrigo.mjs`, `dist/arrigo-content.mjs`: gráficos SVG calculados, controles, apuntes y preguntas originales; el MathML heredado se presenta mediante el renderizador compartido.
- `dist/arrigo2-math.mjs`, `dist/arrigo2.mjs`, `dist/arrigo2-content.mjs`: modelos matemáticos, laboratorios, derivaciones y preguntas del capítulo 2 de Arrigo.
- `dist/math.mjs`, `dist/vendor/katex/`: renderizado unificado de TeX, adaptación de notación heredada y KaTeX con licencia MIT.
- `tests/symmetry.test.mjs`, `tests/lie.test.mjs`, `tests/arrigo2.test.mjs`, `tests/math.test.mjs`: verificaciones matemáticas y de notación.
- `docs/content-review.md`: contraste por sección con los originales, erratas, convenciones y alcance de los modelos.

## Escribir matemáticas y mantener la interfaz

Para fórmulas nuevas, importa `tex` desde `dist/math.mjs` y escribe TeX explícito:

```js
tex(String.raw`\eta^{(k)}=D_x\eta^{(k-1)}-y^{(k)}D_x\xi`, true)
```

El segundo argumento activa un bloque con desplazamiento horizontal y botón para copiar LaTeX; omítelo para una expresión en línea. KaTeX genera HTML y MathML para una presentación consistente y accesible. Los módulos y fuentes están en `dist/vendor/katex`, junto a la licencia y la versión.

Las fórmulas centrales de los dos capítulos de Hamermesh y del capítulo 2 de Arrigo ya usan TeX explícito. El MathML del capítulo 1 de Arrigo conserva su estructura al convertirse. La adaptación de Unicode y de expresiones compactas se limita a la notación anterior; no es un analizador matemático general. Para una expresión larga o ambigua, escribe TeX explícito y comprueba que potencias y denominadores abarcan exactamente los términos previstos.

En móvil el índice se despliega mediante **Índice del capítulo**; Escape lo cierra y al elegir una sección vuelve a plegarse. Las pestañas admiten flechas, Inicio y Fin, y permanecen visibles durante la lectura. Las respuestas y los resultados de controles actualizan también sus fórmulas.

## Convenciones y dominios

Hamermesh usa AB para aplicar B antes de A. D₃ realiza las seis simetrías planas de un triángulo. En el capítulo 2 E es identidad e I inversión; Sₙ denota rotación-reflexión, Y el grupo icosaédrico y Dₙ se realiza con rotaciones propias 3D. Las matrices espaciales usan tolerancia 10⁻⁷. La restricción cristalográfica corresponde a redes periódicas ordinarias. Los colores representan el modelo clásico del libro.

Arrigo usa T_b∘T_a para aplicar a antes de b; ε es un parámetro real. Las fórmulas racionales son flujos locales: no se cruza un polo aunque una fórmula exista al otro lado. Los apuntes justifican las identidades simbólicas y distinguen las pruebas de las ilustraciones numéricas. El círculo usa la misma escala física en ambos ejes. Los gráficos interrumpen las curvas en singularidades y los puntos excluidos.

La gráfica de Riccati muestra x>0 y C>0, además de y=±1/x; la guía explica C general y la carta x<0. En la reducción por cociente se excluyen x=0 y x+y=0; en la de recíprocos se recupera y=0 como solución de la EDO original. Los campos de pendientes y puntos son ilustraciones calculadas con valores redondeados.

En el capítulo 2 de Arrigo, ξ,η denotan los infinitesimales que el libro llama X,Y. Las referencias de sección siguen los apartados reales del libro aunque se dividan en doce lecciones. Se señalan las erratas comprobadas en las páginas 16, 17, 26, 31, 34, 42 y la orientación angular de la p. 71, además de la normalización constante del factor integrante de la p. 35. Los factores integrantes y las coordenadas recíprocas se usan en cartas regulares; las soluciones excluidas se recuperan explícitamente. La integral primera del ejemplo exacto escala bajo el grupo: no se confunde con un invariante del grupo.

Blasius usa la normalización y‴+yy″=0, Runge–Kutta de cuarto orden con paso máximo 0,015 y bisección para ajustar y′ en x=6, 8 o 10. El problema truncado aproxima la condición en infinito. El sistema cuadrático y la órbita de fuerza central se calculan mediante soluciones exactas. La fuerza del último ejemplo es repulsiva; el momento angular y la energía se comprueban independientemente.

## Verificación

```sh
node --test tests/*.test.mjs
```

Las 33 comprobaciones cubren órdenes, cierre, clases, ortogonalidad, poliedros, familias axiales, redes y colores de Hamermesh; identidad, composición e inversos de flujos; invariantes geométricos; regla de la cadena e invariancia de EDO; cambios de coordenadas, integración y soluciones excluidas. El capítulo 2 comprueba factores integrantes, ocho generadores de segundo orden, prolongaciones, reducción, convergencia del disparo de Blasius, escala temporal y conservación de momento angular/energía. El catálogo comprueba capítulos y preguntas completos.

La revisión en navegador recorre las 99 vistas de lectura/laboratorio/práctica a 1440, 390 y 320 px (297 comprobaciones de página), además de 1129 interacciones de los materiales con selectores, extremos de controles, botones y respuestas. Comprueba errores de JavaScript y renderizado matemático, desbordamiento y coordenadas SVG inválidas; también el índice móvil, Escape, copia de TeX, respuestas y enlaces antiguos. Se revisan capturas de los gráficos y los apuntes. La integración opcional existente con document.modelContext para el triángulo se conserva; no es necesaria para usar la web.

## Publicación en GitHub Pages

La web se publica en [prcalopa.github.io/hamermesh-lab](https://prcalopa.github.io/hamermesh-lab/). El repositorio público de origen es `prcalopa/hamermesh-lab`. La rama `main` conserva el proyecto completo; `gh-pages` contiene únicamente los archivos de `dist`, con `index.html` en su raíz. `.nojekyll` indica que se sirven los archivos estáticos directamente.

Para publicar nuevos capítulos después de guardar los cambios en un commit:

```sh
git push github main
bash scripts/deploy-github-pages.sh
```

El script comprueba las matemáticas y publica una instantánea de la web, con actualizaciones normales sin forzar la historia. GitHub Pages debe configurarse en Settings → Pages con Source **Deploy from a branch**, rama **gh-pages** y carpeta **/(root)**. Los módulos, estilos y enlaces usan rutas relativas, compatibles con la subcarpeta del proyecto.

La publicación de este repositorio usa GitHub Pages con acceso público. Los PDF quedan excluidos por `.gitignore` y no forman parte de la historia del repositorio. El comando de publicación no cambia la visibilidad del repositorio ni activa Pages por su cuenta.
