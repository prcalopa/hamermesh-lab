// Matrices ortogonales 3×3, vectores columna, AB aplica primero B.
export const E = [1,0,0,0,1,0,0,0,1];
export const I = [-1,0,0,0,-1,0,0,0,-1];
export const TAU = 2*Math.PI;
export const dot = (a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const cross = (a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const unit = a=>{const n=Math.hypot(...a);if(!n)throw Error('El vector no puede ser cero');return a.map(x=>x/n);};
export const apply = (m,v)=>[0,1,2].map(i=>dot(m.slice(3*i,3*i+3),v));
export const mul = (a,b)=>Array.from({length:9},(_,k)=>{const r=Math.floor(k/3),c=k%3;return a[r*3]*b[c]+a[r*3+1]*b[c+3]+a[r*3+2]*b[c+6];});
export const transpose = m=>[m[0],m[3],m[6],m[1],m[4],m[7],m[2],m[5],m[8]];
export const det = m=>m[0]*(m[4]*m[8]-m[5]*m[7])-m[1]*(m[3]*m[8]-m[5]*m[6])+m[2]*(m[3]*m[7]-m[4]*m[6]);
export const near = (a,b,t=1e-7)=>a.every((x,i)=>Math.abs(x-b[i])<t);
export const key = m=>m.map(x=>Math.round(x*1e7)).join(',');
export function rotation(axis,angle){const[x,y,z]=unit(axis),c=Math.cos(angle),s=Math.sin(angle),t=1-c;return [t*x*x+c,t*x*y-s*z,t*x*z+s*y,t*x*y+s*z,t*y*y+c,t*y*z-s*x,t*x*z-s*y,t*y*z+s*x,t*z*z+c];}
export function reflection(normal){const n=unit(normal);return E.map((v,k)=>v-2*n[Math.floor(k/3)]*n[k%3]);}
export const rz = a=>rotation([0,0,1],a);
export const H = reflection([0,0,1]);
export const V = reflection([0,1,0]);
export const B = rotation([1,0,0],Math.PI);
export function power(m,n){let p=E;for(let i=0;i<n;i++)p=mul(m,p);return p;}
export function matrixOrder(m,limit=240){let p=E;for(let n=1;n<=limit;n++){p=mul(m,p);if(near(p,E))return n;}return null;}
export function closure(generators,limit=240){const group=[E],seen=new Set([key(E)]);for(let i=0;i<group.length;i++)for(const g of generators){const p=mul(g,group[i]),k=key(p);if(!seen.has(k)){if(group.length>=limit)throw Error('El conjunto supera el límite del laboratorio');seen.add(k);group.push(p);}}return group;}
export function classes(group){const remaining=new Set(group.map(key)),out=[];for(const a of group){if(!remaining.has(key(a)))continue;const cls=new Map(group.map(x=>{const p=mul(mul(x,a),transpose(x));return[key(p),p];}));for(const k of cls.keys())remaining.delete(k);out.push([...cls.values()]);}return out;}
export function orbit(group,p){return [...new Map(group.map(m=>{const v=apply(m,p);return[key(v),v];})).values()];}
export function pole(p){const[x,y,z]=unit(p);return[x/(1+Math.abs(z)),y/(1+Math.abs(z)),z>=-1e-8?1:-1];}
const phi=(1+Math.sqrt(5))/2;
export const solids={
 tetra:{name:'Tetraedro',p:3,q:3,V:4,E:6,F:4,group:'T',order:12,vertices:[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]]},
 cube:{name:'Cubo',p:4,q:3,V:8,E:12,F:6,group:'O',order:24,vertices:[-1,1].flatMap(x=>[-1,1].flatMap(y=>[-1,1].map(z=>[x,y,z])))},
 octa:{name:'Octaedro',p:3,q:4,V:6,E:12,F:8,group:'O',order:24,vertices:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]},
 icosa:{name:'Icosaedro',p:3,q:5,V:12,E:30,F:20,group:'Y',order:60,vertices:[-1,1].flatMap(a=>[-1,1].flatMap(b=>[[0,a,b*phi],[a,b*phi,0],[b*phi,0,a]]))},
 dodeca:{name:'Dodecaedro',p:5,q:3,V:20,E:30,F:12,group:'Y',order:60,vertices:[...[-1,1].flatMap(x=>[-1,1].flatMap(y=>[-1,1].map(z=>[x,y,z]))),...[-1,1].flatMap(a=>[-1,1].flatMap(b=>[[0,a*phi,b/phi],[a*phi,b/phi,0],[b/phi,0,a*phi]]))]}
};
export function edges(vertices){let min=Infinity;for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++)min=Math.min(min,Math.hypot(...vertices[i].map((x,k)=>x-vertices[j][k])));const out=[];for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++)if(Math.abs(Math.hypot(...vertices[i].map((x,k)=>x-vertices[j][k]))-min)<1e-7)out.push([i,j]);return out;}
function yGenerators(){const v=solids.icosa.vertices,ed=edges(v),adj=(a,b)=>ed.some(([i,j])=>i===Math.min(a,b)&&j===Math.max(a,b));let face;for(let j=1;j<v.length&&!face;j++)for(let k=j+1;k<v.length;k++)if(adj(0,j)&&adj(0,k)&&adj(j,k)){face=[0,j,k];break;}return [rotation(v[0],TAU/5),rotation([0,1,2].map(k=>face.reduce((s,i)=>s+v[i][k],0)),TAU/3)];}
const cache=new Map();
export function pointGroup(family,n=3){const id=family+':'+n;if(cache.has(id))return cache.get(id);const r=rz(TAU/n),diag=reflection([-Math.sin(Math.PI/(2*n)),Math.cos(Math.PI/(2*n)),0]);let generators;
 switch(family){
 case 'C':generators=[r];break;case 'D':generators=[r,B];break;
 case 'Ch':generators=[r,H];break;case 'Cv':generators=[r,V];break;case 'S':generators=[mul(r,H)];break;
 case 'Dh':generators=[r,B,H];break;case 'Dd':generators=[r,B,diag];break;
 case 'Ci':generators=[I];break;case 'Cs':generators=[H];break;
 case 'T':case 'Td':case 'Th':generators=[rotation([1,1,1],TAU/3),B];if(family==='Td')generators.push(reflection([1,-1,0]));if(family==='Th')generators.push(I);break;
 case 'O':case 'Oh':generators=[rz(Math.PI/2),rotation([1,0,0],Math.PI/2)];if(family==='Oh')generators.push(I);break;
 case 'Y':case 'Yh':generators=yGenerators();if(family==='Yh')generators.push(I);break;
 default:throw Error('Familia desconocida');}
 const group=closure(generators);cache.set(id,group);return group;
}
export function operation(m){if(near(m,E))return 'E · identidad';if(near(m,I))return 'I · inversión';const d=det(m),o=matrixOrder(m);if(d<0&&near(mul(m,m),E))return 'σ · reflexión';if(d<0)return 'Rotación-reflexión · orden '+o;const c=Math.max(-1,Math.min(1,(m[0]+m[4]+m[8]-1)/2));return 'Rotación '+Math.round(Math.acos(c)*180/Math.PI)+'° · orden '+o;}
export function latticeMatrix(kind,n){const a=TAU/n,c=Math.cos(a),s=Math.sin(a);if(kind==='square')return[c,-s,s,c];const t=Math.sqrt(3)/2;return[c-s/(2*t),-(t+1/(4*t))*s,s/t,c+s/(2*t)];}
export const integerMatrix = m=>m.every(x=>Math.abs(x-Math.round(x))<1e-7);
