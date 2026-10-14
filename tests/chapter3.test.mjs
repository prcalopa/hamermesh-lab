import test from 'node:test';
import assert from 'node:assert/strict';
import {identity,transpose,mm,mv,scale,trace,error,inverse,E,P,regular,irreps,classes,classSizes,innerChars,decompose,directSum,kron,changeBasis,skewBasis,invariantMetric,twirl,Q,blockPermutation,projectors,matrixProjector,classProduct,geometricTail,geometricPartialNorm,gram,choleskyUpper,metricAdjoint,hamiltonian,representation,multiply} from '../dist/chapter3-math.mjs';
import {materials} from '../dist/catalog.mjs';
const close=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<t,`${a} differs from ${b}`);
const matrixClose=(A,B)=>close(error(A,B),0);
test('Representaciones: 36 productos y todas las inversas en cinco realizaciones',()=>{
 for(const type of ['A1','A2','E','P','regular'])for(let g=0;g<6;g++){
  const D=representation(type,g);matrixClose(mm(D,inverse(D)),identity(D.length));
  for(let h=0;h<6;h++)matrixClose(mm(D,representation(type,h)),representation(type,multiply(g,h)));
 }
});
test('Cambio de base: acción reconstruida, homomorfismo y carácter constante',()=>{
 for(const s of [-2,-.3,0,1,2]){const S=skewBasis(s),x=[1.2,-.7],c=mv(inverse(S),x);for(let g=0;g<6;g++){
  const B=changeBasis(E[g],S),back=mv(S,mv(B,c)),direct=mv(E[g],x);back.forEach((v,i)=>close(v,direct[i]));close(trace(B),trace(E[g]));
  for(let h=0;h<6;h++)matrixClose(mm(B,changeBasis(E[h],S)),changeBasis(E[multiply(g,h)],S));
 }}
});
test('Métrica, adjunto y unitarización: positividad y conservación para todo D₃',()=>{
 for(const s of [-2,-.4,0,1,2]){const S=skewBasis(s),Ds=E.map(D=>changeBasis(D,S)),M=invariantMetric(Ds),C=choleskyUpper(M);assert.ok(M[0][0]>0);assert.ok(M[0][0]*M[1][1]-M[0][1]*M[1][0]>0);matrixClose(mm(transpose(C),C),M);
  for(const D of Ds){matrixClose(mm(mm(transpose(D),M),D),M);const U=mm(mm(C,D),inverse(C));matrixClose(mm(transpose(U),U),identity(2));}
  const A=changeBasis([[2,0],[0,1]],S);matrixClose(metricAdjoint(A,gram(S)),A);
 }
});
test('Hamiltoniano: degeneración de doblete y ruptura de simetría verificadas',()=>{
 const a=.4,b=.7,H=hamiltonian(a,b,0);for(const D of P)matrixClose(mm(H,D),mm(D,H));const eig=mm(mm(transpose(Q),H),Q);matrixClose(eig,[[a+3*b,0,0],[0,a,0],[0,0,a]]);const broken=hamiltonian(a,b,.2);assert.ok(error(mm(broken,P[1]),mm(P[1],broken))>.1);
});
test('Reducción, caracteres y ortogonalidad matricial independientes',()=>{
 matrixClose(mm(transpose(Q),Q),identity(3));for(let g=0;g<6;g++){const B=blockPermutation(g);close(B[0][0],1);for(let i=1;i<3;i++){close(B[0][i],0);close(B[i][0],0);}close(trace(P[g]),g===0?3:g<3?0:1);}
 for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++)for(let l=0;l<2;l++)close(E.reduce((s,D)=>s+D[i][j]*D[k][l],0)/6,i===k&&j===l?.5:0);
 for(const a of irreps)for(const b of irreps)close(innerChars(a.characters,b.characters),a===b?1:0);
 assert.deepEqual(decompose([3,0,1]),[1,0,1]);assert.deepEqual(decompose([6,0,0]),[1,1,2]);assert.deepEqual(decompose([4,1,0]),[1,1,1]);
});
test('Schur: el promedio de matrices arbitrarias coincide con traza sobre dimensión',()=>{
 for(const X of [[[1,2],[-3,4]],[[0,1],[-1,0]],[[2,0],[0,-2]]]){const T=twirl(X);matrixClose(T,scale(identity(2),trace(X)/2));for(const D of E)matrixClose(mm(T,D),mm(D,T));}
});
test('Regular y álgebra de clases: caracteres, multiplicidades y conteos completos',()=>{
 close(irreps.reduce((s,ir)=>s+ir.dimension**2,0),6);regular.forEach((A,g)=>close(trace(A),g===0?6:0));
 for(let i=0;i<3;i++)for(let j=0;j<3;j++){const {counts,coefficients}=classProduct(i,j);close(counts.reduce((a,b)=>a+b),classSizes[i]*classSizes[j]);classes.forEach((c,k)=>c.forEach(g=>close(counts[g],coefficients[k])));}
 assert.deepEqual(classProduct(2,2).coefficients,[3,3,0]);
});
test('Proyectores centrales y operadores de fila: idempotencia, ortogonalidad y reconstrucción',()=>{
 const total=projectors.reduce((A,B)=>A.map((r,i)=>r.map((v,j)=>v+B[i][j])),scale(identity(3),0));matrixClose(total,identity(3));
 for(let a=0;a<3;a++)for(let b=0;b<3;b++)matrixClose(mm(projectors[a],projectors[b]),a===b?projectors[a]:scale(identity(3),0));
 matrixClose(projectors[0],Array.from({length:3},()=>Array(3).fill(1/3)));matrixClose(projectors[1],scale(identity(3),0));
 for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++)for(let l=0;l<2;l++)matrixClose(mm(matrixProjector(i,j),matrixProjector(k,l)),j===k?matrixProjector(i,l):scale(identity(3),0));
 const image=mv(projectors[2],[1,2,3]);image.forEach((v,j)=>close(v,[-1,0,1][j]));
});
test('Productos tensoriales: composición del grupo producto y restricción diagonal',()=>{
 for(let g=0;g<6;g++)for(let h=0;h<6;h++){close(trace(kron(E[g],E[h])),trace(E[g])*trace(E[h]));for(let a=0;a<6;a++)matrixClose(mm(kron(E[g],E[h]),kron(E[a],E[3])),kron(E[multiply(g,a)],E[multiply(h,3)]));}
 const chars=classes.map(c=>trace(kron(E[c[0]],E[c[0]])));assert.deepEqual(decompose(chars).map(Math.round),[1,1,1]);
});
test('Hilbert: la cola geométrica coincide con una suma explícita independiente',()=>{
 for(const q of [.1,.5,.9,.95])for(const N of [1,5,30]){let partial=0,tail=0;for(let k=0;k<2000;k++)if(k<N)partial+=q**(2*k);else tail+=q**(2*k);close(geometricPartialNorm(q,N)**2,partial);close(geometricTail(q,N)**2,tail);}
});
test('Cobertura: 19 secciones, 57 preguntas y referencias coherentes',()=>{
 const chapter=materials.find(m=>m.id==='hamermesh').chapters.find(c=>c.id===3);assert.equal(chapter.lessons.length,19);assert.equal(chapter.quizzes.flat().length,57);assert.equal(chapter.notes.length,19);chapter.lessons.forEach((l,i)=>{assert.equal(l.reference,`3-${i+1}`);assert.ok(chapter.notes[i].length>1000);});
});
