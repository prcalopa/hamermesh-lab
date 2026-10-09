import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../dist/arrigo2-math.mjs';
import {arrigo2Lessons,arrigo2Notes,arrigo2Quizzes} from '../dist/arrigo2-content.mjs';
const close=(a,b,tol=2e-6)=>assert.ok(Math.abs(a-b)<tol*(1+Math.abs(b)),`${a} ≠ ${b}`);
const d=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h);
const dd=(f,x,h=2e-4)=>(f(x+h)-2*f(x)+f(x-h))/(h*h);
test('Infinitesimales: flujo, grupo, coordenadas y error cuadrático',()=>{
 for(const k of ['parabola','dilation','rotation','reciprocal']){
  const P=[1,.6],T=M.flow(k,...P,.12),TT=M.flow(k,...T,-.05),D=M.flow(k,...P,.07),g=M.generator(k,...P),r=M.canonical(k,...P),rt=M.canonical(k,...T);
  TT.forEach((v,i)=>close(v,D[i]));close(rt[0],r[0]);close(rt[1]-r[1],.12);
  g.forEach((v,i)=>close(d(e=>M.flow(k,...P,e)[i],0),v));
  const error=e=>Math.hypot(...M.flow(k,...P,e).map((v,i)=>v-P[i]-e*g[i]));close(error(.0002)/error(.0001),4,.001);
 }assert.ok(M.flow('reciprocal',1,.6,1.1).every(Number.isNaN));
});
test('Condición de Lie: pesos correctos, contraejemplo y Riccati',()=>{
 for(const [x,y] of [[.8,.4],[1.7,-.9]])for(const [a,b] of [[1,-1],[.3,.8]]){
  const R=M.lieResidual((x,y)=>x*y**3,(x,y)=>y**3,(x,y)=>3*x*y*y,a*x,b*y,a,0,0,b,x,y);close(R,-2*(a+b)*x*y**3);
 }
 for(const [x,y] of [[.7,.2],[1.4,-1.1]])close(M.lieResidual((x,y)=>y*y-y/x-1/x**2,(x,y)=>y/x**2+2/x**3,(x,y)=>2*y-1/x,x,-y,1,0,0,-1,x,y),0);
});
test('Ejemplo 2.11: el cociente correcto del generador es y/x',()=>{
 const F=(x,y)=>y/x+x*x/(x+y),Fx=(x,y)=>-y/(x*x)+(x*x+2*x*y)/(x+y)**2,Fy=(x,y)=>1/x-x*x/(x+y)**2;
 for(const [x,y] of [[.7,.4],[1.6,-.5],[2.1,1.3]]){
  close(M.lieResidual(F,Fx,Fy,1,y/x,0,0,-y/(x*x),1/x,x,y),0);
  assert.ok(Math.abs(M.lieResidual(F,Fx,Fy,1,x/y,0,0,1/y,-x/(y*y),x,y))>.1);
 }
});
test('Lineal y Bernoulli: soluciones, flujos, coordenadas y excepciones',()=>{
 for(const x of [.4,1,2])for(const l of [.4,1,2]){const y=M.linear(x,2,l);close(d(t=>M.linear(t,2,l),x)+l*y,x);close(Math.exp(l*x)*(M.linear(x,2.3,l)-y),.3);}
 for(const x of [.5,1,2])for(const sign of [-1,1]){
  const y=M.bernoulli(x,-2,sign);close(d(t=>M.bernoulli(t,-2,sign),x)+y/x,x*y**3);close(M.bernoulliFlow(x,y,.3),M.bernoulli(x,-1.7,sign));close(d(t=>-1/(2*t*t*M.bernoulli(t,-2,sign)**2),x),1/x);
 }assert.equal(M.bernoulli(1,-2,0),0);assert.ok(Number.isNaN(M.bernoulli(4,-1,1)));assert.ok(Number.isNaN(M.bernoulliFlow(1,1,1)));
});
test('Homogénea: reconstrucción paramétrica y equilibrios omitidos',()=>{
 for(const r of [-1.3,.4,1.8]){const x=Math.exp(Math.asinh(r)+.2),y=r*x,dx=d(t=>Math.exp(Math.asinh(t)+.2),r),dy=d(t=>t*Math.exp(Math.asinh(t)+.2),r);close(dy/dx,(y+Math.hypot(x,y))/x);}
 for(const r of [-1,1])close(r,r+r*r-1);
});
test('Factor integrante: exactitud, potencial, pesos y soluciones singulares',()=>{
 const phi=(x,y)=>Math.log(Math.abs(M.exactIntegral(x,y)))/10;
 for(const [x,y] of [[1,.6],[1.7,1.1],[.8,1.4]]){
  const mu=M.integratingFactor(x,y);close(d(t=>phi(t,y),x),mu*M.exactM(x,y));close(d(t=>phi(x,t),y),mu*M.exactN(x,y));
  close(d(t=>M.integratingFactor(x,t)*M.exactM(x,t),y),d(t=>M.integratingFactor(t,y)*M.exactN(t,y),x));
  const e=.06;close(M.exactIntegral(Math.exp(3*e)*x,Math.exp(4*e)*y),Math.exp(10*e)*M.exactIntegral(x,y));
 }
 for(const x of [.5,1,2]){const y=Math.cbrt(2)*x**(4/3),yp=4*y/(3*x);close(M.exactM(x,y)+M.exactN(x,y)*yp,0);close(M.exactM(x,0),0);}
});
test('Riccati: particular, familia, recíproco y flujo',()=>{
 const F=(x,y)=>Math.exp(-x)*y*y+2*y-2*Math.exp(x);
 for(const x of [-.7,.2,.8])for(const C of [1,3]){const y=M.riccati2(x,C);close(d(t=>M.riccati2(t,C),x),F(x,y));close(M.riccatiFlow(x,y,.2),M.riccati2(x,C+.2));close(d(t=>-Math.exp(4*t)/(M.riccati2(t,C)-Math.exp(t)),x),Math.exp(3*x));close(F(x,Math.exp(x)),Math.exp(x));}
});
test('Prolongación: pesos y derivadas bajo cizalla finita',()=>{
 const [p,q,z]=[.7,-.4,.6],e=.2,d0=1+e*p;
 const jp=M.shearJets(p,q,z,e);close(jp[0],p/d0);close(jp[1],q/d0**3);close(jp[2],z/d0**4-3*e*q*q/d0**5);
 [-p*p,-3*p*q,-4*p*z-3*q*q].forEach((v,i)=>close(d(t=>M.shearJets(p,q,z,t)[i],0),v));
 M.scalingJets([.5,p,q,z],1,-1,.2).forEach((v,k)=>close(v,[.5,p,q,z][k]*Math.exp((-1-k)*.2)));
 // Differentiate the transformed curve parametrically: d/dX=(1+εy′)⁻¹d/dx.
 const yp=x=>p+q*x+z*x*x/2,ypp=x=>q+z*x;
 close(d(x=>yp(x)/(1+e*yp(x)),0)/d0,jp[1]);close(d(x=>ypp(x)/(1+e*yp(x))**3,0)/d0,jp[2]);
});
test('Segundo orden: ecuación no lineal, flujo y reducción s″=1',()=>{
 for(const B of [.6,1,2])for(const x of [.2,1,2]){
  const f=x=>M.nonlinearSecond(x,1,B,2),y=f(x),p=d(f,x),q=dd(f,x);close(q+3*y*p+y**3,0,1e-5);
  const r=t=>t-1/f(t),s=t=>1/(2*f(t)**2),rp=d(r,x),sp=d(s,x),rpp=dd(r,x),spp=dd(s,x);close((spp*rp-sp*rpp)/rp**3,1,1e-5);
  const [X,Y]=M.secondFlow(x,y,.15);close(X-1/Y,r(x));close(1/(2*Y*Y),s(x)+.15);
 }
});
test('Los ocho generadores publicados de la EDO no lineal satisfacen Lie',()=>{
 const generators=[
  (x,y)=>[y,-(y**3)],(x,y)=>[x*y,y*y-x*y**3],
  (x,y)=>[x*x*y,-x*x*y**3+2*x*y*y-2*y],
  (x,y)=>[x**3*y,-(x**3)*y**3+3*x*x*y*y-6*x*y+4],
  (x,y)=>[x**4*y-2*x**3,-(x**4)*y**3+4*x**3*y*y-6*x*x*y+4*x],
  (x,y)=>[1,0],(x,y)=>[x,-y],(x,y)=>[x*x,2-2*x*y]
 ];
 const h=1e-4,partials=(f,x,y)=>({x:d(t=>f(t,y),x,h),y:d(t=>f(x,t),y,h),xx:dd(t=>f(t,y),x,h),yy:dd(t=>f(x,t),y,h),xy:(f(x+h,y+h)-f(x+h,y-h)-f(x-h,y+h)+f(x-h,y-h))/(4*h*h)});
 for(const g of generators)for(const [x,y,p] of [[.4,.3,.2],[1.1,-.7,-.4],[1.5,.8,.6]]){
  const [xi,eta]=g(x,y),X=partials((x,y)=>g(x,y)[0],x,y),Y=partials((x,y)=>g(x,y)[1],x,y),q=-3*y*p-(y**3);
  const e1=Y.x+(Y.y-X.x)*p-X.y*p*p;
  const e2=Y.xx+(2*Y.xy-X.xx)*p+(Y.yy-2*X.xy)*p*p-X.yy*p**3+(Y.y-2*X.x)*q-3*X.y*p*q;
  close(e2+3*eta*p+3*y*e1+3*y*y*eta,0,3e-5);
 }
});
test('Blasius: ecuación, disparo, convergencia y dependencia del extremo',()=>{
 const a=M.shootBlasius(8,.015),fine=M.shootBlasius(8,.0075),long=M.shootBlasius(10,.015);close(a,fine,1e-8);close(a,long,2e-6);
 const rows=M.blasius(a,8,.015);close(rows.at(-1)[2],1,1e-8);assert.ok(rows.every(r=>r[3]>0));assert.ok(rows.every((r,i)=>!i||r[2]>=rows[i-1][2]));assert.ok(a>.46&&a<.48);
 const i=150,r=rows[i],dt=rows[i+1][0]-rows[i-1][0];close((rows[i+1][3]-rows[i-1][3])/dt,-r[1]*r[3],1e-4);
});
test('Sistema cuadrático: EDO, escala temporal, diagonales y polos',()=>{
 for(const [x0,y0] of [[.4,.1],[.4,.4],[.4,-.4],[0,.3]])for(const t of [0,.3,.6]){
  const [x,y]=M.coupled(t,x0,y0);close(d(s=>M.coupled(s,x0,y0)[0],t),2*x*y);close(d(s=>M.coupled(s,x0,y0)[1],t),x*x+y*y);
  const e=.2,f=Math.exp(-e),T=t*Math.exp(e),P=M.coupled(T,x0*f,y0*f);close(P[0],f*x);close(P[1],f*y);
 }assert.ok(M.coupled(2.1,.4,.1).every(Number.isNaN));
});
test('Fuerza central: aceleraciones, momento angular, energía y rotación',()=>{
 for(const L of [-2,0,1])for(const t of [-2,.3,2]){
  const p=M.central(t,L),rot=M.central(t,L,1.2,-.2,.7),R=(p.x*p.x+p.y*p.y)**2;
  close(dd(s=>M.central(s,L).x,t),p.x/R,1e-5);close(dd(s=>M.central(s,L).y,t),p.y/R,1e-5);
  close(p.u*p.u*p.omega,L);close(.5*p.w*p.w+(L*L+1)/(2*p.u*p.u),p.E);close(rot.u,p.u);close(rot.theta-p.theta,.7);
  const [X,Y]=M.flow('rotation',p.x,p.y,.7);close(X,rot.x);close(Y,rot.y);
 }
});
test('Cobertura del capítulo: doce secciones y 48 preguntas razonadas',()=>{
 assert.equal(arrigo2Lessons.length,12);assert.equal(arrigo2Notes.length,12);assert.equal(arrigo2Quizzes.flat().length,48);
 assert.equal(arrigo2Lessons[11].reference,'2.7.2');for(const s of arrigo2Notes){assert.ok(s.includes('data-tex='));assert.ok(s.length>1500);}
});
