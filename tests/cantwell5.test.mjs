import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../dist/cantwell5-math.mjs';
import {cantwell5Lessons,cantwell5Notes,cantwell5Quizzes} from '../dist/cantwell5-content.mjs';
const close=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`),dist=(a,b)=>Math.hypot(...a.map((x,j)=>x-b[j]));
test('Flujos: identidad, composición, inversa y dominios de las cartas',()=>{
 for(const k of ['rotation','translation','scale','projective','hyperbolic','arbitrary','helix','lorentz','nonlinear'])for(const p of [[1,.3,.7],[.8,-.4,-.5]])for(const [a,b]of [[.1,.2],[-.2,.1]]){const A=M.flow(k,M.flow(k,p,b),a),B=M.flow(k,p,a+b),Z=M.flow(k,p,0),back=M.flow(k,M.flow(k,p,a),-a);A.forEach((x,j)=>close(x,B[j]));Z.forEach((x,j)=>close(x,p[j]));back.forEach((x,j)=>close(x,p[j]));}
 assert.throws(()=>M.flow('projective',[1,1],1),RangeError);assert.throws(()=>M.flow('hyperbolic',[1,1],-2),RangeError);assert.throws(()=>M.flow('nonlinear',[1,1,1],1),RangeError);
 const A=M.flow('counter',M.flow('counter',[1,2],.2),.3),B=M.flow('counter',[1,2],.5);assert.ok(dist(A,B)>.1);assert.notDeepEqual(M.flow('counter',[1,2],0),[1,2]);assert.ok(dist(M.flow('linear',M.flow('linear',[1,0],.3),.4),M.flow('linear',[1,0],.7))>.05);
});
test('Invariantes exactos: pesos, rotación, Lorentz, hiperbólico y flujo tridimensional',()=>{
 for(const s of [-.4,.2,.5]){const [x,y]=M.flow('scale',[1,.4],s,2);close(y/(x*x),.4);const r=M.flow('rotation',[1,.4],s);close(r[0]**2+r[1]**2,1.16);const l=M.flow('lorentz',[1,.4],s);close(l[0]**2-l[1]**2,.84);const h=M.flow('hyperbolic',[1,.4],s);close(h[0]*h[1],.4);
  for(const z of [-.7,0,.5]){const initial=[1,.4,z],p=M.flow('nonlinear',initial,s),I=([x,y,z])=>z*Math.sqrt(Math.abs(x))*Math.exp(y*y/(4*x));close(p[1]/p[0],.4);close(I(p),I(initial));}
 }close((.5+.5)/(1+.5*.5),.8);
});
test('El flujo tridimensional satisface su campo por diferenciación independiente',()=>{
 const h=1e-5;for(const p of [[1,.4,.8],[-1,.5,-.2]])for(const s of [-.2,.2]){const A=M.flow('nonlinear',p,s),P=M.flow('nonlinear',p,s+h),Q=M.flow('nonlinear',p,s-h),rhs=[A[0]**2,A[0]*A[1],-(A[1]**2/4+A[0]/2)*A[2]];rhs.forEach((x,j)=>close((P[j]-Q[j])/(2*h),x,1e-7));}
});
test('Series: orden de rotación y diferencia entre existencia y convergencia racional',()=>{
 const exact=M.flow('rotation',[1,.3],.7),coarse=M.rotationSeries(1,.3,.7,4),fine=M.rotationSeries(1,.3,.7,8);assert.ok(dist(exact,fine)<dist(exact,coarse)/1000);assert.ok(Math.abs(Math.hypot(...coarse)-Math.hypot(1,.3))>1e-5);
 const sum=n=>Array.from({length:n+1},(_,k)=>(-2)**k).reduce((a,b)=>a+b,0);assert.ok(Math.abs(sum(8))>Math.abs(sum(4)));close(M.flow('nonlinear',[1,0,1],-2)[0],1/3);
});
test('Tabla proyectiva: cierre exacto, antisimetría y las 512 identidades de Jacobi',()=>{
 for(let i=0;i<8;i++)for(let j=0;j<8;j++){const v=M.structure[i][j],w=M.structure[j][i];v.forEach((x,k)=>close(x,-w[k]));assert.deepEqual(M.coordinates(M.basis[i]),M.unit(i));for(let k=0;k<8;k++){const A=M.coordBracket(M.unit(i),M.structure[j][k]),B=M.coordBracket(M.unit(j),M.structure[k][i]),C=M.coordBracket(M.unit(k),M.structure[i][j]);A.forEach((x,l)=>close(x+B[l]+C[l],0));}}
 assert.deepEqual(M.structure[0][4],[0,0,-2,0,0,0,-1,0]);assert.deepEqual(M.structure[4][5],M.unit(7));
});
test('Corchete polinómico comprobado por diferencias de campos, sin tabla precargada',()=>{
 const h=1e-5,at=(V,p)=>V.map(q=>M.value(q,...p));for(const i of [0,2,4,5])for(const j of [1,3,6,7]){const p=[.7,-.3],A=at(M.basis[i],p),B=at(M.basis[j],p),direct=at(M.bracket(M.basis[i],M.basis[j]),p);for(let k=0;k<2;k++){let rhs=0;for(let axis=0;axis<2;axis++){const plus=[...p],minus=[...p];plus[axis]+=h;minus[axis]-=h;rhs+=A[axis]*(at(M.basis[j],plus)[k]-at(M.basis[j],minus)[k])/(2*h)-B[axis]*(at(M.basis[i],plus)[k]-at(M.basis[i],minus)[k])/(2*h);}close(direct[k],rhs);}}
});
test('Cierre, ideal relativo y series derivadas de los ejemplos',()=>{
 assert.deepEqual(M.closure([0,2,4]).dims,[3,4]);assert.deepEqual(M.derived([5,7]),[2,0]);assert.deepEqual(M.derived([4,5,6,7]),[4,2,0]);assert.deepEqual(M.derived([0,1,2,3,4,5,6,7]),[8,8]);
 for(const i of [4,5,6,7])for(const j of [5,7])M.structure[i][j].forEach((x,k)=>{if(![5,7].includes(k))close(x,0);});assert.ok(M.structure[0][4].some((x,k)=>![4,7].includes(k)&&x!==0));
});
test('Productos de matrices: Jordan y Jacobi sin asociatividad del producto simétrico',()=>{
 const A=[[1,0],[0,-1]],B=[[0,.7],[.3,1]],C=[[1,.3],[0,-1]],norm=A=>Math.max(...A.flat().map(Math.abs)),J=M.jordan,K=M.comm,S=J(A,A);close(norm(M.add(J(J(S,B),A),J(S,J(B,A)),-1)),0);close(norm(M.add(M.add(K(A,K(B,C)),K(B,K(C,A))),K(C,K(A,B)))),0);assert.ok(norm(M.add(J(J(A,B),C),J(A,J(B,C)),-1))>.1);
});
test('Taylor–Lie y RK4: convergencia de cuarto orden y reconstrucción de las derivadas',()=>{
 const initial=[.4,.08],ref=M.integrateFlame(initial,1,.0005,'rk4').at(-1).slice(1);for(const method of ['lie','rk4']){const A=M.integrateFlame(initial,1,.2,method).at(-1).slice(1),B=M.integrateFlame(initial,1,.1,method).at(-1).slice(1),ratio=dist(A,ref)/dist(B,ref);assert.ok(ratio>10&&ratio<25,`${method}: ${ratio}`);}
 const first=M.flameDerivatives[0].map(q=>M.value(q,...initial));close(first[0],initial[1]);close(first[1],initial[1]-initial[0]/4+initial[0]**2/4);
});
test('Cobertura de Cantwell 5: veinte secciones y sesenta preguntas',()=>{
 assert.equal(cantwell5Lessons.length,20);assert.equal(cantwell5Notes.length,20);assert.equal(cantwell5Quizzes.flat().length,60);for(let j=0;j<20;j++){assert.ok(cantwell5Lessons[j].reference.startsWith('5.'));assert.ok(cantwell5Notes[j].length>1500);assert.equal(cantwell5Quizzes[j].length,3);}
});
