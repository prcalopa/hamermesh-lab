import {tex} from './math.mjs';
import {range,plot,sampled,fmt,colors} from './arrigo.mjs';
import * as M from './cantwell5-math.mjs';
const B=s=>tex(s,true),p=s=>`<p>${s}</p>`,T=String.raw;
const select=(id,label,opts)=>`<div class="field"><label for="c5-${id}">${label}</label><select id="c5-${id}">${opts.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></div>`;
const presets={abelian:[5,7],affine:[4,5,6,7],sl2:[0,2,4],missing:[0,2,4,7],growth:[0,2,4],full:[0,1,2,3,4,5,6,7],translations:[4,7]};
const names=Array.from({length:8},(_,j)=>[j,'X'+(j+1)]);
const configs=[
 [['s','Parámetro s',-1,1,.05,.4],['n','Peso vertical n',0,4,.1,2]],
 [['a','Primer parámetro a',-2,2,.1,.8],['b','Segundo parámetro b',-2,2,.1,.3]],
 [['a','Parámetro a',-1,1,.05,.2],['b','Parámetro b',-1,1,.05,.3]],
 [['s','Parámetro s',-.7,.7,.05,.4],['n','Peso vertical n',0,4,.1,2]],
 [['s','Parámetro s',-1.5,1.5,.05,.7]],
 [['s','Parámetro s',-3,3,.1,1.5],['n','Orden de la serie',1,12,1,4]],
 [['x','Coordenada x',-2,2,.1,1],['y','Coordenada y',-2,2,.1,.7]],
 [['r','Radio inicial',0,2,.1,1],['s','Ángulo recorrido',-3.14,3.14,.1,.7]],
 [['s','Parámetro s',-2,2,.1,.5],['n','Orden de Taylor',1,10,1,5]],
 [['s','Parámetro proyectivo s',-.8,.8,.05,.3]],
 [],[],[],[],
 [['a','Entrada diagonal de A',-2,2,.1,1],['b','Entrada superior de B',-2,2,.1,.7],['c','Entrada inferior de B',-2,2,.1,.3]],
 [['s','Parámetro s',-.6,.6,.05,.3]],
 [['s','Ángulo o rapidez',-1.5,1.5,.05,.6],['m','Paso helicoidal m',-.8,.8,.1,.4]],
 [['h','Paso máximo',.01,.2,.01,.05],['d','Distancia inicial a la silla δ',.001,.05,.001,.01],['end','Tiempo hacia atrás',6,24,1,12]],
 [['s','Parámetro s',-.6,.6,.05,.3],['y','Dato inicial y',-.8,.8,.1,.5],['z','Dato inicial z',-1,1,.1,.7]],
 [['s','Ángulo de rotación',-2,2,.1,.7],['a','Boost horizontal',-1,1,.1,.4],['t','Tiempo',0,2,.1,1]]
];
const help=[
 'La curva inicial es una parábola. Violeta: original; verde: transformada. El cociente es invariante cuando el peso vertical vale dos.',
 'El gráfico muestra una línea inicial y su imagen bajo dos traslaciones. El panel compara con dos reflexiones trasladadas; la familia de reflexiones sola no tiene identidad.',
 'La escala positiva multiplica factores y suma sus logaritmos. El laboratorio compara la composición sucesiva con la escala del parámetro suma.',
 'Cambia el peso vertical y observa cómo se mueve el coeficiente de la parábola. Se dibujan solo puntos con coordenada horizontal positiva.',
 'Violeta: órbita circular exacta; verde: aproximación tangente desde (1,0). El infinitesimal coincide, pero la familia tangente no es un flujo.',
 'Compara la órbita exacta y la serie de Lie truncada. El orden controla la precisión; un polinomio no conserva necesariamente el radio.',
 'El cálculo exacto de la derivada direccional distingue una identidad de invariancia de un valor cero accidental en un punto.',
 'El radio cero selecciona un punto fijo. Para radio positivo aparece una órbita circular; una carta angular no puede cubrir globalmente toda la vuelta.',
 'Desde x=1, la serie geométrica reconstruye el flujo racional donde converge. Para s negativo grande, el flujo existe aunque las sumas parciales diverjan.',
 'El subgrupo proyectivo transforma una recta de puntos. El intervalo visible evita el polo; verde: imagen de la recta original.',
 'Selecciona dos de los ocho campos de la base del libro. Las componentes del corchete se calculan a partir de polinomios exactos.',
 'La tabla usa fila primero y columna después: [X fila, X columna]. Los coeficientes se calculan, no se cargan como una tabla fija.',
 'El cierre añade todas las direcciones que faltan al conmutar los generadores seleccionados. Se muestran las dimensiones sucesivas.',
 'La serie derivada reemplaza el espacio por todos sus conmutadores. Llegar a cero certifica resolubilidad; estabilizarse en positivo la descarta.',
 'Matrices reales 2×2. El producto simétrico es AB+BA, sin dividir por dos. Compara su asociador con los residuos de Jordan y Jacobi.',
 'Los tres modelos usan el dato (1,0.6). Los parámetros se restringen para no cruzar polos. Se dibuja la órbita, con el punto imagen destacado.',
 'En Lorentz se dibujan x y ct con c=1, de modo que la rapidez es adimensional. La hélice se muestra como proyección plana y se indica su altura.',
 'Integra hacia atrás desde la dirección estable lineal de (1,0). Violeta: Taylor–Lie de orden 4; verde: RK4. La discrepancia no mide el error del dato inicial aproximado.',
 'Dato x=1; cambia las otras coordenadas. El gráfico representa (x,y) y el resultado incluye z y los dos invariantes comprobados.',
 'Compara rotar y después aplicar un boost horizontal con hacerlo en orden contrario. Se transforman posición y velocidad coherentemente.'
];
const coeff=v=>{const parts=v.map((a,j)=>Math.abs(a)<1e-9?'':`${a===1?'':a===-1?'−':fmt(a,2)+'·'}X${j+1}`).filter(Boolean);return parts.join(' + ').replaceAll('+ −','− ')||'0';};
const table=(heads,rows)=>`<div class="cw-table-wrap"><table class="cw-table"><thead><tr>${heads.map(s=>`<th scope="col">${s}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(s=>`<td>${s}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const norm=A=>Math.max(...A.flat().map(Math.abs));
export function renderCantwell5(section,root){
 let extra='';
 if([5,9,16,17].includes(section))extra=select('kind','Transformación',section===5?[['rotation','Rotación exacta frente a tangente']]:section===9?[['rational','Flujo racional'],['rotation','Rotación']]:section===16?[['projective','Proyectivo'],['hyperbolic','Hiperbólico xy constante'],['arbitrary','Traslación vertical no uniforme']]:[['lorentz','Lorentz'],['helix','Hélice']]);
 if([11,12].includes(section))extra=select('i','Primer generador',names)+select('j','Segundo generador',names);
 if([13,14].includes(section))extra=select('set','Generadores iniciales',[['abelian','X6, X8 · abeliano'],['affine','X5, X6, X7, X8 · afín resoluble'],['sl2','X1, X3, X5 · no cerrado sin X7'],['full','Los ocho generadores']]);
 root.innerHTML=`<div class="lab"><div class="viz"><div class="viz-header"><span>CANTWELL 5 · DEL CAMPO AL GRUPO</span><span class="viz-tag">Lie</span></div><div id="c5-viz"></div><div class="plot-legend"><span><i style="background:${colors.original}"></i>Original o primer modelo</span><span><i style="background:${colors.changed}"></i>Comparación indicada</span></div></div><div class="control-panel"><h3>Comprueba el razonamiento</h3><p class="helper">${help[section-1]}</p>${extra}${configs[section-1].map(c=>range('c5-'+c[0],...c.slice(1))).join('')}<div id="c5-result" class="result-box" aria-live="polite"></div></div></div><div class="insight"><span class="insight-symbol">Γ</span><p><strong>Lee la demostración en Paso a paso.</strong>Los dominios, las convenciones de signo y los errores de aproximación forman parte del modelo. Las preguntas de Practicar comprueban esas condiciones.</p></div>`;
 const $=id=>root.querySelector('#c5-'+id),v=id=>Number($(id).value),str=id=>$(id).value;
 const chart=(f,g,a=-2,b=2)=>{const data=sampled(t=>f(t),a,b,180),other=g?sampled(t=>g(t),a,b,180):[],pts=[...data,...other].filter(r=>r.every(Number.isFinite)),xs=pts.map(r=>r[0]),ys=pts.map(r=>r[1]),xa=Math.min(-.2,...xs),xb=Math.max(.2,...xs),ya=Math.min(-.2,...ys),yb=Math.max(.2,...ys),dx=.12*(xb-xa),dy=.12*(yb-ya);return plot({title:help[section-1],bounds:[xa-dx,xb+dx,ya-dy,yb+dy],paths:[{data},{data:other,color:colors.changed}],labels:['Primera coordenada','Segunda coordenada']});};
 function update(){
  configs[section-1].forEach(c=>$(c[0]+'-value').textContent=fmt(v(c[0]),3));let visual='',out='';
  if(section===1||section===4){const s=v('s'),n=v('n');visual=chart(x=>[x,x*x],x=>M.flow('scale',[x,x*x],s,n),section===4?.2:-2,2);out=B(T`I=Y/X^2=e^{(n-2)s}y/x^2`)+p(`Factor de nivel: ${fmt(Math.exp((n-2)*s),6)}. ${Math.abs(n-2)<1e-8?'Invariante para todo s.':'El nivel cambia salvo casos particulares.'}`);}
  else if(section===2){const a=v('a'),b=v('b');visual=chart(x=>[x,x],x=>[x+a+b,x],-2,2);out=B(T`T_aT_b(x)=x+a+b,\quad R_aR_b(x)=x+a-b`)+p(`Desde x=1: traslaciones=${fmt(1+a+b)}; reflexiones=${fmt(1+a-b)}. El resultado de las reflexiones es una traslación.`);}
  else if(section===3){const a=v('a'),b=v('b'),P=M.flow('scale',M.flow('scale',[1,.5],b,1),a,1),Q=M.flow('scale',[1,.5],a+b,1);visual=chart(s=>M.flow('scale',[1,.5],s,1),null,-1,1);out=B(T`\lambda=e^s,\quad e^ae^b=e^{a+b}`)+p(`Escala compuesta=${fmt(P[0],6)}; escala directa=${fmt(Q[0],6)}; diferencia=${fmt(Math.hypot(...P.map((x,j)=>x-Q[j])),10)}.`);}
  else if(section===5||section===6||section===8){const s=v('s'),r=section===8?v('r'):1,n=section===6?v('n'):1;visual=chart(t=>M.flow('rotation',[r,0],t),section===8?null:t=>M.rotationSeries(r,0,t,n),-Math.max(1,Math.abs(s)),Math.max(1,Math.abs(s)));const A=M.flow('rotation',[r,0],s),C=M.rotationSeries(r,0,s,n);out=B(T`\Gamma=-y\partial_x+x\partial_y`)+p(section===8?`Radio=${fmt(r)}. ${r===0?'El origen es un punto fijo.':'Órbita regular: una circunferencia.'}`:`Error de coordenadas en s=${fmt(s)}: ${fmt(Math.hypot(...A.map((x,j)=>x-C[j])),7)}; radio aproximado=${fmt(Math.hypot(...C),6)}.`);}
  else if(section===7){const x=v('x'),y=v('y');visual=chart(t=>M.flow('rotation',[x,y],t),null,-Math.PI,Math.PI);out=B(T`\Gamma(x^2+y^2)=0,\quad\Gamma x=-y`)+p(`En el punto elegido, derivada del radio al cuadrado=0; derivada de x=${fmt(-y)}. Que esta última se anule en un punto no prueba una identidad.`);}
  else if(section===9){const s=v('s'),n=v('n'),rot=str('kind')==='rotation';if(rot){visual=chart(t=>M.flow('rotation',[1,0],t),t=>M.rotationSeries(1,0,t,n),-2,2);out=p('Rotación: la serie converge para todo parámetro.');}else{const sum=t=>Array.from({length:n+1},(_,k)=>t**k).reduce((a,b)=>a+b,0);visual=chart(t=>[t,1/(1-t)],t=>[t,sum(t)],-2,.8);out=B(T`x(s)=1/(1-s),\quad S_N=\sum_{k=0}^Ns^k,\quad |s|<1`)+p(s>=1?'El parámetro elegido alcanza o cruza el polo: no se evalúa el flujo desde cero.':`Flujo en s=${fmt(s)}: ${fmt(1/(1-s),6)}; suma parcial=${fmt(sum(s),6)}. ${Math.abs(s)<1?'Dentro del intervalo de convergencia.':'Fuera del intervalo de convergencia, aunque el flujo puede existir.'}`);}}
  else if(section===10){const s=v('s');visual=chart(x=>[x,.4*x+.3],x=>M.flow('projective',[x,.4*x+.3],s),-1,1);out=B(T`(X,Y)=\left(\frac x{1-sy},\frac y{1-sy}\right)`)+p('En el segmento dibujado, el denominador se mantiene positivo. La imagen de una recta es otra recta.');}
  else if(section===11){const i=v('i'),j=v('j'),V=M.bracket(M.basis[i],M.basis[j]);visual=chart(x=>[x,M.value(V[0],x,.6)],x=>[x,M.value(V[1],x,.6)]);out=p(`[X${i+1}, X${j+1}]=${coeff(M.structure[i][j])}.`)+p('Sección de las componentes del campo en y=0,6: violeta horizontal, verde vertical.');}
  else if(section===12){const i=v('i'),j=v('j');visual=table(['[fila,columna]',...names.map(n=>n[1])],M.structure.map((row,k)=>['X'+(k+1),...row.map(coeff)]));out=p(`Entrada elegida: [X${i+1}, X${j+1}]=${coeff(M.structure[i][j])}.`)+p('Los 64 corchetes se obtienen por derivación y descomposición polinómica. La tabla tiene desplazamiento horizontal.');}
  else if(section===13||section===14){const ids=presets[str('set')],cl=M.closure(ids),dims=M.derived(ids);visual=table(['Etapa','Dimensión'],(section===13?cl.dims:dims).map((n,j)=>[j,n]));out=p('Generadores: '+ids.map(i=>'X'+(i+1)).join(', '))+p(section===13?`Dimensión inicial=${ids.length}; cierre=${cl.rows.length}. ${ids.length===cl.rows.length?'Subálgebra cerrada.':'Faltan direcciones: el conjunto inicial no es una subálgebra.'}`:`Serie de espacios de conmutadores: ${dims.join(' → ')}. ${ids.length!==cl.rows.length?'El candidato inicial no es subálgebra; el cálculo muestra el resultado de iterar sus espacios, no certifica resolubilidad de un álgebra inicial.':dims.at(-1)===0?'Álgebra resoluble.':'No resoluble: la serie se estabiliza con dimensión positiva.'}`);}
  else if(section===15){const A=[[v('a'),0],[0,-v('a')]],B0=[[0,v('b')],[v('c'),1]],C=[[1,.3],[0,-1]],J=M.jordan,K=M.comm,As=J(A,A),assoc=M.add(J(J(A,B0),C),J(A,J(B0,C)),-1),jr=M.add(J(J(As,B0),A),J(As,J(B0,A)),-1),jac=M.add(M.add(K(A,K(B0,C)),K(B0,K(C,A))),K(C,K(A,B0)));visual=table(['Comprobación','Norma máxima'],[['Asociador simétrico',fmt(norm(assoc),8)],['Residuo Jordan',fmt(norm(jr),8)],['Residuo Jacobi',fmt(norm(jac),8)]]);out=B(T`A\circ B=AB+BA,\qquad[A,B]=AB-BA`)+p('Los residuos se calculan multiplicando matrices. Un asociador no nulo no contradice Jordan ni Jacobi.');}
  else if(section===16){const s=v('s'),kind=str('kind'),f=t=>M.flow(kind,[1,.6],t),A=f(s);visual=chart(f,null,-.6,.6);out=p(`Imagen: (${A.map(x=>fmt(x,6)).join('; ')}).`)+p(kind==='projective'?`Razón x/y=${fmt(A[0]/A[1],6)} (inicial 1/0,6).`:kind==='hyperbolic'?`Producto xy=${fmt(A[0]*A[1],6)} (inicial 0,6).`:`Invariante x=${fmt(A[0])}; desplazamiento vertical=${fmt(A[1]-.6)}.`);}
  else if(section===17){const s=v('s'),m=v('m'),kind=str('kind'),A=M.flow(kind,[1,.4,0],s,m);visual=chart(t=>M.flow(kind,[1,.4,0],t,m).slice(0,2),null,-1.5,1.5);out=kind==='lorentz'?B(T`X^2-(cT)^2=x^2-(ct)^2`)+p(`Invariante=${fmt(A[0]**2-A[1]**2,8)}; velocidad relativa u/c=${fmt(-Math.tanh(s),6)}.`):p(`Radio=${fmt(Math.hypot(A[0],A[1]),6)}; altura=${fmt(A[2],6)}. La proyección no muestra la coordenada axial.`);}
  else if(section===18){const h=v('h'),d=v('d'),end=-v('end'),lam=(1-Math.SQRT2)/2,initial=[1-d,-lam*d],A=M.integrateFlame(initial,end,h,'lie'),C=M.integrateFlame(initial,end,h,'rk4'),last=A.at(-1),other=C.at(-1);visual=plot({title:'Retrato de fases: aproximación Lie y RK4 desde la silla',bounds:[-.1,1.1,-.05,.3],paths:[{data:A.map(r=>r.slice(1))},{data:C.map(r=>r.slice(1)),color:colors.changed}],points:[{xy:[0,0],label:'Nodo'},{xy:[1,0],label:'Silla'}],labels:['x','y']});out=p(`Pasos Lie/RK4: ${A.length-1}/${C.length-1}. Extremos temporales: ${fmt(last[0])}/${fmt(other[0])}.`)+p(`Diferencia final entre métodos=${Math.hypot(last[1]-other[1],last[2]-other[2]).toExponential(3)}. La integración se detiene si sale del rango numérico.`);}
  else if(section===19){const s=v('s'),y=v('y'),z=v('z'),A=M.flow('nonlinear',[1,y,z],s),inv=(x,y,z)=>z*Math.sqrt(Math.abs(x))*Math.exp(y*y/(4*x));visual=chart(t=>M.flow('nonlinear',[1,y,z],t).slice(0,2),null,-.6,.6);out=B(T`I_1=y/x,\quad I_2=z\sqrt{|x|}e^{y^2/(4x)}`)+p(`Imagen z=${fmt(A[2],7)}; I₁=${fmt(A[1]/A[0],7)}; I₂ inicial=${fmt(inv(1,y,z),7)}, final=${fmt(inv(...A),7)}.`);}
  else if(section===20){const s=v('s'),a=v('a'),t=v('t'),R=p=>M.flow('rotation',p,s),pos=[1,.3],vel=[.2,.6],rpos=R(pos),rvel=R(vel),first=[rpos[0]+a*t,rpos[1]],second=R([pos[0]+a*t,pos[1]]),u1=[rvel[0]+a,rvel[1]],u2=R([vel[0]+a,vel[1]]);visual=plot({title:'Orden de rotación y boost: posiciones finales',bounds:[-3,3,-3,3],points:[{xy:pos,label:'Inicial'},{xy:first,label:'Rotar, boost',color:colors.original},{xy:second,label:'Boost, rotar',color:colors.changed}],segments:[{a:[0,0],b:first},{a:[0,0],b:second,color:colors.changed}],labels:['x','y'],equal:true});out=p(`Distancia entre posiciones=${fmt(Math.hypot(first[0]-second[0],first[1]-second[1]),6)}.`)+p(`Velocidades: (${u1.map(x=>fmt(x)).join('; ')}) frente a (${u2.map(x=>fmt(x)).join('; ')}).`);}
  $('viz').innerHTML=visual;$('result').innerHTML=out;
 }
 root.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',update));update();
}
