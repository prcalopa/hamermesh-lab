import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../dist/arrigo3-math.mjs';
import {arrigo3Lessons,arrigo3Notes,arrigo3Quizzes} from '../dist/arrigo3-content.mjs';
const close=(a,b,tol=2e-5)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
test('HJ: familias, envolvente, tangencia y dominio',()=>{
 for(const t of [.3,1,2])for(const x of [-1,.4,2]){
  for(const c of [-1,.3,2])close(M.d1(T=>M.hj(T,x,c),t),M.d1(X=>M.hj(t,X,c),x)**2);
  close(M.d1(T=>M.envelope(T,x),t),M.d1(X=>M.envelope(t,X),x)**2);
  const c=-x/(2*t);close(M.hj(t,x,c),M.envelope(t,x));
 }assert.throws(()=>M.envelope(0,1),RangeError);
});
test('Calor y Galileo: residuos independientes y excepción de dominio',()=>{
 for(const t of [.3,1,2])for(const x of [-1,.4,2]){
  close(M.d1(T=>M.heat(T,x),t),M.d2(X=>M.heat(t,X),x));
  for(const e of [-.4,.3]){const f=(T,X)=>Math.exp(-e*X+e*e*T)*M.heat(T,X-2*e*T);close(f(t,x),M.heat(t,x));close(M.d1(T=>f(T,x),t),M.d2(X=>f(t,X),x));}
 }assert.throws(()=>M.heat(0,1),RangeError);
});
test('Hopf–Cole: Burgers, calor, potencial y libertad de normalización',()=>{
 for(const t of [0,.7,2])for(const x of [-2,.3,2])for(const a of [.2,1,3])for(const k of [.3,1,2]){
  const U=M.coleHopf(t,x,a,k),f=(T,X)=>M.coleHopf(T,X,a,k).u;
  close(M.d1(T=>f(T,x),t)+U.u*M.d1(X=>f(t,X),x)-M.d2(X=>f(t,X),x),0);
  close(U.ut+U.u*U.ux-U.uxx,0,1e-12);
  close(M.d1(X=>M.coleHopf(t,X,a,k).v,x),U.u);
  const w=(T,X)=>1+a*Math.exp(k*X+k*k*T);close(M.d1(T=>w(T,x),t),M.d2(X=>w(t,X),x));
 }assert.throws(()=>M.coleHopf(1,1,0),RangeError);
});
test('Laplace y fuente logarítmica: dominios y normalización constante',()=>{
 for(const x of [-1,.3,2])for(const y of [.2,1]){
  const f=(x,y)=>Math.log(x*x+y*y);close(M.d2(X=>f(X,y),x)+M.d2(Y=>f(x,Y),y),0,1e-4);
  const u=X=>Math.exp(.5-X*X/4);close(M.d2(u,x)+u(x)*Math.log(u(x)),0);
  const wrong=X=>Math.exp(-X*X/4);close(M.d2(wrong,x)+wrong(x)*Math.log(wrong(x)),-wrong(x)/2);
 }
});
test('Perfiles reducidos: equilibrios, sistema y convergencia RK4',()=>{
 // Reconstruct a smooth profile locally from independent centered samples of RK4.
 for(const a of [-.3,0,.4]){const end=1.2,A=M.expProfile(a,end),B=M.rk4((r,[f,p])=>[p,-r*p/2-1-Math.exp(f)],[a,0],end,.005);close(A.at(-1)[1],B.at(-1)[1],1e-7);}
 for(const m of [2,3,4,5]){const alpha=1/(m-1),a=alpha**(1/(m-1)),rows=M.powerProfile(a,m,2);close(rows.at(-1)[1],a,1e-8);const u=t=>a*t**(-alpha);close(M.d1(u,1),-(u(1)**m));}
 assert.throws(()=>M.powerProfile(1,1),RangeError);
 close(M.potentialProfile(.4,1,0).at(-1)[1],.4,1e-9);
 const rows=M.potentialProfile(.4,1),j=50,h=rows[j+1][0]-rows[j][0],[r,f,g]=rows[j];close((rows[j+1][2]-rows[j-1][2])/(2*h),f);close((rows[j+1][1]-rows[j-1][1])/(2*h),(1+f*f)*(g-r*f)/2);
 const C=M.boussProfile(.1,1),[r0,f0,p0,q0,s0]=C[50];close((C[51][4]-C[49][4])/.02,-(f0+r0*r0/4)*q0-p0*p0-7*r0*p0/4-2*f0);
});
test('KdV: residuo de la EDP y amplitud de la normalización del libro',()=>{
 for(const c of [.3,1,2])for(const t of [0,.5,1])for(const x of [-1,.4,2]){const f=X=>M.soliton(t,X,c);close(M.d1(T=>M.soliton(T,x,c),t)+f(x)*M.d1(f,x)+M.d3(f,x),0,6e-5);close(M.soliton(t,c*t,c),3*c);}
 assert.throws(()=>M.soliton(1,1,-1),RangeError);
});
test('Blasius: cambio de normalización y condición lejana',()=>{
 const rows=M.rk4((r,[f,p,q])=>[p,q,-f*q/2],[0,0,.3320573362],10);close(rows.at(-1)[2],1,2e-6);
 const rows2=M.rk4((r,[f,p,q])=>[p,q,-f*q],[0,0,.4695999884],10/Math.sqrt(2));close(rows.at(-1)[1],Math.sqrt(2)*rows2.at(-1)[1],2e-6);
});
test('Difusión en plano y EDP exponencial: sustitución numérica independiente',()=>{
 for(const t of [.5,1,2])for(const x of [-1,.4])for(const y of [-.8,.5]){const f=(X,Y)=>M.radialDiffusion(t,X,Y),u=f(x,y),ux=M.d1(X=>f(X,y),x),uy=M.d1(Y=>f(x,Y),y);close(M.d1(T=>M.radialDiffusion(T,x,y),t),u*(M.d2(X=>f(X,y),x)+M.d2(Y=>f(x,Y),y))+ux*ux+uy*uy);}
 for(const x of [-1,.3])for(const y of [-.5,.8])for(const z of [-.5,1]){const f=(X,Y,Z)=>M.gravity(X,Y,Z);close(M.d2(X=>f(X,y,z),x)+M.d2(Y=>f(x,Y,z),y)+M.d2(Z=>Math.exp(f(x,y,Z)),z),0);}
 assert.throws(()=>M.gravity(0,0,-2),RangeError);
});
test('Arrigo 3: 21 secciones, 63 preguntas, apuntes y referencias',()=>{
 assert.equal(arrigo3Lessons.length,21);assert.equal(arrigo3Notes.length,21);assert.equal(arrigo3Quizzes.flat().length,63);
 for(let i=0;i<21;i++){assert.ok(arrigo3Notes[i].length>1800);assert.ok(arrigo3Lessons[i].reference.startsWith('3.'));assert.equal(arrigo3Quizzes[i].length,3);}
});

