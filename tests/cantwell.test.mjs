import test from 'node:test';
import assert from 'node:assert/strict';
import {dihedral,vertexMap,rotate,slope,heat,nonlinear,nonlinearResidual,nullspace,dimensions,dimensionalResidual,rescale,dragNumbers,stokes,keplerPi,period,mach,capillary,dropTime,rowing} from '../dist/cantwell-math.mjs';
import {materials} from '../dist/catalog.mjs';
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(b)),`${a} ≠ ${b}`);
test('D₆: el producto coincide con la composición independiente de permutaciones',()=>{
 for(let k=0;k<6;k++)for(let f=0;f<2;f++)for(let l=0;l<6;l++)for(let g=0;g<2;g++){
  const A=vertexMap(k,f),B=vertexMap(l,g),C=vertexMap(...dihedral([k,f],[l,g]));assert.deepEqual(C,B.map(j=>A[j]));assert.equal(new Set(C).size,6);
 }
});
test('Regla de la cadena, círculo y carta vertical',()=>{
 for(const s of [-2,-.2,.7,2]){const [x,y]=rotate(1.3,-.4,s);close(x*x+y*y,1.3**2+.4**2);}
 for(const a of [-1,.2,1.3])for(const p of [-.3,.7]){const h=1e-6;const X=x=>x+a*(p*x+2),Y=x=>p*x+2;close((Y(h)-Y(-h))/(X(h)-X(-h)),slope(1,a,0,1,p));}
 assert.equal(slope(1,1,0,1,-1),null);
});
test('Difusión: datos, colapso y EDP comprobada con diferencias finitas',()=>{
 close(heat(0,1),1,2e-7);assert.ok(heat(20,1)<1e-40);close(heat(2,1),.157299207050285,2e-7);
 for(const t of [.5,1,2])for(const k of [.5,1.3]){const x=.7,h=.002;close(heat(x,t,k),heat(2*x,4*t,k));const ut=(heat(x,t+h,k)-heat(x,t-h,k))/(2*h),uxx=(heat(x+h,t,k)-2*heat(x,t,k)+heat(x-h,t,k))/(h*h);close(ut,k*uxx,1e-5);}
});
test('EDP no lineal: residuo independiente, positividad y excepción',()=>{
 for(const s of [-.2,0,.7,1.5]){const x=.7,t=.4,h=1e-4,ux=(nonlinear(x+h,t,s)-nonlinear(x-h,t,s))/(2*h),ut=(nonlinear(x,t+h,s)-nonlinear(x,t-h,s))/(2*h),uxx=(nonlinear(x+h,t,s)-2*nonlinear(x,t,s)+nonlinear(x-h,t,s))/(h*h);close(ut+ux*ux/2-uxx,0,2e-7);close(nonlinearResidual(x,t,s),0);}
 assert.equal(nonlinear(3,1,-1),null);
});
test('Buckingham: rango efectivo, núcleo y grupos invariantes bajo escala',()=>{
 for(const [name,s] of Object.entries(dimensions)){const {rank,basis}=nullspace(s.matrix);assert.equal(rank,name==='contact'?2:3);assert.equal(basis.length,s.names.length-rank);for(const v of basis)for(const residual of dimensionalResidual(s.matrix,v))close(residual,0);}
 const q=[2,1000,.7,.02,.8],S=rescale(q,dimensions.drag.matrix,[.3,-.4,.8]),a=dragNumbers(...q),b=dragNumbers(...S);close(a.cd,b.cd);close(a.re,b.re);
});
test('Kepler, Stokes, gas ideal y escalas capilares: relaciones físicas',()=>{
 const q=.2,e=.8,a=2,T=period(a,q),rA=a*Math.pow(1-e*e,.25);close(T*T/(rA**3),keplerPi(q,e));
 const D=stokes(1,.001,.001),n=dragNumbers(D,1000,.001,.001,1);close(n.cd*n.re,24);close(D/(1*.001*.001),6*Math.PI);
 const gamma=1.4,R=287,Tgas=300,U=350,M=mach(U,gamma,R,Tgas),cv=R/(gamma-1);close(U*U/(cv*Tgas),gamma*(gamma-1)*M*M);
 close(capillary(.072,1000,9.81,.001,Math.PI/2),0);close(dropTime(1000,.004,.072)/dropTime(1000,.001,.072),8);close(rowing(8,'similar'),Math.pow(8,1/9));
});
test('Cantwell: 18 secciones, 72 preguntas y referencias del extracto',()=>{
 const m=materials.find(m=>m.id==='cantwell');assert.deepEqual(m.chapters.map(c=>c.id),[1,2]);assert.equal(m.chapters.flatMap(c=>c.lessons).length,18);assert.equal(m.chapters.flatMap(c=>c.quizzes.flat()).length,72);
 for(const c of m.chapters){assert.equal(c.lessons.length,c.notes.length);assert.equal(c.notes.length,c.quizzes.length);for(const l of c.lessons){assert.ok(l.reference);assert.ok(l.lab);}for(const note of c.notes)assert.ok(note.length>1000);}
});
