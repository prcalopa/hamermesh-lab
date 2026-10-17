import {tex} from './math.mjs';
import {range,fmt,plot,colors} from './arrigo.mjs';
import * as R from './ramadevi-math.mjs';
const B=s=>tex(s,true),P=s=>`<p>${s}</p>`,T=String.raw;
const number=x=>Math.abs(x)<1e-9?'0':Number(x.toPrecision(5)).toString();
const complex=x=>{x=R.Z(x);return Math.abs(x.i)<1e-9?number(x.r):Math.abs(x.r)<1e-9?number(x.i)+'i':number(x.r)+(x.i<0?'':' + ')+number(x.i)+'i';};
const matrix=(A,label='')=>B((label?label+'=':'')+String.raw`\begin{pmatrix}`+A.map(r=>r.map(complex).join('&')).join(String.raw`\\`)+String.raw`\end{pmatrix}`);
const table=(heads,rows)=>`<div class="cw-table-wrap"><table class="cw-table"><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const group=['e','r','r²','s','rs','r²s'];
const rangeSpec=(id,label,min,max,step,value)=>[id,label,min,max,step,value];
const configs={3:[
 [['a','Oblicuidad de la base',-2,2,.1,1]], [['a','Oblicuidad de la base',-2,2,.1,1],['g','Elemento (0=e, 1=r, 2=r², 3–5 reflejos)',0,5,1,1]],
 [['g','Primer elemento (0–5)',0,5,1,1],['h','Segundo elemento (0–5)',0,5,1,3]],
 [['a','Componente x',-3,3,.25,1],['b','Componente y',-3,3,.25,2],['c','Componente z',-3,3,.25,3]],
 [['g','Elemento (0–5)',0,5,1,1]], [['g','Elemento (0–5)',0,5,1,3]], [['g','Elemento (0–5)',0,5,1,1]],
 [['a','Primer tipo (0=A1, 1=A2, 2=E)',0,2,1,0],['b','Segundo tipo',0,2,1,2]],
 [['a','Carácter (0=vértices, 1=tensor, 2=regular)',0,2,1,0]],
 [['a','Vector x',-3,3,.25,1],['b','Vector y',-3,3,.25,2],['c','Vector z',-3,3,.25,3],['g','Sector (0=A1, 1=A2, 2=E)',0,2,1,0]],
 [['g','Elemento del primer factor (0–5)',0,5,1,1],['a','Paridad del segundo factor (0=+, 1=−)',0,1,1,1]],
 [['g','Elemento de G (0–5)',0,5,1,3],['a','Representación de H (0=trivial, 1=signo)',0,1,1,0]]
 ],5:[
 [['a','Ángulo θ',0,6.283,.05,1],['b','Peso n (incluye pruebas no enteras)',-2,3,.5,1]],
 [['a','Parámetro de la exponencial',-2,2,.1,.7]], [['a','Ángulo t',-.8,.8,.05,.4]],
 [['a','Primer generador (1–3)',1,3,1,1],['b','Segundo generador (1–3)',1,3,1,2]],
 [['a','Álgebra (0=su2 compacta, 1=u1)',0,1,1,0]], [['a','Espín j',0,2,.5,1]],
 [['a','Primer peso (0=u, 1=d, 2=s)',0,2,1,0],['b','Segundo peso',0,2,1,2]],
 [['a','Espín j',.5,2,.5,.5],['b','Ángulo de rotación',0,12.566,.05,6.283]],
 [['a','Tamaño n',2,8,1,3]], [['a','Forma real (0=compacta, 1=no compacta)',0,1,1,0]],
 [['a','Reflexión simple (0=α1, 1=α2)',0,1,1,0]], [['a','Primer T (1–8)',1,8,1,1],['b','Segundo T (1–8)',1,8,1,2]],
 [['a','Ángulo entre vectores (grados)',60,150,5,120],['b','Razón de longitudes',.5,2,.1,1]],
 [['a','Etiqueta p',0,5,1,1],['b','Etiqueta q',0,5,1,1]]
 ],6:[
 [['a','Campo longitudinal',-2,2,.1,1],['b','Campo transversal',-2,2,.1,0]],
 [['a','Primer espín j1',0,2,.5,.5],['b','Segundo espín j2',0,2,.5,1]],
 [['a','N de SU(N)',2,5,1,3],['b','Diagrama (0=[2],1=[1,1],2=[2,1],3=[1,1,1])',0,3,1,2]],
 [['a','Estado producto (0=++,1=+−,2=−+,3=−−)',0,3,1,1]],
 [['a','Primer espín j1',0,1.5,.5,.5],['b','Segundo espín j2',0,1.5,.5,1]],
 [['a','J final (0.5 o 1.5)',.5,1.5,1,1.5],['b','Componente q del tensor',-1,1,1,0]],
 [['a','Amplitud reducida común',.2,2,.1,1]], [['a','Número de quarks extraños en la fila',0,3,1,0]],
 [['a','Componente u del estado diagonal',0,1,.1,.5]], [['a','Ruptura ε (unidades arbitrarias)',-1,1,.1,.4]],
 [['a','Rapidez a',-1.5,1.5,.1,.7]], [['a','Rapidez del boost',-1,1,.1,.4],['b','Traslación temporal',-1,1,.1,.5],['c','Logaritmo de escala s',-.7,.7,.1,.2]],
 [['a','Número principal n',1,6,1,2]], [['a','Número principal n',1,8,1,3]]
 ]};
const help={
 '3-1':'El vector físico es (3,1). Cambia la base sin moverlo y comprueba su reconstrucción.',
 '3-2':'La matriz del doblete en una base oblicua conserva Gram. Se compara con la prueba ortogonal usual.',
 '3-3':'Los elementos se numeran e,r,r²,s,rs,r²s. Se aplica el segundo antes que el primero.',
 '3-4':'Separa la media uniforme y las desviaciones de suma cero del vector de tres componentes.',
 '3-5':'Compara las matrices y caracteres de las tres irreducibles de C3v.',
 '3-6':'Cada columna de la matriz regular representa la imagen de un elemento del grupo.',
 '3-7':'Se calcula E(g)⊗E(g), cuyo carácter se descompone como A1+A2+E.',
 '3-8':'Las contribuciones de las clases se ponderan por 1,2,3 antes de dividir por seis.',
 '3-9':'Los tres caracteres ofrecidos son representaciones válidas, con multiplicidades enteras.',
 '3-10':'El proyector actúa sobre la representación de vértices. A2 no aparece en este espacio.',
 '3-11':'Un signo del segundo factor cambia matrices, pero conserva la dimensión del doblete.',
 '3-12':'Se induce desde H={e,s}, con representantes e,r,r². Las matrices se calculan por pertenencia a H.',
 '5-1':'Violeta: fase de U(1). Verde: su carácter de peso n. Los pesos no enteros son pruebas que no descienden al círculo.',
 '5-2':'Una matriz nilpotente N satisface N²=0. Compara la exponencial numérica con I+tN.',
 '5-3':'Compara productos de rotaciones de espín sobre ejes distintos con la exponencial de su suma.',
 '5-4':'Se calculan corchetes de los generadores hermíticos J=Pauli/2; el factor i se conserva.',
 '5-5':'La matriz mostrada se calcula en la adjunta compacta su2 o en la abeliana u1.',
 '5-6':'Las matrices de escalera usan hbar=1 y J± sin raíz de dos adicional.',
 '5-7':'El vector de diferencia entre pesos es una raíz cuando se eligen pesos distintos.',
 '5-8':'La rotación axial usa exp(−iθJz). Prueba θ=2π y θ=4π comparando con ±I.',
 '5-9':'Se cuentan parámetros reales del grupo o del álgebra, no la dimensión de una representación arbitraria.',
 '5-10':'Ejemplos de Killing en dos bases reales declaradas: signo definido frente a signo mezclado.',
 '5-11':'Violeta: raíces A2; verde: imágenes por una reflexión simple de Weyl. Los conjuntos coinciden.',
 '5-12':'T=λ/2. El conmutador se calcula con matrices complejas hermíticas de tres por tres.',
 '5-13':'Vectores candidatos con normas ajustables. No todo ángulo o longitud forma un sistema de raíces válido.',
 '5-14':'Calcula el mayor peso y la dimensión de la irreducible SU3 etiquetada por (p,q).',
 '6-1':'Modelo H=aJz+bJx. El momento Jz se conserva solo cuando el campo transversal deja de contribuir al conmutador.',
 '6-2':'La tabla reúne todos los espines permitidos, en pasos de uno, y comprueba dimensiones.',
 '6-3':'La fórmula de ganchos devuelve cero para antisimetrizaciones con más filas que N.',
 '6-4':'Columnas: triplete y singlete. Filas: base producto. La última columna fija nuestra fase de singlete.',
 '6-5':'Matriz CG completa, con filas (m1,m2) y columnas (J,M). Se usa Condon–Shortley y espines pequeños.',
 '6-6':'J inicial=1/2, M inicial=1/2 y tensor de rango 1. Se muestra solo el factor geométrico; la dinámica puede anular la transición.',
 '6-7':'Dos canales ideales con el mismo elemento reducido. El resultado no incorpora diferencias de espacio de fases.',
 '6-8':'Se muestran los diez pesos simétricos de tres sabores. La fila elegida se destaca en la tabla.',
 '6-9':'Los pares quark–antiquark dan nueve estados y siete posiciones de peso distintas. La tabla distingue multiplicidades.',
 '6-10':'Modelo de energías E=εY en el decuplete. No usa masas experimentales.',
 '6-11':'Evento inicial (ct,x,y,z)=(2,1,0,0), firma (+---). Se verifica ΛᵀηΛ=η.',
 '6-12':'Compara el orden de un boost axial y una traslación temporal. La escala cambia el intervalo, no su carácter nulo.',
 '6-13':'Unidades μ=κ=hbar=1. Se reconstruyen los Casimires a partir del estado ligado de número n.',
 '6-14':'Energías reducidas y degeneración orbital sin espín, para el potencial de Coulomb no relativista ideal.'
};
export function renderRamadevi(chapter,section,root){
 const cfg=configs[chapter][section-1],key=chapter+'-'+section;
 root.innerHTML=`<div class="lab cw-lab"><div class="viz"><div class="viz-header"><span>RAMADEVI Y DUBEY · CAPÍTULO ${chapter}</span><span class="viz-tag">CÁLCULO INTERACTIVO</span></div><div id="rd-viz"></div></div><div class="control-panel"><h3>Comprueba la estructura</h3><p class="helper">${help[key]}</p>${cfg.map(c=>range('rd-'+c[0],...c.slice(1))).join('')}<div id="rd-result" class="result-box" aria-live="polite"></div></div></div><div class="insight"><p><strong>Conecta el cálculo con la demostración.</strong>En Paso a paso se desarrollan las fórmulas y sus hipótesis. Las cantidades de los modelos físicos son idealizadas y las cifras numéricas se redondean.</p></div>`;
 const $=id=>root.querySelector('#rd-'+id),v=id=>Number($(id).value),charTable=[[1,1,1],[1,1,-1],[2,-1,0]],charNames=['A1','A2','E'];
 const points=(pts,other=[],labels=['Primera componente','Segunda componente'])=>plot({title:help[key],bounds:[-Math.max(2,...pts.concat(other).flat().map(Math.abs))-.3,Math.max(2,...pts.concat(other).flat().map(Math.abs))+.3,-Math.max(2,...pts.concat(other).flat().map(Math.abs))-.3,Math.max(2,...pts.concat(other).flat().map(Math.abs))+.3],points:[...pts.map((p,j)=>({xy:p,label:String(j+1),color:colors.original})),...other.map(p=>({xy:p,label:'Imagen',color:colors.changed}))],labels,equal:true});
 const cgTable=(a,b)=>{const A=R.cgMatrix(a,b),cols=R.coupledStates(a,b),rows=R.tensorStates(a,b);return table(['(m1,m2)',...cols.map(p=>p.join(';'))],A.map((r,j)=>[rows[j].join(';'),...r.map(x=>fmt(x,4))]));};
 function update(){cfg.forEach(c=>$(c[0]+'-value').textContent=fmt(v(c[0]),3));let visual='',out='';
 if(chapter===3){
  if(section===1){const s=v('a'),coords=[3-s,1];visual=points([[3,1],[1,0],[s,1]]);out=matrix([[1,s],[0,1]],'B')+P(`Coordenadas: (${coords.map(x=>fmt(x)).join('; ')}). Reconstrucción: (${fmt(coords[0]+s*coords[1])}; 1).`);}
  else if(section===2){const s=v('a'),A=R.realBasisChange(R.E[v('g')],s),G=[[1,s],[s,1+s*s]],U=R.mm(R.mm(R.adj(R.mat(A)),R.mat(G)),R.mat(A));visual=matrix(A,'D')+matrix(G,'G');out=P(`Error D†GD−G=${R.error(U,R.mat(G)).toExponential(2)}.`)+P(`Error D†D−I=${fmt(R.error(R.mm(R.adj(R.mat(A)),R.mat(A)),R.eye(2)),6)}.`);}
  else if(section===3){const g=v('g'),h=v('h'),A=R.E[g],C=R.mm(R.mat(A),R.mat(R.E[h]));visual=matrix(A,'D(g)')+matrix(R.E[h],'D(h)')+matrix(C,'D(g)D(h)');out=P(`${group[g]}·${group[h]}=${group[R.multiply(g,h)]}; error de la ley=${fmt(R.error(C,R.mat(R.E[R.multiply(g,h)])),10)}.`);}
  else if(section===4||section===10){const x=[v('a'),v('b'),v('c')],mean=x.reduce((a,b)=>a+b,0)/3,part=x.map(n=>n-mean);if(section===4){visual=table(['Sector','x','y','z'],[['Uniforme',mean,mean,mean],['Suma cero',...part]].map(r=>r.map(x=>typeof x==='number'?fmt(x):x)));out=P(`Producto escalar=${fmt(mean*part.reduce((a,b)=>a+b,0),10)}; suma de desviaciones=${fmt(part.reduce((a,b)=>a+b,0),10)}.`);}else{const A=R.projectors[v('g')],p=A.map(r=>r.reduce((sum,a,j)=>sum+a*x[j],0));visual=matrix(A,'P');out=P(`Imagen=(${p.map(x=>fmt(x)).join('; ')}); error P²−P=${fmt(R.error(R.mm(R.mat(A),R.mat(A)),R.mat(A)),10)}.`);}}
  else if(section===5){const g=v('g');visual=matrix([[1]],'A_1')+matrix([[g<3?1:-1]],'A_2')+matrix(R.E[g],'E');out=table(['Tipo','Carácter de '+group[g]],charNames.map((n,i)=>[n,charTable[i][g===0?0:g<3?1:2]]));}
  else if(section===6){visual=matrix(R.regular[v('g')],'D_{reg}');out=P(`Traza=${R.trace(R.regular[v('g')])}. Descomposición A1+A2+2E; dimensión seis.`);}
  else if(section===7){const g=v('g'),A=R.kron(R.mat(R.E[g]),R.mat(R.E[g]));visual=matrix(A,T`E(g)\otimes E(g)`);out=P(`Carácter=${complex(R.tr(A))}. En las tres clases: (4,1,0). Descomposición A1+A2+E.`);}
  else if(section===8){const A=charTable[v('a')],C=charTable[v('b')],terms=A.map((x,j)=>x*C[j]*[1,2,3][j]);visual=table(['Clase','Tamaño','Contribución'],terms.map((n,j)=>[['e','2 giros','3 espejos'][j],[1,2,3][j],n]));out=P(`Promedio=${fmt(terms.reduce((a,b)=>a+b,0)/6)}.`);}
  else if(section===9){const chars=[[3,0,1],[4,1,0],[6,0,0]][v('a')],m=R.decompose(chars);visual=table(['Tipo','Multiplicidad','Dimensión aportada'],m.map((n,j)=>[charNames[j],fmt(n),fmt(n*[1,1,2][j])]));out=P(`Carácter (${chars.join('; ')}), norma=${fmt(R.innerChars(chars,chars))}; dimensión=${chars[0]}.`);}
  else if(section===11){const sign=v('a')?-1:1,A=R.E[v('g')].map(r=>r.map(x=>x*sign));visual=matrix(A,T`E^{\pm}(g)`);out=P(`Dimensión dos; traza=${fmt(R.trace(A))}. El factor binario aporta un signo, no un estado adicional.`);}
  else if(section===12){const sign=v('a')?-1:1,A=R.induced(v('g'),sign),chars=R.inducedChars(sign);visual=matrix(A,T`\operatorname{Ind}(g)`);out=P(`Carácter=(${chars.join('; ')}); multiplicidades=${R.decompose(chars).map(x=>fmt(x)).join('; ')}.`);}
 }else if(chapter===5){
  if(section===1){const t=v('a'),n=v('b'),pts=Array.from({length:100},(_,j)=>[Math.cos(j*2*Math.PI/99),Math.sin(j*2*Math.PI/99)]);visual=plot({title:'Fases en la circunferencia unidad',bounds:[-1.3,1.3,-1.3,1.3],paths:[{data:pts}],points:[{xy:[Math.cos(t),Math.sin(t)],label:'Fase'},{xy:[Math.cos(n*t),Math.sin(n*t)],label:'Carácter',color:colors.changed}],equal:true});out=P(`Defecto tras 2π: ${fmt(Math.hypot(Math.cos(2*Math.PI*n)-1,Math.sin(2*Math.PI*n)),8)}. ${Number.isInteger(n)?'Peso entero: representación del círculo.':'Peso no entero: no desciende a U(1). '}`);}
  else if(section===2){const t=v('a'),N=R.mat([[0,1],[0,0]]),A=R.expm(N,t);visual=matrix(A,'e^{tN}');out=P(`Error frente a I+tN=${fmt(R.error(A,R.add(R.eye(2),N,t)),10)}.`);}
  else if(section===3){const t=v('a'),A=R.scale(R.pauli[0],R.z(0,-.5)),C=R.scale(R.pauli[2],R.z(0,-.5)),U=R.mm(R.expm(A,t),R.expm(C,t)),V=R.expm(R.add(A,C),t);visual=matrix(U,'e^{tA}e^{tB}')+matrix(V,'e^{t(A+B)}');out=P(`Diferencia=${fmt(R.error(U,V),8)}; norma del conmutador=${fmt(R.error(R.comm(A,C),R.scale(A,0)),6)}.`);}
  else if(section===4||section===12){const basis=section===4?R.pauli:R.gellMann,A=R.scale(basis[v('a')-1],.5),C=R.scale(basis[v('b')-1],.5);visual=matrix(A,'T_a')+matrix(C,'T_b')+matrix(R.comm(A,C),'[T_a,T_b]');out=P('Se muestran las partes reales e imaginarias; los coeficientes pequeños por redondeo se presentan como cero.');}
  else if(section===5||section===10){const K=section===5?(v('a')?[[0]]:[[-2,0,0],[0,-2,0],[0,0,-2]]):(v('a')?[[8,0,0],[0,0,4],[0,4,0]]:[[-2,0,0],[0,-2,0],[0,0,-2]]);visual=matrix(K,'K');out=P(section===5?(v('a')?'Abeliana: Killing degenerada.':'su2 compacta: Killing negativa definida.'):(v('a')?'sl2 real en base H,E,F: autovalores 8,4,−4; forma indefinida.':'su2 real compacta: tres autovalores negativos.'));}
  else if(section===6){const j=v('a'),A=R.spin(j);visual=matrix(A.jp,'J_+')+matrix(A.Jz,'J_z');out=P(`Dimensión=${A.ms.length}; error del Casimir=${fmt(R.error(A.casimir,R.scale(R.eye(A.ms.length),j*(j+1))),10)}.`);}
  else if(section===7){const i=v('a'),j=v('b'),a=R.weights3[i],b=R.weights3[j],d=a.map((x,k)=>x-b[k]);visual=points(R.weights3,[d],['T3','T8']);out=P(`Diferencia de pesos=(${d.map(x=>fmt(x)).join('; ')}). ${i===j?'Es cero: no es raíz no nula.':'Es una de las seis raíces.'}`);}
  else if(section===8){const j=v('a'),theta=v('b'),A=R.expm(R.scale(R.spin(j).Jz,R.z(0,-1)),theta);visual=matrix(A,T`U_j(\theta)`);out=P(`Error frente a I=${fmt(R.error(A,R.eye(A.length)),6)}; frente a −I=${fmt(R.error(A,R.scale(R.eye(A.length),-1)),6)}. Las marcas 2π y 4π se aproximan con el paso del control.`);}
  else if(section===9){const n=v('a');visual=table(['Grupo','Dimensión real'],[['O(n)',n*(n-1)/2],['U(n)',n*n],['SU(n)',n*n-1],['GL(n,R)',n*n],['SL(n,R)',n*n-1]]);out=P('Se cuenta la dimensión local del grupo. O(n) y GL(n,R) tienen componentes globales que este número no distingue.');}
  else if(section===11){const a=R.alpha[v('a')],image=R.roots.map(r=>{const dot=r[0]*a[0]+r[1]*a[1];return r.map((x,j)=>x-2*dot*a[j]);});visual=points(R.roots,image);out=P('Cada raíz reflejada coincide con otra raíz del mismo hexágono. Se usa igual escala en ambos ejes.');}
  else if(section===13){const t=v('a')*Math.PI/180,q=v('b'),A=[[1,0],[q*Math.cos(t),q*Math.sin(t)]],dot=(a,b)=>a.reduce((s,x,j)=>s+x*b[j],0),G=A.map(a=>A.map(b=>dot(a,b))),C=G.map((r,i)=>r.map(x=>2*x/G[i][i]));visual=matrix(G,'G')+matrix(C,'A');out=P(`Determinante=${fmt(C[0][0]*C[1][1]-C[0][1]*C[1][0],6)}. ${C.flat().every(x=>Math.abs(x-Math.round(x))<1e-8)?'Entradas enteras: aún deben comprobarse las restantes condiciones de un sistema de raíces.':'No es una matriz de Cartan cristalográfica: hay entradas no enteras.'}`);}
  else if(section===14){const p=v('a'),q=v('b'),w=R.highest(p,q);visual=points(R.weights3,[w]);out=B(T`d(p,q)=\frac{(p+1)(q+1)(p+q+2)}2`)+P(`Dimensión=${R.su3dim(p,q)}; mayor peso=(${w.map(x=>fmt(x)).join('; ')}); conjugada (${q},${p}).`);}
 }else{
  if(section===1){const J=R.spin(.5),H=R.add(R.scale(J.Jz,v('a')),R.scale(J.Jx,v('b')));visual=matrix(H,'H')+matrix(R.comm(H,J.Jz),'[H,J_z]');out=P(`Norma máxima del conmutador=${fmt(R.error(R.comm(H,J.Jz),R.scale(H,0)),6)}. Jz se conserva en este modelo si el conmutador es cero.`);}
  else if(section===2){const a=v('a'),b=v('b'),J=R.spins(a,b);visual=table(['Espín J','Dimensión'],J.map(j=>[j,2*j+1]));out=P(`Producto=${(2*a+1)*(2*b+1)}; suma=${J.reduce((s,j)=>s+2*j+1,0)}.`);}
  else if(section===3){const N=v('a'),rows=[[2],[1,1],[2,1],[1,1,1]][v('b')];visual=table(['Fila','Casillas'],rows.map((n,i)=>[i+1,'□ '.repeat(n)]));out=P(`Partición (${rows.join(',')}); dimensión=${R.youngDimension(N,rows)} para SU(${N}).`);}
  else if(section===4||section===5){const a=section===4?.5:v('a'),b=section===4?.5:v('b'),A=R.cgMatrix(a,b);visual=cgTable(a,b);out=P(`Error C†C−I=${fmt(R.error(R.mm(R.adj(R.mat(A)),R.mat(A)),R.eye(A.length)),10)}.`);if(section===4){const row=A[v('a')],states=R.coupledStates(.5,.5);out+=table(['J,M','Probabilidad'],row.map((x,j)=>[states[j].join(';'),fmt(x*x,6)]));}}
  else if(section===6){const J=v('a'),q=v('b'),Mp=.5+q,C=R.cg(.5,.5,1,q,J,Mp);visual=table(['J inicial','M inicial','k','q','J final','M final','CG'],[[.5,.5,1,q,J,Mp,fmt(C,6)]]);out=P(`Factor de probabilidad geométrico=${fmt(C*C,6)}. ${C===0?'Este elemento se anula por la geometría.':'La transición sigue dependiendo del elemento reducido y de otras reglas.'}`);}
  else if(section===7){const a=v('a'),p=R.cg(.5,.5,1,0,1.5,.5),n=R.cg(.5,-.5,1,1,1.5,.5);visual=table(['Canal','Amplitud','Módulo cuadrado'],[['p π0',fmt(a*p,6),fmt((a*p)**2,6)],['n π+',fmt(a*n,6),fmt((a*n)**2,6)]]);out=P(`Razón de cuadrados=${fmt(p*p/(n*n),6)} en el límite ideal declarado.`);}
  else if(section===8){const rows=R.quarkStates(3);visual=points(rows.map(r=>[r.I3,r.Y]));out=table(['Ocupación u,d,s','I3','Y','Q'],rows.filter(r=>r.s===v('a')).map(r=>[[r.u,r.d,r.s].join(','),r.I3,r.Y,fmt(r.Q)]));}
  else if(section===9){const pairs=R.weights3.flatMap(a=>R.weights3.map(b=>a.map((x,j)=>x-b[j])));visual=points(pairs);const a=v('a'),A=R.mat([[a,0,0],[0,1-a,0],[0,0,0]]),sing=R.scale(R.eye(3),1/3),oct=R.add(A,sing,-1),norm=a*a+(1-a)**2;out=P('Nueve estados producto: seis pesos no nulos y peso cero con multiplicidad tres. Para el estado diagonal A=diag(a,1−a,0), la traza separa el singlete del octeto.')+matrix(A,'A')+matrix(oct,'A_8')+P(`Norma al cuadrado del singlete=1/3; probabilidad normalizada=${fmt(1/(3*norm),6)}. La proyección cambia el estado, pero no las posiciones del diagrama de pesos.`);}
  else if(section===10){const e=v('a'),rows=R.branchingDecuplet();visual=table(['I','Y','Dimensión','E−E0'],rows.map(r=>[r.I,r.Y,r.dim,fmt(e*r.Y)]));out=P('Las cuatro dimensiones suman diez. Todos los estados de una fila comparten la energía del modelo.');}
  else if(section===11){const A=R.lorentz(v('a')),p=R.mat([[2],[1],[0],[0]]),im=R.mm(A,p),metric=R.mm(R.mm(R.adj(A),R.minkowski),A);visual=matrix(A,T`\Lambda`)+matrix(im,"x'");out=P(`Error ΛᵀηΛ−η=${fmt(R.error(metric,R.minkowski),10)}; intervalo=${fmt(im[0][0].r**2-im[1][0].r**2,8)}; v/c=${fmt(Math.tanh(v('a')),6)}.`);}
  else if(section===12){const a=v('a'),b=v('b'),s=v('c'),L=R.lorentz(a),p=R.mat([[2],[1],[0],[0]]),tr=R.mat([[b],[0],[0],[0]]),A=R.add(R.mm(L,p),tr),C=R.mm(L,R.add(p,tr));visual=matrix(A,T`\Lambda x+a`)+matrix(C,T`\Lambda(x+a)`);out=P(`Diferencia entre órdenes=${fmt(R.error(A,C),6)}. Factor del intervalo bajo escala=${fmt(Math.exp(2*s),6)}.`);}
  else if(section===13){const n=v('a'),H=R.hydrogen(n),j=H.j,I2=j*(j+1),sum=4*I2,M2=-1/(2*H.energy)-1;visual=table(['Cantidad reducida','Valor'],[['E',H.energy],['I²=K²',I2],['L²+M²',sum],['κ²/(−2E)−1',M2]].map(r=>[r[0],fmt(r[1],6)]));out=P(`Error entre ambas reconstrucciones=${fmt(Math.abs(sum-M2),10)}. El valor es un Casimir combinado, no cada momento orbital individual.`);}
  else if(section===14){const n=v('a'),H=R.hydrogen(n);visual=table(['n','E (unidades μ=κ=hbar=1)','Degeneración orbital'],Array.from({length:8},(_,j)=>{const x=R.hydrogen(j+1);return[j+1,fmt(x.energy,6),x.degeneracy];}));out=table(['l','Estados 2l+1'],H.ls.map(r=>[r.l,r.dim]))+P(`Para n=${n}, total=${H.degeneracy}; j de cada su2=${H.j}.`);}
 }
 $('viz').innerHTML=visual;$('result').innerHTML=out;
 }
 root.querySelectorAll('input').forEach(el=>el.addEventListener('input',update));update();
}
