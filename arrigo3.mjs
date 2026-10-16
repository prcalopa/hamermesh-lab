import {tex} from './math.mjs';
import {plot,sampled,range,fmt,colors} from './arrigo.mjs';
import * as M from './arrigo3-math.mjs';
const B=s=>tex(s,true),p=s=>`<p>${s}</p>`;
const controls=[
 [['e','Parámetro de escala ε',-1,1,.05,.4],['c','Peso de amplitud',-1,2,.1,1]],
 [['a','Peso temporal a',-2,4,.1,1],['b','Peso espacial b',-2,3,.1,1],['c','Peso de amplitud c',-2,3,.1,1]],
 [['t','Tiempo positivo',.25,3,.05,1],['c','Pendiente C',-2,2,.1,.7]],
 [['c','Velocidad del observador',-2,2,.1,1],['t','Tiempo',0,3,.05,1]],
 [['a','Peso temporal a',0,4,.1,2],['b','Peso espacial b',0,3,.1,1]],
 [['t','Tiempo positivo',.2,3,.05,1]],
 [['e','Parámetro de Galileo ε',-.7,.7,.02,.3],['t','Tiempo positivo',.2,2,.05,1]],
 [['a','Coeficiente logarítmico',-1,1,.1,.5],['y','Segunda coordenada fija',.2,2,.05,.7]],
 [['k','Escala k',.25,2,.05,1],['t','Tiempo',0,3,.05,1]],
 [['a','Coeficiente positivo a',.2,3,.1,1],['k','Escala k',.25,2,.05,1],['t','Tiempo',0,3,.05,1]],
 [['m','Exponente de la fuente',2,5,1,2],['c','Peso de amplitud',-3,1,.1,-2]],
 [['a','Perfil inicial f(0)',-1,1,.05,0],['end','Extremo del perfil',.5,3,.1,2]],
 [['a','Centro de la gaussiana',-2,2,.1,0]],
 [['m','Exponente entero m',2,5,1,2],['a','Perfil inicial f(0)',.1,1.2,.05,1]],
 [['c','Velocidad positiva c',.25,2,.05,1],['t','Tiempo',0,3,.05,1]],
 [['a','Dato inicial f(0)',-.3,.3,.02,.1],['end','Extremo del perfil',.5,3,.1,2]],
 [['a','Dato inicial f(0)',-.8,.8,.05,.4],['b','Dato inicial g(0)',-.5,.5,.05,.3],['end','Extremo del perfil',.5,2.5,.1,2]],
 [['a','Curvatura de pared f″(0)',.2,.5,.001,.332],['end','Extremo que aproxima infinito',5,10,1,8]],
 [['c','Constante positiva C',1,4,.1,2],['y','Coordenada transversal',-2,2,.1,0]],
 [['t','Tiempo positivo',.3,3,.05,1],['y','Coordenada transversal fija',-2,2,.1,1]],
 [['z','Tercera coordenada z',-.5,2,.05,.5],['y','Coordenada y fija',-1,1,.1,.5]]
];
const descriptions=[
 'La escala fija peso temporal y espacial uno. Compara la pendiente temporal transformada con el cuadrado de la pendiente espacial transformada. Deben coincidir para todas las pendientes.',
 'Modifica los tres pesos. El defecto es un polinomio en la pendiente p: anularse solo en p=0 no basta para ser simetría.',
 'Violeta: una recta de la familia exacta. Verde: la envolvente singular. Cambia la pendiente para ver la tangencia; el tiempo nunca cruza cero.',
 'La onda lineal de la primera EDP viaja con la velocidad seleccionada. Las curvas muestran tiempo cero y tiempo actual.',
 'La amplitud queda con peso cero. Compara el peso de la derivada temporal y el de la curvatura: deben ser iguales.',
 'La curva gaussiana conserva masa. La segunda curva es el perfil en tiempo uno. La anchura y la altura se compensan.',
 'Violeta: solución obtenida aplicando Galileo a u=1. Verde: la gaussiana, que queda fija bajo el generador. No son dos imágenes de la misma solución.',
 'Sección en una recta que evita el origen: violeta, logaritmo radial; verde, función armónica no radial. Ambas tienen laplaciano cero.',
 'El frente exacto conecta 0 con −2k y viaja a velocidad −k. Verde: su forma inicial. La difusión mantiene el frente suave.',
 'La suma positiva de dos soluciones del calor genera este frente. Se muestra también su derivada espacial, no una segunda solución.',
 'Para la escala parabólica, la condición de clase de una fuente u elevada a m exige 2+(m−1)c=0. Violeta: defecto; verde: cero.',
 'Integración del perfil exponencial con pendiente inicial cero. Violeta: f; verde: f′. Paso máximo 0,01; intervalo finito, sin condición de contorno.',
 'Gaussiana estacionaria positiva de la fuente u ln u, trasladada en el espacio. El factor exp(1/2) es necesario. Verde: curvatura más fuente, que se anula.',
 'Fuente de absorción −u elevada a m. Violeta: perfil integrado; verde: derivada. Se integra hasta r=2 con paso máximo 0,01; no se impone positividad después de integrar.',
 'Solitón exacto en la normalización uₜ+uuₓ+uₓₓₓ=0. Verde: pulso inicial. Más velocidad implica más altura y menos anchura.',
 'Perfil de Boussinesq con f′(0)=f″(0)=f‴(0)=0. Violeta: f; verde: f′. Es un problema inicial numérico de cuarto orden, en un intervalo finito.',
 'Sistema reducido con dos datos iniciales ajustables. Violeta: amplitud f; verde: potencial g. Ambos se integran juntos, con paso máximo 0,01.',
 'Blasius con coeficiente 1/2. Violeta: velocidad f′; verde: curvatura f″. La condición lejana se aproxima en el extremo seleccionado.',
 'Solución estacionaria e independiente de la coordenada transversal: raíz de 2x+C, con x entre cero y tres. Cambiar y no altera la curva, porque esa dirección se ha eliminado.',
 'Sección de la solución cuadrática exacta negativa. Violeta: u; verde: perfil temporal f=t·u. Es una identidad matemática, fuera del régimen de difusión positiva.',
 'Solución exacta u=ln(z+2)+x²−y². Violeta: u; verde: exponencial de u. El intervalo de z conserva positivo el argumento del logaritmo.'
];
export function renderArrigo3(section,root){
 const index=section-1;
 root.innerHTML=`<div class="lab"><div class="viz"><div class="viz-header"><span>ARRIGO 3 · COMPROBAR UNA REDUCCIÓN</span><span class="viz-tag">EDP</span></div><div id="a3-chart"></div><div class="plot-legend"><span><i style="background:${colors.original}"></i>Curva principal</span><span><i style="background:${colors.changed}"></i>Comparación indicada</span></div></div><div class="control-panel"><h3>Del cálculo al perfil</h3><p class="helper">${descriptions[index]}</p>${controls[index].map(c=>range('a3-'+c[0],...c.slice(1))).join('')}${section===18?'<button id="a3-shoot" class="primary-button">Ajustar velocidad lejana a 1</button>':''}<div id="a3-result" class="result-box" aria-live="polite"></div></div></div><div class="insight"><span class="insight-symbol">∂</span><p><strong>Cómo leer el laboratorio.</strong>Los apuntes desarrollan la reducción y sus hipótesis. Las comprobaciones numéricas de un perfil ilustran la derivación; no clasifican todas las soluciones.</p></div>`;
 const $=id=>root.querySelector('#a3-'+id),v=id=>Number($(id).value);
 const chart=(f,g,a=-3,b=3)=>{const data=sampled(x=>[x,f(x)],a,b,180),other=g?sampled(x=>[x,g(x)],a,b,180):[],ys=[...data,...other].map(r=>r[1]).filter(Number.isFinite),lo=Math.min(0,...ys),hi=Math.max(.1,...ys),pad=.12*(hi-lo)||1;return plot({title:descriptions[index],bounds:[a,b,lo-pad,hi+pad],paths:[{data},{data:other,color:colors.changed}],labels:['Coordenada indicada','Valor']});};
 function update(){
  for(const c of controls[index])$(c[0]+'-value').textContent=fmt(v(c[0]),3);
  let visual='',out='';
  const numeric=(rows,formula)=>{const f=rows.map(r=>[r[0],r[1]]),g=rows.map(r=>[r[0],r[2]]),ys=[...f,...g].map(r=>r[1]),lo=Math.min(0,...ys),hi=Math.max(.1,...ys),pad=.12*(hi-lo);visual=plot({title:descriptions[index],bounds:[0,Math.max(.1,rows.at(-1)[0]),lo-pad,hi+pad],paths:[{data:f},{data:g,color:colors.changed}],labels:['Variable de semejanza r','Perfil y derivada / potencial']});out=B(formula)+p(`Integrados ${rows.length-1} pasos. Último punto: r=${fmt(rows.at(-1)[0])}, f=${fmt(rows.at(-1)[1])}. ${rows.at(-1)[0]+1e-8<(controls[index].some(c=>c[0]==='end')?v('end'):2)?'Integración detenida antes del extremo al salir del rango numérico.':'Se ha alcanzado el extremo del intervalo.'}`);};
  if(section===1){const e=v('e'),c=v('c');visual=chart(p=>Math.exp((c-1)*e)*p*p,p=>Math.exp(2*(c-1)*e)*p*p,-2,2);out=B(String.raw`\bar u_{\bar t}=e^{(c-1)\varepsilon}p^2,\quad\bar u_{\bar x}^2=e^{2(c-1)\varepsilon}p^2`)+p(`Defecto en p=1: ${fmt(Math.exp((c-1)*e)-Math.exp(2*(c-1)*e),6)}. Para todo ε se requiere c=1; ε=0 da coincidencia trivial.`);}
  else if(section===2){const a=v('a'),b=v('b'),c=v('c');visual=chart(p=>M.hjWeights(a,b,c,p),()=>0,-2,2);out=B(String.raw`\operatorname{pr}\Gamma(\Delta)=(2b-a-c)p^2`)+p(`Coeficiente del polinomio: ${fmt(2*b-a-c)}. ${Math.abs(2*b-a-c)<1e-8?'Identidad: esta escala es una simetría.':'No se anula como identidad.'}`);}
  else if(section===3){const t=v('t'),c=v('c');visual=chart(x=>M.hj(t,x,c),x=>M.envelope(t,x));out=B(String.raw`u=Cx+C^2t,\qquad u_{\rm env}=-x^2/(4t)`)+p(`Punto de tangencia: x=${fmt(-2*c*t)}, u=${fmt(-c*c*t)}. Ambas ramas resuelven la EDP.`);}
  else if(section===4){const c=v('c'),t=v('t');visual=chart(x=>-c*x+c*c*t,x=>-c*x);out=B(String.raw`u=-c(x-ct),\quad u_t=c^2=u_x^2,\quad u_t+cu_x=0.`);}
  else if(section===5){const a=v('a'),b=v('b');visual=chart(x=>-a*x,x=>-2*b*x,-1,1);out=B(String.raw`\operatorname{peso}(u_t)=-a,\quad\operatorname{peso}(u_{xx})=-2b`)+p(`Diferencia: ${fmt(M.heatWeights(a,b))}. ${Math.abs(2*b-a)<1e-8?'Balance correcto.':'Las derivadas no tienen el mismo peso.'}`);}
  else if(section===6){const t=v('t');visual=chart(x=>M.heat(t,x),x=>M.heat(1,x),-6,6);out=B(String.raw`u=t^{-1/2}e^{-x^2/(4t)},\quad\int_{\mathbb R}u\,dx=2\sqrt\pi`)+p(`Altura=${fmt(1/Math.sqrt(t))}; longitud de difusión=${fmt(Math.sqrt(t))}.`);}
  else if(section===7){const t=v('t'),e=v('e');visual=chart(x=>Math.exp(-e*x+e*e*t),x=>M.heat(t,x));out=B(String.raw`\widetilde u=e^{-\varepsilon x+\varepsilon^2t},\quad\widetilde u_t-\widetilde u_{xx}=0`)+p('La gaussiana queda fija porque su exponente completo cancela los términos lineal y cuadrático del parámetro.');}
  else if(section===8){const a=v('a'),y=v('y');visual=chart(x=>a*Math.log(x*x+y*y),x=>x*x-y*y);out=B(String.raw`u=A\ln(x^2+y^2),\quad\Delta u=0\quad(x^2+y^2>0)`)+p(`La sección evita el origen porque y=${fmt(y)}>0. El logaritmo no se extiende regularmente al origen si A≠0.`);}
  else if(section===9||section===10){const t=v('t'),k=v('k'),a=section===10?v('a'):1,z=M.coleHopf(t,.5,a,k);visual=chart(x=>M.coleHopf(t,x,a,k).u,x=>section===9?M.coleHopf(0,x,a,k).u:M.coleHopf(t,x,a,k).ux,-6,6);out=B(String.raw`u=-2\frac{w_x}{w},\quad w=1+ae^{kx+k^2t}`)+p(`Velocidad del frente=${fmt(-k)}; residuo analítico en x=0,5: ${fmt(z.ut+z.u*z.ux-z.uxx,10)}.`);}
  else if(section===11){const m=v('m'),c=v('c'),d=2+(m-1)*c;visual=chart(u=>d*u**m,()=>0,0,1.5);out=B(String.raw`(cu)F'(u)+(2-c)F(u)=[2+(m-1)c]u^m`)+p(`Peso necesario: ${fmt(-2/(m-1))}. Defecto elegido: ${fmt(d)}. La fuente genérica solo garantiza las traslaciones.`);}
  else if(section===12)numeric(M.expProfile(v('a'),v('end')),String.raw`f''+\tfrac r2 f'+1+e^f=0,\quad f'(0)=0`);
  else if(section===13){const a=v('a');visual=chart(x=>Math.exp(.5-(x-a)**2/4),()=>0,-5,5);out=B(String.raw`u=e^{1/2-(x-a)^2/4},\quad u_{xx}+u\ln u=0`)+p('Solución exacta estacionaria: trasladar el centro es una simetría espacial de la ecuación con fuente.');}
  else if(section===14){const m=v('m');numeric(M.powerProfile(v('a'),m,2),String.raw`f''+\tfrac r2f'+\tfrac1{m-1}f-f^m=0`);out+=p(`Perfil constante positivo de referencia: ${fmt((1/(m-1))**(1/(m-1)),6)}.`);}
  else if(section===15){const t=v('t'),c=v('c'),x=.7,f=z=>M.soliton(t,z,c),res=M.d1(T=>M.soliton(T,x,c),t)+f(x)*M.d1(f,x)+M.d3(f,x);visual=chart(f,x=>M.soliton(0,x,c),-8,8);out=B(String.raw`u=3c\operatorname{sech}^2\!\left(\tfrac{\sqrt c}{2}(x-ct)\right)`)+p(`Amplitud=${fmt(3*c)}; residuo por diferencias finitas en x=0,7: ${res.toExponential(2)}. El error depende del paso numérico.`);}
  else if(section===16)numeric(M.boussProfile(v('a'),v('end')),String.raw`f^{(4)}+(f+r^2/4)f''+(f')^2+7rf'/4+2f=0`);
  else if(section===17)numeric(M.potentialProfile(v('a'),v('end'),v('b')),String.raw`f'=\tfrac12(1+f^2)(g-rf),\quad g'=f`);
  else if(section===18){const end=v('end'),rows=M.rk4((r,[f,p,q])=>[p,q,-f*q/2],[0,0,v('a')],end),last=rows.at(-1);visual=plot({title:'Velocidad y curvatura de Blasius',bounds:[0,end,0,1.5],paths:[{data:rows.map(r=>[r[0],r[2]])},{data:rows.map(r=>[r[0],r[3]]),color:colors.changed}],segments:[{a:[0,1],b:[end,1],color:colors.red}],labels:['r','Velocidad y curvatura']});out=B(String.raw`f'''+\tfrac12ff''=0,\quad f(0)=f'(0)=0`)+p(`Velocidad en r=${end}: ${fmt(last[2],7)}. Error respecto a 1: ${fmt(last[2]-1,7)}. Repite con un extremo mayor para comprobar la aproximación.`);}
  else if(section===19){const c=v('c');visual=chart(x=>Math.sqrt(2*x+c),null,0,3);out=B(String.raw`u=\sqrt{2x+C},\quad uu_x=1,\quad u_t=(uu_x)_x+(uu_y)_y=0`)+p(`Coordenada transversal=${fmt(v('y'))}: la solución permanece igual. Dos invariancias dejan una EDO estacionaria.`);}
  else if(section===20){const t=v('t'),y=v('y');visual=chart(x=>M.radialDiffusion(t,x,y),x=>t*M.radialDiffusion(t,x,y));out=B(String.raw`u=-\frac{x^2+y^2}{8t},\quad u_t=\nabla\cdot(u\nabla u)`)+p(`En x=1: ambos lados valen ${fmt((1+y*y)/(8*t*t),6)}. Perfil negativo, sin interpretación como difusión positiva.`);}
  else if(section===21){const z=v('z'),y=v('y');visual=chart(x=>M.gravity(x,y,z),x=>Math.exp(M.gravity(x,y,z)),-1.5,1.5);out=B(String.raw`u=\ln(z+2)+x^2-y^2,\quad u_{xx}+u_{yy}=0,\quad(e^u)_{zz}=0`)+p(`Argumento del logaritmo=${fmt(z+2)}>0. La solución se verifica en todo el dominio indicado.`);}
  $('chart').innerHTML=visual;$('result').innerHTML=out;
 }
 root.querySelectorAll('input').forEach(el=>el.addEventListener('input',update));
 if(section===18)$('shoot').onclick=()=>{let lo=.2,hi=.5;for(let i=0;i<30;i++){const a=(lo+hi)/2,last=M.rk4((r,[f,p,q])=>[p,q,-f*q/2],[0,0,a],v('end')).at(-1)[2];if(last<1)lo=a;else hi=a;}$('a').step='any';$('a').value=(lo+hi)/2;update();};
 update();
}
