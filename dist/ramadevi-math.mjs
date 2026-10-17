import {E,P,regular,multiply,inverse as inverseMatrix,mm as realMM,trace,innerChars,decompose,projectors} from './chapter3-math.mjs';
import {inverse as groupInverse} from './algebra.mjs';
export {E,P,regular,multiply,trace,innerChars,decompose,projectors};
export const z=(r=0,i=0)=>({r,i}),Z=x=>typeof x==='number'?z(x):x;
export const za=(a,b)=>{a=Z(a);b=Z(b);return z(a.r+b.r,a.i+b.i);};
export const zm=(a,b)=>{a=Z(a);b=Z(b);return z(a.r*b.r-a.i*b.i,a.r*b.i+a.i*b.r);};
export const conj=a=>{a=Z(a);return z(a.r,-a.i);};
export const abs=a=>Math.hypot(Z(a).r,Z(a).i);
export const eye=n=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>z(i===j?1:0)));
export const mat=A=>A.map(r=>r.map(Z));
export const scale=(A,c)=>A.map(r=>r.map(x=>zm(x,c)));
export const add=(A,B,c=1)=>A.map((r,i)=>r.map((x,j)=>za(x,zm(c,B[i][j]))));
export const mm=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>za(s,zm(x,B[k][j])),z())));
export const adj=A=>A[0].map((_,j)=>A.map(r=>conj(r[j])));
export const comm=(A,B)=>add(mm(A,B),mm(B,A),-1);
export const tr=A=>A.reduce((s,r,i)=>za(s,r[i]),z());
export const error=(A,B)=>Math.max(...add(A,B,-1).flat().map(abs));
export const kron=(A,B)=>A.flatMap(r=>B.map(b=>r.flatMap(x=>b.map(y=>zm(x,y)))));
export function expm(A,t=1,terms=32){
 let B=scale(A,t),norm=Math.max(...B.map(r=>r.reduce((s,x)=>s+abs(x),0))),s=Math.max(0,Math.ceil(Math.log2(norm||1))),C=scale(B,2**(-s)),sum=eye(A.length),term=eye(A.length);
 for(let k=1;k<=terms;k++){term=scale(mm(term,C),1/k);sum=add(sum,term);}for(let k=0;k<s;k++)sum=mm(sum,sum);return sum;
}
export const pauli=[mat([[0,1],[1,0]]),[[z(),z(0,-1)],[z(0,1),z()]],mat([[1,0],[0,-1]])];
export const gellMann=[
 [[0,1,0],[1,0,0],[0,0,0]],[[0,z(0,-1),0],[z(0,1),0,0],[0,0,0]],[[1,0,0],[0,-1,0],[0,0,0]],
 [[0,0,1],[0,0,0],[1,0,0]],[[0,0,z(0,-1)],[0,0,0],[z(0,1),0,0]],[[0,0,0],[0,0,1],[0,1,0]],[[0,0,0],[0,0,z(0,-1)],[0,z(0,1),0]],[[1/Math.sqrt(3),0,0],[0,1/Math.sqrt(3),0],[0,0,-2/Math.sqrt(3)]]
].map(mat);
export function spin(j){
 if(j<0||Math.abs(2*j-Math.round(2*j))>1e-9)throw RangeError('j entero o semientero no negativo');
 const n=Math.round(2*j+1),ms=Array.from({length:n},(_,k)=>j-k),jp=eye(n).map(r=>r.map(()=>z()));
 for(let col=1;col<n;col++)jp[col-1][col]=z(Math.sqrt((j-ms[col])*(j+ms[col]+1)));
 const jm=adj(jp),Jz=mat(ms.map((m,i)=>ms.map((_,k)=>i===k?m:0)));
 return {ms,jp,jm,Jz,Jx:scale(add(jp,jm),.5),Jy:scale(add(jp,jm,-1),z(0,-.5)),casimir:add(add(mm(scale(add(jp,jm),.5),scale(add(jp,jm),.5)),mm(scale(add(jp,jm,-1),z(0,-.5)),scale(add(jp,jm,-1),z(0,-.5)))),mm(Jz,Jz))};
}
export const spins=(j1,j2)=>Array.from({length:Math.round(2*Math.min(j1,j2))+1},(_,k)=>j1+j2-k);
const fact=n=>{if(n<0||Math.abs(n-Math.round(n))>1e-8)return NaN;let r=1;for(let k=2;k<=Math.round(n);k++)r*=k;return r;};
// Condon–Shortley convention. Small spins only (interactive controls <= 3).
export function cg(j1,m1,j2,m2,J,M){
 if(Math.abs(m1+m2-M)>1e-8||J<Math.abs(j1-j2)-1e-8||J>j1+j2+1e-8||Math.abs(M)>J+1e-8||Math.abs(m1)>j1||Math.abs(m2)>j2)return 0;
 const f=[J+j1-j2,J-j1+j2,j1+j2-J,j1+j2+J+1,J+M,J-M,j1-m1,j1+m1,j2-m2,j2+m2].map(fact);if(f.some(x=>!Number.isFinite(x)))return 0;
 const pref=Math.sqrt((2*J+1)*f[0]*f[1]*f[2]/f[3]*f.slice(4).reduce((a,b)=>a*b,1));let sum=0;
 for(let k=0;k<=Math.round(j1+j2+J+1);k++){const args=[k,j1+j2-J-k,j1-m1-k,j2+m2-k,J-j2+m1+k,J-j1-m2+k];if(args.some(x=>x<0))continue;const den=args.map(fact).reduce((a,b)=>a*b,1);if(Number.isFinite(den))sum+=(-1)**k/den;}return pref*sum;
}
export const tensorStates=(j1,j2)=>spin(j1).ms.flatMap(m1=>spin(j2).ms.map(m2=>[m1,m2]));
export const coupledStates=(j1,j2)=>spins(j1,j2).flatMap(J=>spin(J).ms.map(M=>[J,M]));
export const cgMatrix=(j1,j2)=>tensorStates(j1,j2).map(([m1,m2])=>coupledStates(j1,j2).map(([J,M])=>cg(j1,m1,j2,m2,J,M)));
export function youngDimension(N,rows){
 if(rows.some((r,i)=>r<0||!Number.isInteger(r)||i&&r>rows[i-1]))throw RangeError('Partición no creciente');
 let d=1;for(let i=0;i<rows.length;i++)for(let j=0;j<rows[i];j++){const below=rows.slice(i+1).filter(r=>r>j).length,hook=rows[i]-j+below;d*=(N+j-i)/hook;}return Math.round(d);
}
export const su3dim=(p,q)=>(p+1)*(q+1)*(p+q+2)/2;
export const alpha=[[.5,Math.sqrt(3)/2],[.5,-Math.sqrt(3)/2]],omega=[[.5,Math.sqrt(3)/6],[.5,-Math.sqrt(3)/6]];
export const weights3=[[.5,Math.sqrt(3)/6],[-.5,Math.sqrt(3)/6],[0,-Math.sqrt(3)/3]];
export const roots=weights3.flatMap((a,i)=>weights3.filter((_,j)=>j!==i).map(b=>a.map((x,k)=>x-b[k])));
export const highest=(p,q)=>omega[0].map((x,j)=>p*x+q*omega[1][j]);
export function induced(g,sign=1){const reps=[0,1,2],H=[0,3];return reps.map(ri=>reps.map(rj=>{const h=multiply(multiply(groupInverse(ri),g),rj);return H.includes(h)?h===0?1:sign:0;}));}
export const inducedChars=sign=>[0,1,3].map(g=>trace(induced(g,sign)));
export const restrictToReflection=ir=>ir==='A1'?[1,1]:ir==='A2'?[1,-1]:[2,0];
export function branchingDecuplet(){return [{I:1.5,Y:1,dim:4},{I:1,Y:0,dim:3},{I:.5,Y:-1,dim:2},{I:0,Y:-2,dim:1}];}
export function quarkStates(n=3){const rows=[];for(let u=0;u<=n;u++)for(let d=0;d<=n-u;d++){const s=n-u-d,I3=(u-d)/2,Y=(u+d-2*s)/3;rows.push({u,d,s,I3,Y,Q:I3+Y/2});}return rows;}
export const lorentz=a=>mat([[Math.cosh(a),-Math.sinh(a),0,0],[-Math.sinh(a),Math.cosh(a),0,0],[0,0,1,0],[0,0,0,1]]);
export const minkowski=mat([[1,0,0,0],[0,-1,0,0],[0,0,-1,0],[0,0,0,-1]]);
export const hydrogen=(n,mu=1,kappa=1,hbar=1)=>{if(n<1||!Number.isInteger(n))throw RangeError('n entero positivo');return {energy:-mu*kappa*kappa/(2*hbar*hbar*n*n),j:(n-1)/2,degeneracy:n*n,ls:Array.from({length:n},(_,l)=>({l,dim:2*l+1}))};};
export const realBasisChange=(A,s)=>realMM(realMM(inverseMatrix([[1,s],[0,1]]),A),[[1,s],[0,1]]);
