export const arrigoLessons=[
 {title:'¿Qué es una simetría?',nav:'Qué se conserva',pages:'1–4',desc:'Mueve los puntos y distingue la figura que permanece de los puntos que cambian. Rotaciones, dilataciones e invariantes.'},
 {title:'Grupos de Lie de un parámetro',nav:'Componer un flujo',pages:'4–6',desc:'Dos movimientos sucesivos se convierten en uno. Explora identidad, inverso, composición y dominio.'},
 {title:'Invariancia de ecuaciones diferenciales',nav:'Transformar pendientes',pages:'6–8',desc:'Una simetría transforma soluciones en soluciones. La regla de la cadena explica cómo se mueve una pendiente.'},
 {title:'Resolver con nuevas coordenadas',nav:'Reducir y resolver',pages:'8–14',desc:'Sigue tres ecuaciones desde el campo de pendientes hasta una ecuación separable. Recupera las soluciones y sus restricciones.'}
];
const frac=(a,b)=>`<mfrac><mrow>${a}</mrow><mrow>${b}</mrow></mfrac>`;
const x='<mi>x</mi>',y='<mi>y</mi>',r='<mi>r</mi>',s='<mi>s</mi>',c='<mi>C</mi>',one='<mn>1</mn>',two='<mn>2</mn>';
const sq=a=>`<msup>${a}<mn>2</mn></msup>`;
export const eq=(html,label)=>`<div class="formula math-display"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="${label}"><mrow>${html}</mrow></math></div>`;
export const arrigoNotes=[
`<h3>1. Una figura puede quedarse mientras sus puntos se mueven</h3>
<p>Una simetría es una transformación que conserva el objeto que estamos estudiando. En el círculo, un punto cambia de lugar al girar, pero el conjunto de puntos sigue siendo el mismo círculo. En Hamermesh vimos seis simetrías del triángulo; aquí aparece un parámetro continuo ε: puedes girar una cantidad tan pequeña como quieras.</p>
${eq('<mover><mi>x</mi><mo>¯</mo></mover><mo>=</mo><mi>x</mi><mi>cos</mi><mi>ε</mi><mo>−</mo><mi>y</mi><mi>sin</mi><mi>ε</mi><mo>,</mo><mspace width="1em"/><mover><mi>y</mi><mo>¯</mo></mover><mo>=</mo><mi>x</mi><mi>sin</mi><mi>ε</mi><mo>+</mo><mi>y</mi><mi>cos</mi><mi>ε</mi>','x barra igual a x coseno epsilon menos y seno epsilon; y barra igual a x seno epsilon más y coseno epsilon')}
<p>Al sumar x̄² e ȳ², los términos cruzados se cancelan y queda (x²+y²)(cos²ε+sin²ε)=x²+y². El radio es un <strong>invariante</strong>: una cantidad con el mismo valor antes y después. La barra distingue las coordenadas transformadas; no significa derivada ni promedio.</p>
<h3>2. Conservar una ecuación no exige conservar cada coordenada</h3>
<p>La dilatación (x̄,ȳ)=(e<sup>ε</sup>x,e<sup>ε</sup>y) conserva cualquier recta y=mx que pase por el origen. Si y=mx, entonces ȳ=e<sup>ε</sup>mx=mx̄. El cociente y/x permanece cuando x≠0, aunque la distancia al origen cambia.</p>
<p>En cambio, para y=mx+b, el residuo transformado es ȳ−mx̄−b=b(e<sup>ε</sup>−1). Si b≠0 y ε≠0, la recta ya no se conserva. El laboratorio deja comparar ambas situaciones con la misma transformación. Un solo punto que falle basta para refutar invariancia; para demostrarla necesitamos una identidad válida para todo punto del dominio.</p>
<h3>3. Buscar la combinación que no se mueve</h3>
<p>Para x̄=x+ε y ȳ=y/(1−εy), intenta combinar la traslación de x con el recíproco de y:</p>
${eq('<mover><mi>x</mi><mo>¯</mo></mover><mo>+</mo>'+frac(one,'<mover><mi>y</mi><mo>¯</mo></mover>')+'<mo>=</mo>'+x+'<mo>+</mo><mi>ε</mi><mo>+</mo>'+frac(one,y)+'<mo>−</mo><mi>ε</mi><mo>=</mo>'+x+'<mo>+</mo>'+frac(one,y),'x barra más uno sobre y barra es igual a x más uno sobre y')}
<p>Así, cualquier relación que dependa solo de I=x+1/y se conserva. En el ejemplo 1.1 del libro, la ecuación polinómica equivale a y²(I²−I−1)=0. Allí y=0 no satisface el polinomio (da 1), de modo que dividir por y² no elimina soluciones. La familia I=k produce hipérbolas y=1/(k−x).</p>
<h3>4. El dominio forma parte de la afirmación</h3>
<p>El mapa racional requiere 1−εy≠0; la escritura de I requiere y≠0. Para seguir un flujo continuo desde ε=0, trabaja en un intervalo que no atraviese el polo. Una fórmula finita al otro lado de una singularidad no autoriza a saltar a través de ella.</p>
<div class="challenge"><strong>Para explicarlo sin fórmulas</strong>Una simetría mueve los puntos a lo largo del mismo objeto. Un invariante pone una etiqueta constante a ese recorrido. Describe qué etiqueta usa cada modelo del laboratorio.</div>`,
`<h3>1. De una colección de mapas a un grupo</h3>
<p>Escribimos T<sub>ε</sub> para el mapa completo, no para un punto. Componer T<sub>b</sub>∘T<sub>a</sub> significa aplicar primero a y después b. Un grupo tiene cierre, asociatividad, identidad e inversos; son las mismas condiciones estudiadas con Hamermesh. Ahora los elementos son transformaciones que varían continuamente con ε.</p>
${eq('<msub><mi>T</mi><mi>b</mi></msub><mo>∘</mo><msub><mi>T</mi><mi>a</mi></msub><mo>=</mo><msub><mi>T</mi><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></msub><mo>,</mo><mspace width="1em"/><msub><mi>T</mi><mn>0</mn></msub><mo>=</mo><mi>Id</mi><mo>,</mo><mspace width="1em"/><msubsup><mi>T</mi><mi>ε</mi><mrow><mo>−</mo><mn>1</mn></mrow></msubsup><mo>=</mo><msub><mi>T</mi><mrow><mo>−</mo><mi>ε</mi></mrow></msub>','T b compuesto con T a es T a más b; T cero es identidad; el inverso de T epsilon es T menos epsilon')}
<p>En esta parametrización, la asociatividad viene de (a+b)+c=a+(b+c). Estos flujos de un parámetro con ley aditiva conmutan donde ambas composiciones están definidas. Esto no implica que todos los grupos de Lie sean abelianos: combinar flujos distintos puede depender del orden.</p>
<h3>2. Un ejemplo que obliga a mirar las dos coordenadas</h3>
<p>El ejemplo 1.3 usa T<sub>ε</sub>(x,y)=(xy/(y−ε),y−ε). Después de a, las coordenadas son x₁=xy/(y−a), y₁=y−a. Aplicando b, el numerador x₁y₁ vuelve a ser xy:</p>
${eq('<msub><mi>x</mi><mn>2</mn></msub><mo>=</mo>'+frac('<msub><mi>x</mi><mn>1</mn></msub><msub><mi>y</mi><mn>1</mn></msub>','<msub><mi>y</mi><mn>1</mn></msub><mo>−</mo><mi>b</mi>')+'<mo>=</mo>'+frac(x+y,y+'<mo>−</mo><mo>(</mo><mi>a</mi><mo>+</mo><mi>b</mi><mo>)</mo>'),'x dos es xy dividido por y menos a más b')}
<p>Además y₂=y−(a+b). La composición equivale a sumar parámetros. El producto x̄ȳ=xy es invariante, así que la órbita de un punto con xy=k recorre una hipérbola. La identidad tiene ε=0 en el dominio y≠0; el inverso usa −ε.</p>
<h3>3. La parametrización puede ocultar la ley sencilla</h3>
<p>Para x̄=ax, con a≠0, la ley original es multiplicativa: aplicar a y b equivale a ab, la identidad es a=1 y el inverso 1/a. Si a&gt;0, podemos escribir a=e<sup>ε</sup> y ab=e<sup>ε+δ</sup>. Así recuperamos el parámetro aditivo.</p>
<p><strong>El detalle que importa:</strong> e<sup>ε</sup> cubre solo escalas positivas. Las escalas negativas pertenecen a otra componente del grupo de escalas no nulas; no se alcanzan con este flujo desde la identidad. Tampoco aparece a=0, que colapsaría puntos y no tendría inverso.</p>
<h3>4. Suavidad y carácter local</h3>
<p>Arrigo formula sus ejemplos como funciones suaves en las coordenadas y analíticas en el parámetro cerca de la identidad. En la definición general de grupo de Lie basta la estructura suave compatible; el capítulo trabaja con estos ejemplos analíticos de un parámetro. Aquí se normaliza la identidad a ε=0 y la composición a una suma.</p>
<p>Las rotaciones y las dilataciones exponenciales están definidas para todo ε real. Los mapas racionales, en cambio, pueden tener polos. Por eso verificamos las leyes de <strong>transformaciones locales</strong>, con puntos y parámetros admisibles. Para la hipérbola del laboratorio, el recorrido desde 0 no debe atravesar ε=y inicial, ni en el paso intermedio ni en el final.</p>
<div class="challenge"><strong>Conexión con el capítulo siguiente</strong>La velocidad inicial del movimiento será el generador infinitesimal. Este capítulo prepara la idea; el método sistemático para encontrarlo aparece en el capítulo 2.</div>`,
`<h3>1. Una ecuación diferencial describe direcciones</h3>
<p>En y′=F(x,y), cada punto lleva una pendiente p=F(x,y). Una solución es una curva cuya tangente respeta ese campo. Una simetría de la EDO transforma cada curva solución en otra curva solución de la misma ecuación; no exige que cada curva individual quede fija.</p>
<h3>2. La pendiente también debe transformarse</h3>
<p>Sea x̄=X(x,y), ȳ=Y(x,y). Al recorrer una solución, y depende de x. Aplicando la regla de la cadena a las dos coordenadas:</p>
${eq(frac('<mi>d</mi><mover><mi>y</mi><mo>¯</mo></mover>','<mi>d</mi><mover><mi>x</mi><mo>¯</mo></mover>')+'<mo>=</mo>'+frac('<msub><mi>Y</mi><mi>x</mi></msub><mo>+</mo><msub><mi>Y</mi><mi>y</mi></msub><mi>p</mi>','<msub><mi>X</mi><mi>x</mi></msub><mo>+</mo><msub><mi>X</mi><mi>y</mi></msub><mi>p</mi>'),'pendiente transformada igual a Y x más Y y por p dividido por X x más X y por p')}
<p>Necesitamos X<sub>x</sub>+X<sub>y</sub>p≠0 para describir la curva transformada como función de x̄. La prueba de invariancia consiste en sustituir p=F(x,y) y comprobar que el cociente es F(X,Y). Una transformación regular de puntos puede producir una tangente vertical; la fórmula como gráfico deja de servir allí.</p>
<h3>3. Primer ejemplo: y′=xy³</h3>
<p>Con x̄=e<sup>ε</sup>x y ȳ=e<sup>−ε</sup>y, dȳ/dx=e<sup>−ε</sup>p y dx̄/dx=e<sup>ε</sup>. La pendiente transformada es e<sup>−2ε</sup>p. El otro miembro da x̄ȳ³=e<sup>−2ε</sup>xy³. Ambos reciben el mismo factor, por lo que la ecuación se conserva.</p>
<p>La integración directa da y=±1/√(K−x²), donde K−x²&gt;0; además y=0 es una solución que se perdería al dividir por y³. La transformación lleva K a e<sup>2ε</sup>K. Se conserva la familia de soluciones, aunque cambie la etiqueta K de una curva.</p>
<h3>4. Ejemplo racional: una cancelación menos evidente</h3>
${eq('<msup><mi>y</mi><mo>′</mo></msup><mo>=</mo>'+frac('<msup><mrow><mo>(</mo>'+x+y+'<mo>+</mo>'+one+'<mo>)</mo></mrow><mn>3</mn></msup>','<msup>'+x+'<mn>5</mn></msup>')+'<mo>+</mo>'+frac(one,sq(x)),'y prima igual a xy más uno al cubo dividido por x a la quinta, más uno sobre x al cuadrado')}
<p>Usa X=x/(1+εx), Y=y−ε. Aquí X<sub>y</sub>=0, Y<sub>x</sub>=0, X<sub>x</sub>=1/(1+εx)² y Y<sub>y</sub>=1. Por tanto p̄=(1+εx)²p. Además XY+1=(xy+1)/(1+εx). El término cúbico adquiere el factor (1+εx)² y 1/X² también. De nuevo, los dos lados coinciden.</p>
<p>La EDO exige x≠0 y el mapa exige 1+εx≠0. En el laboratorio verás el resultado numérico en un punto; la derivación anterior es la prueba general. Los decimales de la gráfica se redondean, así que una pequeña diferencia de cómputo no refuta la identidad algebraica.</p>
<div class="challenge"><strong>Un error frecuente</strong>Transformar únicamente F(x,y) deja la mitad de la prueba sin hacer. Hay que transformar también dy/dx: cambiar el eje horizontal cambia el denominador de la pendiente.</div>`,
`<h3>1. Elegir una coordenada que no cambie y otra que avance</h3>
<p>Buscamos coordenadas (r,s) donde la simetría sea r̄=r, s̄=s+ε. Si la ecuación queda independiente de s y puede escribirse ds/dr=g(r), se integra mediante una cuadratura. El capítulo 1 muestra los cambios; el capítulo 2 explicará cómo encontrarlos sistemáticamente. Aquí comprobamos cada paso y sus dominios.</p>
<h3>2. Riccati: la dilatación revela r=xy</h3>
${eq('<msup><mi>y</mi><mo>′</mo></msup><mo>=</mo>'+sq(y)+'<mo>−</mo>'+frac(y,x)+'<mo>−</mo>'+frac(one,sq(x)),'y prima es y al cuadrado menos y sobre x menos uno sobre x al cuadrado')}
<p>La simetría es (x̄,ȳ)=(e<sup>ε</sup>x,e<sup>−ε</sup>y). Pon r=xy y s=ln|x|. Entonces r̄=r y s̄=s+ε. En cada semieje x≠0, dr/dx=y+xy′=(r²−1)/x y ds/dx=1/x, de modo que:</p>
${eq(frac('<mi>d</mi>'+s,'<mi>d</mi>'+r)+'<mo>=</mo>'+frac(one,sq(r)+'<mo>−</mo>'+one),'ds sobre dr igual a uno sobre r al cuadrado menos uno')}
<p>Para r≠±1, descompón 1/(r²−1)=½[1/(r−1)−1/(r+1)]. Integrando, s=½ ln|(r−1)/(r+1)|+C₀. Al despejar se puede parametrizar la familia como y=1/x+2x/(C−x²), con C−x²≠0. La gráfica usa C&gt;0 para visualizar el polo; la fórmula admite otros C.</p>
<p><strong>Recupera lo que dividiste:</strong> r=1 y r=−1 dan las soluciones y=1/x y y=−1/x. La segunda está incluida con C=0; la primera se añade por separado. No las descartes porque ds/dr diverja. Son curvas válidas con x≠0. Para x&lt;0 usa x=−e<sup>s</sup>; el cambio x=e<sup>s</sup> del libro representa el semieje positivo.</p>
<details class="extension"><summary>Comparar con la vía clásica de Riccati</summary><div class="detail-body"><p>La solución particular y₁=1/x permite poner y=1/u+1/x. Sustituyendo aparece u′+u/x=−1. En cada semieje, un factor integrante proporcional a x da (xu)′=−x y u=(C−x²)/(2x). Recuperas la misma familia. El cambio inspirado por la simetría llega directamente a una ecuación separable y muestra por qué xy es la variable adecuada.</p></div></details>
<h3>3. Una traslación oculta en el cociente</h3>
${eq('<msup><mi>y</mi><mo>′</mo></msup><mo>=</mo>'+frac(y,x)+'<mo>+</mo>'+frac(sq(x),x+'<mo>+</mo>'+y),'y prima igual a y sobre x más x al cuadrado sobre x más y')}
<p>El mapa (x̄,ȳ)=(x+ε,(x+ε)y/x) conserva r=y/x y traslada s=x. Escribiendo y=rx, dr/dx=(xy′−y)/x²=1/(1+r). Así ds/dr=1+r y s=½r²+r+C. La solución se expresa implícitamente como x=½(y/x)²+y/x+C.</p>
<p>Trabaja con x≠0 y x+y≠0, es decir, r≠−1. La parábola s(r) es regular en r=−1, pero allí dx/dr=0 y la EDO original está indefinida: no hay una solución y(x) atravesando ese punto. También se excluyen las raíces s=0. La simetría lleva C a C+ε.</p>
<h3>4. Recíprocos para una ecuación más complicada</h3>
${eq('<msup><mi>y</mi><mo>′</mo></msup><mo>=</mo>'+frac(two+'<msup>'+y+'<mn>3</mn></msup><mo>(</mo>'+x+'<mo>−</mo>'+y+'<mo>−</mo>'+x+y+'<mo>)</mo>',x+'<msup><mrow><mo>(</mo>'+x+'<mo>−</mo>'+y+'<mo>)</mo></mrow><mn>2</mn></msup>'),'y prima igual a dos y al cubo por x menos y menos xy dividido por x por x menos y al cuadrado')}
<p>El mapa X=x/(1+εx), Y=y/(1+εy) traslada ambos recíprocos: 1/X=1/x+ε y 1/Y=1/y+ε. Por eso r=1/x−1/y queda fijo y s=1/y avanza. Sus inversas son x=1/(r+s), y=1/s.</p>
<p>Calcula ds/dx=−y′/y² y dr/dx=−1/x²+y′/y². Al sustituir la EDO y simplificar obtienes ds/dr=−2(r+1)/(r²+2r+2). El numerador es la derivada del denominador, así que:</p>
${eq(s+'<mo>=</mo><mo>−</mo><mi>ln</mi><mo>(</mo>'+sq(r)+'<mo>+</mo>'+two+r+'<mo>+</mo>'+two+'<mo>)</mo><mo>+</mo>'+c,'s igual a menos logaritmo de r al cuadrado más dos r más dos, más C')}
<p>El argumento (r+1)²+1 siempre es positivo. Para reconstruir la curva exige s≠0, r+s≠0 y r≠0: corresponden a y finita, x finita y x≠y. El cambio también excluye y=0, pero <strong>y=0 sí es solución de la EDO original para x≠0</strong> y debe añadirse. En r=0 el cociente reducido es finito aunque la EDO original tiene un polo: regularidad de la reducción no basta para ampliar el dominio.</p>
<h3>5. Cómo estudiar los ejercicios finales (pp. 12–14)</h3>
<p>Los ejercicios del libro conectan composición, invariantes, regla de la cadena y reducción. Las preguntas de esta guía son originales. Usa los siguientes desarrollos como modelo de razonamiento antes de intentar los del PDF.</p>
<details class="extension"><summary>Práctica desarrollada · una traslación vertical</summary><div class="detail-body"><p>Considera X=x, Y=y+ε y y′=F(x,y). La pendiente no cambia: p̄=p. La invariancia exige F(x,y+ε)=F(x,y) para todos los ε pequeños admisibles. Si F es diferenciable, derivar en ε=0 da F<sub>y</sub>=0: en cada componente vertical conexa del dominio F depende solo de x. A la inversa, cualquier y′=f(x) cumple la identidad. Por ejemplo, y′=2x tiene soluciones y=x²+C; la simetría cambia C por C+ε.</p></div></details>
<details class="extension"><summary>Práctica desarrollada · escala con dos pesos</summary><div class="detail-body"><p>Para y′=x²y³ y X=e<sup>aε</sup>x, Y=e<sup>bε</sup>y, la pendiente recibe e<sup>(b−a)ε</sup> y el otro lado e<sup>(2a+3b)ε</sup>. Igualarlos exige b−a=2a+3b, es decir, 3a+2b=0. Un flujo no trivial se obtiene con a=2, b=−3. El invariante x³y² tiene peso 3a+2b=0. El caso a=b=0 es la identidad, válida pero sin reducción útil.</p></div></details>
<details class="extension"><summary>Práctica desarrollada · diseñar un grupo que conserve una recta</summary><div class="detail-body"><p>Para la recta y−y₀=m(x−x₀), usa una dilatación centrada en (x₀,y₀): X=x₀+e<sup>ε</sup>(x−x₀), Y=y₀+e<sup>ε</sup>(y−y₀). Ambos lados reciben el mismo factor, la recta se conserva y T<sub>b</sub>∘T<sub>a</sub>=T<sub>a+b</sub>. Identidad e inverso corresponden a 0 y −ε. Elegir funciones a(ε),b(ε),c(ε),d(ε) que conserven la recta punto a punto no garantiza por sí solo la ley de grupo.</p></div></details>
<div class="challenge"><strong>Tu lista de comprobación matemática</strong>Identifica el invariante, calcula la regla de la cadena, integra, vuelve a (x,y), verifica la solución y recupera los casos excluidos al dividir.</div>`
];
export const arrigoQuizzes=[
 [
 {q:'Un círculo es invariante bajo una rotación. ¿Qué significa?',a:['Todos sus puntos permanecen fijos','El conjunto de puntos se conserva, aunque sus puntos se muevan','Las coordenadas x e y permanecen constantes'],correct:1,why:'La transformación permuta los puntos del mismo círculo. Su ecuación x²+y²=R² sigue cumpliéndose.'},
 {q:'¿Qué conserva (x,y) ↦ (e^εx,e^εy), para x≠0?',a:['x²+y²','y/x','x+y'],correct:1,why:'El mismo factor aparece en numerador y denominador. El radio sí cambia con esta dilatación.'},
 {q:'La dilatación respecto al origen, ¿conserva y=2x+3 para todo ε?',a:['Sí, porque es una recta','Solo si ε=0 dentro de este flujo','Sí, si x es positivo'],correct:1,why:'El término independiente pasa a 3e^ε. Para conservar la recta original necesitas e^ε=1, que en reales significa ε=0.'},
 {q:'Para X=x+ε, Y=y/(1−εy), ¿qué cantidad es invariante?',a:['x+1/y, cuando y≠0','x+y','xy'],correct:0,why:'1/Y=1/y−ε; al sumar X, los dos parámetros se cancelan. Excluye además 1−εy=0.'},
 {q:'Comprobar una identidad en diez puntos, ¿demuestra invariancia general?',a:['Sí, diez puntos bastan','No: hacen falta una identidad o una prueba general en el dominio','Sí, si los errores son pequeños'],correct:1,why:'La evaluación numérica ayuda a explorar y detectar errores. Una demostración tiene que abarcar todos los puntos admisibles.'}
 ],
 [
 {q:'Si T_b∘T_a=T_(a+b), ¿qué parámetro corresponde al inverso de T_a?',a:['1/a','−a','a²'],correct:1,why:'a+(−a)=0 y T₀ es la identidad. 1/a corresponde a la ley multiplicativa, no a esta parametrización aditiva.'},
 {q:'Escribir una escala como a=e^ε cubre…',a:['Todas las escalas reales no nulas','Solo las escalas positivas','También la escala a=0'],correct:1,why:'Una exponencial real siempre es positiva. El componente negativo no se alcanza con un camino de este flujo desde la identidad.'},
 {q:'En T_ε(x,y)=(xy/(y−ε),y−ε), ¿qué se conserva?',a:['xy','x/y','x+y'],correct:0,why:'Multiplicando las coordenadas transformadas se cancela y−ε y se recupera xy, donde el mapa está definido.'},
 {q:'Desde y=1, un flujo racional tiene un polo en ε=1. ¿Puedes seguir continuamente hasta ε=2?',a:['Sí, la fórmula final es finita','No: el recorrido cruza una singularidad','Sí, si aplicas el inverso al final'],correct:1,why:'Un flujo local se sigue dentro de su intervalo de existencia. Tener una fórmula al otro lado del polo no permite atravesarlo.'},
 {q:'¿Todos los grupos de Lie son conmutativos?',a:['Sí','No; los flujos de un parámetro con ley aditiva sí conmutan localmente','Solo los de matrices lo son'],correct:1,why:'La suma de parámetros conmuta. Grupos de varias dimensiones, por ejemplo rotaciones espaciales, pueden ser no abelianos.'}
 ],
 [
 {q:'Si X=e^εx y Y=e^(−ε)y, ¿cómo cambia p=dy/dx?',a:['p̄=e^(−ε)p','p̄=e^(−2ε)p','p̄=p'],correct:1,why:'El numerador recibe e^(−ε) y el denominador e^ε. Al dividir queda e^(−2ε).'},
 {q:'Una simetría de una EDO debe…',a:['Dejar fija cada curva solución','Transformar soluciones en soluciones de la misma EDO','Conservar cada valor de y'],correct:1,why:'Puede cambiar la constante de integración de una solución. Lo que se conserva es la familia y la ecuación que la describe.'},
 {q:'Para X(x,y), Y(x,y), ¿cuál es la pendiente transformada?',a:['Y_y p / X_x siempre','(Y_x+Y_y p)/(X_x+X_y p)','Y/X'],correct:1,why:'Son las derivadas totales de Y y X a lo largo de la curva. Solo en casos particulares desaparecen los términos cruzados.'},
 {q:'Si X=x/(1+εx), Y=y−ε, ¿qué factor multiplica a p?',a:['1+εx','(1+εx)²','1/(1+εx)²'],correct:1,why:'dX/dx=1/(1+εx)² y dY/dx=p. La pendiente es el cociente, así que el factor se invierte.'},
 {q:'Al integrar y′=xy³ dividiendo por y³, ¿qué solución debes recuperar?',a:['y=0','y=x','y=1'],correct:0,why:'La división excluyó y=0, que sí cumple la ecuación original. Las soluciones no nulas son ±1/√(K−x²).'}
 ],
 [
 {q:'Para la simetría (e^εx,e^(−ε)y), con x>0, ¿qué coordenadas sirven?',a:['r=xy, s=ln x','r=x+y, s=x','r=y/x, s=ln y'],correct:0,why:'El producto xy permanece y ln(e^εx)=ln x+ε. En x<0 sirve ln|x| con una carta separada.'},
 {q:'En Riccati, dividir por r²−1 deja fuera…',a:['Ninguna solución','r=±1, que corresponden a y=±1/x','Solo x=0'],correct:1,why:'Ambas curvas satisfacen la EDO para x≠0. No se representan como s(r), porque r es constante.'},
 {q:'Si ds/dr=r+1, la integral es…',a:['s=r²+r+C','s=r²/2+r+C','s=ln|r+1|+C'],correct:1,why:'Integra cada sumando: ∫r dr=r²/2 y ∫1 dr=r. Derivar el resultado devuelve r+1.'},
 {q:'¿Por qué ln(r²+2r+2) no necesita valor absoluto para r real?',a:['Porque r siempre es positivo','Porque r²+2r+2=(r+1)²+1>0','Porque todo polinomio es positivo'],correct:1,why:'Completar el cuadrado demuestra que el argumento nunca se anula ni cambia de signo.'},
 {q:'Para r=1/x−1/y y s=1/y, ¿cuál es la transformación inversa?',a:['x=1/(r+s), y=1/s','x=r+s, y=s','x=1/r, y=1/s'],correct:0,why:'1/x=r+s. Exige s≠0 y r+s≠0 para recuperar coordenadas finitas; la EDO también excluye r=0.'},
 {q:'La reducción racional excluye y=0. ¿Qué debes hacer?',a:['Descartarla siempre','Sustituirla en la EDO original; aquí es una solución para x≠0','Usar s=0 para representarla'],correct:1,why:'El cambio s=1/y falla en y=0, pero la ecuación original tiene lado derecho cero allí. s=0 representa un y infinito, no y=0.'}
 ]
];
