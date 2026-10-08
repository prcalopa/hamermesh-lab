import test from 'node:test';
import assert from 'node:assert/strict';
import {transform,pushSlope,odeRhs,coordinates,reduced,reducedSolution,riccati} from '../dist/lie-math.mjs';
import {materials} from '../dist/catalog.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b)),`${a} ≠ ${b}`);
test('Flujos: identidad, composición aditiva e inverso en dominios admisibles',()=>{
 for(const kind of ['rotation','scale','rational','hyperbola','odeScale','projective','ratio','reciprocal'])
 for(const [x,y] of [[.8,.6],[1.2,1.3],[-.8,-.5]])
 for(const [a,b] of [[.04,.06],[-.04,.03],[.06,-.06]]){
  const p=transform(kind,x,y,a),q=transform(kind,...p,b),direct=transform(kind,x,y,a+b),zero=transform(kind,x,y,0),back=transform(kind,...p,-a);
  q.forEach((v,i)=>close(v,direct[i]));zero.forEach((v,i)=>close(v,[x,y][i]));back.forEach((v,i)=>close(v,[x,y][i]));
 }
 assert.throws(()=>transform('rational',1,2,.5),RangeError);
 assert.throws(()=>transform('hyperbola',1,2,2),RangeError);
 assert.throws(()=>transform('projective',2,1,-.5),RangeError);
});
test('Los cuatro invariantes geométricos permanecen constantes',()=>{
 for(const e of [-.3,.1,.4]){
  const [x,y]=[1,.6],circle=transform('rotation',x,y,e),line=transform('scale',x,y,e),rat=transform('rational',x,y,e),hyp=transform('hyperbola',x,y,e);
  close(circle[0]**2+circle[1]**2,x*x+y*y);close(line[1]/line[0],y/x);close(rat[0]+1/rat[1],x+1/y);close(hyp[0]*hyp[1],x*y);
 }
});
test('Regla de la cadena: invariancia de las cinco EDO y fallo del contraejemplo',()=>{
 for(const [name,kind] of [['simple','odeScale'],['projective','projective'],['riccati','odeScale'],['ratio','ratio'],['reciprocal','reciprocal']])
 for(const [x,y] of [[.8,.3],[1.2,.7],[-1.1,.4]])for(const e of [-.1,.2]){
  const p=odeRhs[name](x,y),P=transform(kind,x,y,e);close(pushSlope(kind,x,y,e,p),odeRhs[name](...P));
 }
 const p=odeRhs.simple(1,.6),P=transform('scale',1,.6,.3);assert.ok(Math.abs(pushSlope('scale',1,.6,.3,p)-odeRhs.simple(...P))>.1);
});
test('Coordenadas adaptadas: r fijo, s trasladado; las reducciones siguen de la EDO',()=>{
 for(const [kind,flow] of [['riccati','odeScale'],['ratio','ratio'],['reciprocal','reciprocal']])
 for(const [x,y] of [[.8,.3],[1.2,.7],[-1.1,.4]]){
  const e=.12,R=coordinates(kind,x,y),P=transform(flow,x,y,e),S=coordinates(kind,...P);close(R[0],S[0]);close(R[1]+e,S[1]);
  const F=odeRhs[kind](x,y);let ds,dr;
  if(kind==='riccati'){ds=1/x;dr=y+x*F;}
  if(kind==='ratio'){ds=1;dr=(x*F-y)/x**2;}
  if(kind==='reciprocal'){ds=-F/y**2;dr=-1/x**2+F/y**2;}
  close(ds/dr,reduced(kind,R[0]));
 }
});
test('Soluciones integradas: derivadas, reconstrucción y casos excluidos',()=>{
 const h=1e-5;
 for(const kind of ['riccati','ratio','reciprocal'])for(const r of [-2.2,-.6,.4,1.6])close((reducedSolution(kind,r+h,3)-reducedSolution(kind,r-h,3))/(2*h),reduced(kind,r));
 for(const x of [.4,.9,1.8]){const y=riccati(x,6);close((riccati(x+h,6)-riccati(x-h,6))/(2*h),odeRhs.riccati(x,y));close(odeRhs.riccati(x,1/x),-1/x**2);close(odeRhs.riccati(x,-1/x),1/x**2);close(odeRhs.reciprocal(x,0),0);close(odeRhs.simple(x,0),0);}
 for(const kind of ['ratio','reciprocal'])for(const r of [-2.4,-.5,.7,1.7]){
  const back=t=>{const s=reducedSolution(kind,t,3);return kind==='ratio'?[s,t*s]:[1/(t+s),1/s];};
  const P=back(r),A=back(r-h),B=back(r+h);close((B[1]-A[1])/(B[0]-A[0]),odeRhs[kind](...P));
 }
});
test('Catálogo ampliable: capítulos completos y preguntas con respuestas válidas',()=>{
 assert.equal(materials.length,2);assert.equal(materials.flatMap(m=>m.chapters).length,4);
 for(const m of materials)for(const c of m.chapters){assert.equal(c.lessons.length,c.notes.length);assert.equal(c.lessons.length,c.quizzes.length);for(const qs of c.quizzes)for(const q of qs){assert.ok(q.a[q.correct]);assert.ok(q.why.length>30);}}
 assert.equal(materials.find(m=>m.id==='arrigo').chapters[0].quizzes.flat().length,21);
});
