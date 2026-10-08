import test from 'node:test';
import assert from 'node:assert/strict';
import {E,I,H,V,B,TAU,rz,mul,transpose,near,det,pointGroup,classes,apply,unit,solids,edges,latticeMatrix,integerMatrix,matrixOrder,pole} from '../dist/symmetry.mjs';
import {chapter2Lessons,chapter2Notes,chapter2Quizzes} from '../dist/chapter2-content.mjs';
import {crystalRows} from '../dist/chapter2.mjs';

test('Grupos poliédricos: órdenes, clases, ortogonalidad y cierre',()=>{
 const expected={T:[12,4],Td:[24,5],Th:[24,8],O:[24,5],Oh:[48,10],Y:[60,5],Yh:[120,10]};
 for(const [f,[order,count]]of Object.entries(expected)){
  const group=pointGroup(f);assert.equal(group.length,order,f);assert.equal(classes(group).length,count,f);
  for(const a of group){assert(near(mul(a,transpose(a)),E),f);for(const b of group)assert(group.some(x=>near(mul(a,b),x)),f);}
 }
});
test('Los cinco sólidos son conservados por sus grupos y tienen las aristas esperadas',()=>{
 for(const [id,s]of Object.entries(solids)){
  const vertices=s.vertices.map(unit);assert.equal(edges(vertices).length,s.E,id);
  assert(pointGroup(s.group).every(m=>vertices.every(p=>vertices.some(q=>near(apply(m,p),q)))),id);
  assert.equal(s.V-s.E+s.F,2,id);
 }
});
test('Familias axiales, paridad de inversión y modelos de anillos',()=>{
 for(let n=2;n<=6;n++)for(const f of ['C','D','Ch','Cv','S','Dh','Dd']){
  const group=pointGroup(f,n);assert.equal(group.length,{C:n,D:2*n,Ch:2*n,Cv:2*n,S:n%2?2*n:n,Dh:4*n,Dd:4*n}[f],f+n);
  assert.equal(classes(group).reduce((s,c)=>s+c.length,0),group.length,f+n);
  if(['C','D'].includes(f))assert(group.every(m=>det(m)>0),f+n);
  if(f==='Dh'||f==='Dd'){
   assert.equal(group.some(m=>near(m,I)),f==='Dh'?n%2===0:n%2===1,f+n);
   const twist=f==='Dd'?Math.PI/n:0;
   const pts=[1,-1].flatMap((z,j)=>Array.from({length:n},(_,i)=>{const a=i*TAU/n-twist/2+j*twist;return[Math.cos(a),Math.sin(a),z*.63];}));
   assert(group.every(m=>pts.every(p=>pts.some(q=>near(apply(m,p),q)))),f+n);
  }
 }
});
test('Conjugación por plano horizontal, vertical y giro transversal',()=>{
 for(const n of [3,4,6]){
  const r=rz(TAU/n);assert(near(mul(mul(B,r),B),transpose(r)));
  assert(near(mul(mul(V,r),V),transpose(r)));assert(near(mul(mul(H,r),H),r));
 }
});
test('Orden de Sₙ y restricciones específicas de cada red',()=>{
 for(let n=1;n<=8;n++){
  assert.equal(matrixOrder(mul(rz(TAU/n),H)),n%2?2*n:n);
  assert.equal(integerMatrix(latticeMatrix('square',n)),[1,2,4].includes(n));
  assert.equal(integerMatrix(latticeMatrix('triangular',n)),[1,2,3,6].includes(n));
 }
});
test('La proyección mantiene la distinción de hemisferio en polos superpuestos',()=>{
 const a=pole(unit([1,2,3])),b=pole(unit([1,2,-3]));
 assert(near(a.slice(0,2),b.slice(0,2)));assert.equal(a[2],1);assert.equal(b[2],-1);
 assert(near(pole([1,0,0]),[1,0,1]));assert(near(pole([0,0,-1]),[0,0,-1]));
});
test('Catálogo de 32 grupos: sistemas, órdenes y subgrupo propio',()=>{
 assert.equal(crystalRows.length,32);assert.equal(new Set(crystalRows.map(r=>r[0])).size,32);
 assert.deepEqual(['Triclínico','Monoclínico','Ortorrómbico','Tetragonal','Trigonal','Hexagonal','Cúbico'].map(s=>crystalRows.filter(r=>r[3]===s).length),[2,3,3,7,5,7,5]);
 for(const r of crystalRows){const group=pointGroup(r[4],r[5]),own=group.filter(m=>det(m)>0).length;assert(group.length===own||group.length===2*own,r[0]);}
 assert.equal(pointGroup('S',6).length,6);assert(!pointGroup('S',6).some(m=>near(m,H)));
 assert(pointGroup('Ch',3).some(m=>near(m,H)));assert(!pointGroup('Ch',3).some(m=>near(m,I)));
});
test('Diez secciones y treinta preguntas completas',()=>{
 assert.equal(chapter2Lessons.length,10);assert.equal(chapter2Notes.length,10);assert.equal(chapter2Quizzes.flat().length,30);
 for(const q of chapter2Quizzes.flat())assert(q.correct>=0&&q.correct<q.a.length&&q.why.length>25);
});
test('Asignación clásica de colores: cierre para n par e imposibilidad para n impar',()=>{
 for(const n of [4,6])for(let a=0;a<n;a++)for(let b=0;b<n;b++)assert.equal(((a+b)%n)%2,(a%2)^(b%2));
 const n=3;assert.notEqual(((2+1)%n)%2,(2%2)^(1%2));
});
