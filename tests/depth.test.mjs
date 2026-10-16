import test from 'node:test';
import assert from 'node:assert/strict';
import {materials} from '../dist/catalog.mjs';
import {applyDepth,extensions} from '../dist/depth.mjs';
import {nullspace,erfc} from '../dist/cantwell-math.mjs';
import {mm,mv,transpose,inverse,gram,E,directSum,identity,error} from '../dist/chapter3-math.mjs';
const close=(a,b,tol=1e-6)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const d1=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h),d2=(f,x,h=1e-3)=>(f(x+h)-2*f(x)+f(x-h))/(h*h);
test('Ampliación completa: 70 secciones de siete capítulos y 424 preguntas totales',()=>{
 let sections=0,chapters=0;for(const m of materials)for(const c of m.chapters){const extra=extensions[m.id]?.[c.id];if(!extra)continue;chapters++;assert.equal(extra.length,c.lessons.length);sections+=extra.length;
  for(let j=0;j<extra.length;j++){const d=extra[j];assert.ok(d.intro.length>100);assert.ok(d.derivation.length>180);assert.ok(d.worked.length>200);assert.ok(c.notes[j].includes('DESARROLLO MATEMÁTICO AMPLIADO'));assert.equal(c.quizzes[j].at(-1).q,d.challenge);assert.equal(c.quizzes[j].at(-1).a[c.quizzes[j].at(-1).correct],d.quiz.a[d.quiz.correct]);}
 }assert.equal(chapters,7);assert.equal(sections,70);assert.equal(materials.flatMap(m=>m.chapters).flatMap(c=>c.quizzes).flat().length,424);
 const notes=materials[0].chapters[0].notes,qs=materials[0].chapters[0].quizzes;applyDepth(materials);assert.equal(materials[0].chapters[0].notes,notes);assert.equal(materials[0].chapters[0].quizzes,qs);
});
test('Nuevas soluciones de Arrigo: Bernoulli, homogénea y Riccati',()=>{
 for(const x of [.3,.7,1.2])for(const C of [-.2,.4,1]){
  const bern=X=>1/(1+C*Math.exp(X));close(d1(bern,x)+bern(x),bern(x)**2);
  if(Math.abs(1-C*x)>.15){const hom=X=>C*X*X/(1-C*X);close(d1(hom,x),2*hom(x)/x+(hom(x)/x)**2);}
  const z=C*Math.exp(-2*x)-.5;if(Math.abs(z)>.1){const ric=X=>1+1/(C*Math.exp(-2*X)-.5);close(d1(ric,x),ric(x)**2-1);}
 }for(const x of [.3,1]){const y=X=>-X;close(d1(y,x),2*y(x)/x+(y(x)/x)**2);}
});
test('Sistema desacoplado y fuerza central: reconstrucción de los ejemplos nuevos',()=>{
 const X=t=>1/(1-t*t),Y=t=>t/(1-t*t);for(const t of [-.6,.2,.7]){close(d1(X,t),2*X(t)*Y(t));close(d1(Y,t),X(t)**2+Y(t)**2);}
 const r=t=>Math.sqrt(1+2*t*t),theta=t=>Math.atan(Math.SQRT2*t)/Math.SQRT2;for(const t of [-1,.3,1]){close(d2(r,t),2/r(t)**3);close(r(t)**2*d1(theta,t),1);close(.5*d1(r,t)**2+1/r(t)**2,1);}
});
test('Covariancia de métrica, adjunto y base dual',()=>{
 for(const s of [-2,.3,2]){const B=[[1,s],[0,1]],v=[3,1],c=mv(inverse(B),v),G=gram(B),A=mm(mm(inverse(B),[[2,0],[0,1]]),B);close(c[0],3-s);close(c[1],1);const recon=mv(B,c);recon.forEach((x,j)=>close(x,v[j]));close(c.reduce((sum,x,j)=>sum+x*mv(G,c)[j],0),10);assert.ok(error(mm(transpose(A),G),mm(G,A))<1e-12);}
 const A=[[2,0],[0,1]],old=[[1,0],[0,1]],newMetric=mm(mm(transpose(inverse(A)),old),inverse(A)),v=[1,1],w=mv(A,v);close(w.reduce((sum,x,j)=>sum+x*mv(newMetric,w)[j],0),2);
});
test('Difusión: derivada de pared y cantidad integral; perturbación singular',()=>{
 for(const t of [.3,1,2]){const k=.7,u=x=>erfc(x/(2*Math.sqrt(k*t))),h=1e-4;close((u(h)-u(0))/h,-1/Math.sqrt(Math.PI*k*t),1e-4);let integral=0,n=10000,end=12*Math.sqrt(k*t);for(let j=0;j<n;j++)integral+=u((j+.5)*end/n)*end/n;close(integral,2*Math.sqrt(k*t/Math.PI),2e-6);}
 for(const e of [.1,.3]){const f=x=>(1-Math.exp(-x/e))/(1-Math.exp(-1/e));close(f(0),0);close(f(1),1);for(const x of [.1,.5])close(e*d2(f,x,1e-4)+d1(f,x),0,1e-5);}
});
test('Cayley, clases y producto directo: conteos independientes',()=>{
 const perms=a=>a.length?a.flatMap((v,j)=>perms(a.filter((_,k)=>k!==j)).map(p=>[v,...p])):[[]],ps=perms([0,1,2,3]),compose=(a,b)=>b.map(x=>a[x]),a=[1,0,3,2];let central=0;for(const g of ps)if(JSON.stringify(compose(g,a))===JSON.stringify(compose(a,g)))central++;assert.equal(central,8);assert.equal(ps.length/central,3);
 const ord=(a,b)=>{for(let k=1;k<=12;k++)if(k%a===0&&k%b===0)return k;};assert.equal(ord(2,3),6);assert.equal(ord(2,2),2);
});
test('Conjugación espacial axial y operaciones impropias',()=>{
 const R=t=>[[Math.cos(t),-Math.sin(t),0],[Math.sin(t),Math.cos(t),0],[0,0,1]],Q=[[-1,0,0],[0,1,0],[0,0,1]],Qax=[[1,0,0],[0,-1,0],[0,0,-1]];
 for(const t of [.3,1,2]){assert.ok(error(mm(mm(Q,R(t)),Q),R(-t))<1e-12);assert.ok(error(mm(mm(Qax,R(t)),Qax),R(-t))<1e-12);}
 for(const n of [3,4,5,6]){const S=mm(R(Math.PI/n),[[1,0,0],[0,1,0],[0,0,-1]]);let power=identity(3);for(let k=0;k<n;k++)power=mm(power,S);const expected=n%2?[[-1,0,0],[0,-1,0],[0,0,-1]]:R(Math.PI);assert.ok(error(power,expected)<1e-12);}
});
test('Conmutante con multiplicidad: dimensión cinco para A1 más dos dobletes',()=>{
 const reps=E.map(A=>directSum([[1]],directSum(A,A))),constraints=[];
 for(const D of reps)for(let i=0;i<5;i++)for(let j=0;j<5;j++){const row=Array(25).fill(0);for(let k=0;k<5;k++){row[i*5+k]+=D[k][j];row[k*5+j]-=D[i][k];}constraints.push(row);}
 assert.equal(nullspace(constraints).basis.length,5);
 const J=Array.from({length:3},()=>[1/3,1/3,1/3]),v=[1,2,6],mean=mv(J,v);assert.deepEqual(mean,[3,3,3]);const rest=v.map((x,j)=>x-mean[j]);assert.deepEqual(rest,[-2,-1,3]);close(mean.reduce((s,x,j)=>s+x*rest[j],0),0);
});
