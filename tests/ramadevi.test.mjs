import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../dist/ramadevi-math.mjs';
import {materials} from '../dist/catalog.mjs';
import {renderRamadevi} from '../dist/ramadevi.mjs';
const near=(a,b,eps=1e-9)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const equal=(A,B,eps=1e-9)=>assert.ok(R.error(A,B)<eps,`Matrix error ${R.error(A,B)}`);
test('Inducción desde C2: ley del grupo, unitariedad y reciprocidad de Frobenius',()=>{
 for(const sign of [1,-1]){
  for(let g=0;g<6;g++){
   const A=R.mat(R.induced(g,sign));equal(R.mm(R.adj(A),A),R.eye(3));
   for(let h=0;h<6;h++)equal(R.mm(A,R.mat(R.induced(h,sign))),R.mat(R.induced(R.multiply(g,h),sign)));
  }
  const mult=R.decompose(R.inducedChars(sign));
  ['A1','A2','E'].forEach((name,i)=>{const c=R.restrictToReflection(name);near(mult[i],(c[0]+sign*c[1])/2);});
 }
});
test('Espín: escalera, Casimir, conmutadores y signo de la vuelta completa',()=>{
 for(const j of [0,.5,1,1.5,2,2.5,3]){
  const {Jx,Jy,Jz,jp,jm,casimir}=R.spin(j),I=R.eye(2*j+1);
  equal(R.comm(Jx,Jy),R.scale(Jz,R.z(0,1)));equal(R.comm(Jz,jp),jp);equal(R.comm(jp,jm),R.scale(Jz,2));equal(casimir,R.scale(I,j*(j+1)));
  const U=R.expm(R.scale(Jz,R.z(0,-1)),2*Math.PI);equal(U,R.scale(I,(-1)**(2*j)));equal(R.mm(R.adj(U),U),I);
 }
 assert.throws(()=>R.spin(.3),RangeError);
});
test('Gell-Mann: hermiticidad, traza, normalización y álgebra por proyección',()=>{
 const T=R.gellMann.map(A=>R.scale(A,.5));
 for(let a=0;a<8;a++){
  equal(T[a],R.adj(T[a]));near(R.abs(R.tr(T[a])),0);
  for(let b=0;b<8;b++){
   near(R.tr(R.mm(T[a],T[b])).r,a===b?.5:0);
   const C=R.comm(T[a],T[b]);let sum=R.scale(T[0],0);
   for(const t of T){const f=R.zm(R.z(0,-2),R.tr(R.mm(C,t)));near(f.i,0);sum=R.add(sum,R.scale(t,R.z(0,f.r)));}
   equal(C,sum);
  }
 }
});
test('CG: ortogonalidad y diagonalización independiente de J total para todos los espines del control',()=>{
 for(const a of [0,.5,1,1.5,2])for(const b of [0,.5,1,1.5,2]){
  const C=R.mat(R.cgMatrix(a,b)),A=R.spin(a),B=R.spin(b),I=R.eye(2*a+1),K=R.eye(2*b+1);
  equal(R.mm(R.adj(C),C),R.eye(C.length));
  const J=['Jx','Jy','Jz'].map(key=>R.add(R.kron(A[key],K),R.kron(I,B[key])));
  const cas=J.reduce((s,x)=>R.add(s,R.mm(x,x)),R.scale(R.eye(C.length),0));
  const states=R.coupledStates(a,b),diag=states.map(([j],i)=>states.map((_,k)=>i===k?j*(j+1):0));
  equal(R.mm(R.mm(R.adj(C),cas),C),R.mat(diag));
  equal(R.mm(R.mm(R.adj(C),J[2]),C),R.mat(states.map(([,m],i)=>states.map((_,k)=>i===k?m:0))));
 }
 near(R.cg(.5,.5,.5,-.5,0,0),1/Math.sqrt(2));near(R.cg(.5,-.5,.5,.5,0,0),-1/Math.sqrt(2));
 near(R.cg(.5,.5,1,0,1.5,.5)**2,2/3);
 near(R.cg(.5,-.5,1,1,1.5,.5)**2,1/3);
});
test('Young, SU3, raíces y pesos: dimensiones y geometría',()=>{
 for(let n=2;n<=5;n++){
  assert.equal(R.youngDimension(n,[2]),n*(n+1)/2);assert.equal(R.youngDimension(n,[1,1]),n*(n-1)/2);
  assert.equal(R.youngDimension(n,[1,1,1]),n*(n-1)*(n-2)/6);
 }
 assert.equal(R.youngDimension(2,[1,1,1]),0);
 assert.deepEqual([[1,0],[0,1],[1,1],[3,0],[2,0]].map(p=>R.su3dim(...p)),[3,3,8,10,6]);
 for(const [i,a] of R.alpha.entries())for(const [j,w] of R.omega.entries())near(2*a.reduce((s,x,k)=>s+x*w[k],0),i===j?1:0);
 for(const a of R.alpha)for(const r of R.roots){const d=r.reduce((s,x,k)=>s+x*a[k],0),im=r.map((x,k)=>x-2*d*a[k]);assert.ok(R.roots.some(x=>Math.hypot(...x.map((v,k)=>v-im[k]))<1e-9));}
 const states=R.quarkStates();assert.equal(states.length,10);
 for(const r of states){near(r.Q,2*r.u/3-r.d/3-r.s/3);near(r.Y,1-r.s);}
 assert.equal(R.branchingDecuplet().reduce((s,r)=>s+r.dim,0),10);
});
test('Lorentz y Coulomb: invariantes, composición y degeneración orbital',()=>{
 for(const a of [-1.5,-.3,0,.7,1.5]){
  const L=R.lorentz(a);equal(R.mm(R.mm(R.adj(L),R.minkowski),L),R.minkowski);equal(R.mm(L,R.lorentz(-a)),R.eye(4));
  equal(R.mm(L,R.lorentz(.3)),R.lorentz(a+.3));
 }
 for(let n=1;n<=8;n++){const h=R.hydrogen(n);near(h.ls.reduce((s,r)=>s+r.dim,0),n*n);near(-1/(2*h.energy)-1,4*h.j*(h.j+1));}
 assert.throws(()=>R.hydrogen(0),RangeError);
});
test('Ramadevi y Dubey: 40 secciones, 120 preguntas y referencias de los tres capítulos',()=>{
 assert.equal(typeof renderRamadevi,'function');const m=materials.find(m=>m.id==='ramadevi');
 assert.deepEqual(m.chapters.map(c=>c.id),[3,5,6]);assert.deepEqual(m.chapters.map(c=>c.lessons.length),[12,14,14]);
 assert.equal(m.chapters.flatMap(c=>c.quizzes).flat().length,120);
 for(const c of m.chapters)for(let i=0;i<c.lessons.length;i++){assert.ok(c.notes[i].length>1000);assert.ok(c.lessons[i].reference);assert.equal(c.quizzes[i].length,3);}
});
