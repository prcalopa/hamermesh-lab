import * as M from './emc-math.mjs';
import {range,fmt,plot,colors} from './arrigo.mjs';
import {tex} from './math.mjs';
const T=String.raw,B=s=>tex(s,true),P=s=>`<p>${s}</p>`,f=(x,n=4)=>x===null||Number.isNaN(x)?'No definido':x===Infinity?'∞':fmt(x,n);
const table=(heads,rows)=>`<div class="emc-table-wrap"><table class="emc-table"><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${typeof x==='number'?f(x):x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const bars=(values,labels,title)=>{const max=Math.max(0,...values),min=Math.min(0,...values),span=max-min||1,width=500/values.length,Y=v=>300-240*(v-min)/span,zero=Y(0);return `<svg class="lie-plot" viewBox="0 0 560 350" role="img" aria-label="${title}"><text x="30" y="24" fill="#d9e2f4">${title}</text><path d="M30 50V300M30 ${zero}H540" stroke="#8794b4" fill="none"/>${values.map((v,i)=>`<rect x="${31+i*width}" y="${Math.min(zero,Y(v))}" width="${Math.max(1,width-3)}" height="${Math.abs(zero-Y(v))}" fill="#c3b6ff"/><text x="${31+(i+.5)*width}" y="321" text-anchor="middle" fill="#d9e2f4">${labels[i]??i+1}</text>`).join('')}<text x="35" y="43" fill="#d9e2f4">Rango: ${f(min,3)} a ${f(max,3)}</text></svg>`;};
const C=(id,label,min,max,step,value)=>[id,label,min,max,step,value];
export const emcLabConfigs={
 1:[
 [C('a','Número de sensores',10,1000,10,100),C('b','Registros por segundo y sensor',1,20,1,2)],
 [C('a','Lecturas del primer grupo',10,90,10,10)],
 [C('a','Fracción del tipo con media 20 en la muestra',.1,.9,.1,.9),C('b','Número de registros',10,10000,10,100)],
 [C('a','Predicción constante',0,15,.25,5)],
 [C('a','Valores ausentes entre 1000',0,200,1,20),C('b','Filas duplicadas entre 1000',0,200,1,10)],
 [C('a','Fracción fácil para A',0,1,.05,.1),C('b','Fracción fácil para B',0,1,.05,.9)]
 ],
 2:[
 [C('a','MAE de referencia',.5,5,.1,2.4),C('b','MAE del candidato',.1,5,.1,1.8)],
 [C('a','Valor de prueba que no debe ajustar la imputación',10,100,1,100)],
 [C('a','Porcentaje para entrenamiento',40,80,5,60)],
 [C('a','Complejidad c',1,20,.25,8)],
 [C('a','Diferencia estimada',-3,5,.1,2),C('b','Error estándar',.1,2,.1,1)],
 [C('a','Cambio de media de X',-1,2,.1,1),C('b','Nueva pendiente de Y dado X',1,4,.1,2)],
 [C('a','Contrastes independientes',1,100,1,20)],
 [C('a','Número de nodos',4,20,1,8),C('b','Fracción de aristas posibles',0,1,.05,.35)]
 ],
 3:[
 [C('a','Posición que se declara ausente (1–4)',1,4,1,3)],
 [C('a','Lectura extrema',12,100,1,40)],
 [C('a','Factor de escala',.5,10,.5,2),C('b','Traslación de unidades',-5,5,.5,1)],
 [C('a','Última observación',5,1000,5,100)],
 [C('a','Número de intervalos',3,16,1,7)],
 [C('a','Componente lineal en y=x²+ax',-3,3,.1,0)],
 [C('a','Tamaño n',5,80,5,20),C('b','Probabilidad p',.1,.9,.1,.3)],
 [C('a','Tamaño por muestra',5,100,5,25),C('b','Nivel de confianza',.8,.99,.01,.95)],
 [C('a','Desplazamiento del segundo grupo',-3,5,.25,2)],
 [C('a','Desplazamiento del segundo grupo',-4,4,1,0)],
 [C('a','Observaciones por grupo',4,200,2,64),C('b','Diferencia real δ',0,2,.1,1)],
 [C('a','Separación entre medias',0,4,.25,2)],
 [C('a','Celda concordante de una tabla simétrica',5,45,1,30)],
 [C('a','Inicio del eje vertical',0,97,1,0)]
 ],
 4:[
 [C('a','Factor de escala del segundo eje',.2,8,.2,1)],
 [C('a','Número de grupos k',1,6,1,3)],
 [C('a','Coordenada x del punto',-3,3,.1,-.1),C('b','Coordenada y del punto',-2,2,.1,1)],
 [C('a','Centro candidato',0,7,.1,4)],
 [C('a','Iteración tras actualizar',1,12,1,1),C('b','Semilla de inicialización',1,12,1,1)],
 [C('a','Penalización por grupo λ',0,40,1,10)],
 [C('a','Factor de escala del segundo eje',.2,8,.2,4),C('b','Estandarizar (0=no, 1=sí)',0,1,1,0)],
 [C('a','Radio ε',.2,2,.1,.8),C('b','Mínimo de puntos, incluido el propio',2,8,1,4)]
 ],
 5:[
 [C('a','Conjunto (0=A, 1=B, 2=AB, 3=ABC, 4=D)',0,4,1,2)],
 [C('a','P(A)',.1,.9,.1,.2),C('b','P(B dado A)',.1,.9,.1,.8),C('c','P(B dado no A)',.1,.9,.1,.8)],
 [C('a','P(B dado A)',.1,1,.1,.6)],
 [C('a','Soporte mínimo',.1,.8,.05,.3)],
 [C('a','Soporte mínimo',.1,.8,.05,.25)],
 [C('a','Intercambiar regla (0=A→C, 1=C→A)',0,1,1,0)],
 [C('a','Antecedentes en prueba',10,200,10,10),C('b','Fracción con consecuente',.1,.9,.1,.8)],
 [C('a','Número de transacciones',100,5000,100,1000),C('b','Casos conjuntos, ambos elementos solo aquí',1,10,1,1)]
 ],
 6:[
 [C('a','Coeficiente cuadrático omitido',0,1,.1,.5)],
 [C('a','Pendiente candidata',0,3,.1,1),C('b','Intercepto candidato',-1,3,.1,1)],
 [C('a','Perturbación que separa x2 de 2x1',.01,1,.01,.2)],
 [C('a','Escala del ruido',.2,3,.2,1)],
 [C('a','Grado polinómico',1,9,1,3)],
 [C('a','Curvatura omitida',0,1,.1,.3),C('b','Crecimiento de dispersión con |x|',0,2,.2,.6)],
 [C('a','Cambio de respuesta en el punto extremo',0,12,.5,5)],
 [C('a','Nueva entrada x0',-5,5,.25,0)],
 [C('a','Intercepto logístico',-4,4,.2,0),C('b','Pendiente logística',-2,2,.1,1)],
 [C('a','Intercepto logístico',-3,3,.2,0),C('b','Pendiente logística',-3,3,.2,1)],
 [C('a','Umbral de decisión',0,1,.05,.5)],
 [C('a','Penalización ridge λ',0,20,.5,2)]
 ],
 7:[
 [C('a','Corte del tocón',-1.5,1.5,.1,0)],
 [C('a','Fracción positiva en una hoja',0,1,.02,.8)],
 [C('a','Corte candidato',-1.5,1.5,.1,0)],
 [C('a','Penalización por hoja α',0,.03,.001,.01)],
 [C('a','Mínimo de observaciones por hoja',1,8,1,3)],
 [C('a','Prevalencia (%)',.02,20,.02,1),C('b','Sensibilidad',.5,1,.01,1),C('c','Falsa alarma',.001,.1,.001,.01)],
 [C('a','Probabilidad previa positiva',.1,.9,.05,.4),C('b','P(indicio 1 dado positivo)',.1,.9,.05,.8)],
 [C('a','Pseudocuenta α',0,3,.1,1),C('b','Observaciones en categoría 1 de diez',0,10,1,10)],
 [C('a','Copias de la misma señal',1,8,1,1)],
 [C('a','Umbral de decisión',0,1,.05,.5)],
 [C('a','Umbral de decisión',0,1,.05,.5),C('b','Invertir ordenación (0=no, 1=sí)',0,1,1,0)],
 [C('a','Coste de falsa alarma',1,10,1,1),C('b','Coste de omisión',1,20,1,9)]
 ]};
const palette=['#c3b6ff','#6ce2bc','#ffac95','#8bbcff','#e9dc85','#d79edc'];
function scatter(data,labels=[],centers=[],title='Observaciones y grupos'){
 const xs=data.map(p=>p[0]),ys=data.map(p=>p[1]),dx=Math.max(...xs)-Math.min(...xs)||1,dy=Math.max(...ys)-Math.min(...ys)||1;
 return plot({title,bounds:[Math.min(...xs)-.12*dx,Math.max(...xs)+.12*dx,Math.min(...ys)-.15*dy,Math.max(...ys)+.15*dy],points:[...data.map((xy,i)=>({xy,r:4,label:'',color:labels[i]===-1?'#8791a7':palette[(labels[i]??0)%palette.length]})),...centers.map((xy,i)=>({xy,r:9,label:'C'+(i+1),color:palette[i%palette.length]}))],labels:['x','y']});
}
const line=(fn,a=-3,b=3,n=100)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return [x,fn(x)];});
// The shared plotter breaks long jumps to avoid drawing across poles. Statistical
// segments (intervals and ROC steps) are continuous: subdivide them geometrically.
const drawLines=(paths,bounds,labels=['x','y'],points=[])=>{
 const dense=data=>data.flatMap((p,i)=>{if(!i)return[p];const a=data[i-1],steps=Math.max(1,Math.ceil(Math.max(Math.abs(p[0]-a[0])*490/(bounds[1]-bounds[0]),Math.abs(p[1]-a[1])*318/(bounds[3]-bounds[2]))/40));return Array.from({length:steps},(_,j)=>a.map((v,k)=>v+(p[k]-v)*(j+1)/steps));});
 return plot({title:labels.join(' frente a '),bounds,paths:paths.map((data,i)=>({data:dense(data),color:palette[i%palette.length]})),labels,points});
};
const polynomial=(x,d)=>Array.from({length:d+1},(_,j)=>x**j);
const fittedPlot=(x,y,beta)=>{const a=Math.min(...x),b=Math.max(...x),path=line(z=>M.sum(beta.map((c,j)=>c*z**j)),a,b),yy=[...y,...path.map(p=>p[1])],lo=Math.min(...yy),hi=Math.max(...yy),pad=(hi-lo)*.1||1;return drawLines([path],[a-.2,b+.2,lo-pad,hi+pad],['Entrada x','Respuesta y'],x.map((z,i)=>({xy:[z,y[i]],r:4,color:colors.changed})));};
const loss=(a,b)=>M.mean(a.map((v,i)=>(v-b[i])**2));
const binaryData=(n,seed)=>{const x=M.sample(n,seed).map(v=>Math.max(-2.5,Math.min(2.5,v))),r=M.rng(seed+10),y=x.map(v=>r()<M.sigmoid(1.3*v)?1:0);return {x,y};};
const cmTable=c=>table(['Clase real ↓ / Predicción →','Positiva','Negativa'],[['Positiva',c.tp,c.fn],['Negativa',c.fp,c.tn]]);
const cmStats=c=>table(['Medida','Valor'],[['Exactitud',f(c.accuracy)],['Precisión positiva',f(c.precision)],['Recobrado / TPR',f(c.recall)],['FPR',f(c.fpr)],['FNR',f(c.fnr)],['F1',f(c.f1)]]);
export function renderEMC(chapter,section,root){
 const cfg=emcLabConfigs[chapter][section-1];
 root.innerHTML=`<div class="lab cw-lab emc-lab"><div class="viz"><div class="viz-header"><span>EMC · CAPÍTULO ${chapter}</span><span class="viz-tag">DATOS SINTÉTICOS</span></div><div id="emc-viz"></div></div><div class="control-panel"><h3>Calcula y compara</h3><p class="helper">Mueve los controles y contrasta el resultado con el problema desarrollado en Paso a paso.</p>${cfg.map(c=>range('emc-'+c[0],...c.slice(1))).join('')}<div class="result-box" id="emc-result" aria-live="polite"></div></div></div><div class="insight"><p><strong>Comprueba también los supuestos.</strong>Datos y parámetros didácticos reproducibles. Una gráfica ilustra el modelo declarado; la inferencia requiere las condiciones explicadas en los apuntes. El código R se muestra en las secciones donde ayuda a repetir el cálculo.</p></div>`;
 const $=id=>root.querySelector('#emc-'+id),v=id=>Number($(id).value);
 function update(){cfg.forEach(c=>$(c[0]+'-value').textContent=f(v(c[0]),3));let visual='',out='';
 if(chapter===1){
  if(section===1){const rate=v('a')*v('b')*200;visual=bars([rate*3600/1e9,rate*86400/1e9,3*rate*86400/1e9],['1 h','1 día','3 copias'],'Volumen en GB decimales');out=P(`Flujo: ${f(rate,0)} bytes/s. Tamaño fijo por registro: 200 bytes. Un día: ${f(rate*86400/1e9,4)} GB. No se incluyen cabeceras ni compresión.`);}
  else if(section===2){const a=v('a'),m=(20*a+30*(100-a))/100;visual=bars([20,30,m],['Grupo 1','Grupo 2','Global'],'Medias ponderadas');out=P(`Tamaños: ${a} y ${100-a}. Media conjunta=${f(m)}. Media de las dos medias sin ponderar=25; solo coincide si los tamaños son iguales.`);}
  else if(section===3){const p=v('a'),n=v('b'),m=10+10*p,bias=m-15,variance=100*p*(1-p)/n;visual=drawLines([line(x=>100*p*(1-p)/x+bias*bias,10,10000,100)], [10,10000,0,Math.max(17,bias*bias+2)],['n','ECM']);out=P(`Media de registros=${f(m)} frente a población 15. Sesgo=${f(bias)}; varianza de la media=${f(variance,6)}; ECM=${f(variance+bias*bias,6)}. Modelo: mezcla independiente con valores exactos 10 y 20.`);}
  else if(section===4){const data=[1,2,3,14],a=v('a');visual=drawLines([line(x=>M.sum(data.map(y=>(y-x)**2)),0,15),line(x=>M.sum(data.map(y=>Math.abs(y-x))),0,15)],[0,15,0,400],['Predicción','Pérdida total']);out=table(['Criterio','Con predicción actual'],[['Cuadrados',M.sum(data.map(y=>(y-a)**2))],['Absolutos',M.sum(data.map(y=>Math.abs(y-a)))],['Media',M.mean(data)],['Mediana de convenio',M.median(data)]]);}
  else if(section===5){const a=v('a'),b=v('b');visual=bars([1-a/1000,1-b/1000],['Completitud','Unicidad'],'Indicadores entre 0 y 1');out=P(`Al menos un problema: entre ${Math.max(a,b)} y ${Math.min(1000,a+b)} filas. Ese intervalo depende de un solapamiento que no se ha observado. No se suman las dos tasas como una calidad única.`);}
  else{const a=.9*v('a')+.6*(1-v('a')),b=.8*v('b')+.5*(1-v('b'));visual=bars([a,b,.75,.65],['A mezcla','B mezcla','A común','B común'],'Tasas agregadas y mezcla común 50/50');out=P(`A=${f(a)}, B=${f(b)}. Dentro de ambos grupos A supera a B por 0,1. ${a<b?'La composición invierte el orden agregado.':'En esta mezcla no se invierte el orden.'} La estandarización común da 0,75 frente a 0,65.`);}
 }else if(chapter===2){
  if(section===1){const a=v('a'),b=v('b');visual=bars([a,b],['Referencia','Candidato'],'MAE en unidades de la respuesta');out=P(`Reducción absoluta=${f(a-b)}. Reducción relativa=${f((a-b)/a*100,2)} %. Un valor negativo indica empeoramiento. Las cifras son un escenario y no una validación empírica.`);}
  else if(section===2){const wrong=(12+v('a'))/4;visual=bars([4,wrong],['Solo entren.','Con prueba'],'Valor de imputación');out=P(`Entrenamiento: 2,4,6; media=4. La media contaminada con la observación de prueba sería ${f(wrong)}. La prueba debe transformarse usando la primera.`);}
  else if(section===3){const train=200*v('a')/100,remaining=200-train;visual=bars([train,remaining/2,remaining/2],['Entrenar','Validar','Prueba'],'Reparto de 200 observaciones');out=P(`Entrenamiento=${train}, validación=${remaining/2}, prueba=${remaining/2}. Si hay veinte sensores con diez lecturas cada uno, esos tamaños deben aproximarse asignando sensores completos. El objetivo de uso decide la unidad de separación.`);}
  else if(section===4){const c=v('a');visual=drawLines([line(x=>9/x,1,20),line(x=>.15*x,1,20),line(x=>1+9/x+.15*x,1,20)],[1,20,0,12],['Complejidad','Error esperado']);out=table(['Componente ilustrativa','Valor'],[['Sesgo²',9/c],['Varianza',.15*c],['Ruido',1],['Total',1+9/c+.15*c]])+P('Violeta: sesgo²; verde: varianza; naranja: total. Son funciones didácticas declaradas.');}
  else if(section===5){const a=v('a'),se=v('b'),lo=a-1.96*se,hi=a+1.96*se;visual=drawLines([[[lo,0],[hi,0]],[[3,-1],[3,1]]],[-7,10,-1.5,1.5],['Diferencia',''],[{xy:[a,0],label:'Estimación',color:colors.changed}]);out=P(`Intervalo normal aproximado 95 %: [${f(lo)}; ${f(hi)}]. Mejora mínima útil ilustrativa: 3. ${lo>3?'Todo el intervalo supera ese criterio.':hi<3?'Todo el intervalo queda por debajo.':'El intervalo contiene valores a ambos lados del criterio.'}`);}
  else if(section===6){const x=M.sample(100,19,v('a')),noise=M.sample(100,71),y=x.map((z,i)=>1+v('b')*z+noise[i]),pred=x.map(z=>1+2*z);visual=scatter(x.map((z,i)=>[z,y[i]]));out=P(`Pérdida del predictor antiguo 1+2x: MSE=${f(loss(y,pred))}. Nueva media de entrada=${f(M.mean(x))}; nueva pendiente=${f(v('b'))}. El ruido mantiene la misma secuencia y escala para aislar ambos cambios.`);}
  else if(section===7){const m=v('a');visual=drawLines([line(x=>1-.95**x,1,100)],[1,100,0,1],['Pruebas','Probabilidad familiar']);out=P(`Con ${m} nulas independientes a nivel 0,05, P(al menos un rechazo)=${f(1-.95**m)}. Bonferroni da cota min(1,mα)=${f(Math.min(1,.05*m))}. No es la proporción de hallazgos falsos entre positivos.`);}
  else{const n=v('a'),max=n*(n-1)/2,m=Math.round(max*v('b'));visual=table(['Nodos','Aristas','Máximo posible'],[[n,m,max]]);out=P(`Grado medio=${f(2*m/n)}; densidad=${f(m/max)}; suma de grados=${2*m}. Se supone grafo simple, no dirigido y sin bucles. La fracción elegida se redondea a un número entero de aristas.`);}
 }else if(chapter===3){
  if(section===1){const all=[2,4,6,8],i=v('a')-1,observed=all.filter((_,j)=>j!==i);visual=bars(all,all.map((_,j)=>j===i?'Ausente':String(j+1)),'Valores originales antes de ocultar');out=P(`Vector observado: ${all.map((x,j)=>j===i?'NA':x).join(', ')}. Posiciones=4, presentes=3; media observada=${f(M.mean(observed))}; media completa=5. Omitir NA cambia el denominador y puede cambiar la estimación.`);}
  else if(section===2||section===4){const a=section===2?[9,10,10,11,12,v('a')]:[1,2,3,4,v('a')],q1=M.quantile(a,.25),q3=M.quantile(a,.75),mad=M.median(a.map(x=>Math.abs(x-M.median(a))));visual=bars(a,a.map((_,i)=>String(i+1)),'Lecturas de la muestra');out=table(['Resumen','Valor'],[['Media',M.mean(a)],['Mediana',M.median(a)],['Q1',q1],['Q3',q3],['RIC',q3-q1],['MAD sin escala',mad],['Cerca inferior',q1-1.5*(q3-q1)],['Cerca superior',q3+1.5*(q3-q1)]]);}
  else if(section===3){const a=[1,2,3],y=a.map(x=>v('a')*x+v('b'));visual=bars(y,['1','2','3'],'Muestra transformada');out=table(['Resumen','Original','Transformado'],[['Media',M.mean(a),M.mean(y)],['Varianza n−1',M.variance(a),M.variance(y)],['Varianza divisor n',M.variance(a,0),M.variance(y,0)]])+P(`Comprobación s² transformada=a²s² original: ${f(v('a')**2*M.variance(a))}.`);}
  else if(section===5){const a=M.sample(120,28).map(x=>Math.exp(.65*x)),h=M.histogram(a,v('a'));visual=bars(h.map(r=>r.density),h.map((_,i)=>String(i+1)),'Densidad por intervalo; anchuras iguales');out=P(`Suma de áreas=${f(M.sum(h.map(r=>r.density*(r.hi-r.lo))),8)}. Muestra fija de 120 valores lognormales sintéticos.`)+table(['Intervalo','Recuento','Densidad'],h.map(r=>[`${f(r.lo,2)}–${f(r.hi,2)}`,r.n,r.density]));}
  else if(section===6){const x=[-2,-1,0,1,2],y=x.map(t=>t*t+v('a')*t);visual=scatter(x.map((z,i)=>[z,y[i]]));out=P(`Correlación de Pearson=${f(M.correlation(x,y),6)}. Con a=0, y=x² sigue siendo una función exacta de x aunque la correlación lineal sea cero.`);}
  else if(section===7){const n=v('a'),p=v('b'),prob=M.binomial(n,p);visual=bars(prob,prob.map((_,i)=>i%Math.max(1,Math.round(n/8))===0?f(i/n,2):''),'Masa binomial de la proporción k/n');out=P(`Suma de probabilidades=${f(M.sum(prob),8)}; E(proporción)=${f(p)}; error estándar=${f(Math.sqrt(p*(1-p)/n),6)}. La variable sigue siendo discreta; altura=masa por resultado, no densidad continua.`);}
  else if(section===8){const n=v('a'),level=v('b'),z=M.normalQuantile((1+level)/2),half=z/Math.sqrt(n),means=Array.from({length:50},(_,i)=>M.mean(M.sample(n,500+i))),cover=means.filter(m=>Math.abs(m)<=half).length,limit=Math.max(1,...means.slice(0,20).map(m=>Math.abs(m)+half))+.1;visual=drawLines(means.slice(0,20).map((m,i)=>[[i+1,m-half],[i+1,m+half]]),[0,21,-limit,limit],['Muestra','Intervalo para μ=0']);out=P(`Normal N(0,1), sigma conocida. Semiamplitud=${f(half)}; cobertura observada en 50 muestras=${cover}/50=${f(cover/50)}. Nivel nominal=${f(level)}. El resultado empírico puede diferir del nominal.`);}
  else if(section===9){const a=[10,11,9,12,8],b=[10,11,8,12,9].map(x=>x+v('a')),w=M.welch(a,b);visual=bars([M.mean(a),M.mean(b)],['A','B'],'Medias de dos grupos independientes');out=table(['Welch bilateral','Valor'],[['Diferencia A−B',w.difference],['Error estándar',w.se],['t',w.t],['Grados aproximados',w.df],['Valor p',w.p]])+P('Se mantienen las dispersiones y se desplaza B. p no es la probabilidad posterior de la nula.');}
  else if(section===10){const a=[1,2,3,4],b=[5,6,7,8].map(x=>x+v('a')),w=M.wilcoxon(a,b);visual=table(['Grupo','Valores','Rangos medios'],[['A',a.join(', '),w.ranks.slice(0,4).join(', ')],['B',b.join(', '),w.ranks.slice(4).join(', ')]]);out=P(`U=${f(w.U)}; p bilateral exacto por etiquetas intercambiables=${f(w.p,6)}. Se enumeran ${w.total} asignaciones; empates conservan rangos medios. La interpretación de medianas exige hipótesis adicionales.`);}
  else if(section===11){const n=v('a'),delta=v('b');visual=drawLines([line(x=>M.power(x,delta,2,.05),4,200)],[4,200,0,1],['n por grupo','Potencia']);out=P(`Potencia normal bilateral=${f(M.power(n,delta,2,.05),6)}, sigma conocida=2, α=0,05 y δ=${f(delta)}. Para δ=0 la probabilidad de rechazo es α. No es una potencia t de Welch exacta.`);}
  else if(section===12){const d=v('a'),groups=[[-1,0,1],[-1+d,d,1+d],[-1+2*d,2*d,1+2*d]],a=M.anova(groups);visual=bars(groups.map(M.mean),['G1','G2','G3'],'Medias de grupos');out=table(['ANOVA clásico','Valor'],[['SC entre',a.between],['SC dentro',a.within],['SC total',a.total],['F',a.F],['Grados numerador',a.df1],['Grados denominador',a.df2],['Valor p',a.p]]);}
  else if(section===13){const a=v('a'),t=[[a,50-a],[50-a,a]],c=M.chiSquare(t);visual=table(['Real ↓ / Categoría →','C1','C2'],[['F1',...t[0]],['F2',...t[1]]]);out=P(`Todos los esperados=25. χ²=${f(c.stat)}, grados=${c.df}, p=${f(c.p,6)}. Sin corrección de continuidad; datos categóricos independientes.`);}
  else{const start=v('a');visual=bars([98-start,100-start],['98','100'],`Altura visible desde ${start}`);out=P(`Valores reales: 98 y 100. Diferencia=2; cambio relativo=${f(2/98*100,2)} %. Razón de alturas visibles=${f((100-start)/(98-start),3)}, que no es la razón de valores ${f(100/98,3)}. El inicio del eje debe declararse.`);}
 }else if(chapter===4){
  if([1,2,5,7].includes(section)){let data=M.clusterData(section===1||section===7?v('a'):1);if(section===7&&v('b'))data=M.standardize(data);const k=section===2?v('a'):3,history=M.kmeans(data,k,section===5?v('b'):1),step=section===5?v('a')-1:11,h=history[step];visual=scatter(data,h.labels,h.centers);out=P(`k=${k}; WSS después de actualizar=${f(h.wss,6)}; silueta media=${f(M.mean(M.silhouette(data,h.labels)))}.`);if(section===5)out+=table(['Iteración','WSS'],history.map((h,i)=>[i+1,h.wss]));if(section===7)out+=P('La estandarización usa media y desviación muestral de esta nube. El índice cambia porque cambia la métrica.');}
  else if(section===3){const p=[v('a'),v('b')],d1=M.distance2(p,[-2,0]),d2=M.distance2(p,[2,0]);visual=drawLines([[[0,-2],[0,2]]],[-3.5,3.5,-2.5,2.5],['x','y'],[{xy:[-2,0],label:'C1'},{xy:[2,0],label:'C2'},{xy:p,label:'P',color:colors.original}]);out=P(`d²(P,C1)=${f(d1)}; d²(P,C2)=${f(d2)}. Se asigna a ${d1<=d2?'C1':'C2'}; en empate se elige C1. La frontera es x=0.`);}
  else if(section===4){const data=[1,2,6],a=v('a'),cost=M.sum(data.map(x=>(x-a)**2));visual=drawLines([line(x=>M.sum(data.map(y=>(y-x)**2)),0,7)],[0,7,0,70],['Centro','Suma de cuadrados'],[{xy:[a,cost],label:'Candidato'}]);out=P(`Media=3; mínimo=14; J(${f(a)})=${f(cost)}. Identidad: 14+3(a−3)²=${f(14+3*(a-3)**2)}.`);}
  else if(section===6){const data=M.clusterData(),values=Array.from({length:6},(_,j)=>Math.min(...[1,2,3,4].map(seed=>M.kmeans(data,j+1,seed).at(-1).wss))),cost=values.map((x,i)=>x+v('a')*(i+1)),best=cost.indexOf(Math.min(...cost))+1;visual=drawLines([values.map((x,i)=>[i+1,x]),cost.map((x,i)=>[i+1,x])],[1,6,0,Math.max(...cost)*1.1],['k','Coste']);out=table(['k','Mejor WSS de 4 inicios','WSS+λk'],values.map((x,i)=>[i+1,x,cost[i]]))+P(`Preferencia bajo este criterio ilustrativo: k=${best}. Violeta: WSS; verde: penalizado. No es una prueba de número verdadero de clases.`);}
  else{const data=M.clusterData(),labels=M.dbscan(data,v('a'),v('b')),k=new Set(labels.filter(x=>x>=0)).size;visual=scatter(data,labels);out=P(`Grupos=${k}; ruido=${labels.filter(x=>x===-1).length} de ${data.length}. Gris: ruido. Vecindad incluye el propio punto; ε=${f(v('a'))}, minPts=${v('b')}.`);}
 }else if(chapter===5){
  if(section===1){const sets=[['A'],['B'],['A','B'],['A','B','C'],['D']],s=sets[v('a')],count=M.baskets.filter(row=>s.every(x=>row.includes(x))).length;visual=table(['Transacción','Elementos','Contiene conjunto'],M.baskets.map((b,i)=>[i+1,b.join(', '),s.every(x=>b.includes(x))?'Sí':'No']));out=P(`Conjunto {${s.join(',')}}: ${count}/12, soporte=${f(count/12)}. Elementos son indicadores binarios de presencia.`);}
  else if(section===2||section===3){const pa=section===2?v('a'):.5,ba=section===2?v('b'):v('a'),bna=section===2?v('c'):.2,pb=pa*ba+(1-pa)*bna,joint=pa*ba,confidence=ba,lift=ba/pb,leverage=joint-pa*pb,conviction=pb===1?null:ba===1?Infinity:(1-pb)/(1-ba);visual=table(['Proporción ↓','B','No B'],[['A',joint,pa-joint],['No A',(1-pa)*bna,(1-pa)*(1-bna)]]);out=table(['Medida de A→B','Valor'],[['Soporte conjunto',joint],['P(B)',pb],['Confianza',confidence],['Lift',lift],['Leverage',leverage],['Conviction',f(conviction)]]);}
  else if(section===4||section===5){const a=M.apriori(M.baskets,v('a'));visual=table(['Nivel','Candidatos','Frecuentes'],a.levels.map(l=>[l.k,l.candidates.map(s=>s.join('')).join(', ')||'—',l.frequent.map(s=>s.join('')).join(', ')||'Ninguno']));out=table(['Conjunto frecuente','Soporte'],a.result.map(r=>[r.items.join(''),r.support]))+P('Se podan candidatos si un subconjunto inmediato no es frecuente. Las cestas originales permanecen fijas.');}
  else if(section===6){const invert=v('a'),r=M.rule(invert?['C']:['A'],invert?['A']:['C']);visual=table(['Regla','Soporte conjunto','Confianza','Lift'],[['A→C',M.rule(['A'],['C']).joint,M.rule(['A'],['C']).confidence,M.rule(['A'],['C']).lift],['C→A',M.rule(['C'],['A']).joint,M.rule(['C'],['A']).confidence,M.rule(['C'],['A']).lift]]);out=P(`Regla elegida: ${invert?'C→A':'A→C'}. Soporte del antecedente=${f(r.sx)}; confianza=${f(r.confidence)}; lift=${f(r.lift)}. La frecuencia conjunta se conserva al invertir, pero cambia el denominador condicional.`);}
  else if(section===7){const n=v('a'),s=Math.round(n*v('b')),w=M.wilson(s,n);visual=drawLines([[[w[0],0],[w[1],0]]],[0,1,-1,1],['Confianza',''],[{xy:[s/n,0],label:'Estimación'}]);out=P(`${s} éxitos entre ${n} antecedentes; confianza=${f(s/n)}. Wilson 95 %=[${f(w[0])}; ${f(w[1])}]. Para una regla fijada antes de observar la muestra y unidades independientes; no corrige búsqueda múltiple.`);}
  else{const n=v('a'),c=v('b'),p=c/n;visual=table(['Total','A','B','A y B'],[[n,c,c,c]]);out=P(`Soporte=${f(p,6)}; confianza=1; lift=n/c=${f(n/c,2)}; leverage=${f(p-p*p,6)}. Solo hay ${c} coocurrencias: una razón grande no garantiza estabilidad.`);}
 }else if(chapter===6){
  if(section===1){const {x,y}=M.regressionData(v('a')),fit=M.ols(x.map(t=>[1,t]),y);visual=fittedPlot(x,y,fit.beta);out=P(`Recta ajustada: intercepto=${f(fit.beta[0])}, pendiente=${f(fit.beta[1])}. SSE=${f(fit.sse)}; curvatura real omitida=${f(v('a'))}. Verde: observaciones; violeta: recta. La normalidad no es necesaria para calcular este ajuste.`);}
  else if(section===2){const x=[0,1,2],y=[1,2,5],a=v('a'),b=v('b'),fit=M.ols(x.map(z=>[1,z]),y),res=x.map((z,i)=>y[i]-b-a*z);visual=fittedPlot(x,y,[b,a]);out=P(`SSE candidata=${f(M.sum(res.map(x=>x*x)))} frente a mínimo=${f(fit.sse)}. Recta óptima: intercepto=${f(fit.beta[0])}, pendiente=${f(fit.beta[1])}. Suma residual candidata=${f(M.sum(res))}.`);}
  else if(section===3){const {x}=M.regressionData(),e=M.sample(x.length,311),x2=x.map((t,i)=>2*t+v('a')*e[i]),y=x.map((t,i)=>1+t+.5*x2[i]+.4*Math.sin(i)),fit=M.ols(x.map((t,i)=>[1,t,x2[i]]),y);visual=scatter(x.map((t,i)=>[t,x2[i]]));out=table(['Coeficiente','Estimación','Error estándar homocedástico'],fit.beta.map((b,i)=>[['Intercepto','x1','x2'][i],b,Math.sqrt(fit.cov[i][i])]))+P(`Correlación x1,x2=${f(M.correlation(x,x2),6)}. Perturbación pequeña implica casi dependencia. El diseño se resuelve con QR reortogonalizado.`);}
  else if(section===4){const {x}=M.regressionData(),noise=M.sample(x.length,91),y=x.map((t,i)=>1+2*t+v('a')*noise[i]),fit=M.ols(x.map(t=>[1,t]),y),se=Math.sqrt(fit.cov[1][1]),stat=fit.beta[1]/se,p=2*M.studentCDF(-Math.abs(stat),fit.df);visual=fittedPlot(x,y,fit.beta);out=table(['Cantidad','Valor'],[['Pendiente',fit.beta[1]],['EE de pendiente',se],['Varianza residual',fit.sigma2],['Grados',fit.df],['t frente a cero',stat],['p bilateral',p]])+P('Los errores estándar corresponden al modelo normal independiente homocedástico. No se usan como regla automática de eliminación de variables.');}
  else if(section===5){const d=v('a'),train=M.regressionData(.15),fit=M.ols(train.x.map(z=>polynomial(z,d)),train.y),x=Array.from({length:40},(_,i)=>-3+6*i/39),noise=M.sample(40,722),y=x.map((z,i)=>1+1.5*z+.15*z*z+.45*noise[i]),pred=x.map(z=>M.sum(fit.beta.map((b,j)=>b*z**j)));visual=fittedPlot(train.x,train.y,fit.beta);out=table(['Evaluación','Valor'],[['Grado',d],['R² entren.',fit.r2],['R² ajustado',fit.adjusted],['RMSE entren.',Math.sqrt(fit.sse/train.x.length)],['RMSE reservado',Math.sqrt(loss(y,pred))],['R² reservado',1-loss(y,pred)/M.variance(y,0)]])+P('La muestra reservada es sintética y fija. Mover el grado aquí es explorar; no convierte ese conjunto en una prueba final independiente tras seleccionar.');}
  else if(section===6){const {x,y}=M.regressionData(v('a'),v('b')),fit=M.ols(x.map(z=>[1,z]),y);visual=scatter(x.map((z,i)=>[z,fit.res[i]]),[],[],'Residuos frente a la entrada');out=P(`Suma residual=${f(M.sum(fit.res),8)}; SSE=${f(fit.sse)}. Curvatura=${f(v('a'))}, heterocedasticidad=${f(v('b'))}. Que la suma sea cero es una ecuación del ajuste, no prueba de que el modelo esté bien especificado.`);}
  else if(section===7){const {x,y}=M.regressionData(0,0,v('a')),fit=M.ols(x.map(z=>[1,z]),y),i=x.length-1,h=fit.leverage[i],e=fit.res[i],cook=e*e/(2*fit.sigma2)*h/(1-h)**2;visual=fittedPlot(x,y,fit.beta);out=table(['Punto extremo','Valor'],[['Cambio añadido',v('a')],['Apalancamiento h',h],['Residuo',e],['Distancia de Cook',cook],['Suma de h',M.sum(fit.leverage)]])+P('La suma de apalancamientos es dos: intercepto y pendiente. El control altera y, de modo que h permanece constante.');}
  else if(section===8){const {x,y}=M.regressionData(),fit=M.ols(x.map(z=>[1,z]),y),a=v('a'),c=[1,a],variance=M.sum(c.map((u,i)=>M.sum(c.map((w,j)=>u*fit.cov[i][j]*w)))),pred=fit.beta[0]+a*fit.beta[1],q=M.studentQuantile(.975,fit.df),hm=q*Math.sqrt(variance),hp=q*Math.sqrt(variance+fit.sigma2);visual=drawLines([[[pred-hm,1],[pred+hm,1]],[[pred-hp,0],[pred+hp,0]]],[pred-hp-1,pred+hp+1,-.5,1.5],['Respuesta','Tipo de intervalo']);out=table(['Intervalo 95 %','Inferior','Superior'],[['Media (altura 1)',pred-hm,pred+hm],['Nueva observación (altura 0)',pred-hp,pred+hp]])+P(`x0=${f(a)}, predicción=${f(pred)}; t crítico=${f(q)} con ${fit.df} grados. Entradas observadas entre −3 y 2,75; fuera de ellas se está extrapolando.`);}
  else if(section===9){const a=v('a'),b=v('b'),p=M.sigmoid(a),der=b*p*(1-p);visual=drawLines([line(x=>M.sigmoid(a+b*x),-4,4)],[-4,4,0,1],['Entrada','Probabilidad']);out=P(`En x=0: p=${f(p)}, odds=${f(Math.exp(a))}, derivada dp/dx=${f(der)}. Razón de odds por unidad=exp(β)=${f(Math.exp(b))}. No es un incremento fijo de probabilidad.`);}
  else if(section===10){const a=v('a'),b=v('b'),data=binaryData(32,551),scores=data.x.map(x=>a+b*x),prob=scores.map(M.sigmoid);visual=drawLines([line(x=>M.sigmoid(a+b*x),-3,3)],[-3,3,-.1,1.1],['Entrada','Probabilidad'],data.x.map((x,i)=>({xy:[x,data.y[i]],r:4,color:data.y[i]?colors.changed:colors.original})));out=P(`Entropía cruzada media=${f(M.logLoss(data.y,scores),6)}; Brier=${f(loss(data.y,prob),6)}. Puntos: respuestas observadas; curva: probabilidad candidata. No se afirma que los controles estén en el máximo de verosimilitud.`);}
  else if(section===11){const {labels,scores}=M.classifierData,c=M.confusion(labels,scores,v('a'));visual=cmTable(c);out=cmStats(c)+P(`Brier de las probabilidades fijas=${f(loss(labels,scores),6)}. Cambiar solo el umbral no cambia este Brier; sí cambia las etiquetas. Este ejemplo separa evaluación probabilística y decisión.`);}
  else{const {x,y}=M.regressionData(.15),X=x.map(t=>polynomial(t/3,5)),fit=M.ridge(X,y,v('a')),beta=fit.beta.map((b,j)=>b/3**j);visual=fittedPlot(x,y,beta);out=table(['Coeficiente de (x/3)^j','Valor'],fit.beta.map((b,j)=>[j,b]))+P(`SSE de entrenamiento=${f(M.sum(y.map((z,i)=>(z-fit.pred[i])**2)))}; λ=${f(v('a'))}. Intercepto sin penalizar; escalado x/3 explícito. No se ha seleccionado λ usando una prueba final.`);}
 }else{
  if(section===1||section===3){const data=binaryData(32,551),t=v('a'),L=data.y.filter((_,i)=>data.x[i]<=t),R=data.y.filter((_,i)=>data.x[i]>t),counts=a=>[a.length-M.sum(a),M.sum(a)],gain=M.splitGain(counts(L),counts(R));visual=scatter(data.x.map((x,i)=>[x,data.y[i]]),data.y,[],`Corte en x=${f(t,2)}; verde=positivo, violeta=negativo`);out=table(['Hoja','Casos','Negativos','Positivos','Probabilidad'],[['x≤t',L.length,...counts(L),f(M.mean(L))],['x>t',R.length,...counts(R),f(M.mean(R))]])+P(`Ganancia de entropía=${f(gain,6)} bits. Padre: ${data.y.length} casos. La tabla pondera hijos por tamaño; el corte se selecciona explorando la muestra.`);}
  else if(section===2){const p=v('a');visual=drawLines([line(x=>M.entropy([x,1-x]),0,1),line(x=>M.gini([x,1-x]),0,1)],[0,1,0,1.05],['Proporción positiva','Impureza']);out=P(`p=${f(p)}; entropía=${f(M.entropy([p,1-p]))} bits; Gini=${f(M.gini([p,1-p]))}. Violeta=entropía, verde=Gini. Máximos diferentes: uno y un medio.`);}
  else if(section===4){const leaves=[2,4,8,12,20],errors=[.2,.12,.09,.07,.04],alpha=v('a'),cost=leaves.map((n,i)=>errors[i]+alpha*n),at=cost.indexOf(Math.min(...cost));visual=table(['Hojas','Error ilustrativo','Error+α hojas'],leaves.map((n,i)=>[n,errors[i],cost[i]]));out=P(`Se prefiere ${leaves[at]} hojas bajo este α. Son candidatos hipotéticos para explicar el criterio; no son un ajuste ejecutado sobre los datos del libro. La elección real exige validación.`);}
  else if(section===5){const train=binaryData(36,551),test=binaryData(60,782),s=M.stump(train.x,train.y,v('a')),scores=test.x.map(x=>x<=s.t?s.pL:s.pR),c=M.confusion(test.y,scores,.5);visual=cmTable(c);out=P(`Corte aprendido solo en entrenamiento: ${f(s.t)}; ganancia=${f(s.gain)}; hojas ${s.nL}/${s.nR}. Evaluación en 60 casos sintéticos de otra semilla.`)+cmStats(c);}
  else if(section===6){const p=v('a')/100,se=v('b'),fp=v('c'),posterior=M.bayes(p,se,fp),n=100000,tp=n*p*se,falsePos=n*(1-p)*fp;visual=bars([tp,falsePos],['Señales reales','Falsas alarmas'],'Recuentos esperados entre 100 000 registros');out=P(`P(clase dada señal)=${f(posterior,6)}; sensibilidad=${f(se)}, FPR=${f(fp)}, prevalencia=${f(p,6)}. Recuentos esperados, que no tienen por qué ser enteros. Se supone que estas tasas describen la población objetivo.`);}
  else if(section===7){const result=M.nbPosterior(v('a'),[[v('b'),.2],[.6,.3]]);visual=bars(result.posterior,['Positiva','Negativa'],'Posteriores normalizadas');out=table(['Clase','Log-score','Posterior'],[['Positiva',result.scores[0],result.posterior[0]],['Negativa',result.scores[1],result.posterior[1]]])+P(`Suma posterior=${f(M.sum(result.posterior),8)}. Se supone independencia de ambos indicios dentro de cada clase.`);}
  else if(section===8){const counts=[v('b'),10-v('b'),0],a=v('a'),prob=counts.map(n=>M.smooth(n,10,3,a));visual=bars(prob,['C1','C2','C3'],'Probabilidad categórica suavizada');out=table(['Categoría','Recuento','Probabilidad'],prob.map((p,i)=>[i+1,counts[i],p]))+P(`Total de recuentos=10; pseudocuentas totales=3α=${f(3*a)}; suma de probabilidades=${f(M.sum(prob),8)}.`);}
  else if(section===9){const n=v('a'),p=M.sigmoid(n*Math.log(4));visual=drawLines([line(x=>M.sigmoid(x*Math.log(4)),1,8)],[1,8,.5,1.01],['Copias','Posterior aparente']);out=P(`Una señal: razón de verosimilitudes=4 y posterior=0,8 con previas iguales. ${n} copias tratadas ingenuamente como independientes producen ${f(p,6)}. La copia no añade evidencia independiente; el aumento es una exageración del modelo.`);}
  else if(section===10){const d=M.classifierData,c=M.confusion(d.labels,d.scores,v('a'));visual=cmTable(c);out=cmStats(c)+P('Filas reales, columnas predichas; positivo si puntuación≥umbral. “No definido” indica denominador cero. Las etiquetas de este ejemplo se conservan al mover el umbral.');}
  else if(section===11){const {labels,scores}=M.classifierData,s=v('b')?scores.map(x=>1-x):scores,r=M.roc(labels,s),c=M.confusion(labels,s,v('a'));visual=drawLines([r.points.map(p=>[p.x,p.y]),[[0,0],[1,1]]],[0,1,0,1],['FPR','TPR'],[{xy:[c.fpr,c.recall],label:'Umbral',color:colors.red}]);out=P(`AUC=${f(r.auc,6)}; TPR=${f(c.recall)}, FPR=${f(c.fpr)}, precisión=${f(c.precision)}. Umbrales agrupados por puntuaciones empatadas. Invertir ordenación convierte AUC en 1−AUC.`)+table(['Punto de curva PR','Recobrado','Precisión'],r.points.filter(p=>p.precision!==null).map((p,i)=>[i+1,p.y,p.precision]));}
  else{const fp=v('a'),fn=v('b'),threshold=fp/(fp+fn),{labels,scores}=M.classifierData,c=M.confusion(labels,scores,threshold),cost=(fp*c.fp+fn*c.fn)/labels.length,rows=[0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1].map(t=>{const a=M.confusion(labels,scores,t);return[t,(fp*a.fp+fn*a.fn)/labels.length];});visual=drawLines([rows],[0,1,0,Math.max(...rows.map(r=>r[1]))+.5],['Umbral','Coste medio observado']);out=P(`Umbral teórico=${f(threshold)} bajo posterior calibrada y aciertos de coste cero. Coste observado con él=${f(cost)}. El mínimo de esta muestra discreta puede ser distinto por variación y calibración imperfecta; no se reajusta usando prueba final.`)+cmTable(c);}
 }
 $('viz').innerHTML=visual;$('result').innerHTML=out;
 }
 root.querySelectorAll('input').forEach(el=>el.addEventListener('input',update));update();
}
