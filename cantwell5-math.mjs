export function flow(kind,p,s,a=2){
 const [x,y,z=0]=p,c=Math.cos(s),q=Math.sin(s);
 if(kind==='rotation')return [x*c-y*q,x*q+y*c];
 if(kind==='translation')return [x+s,y];
 if(kind==='counter')return [-x+s,y];
 if(kind==='linear')return [x-s*y,y+s*x];
 if(kind==='scale')return [Math.exp(s)*x,Math.exp(a*s)*y];
 if(kind==='projective'){const d=1-s*y;if(d<=0)throw RangeError('El flujo cruza un polo');return [x/d,y/d];}
 if(kind==='hyperbolic'){if(x===0||x*(x+s)<=0)throw RangeError('Carta x distinta de cero, sin cruzar el polo');return [x+s,x*y/(x+s)];}
 if(kind==='arbitrary')return [x,y+s*(1+x*x)];
 if(kind==='helix')return [x*c-y*q,x*q+y*c,z+a*s];
 if(kind==='lorentz')return [x*Math.cosh(s)+y*Math.sinh(s),x*Math.sinh(s)+y*Math.cosh(s)];
 if(kind==='nonlinear'){const d=1-s*x;if(d<=0||x===0)throw RangeError('Se requiere x distinto de cero y flujo sin polo');return [x/d,y/d,z*Math.sqrt(d)*Math.exp(-y*y*(1/d-1)/(4*x))];}
 throw Error('Modelo desconocido');
}
export function rotationSeries(x,y,s,n){let X=x,Y=y,tx=x,ty=y;for(let k=1;k<=n;k++){const nx=-ty*s/k,ny=tx*s/k;tx=nx;ty=ny;X+=tx;Y+=ty;}return [X,Y];}
// Sparse bivariate polynomials: exact integer arithmetic for the chapter's basis.
const clean=p=>Object.fromEntries(Object.entries(p).filter(([,v])=>Math.abs(v)>1e-12));
export const poly=(terms={})=>clean(terms);
export const plus=(a,b,t=1)=>{const c={...a};for(const [k,v]of Object.entries(b))c[k]=(c[k]||0)+t*v;return clean(c);};
export const times=(a,b)=>{const c={};for(const [k,u]of Object.entries(a))for(const [l,v]of Object.entries(b)){const [i,j]=k.split(',').map(Number),[m,n]=l.split(',').map(Number),key=[i+m,j+n].join(',');c[key]=(c[key]||0)+u*v;}return clean(c);};
export const derivative=(p,axis)=>{const c={};for(const [key,v]of Object.entries(p)){const e=key.split(',').map(Number),n=e[axis];if(n){e[axis]--;c[e.join(',')]=n*v;}}return clean(c);};
export const value=(p,x,y)=>Object.entries(p).reduce((s,[k,v])=>{const [i,j]=k.split(',').map(Number);return s+v*x**i*y**j;},0);
export const act=(V,p)=>plus(times(V[0],derivative(p,0)),times(V[1],derivative(p,1)));
export const bracket=(A,B)=>B.map((p,j)=>plus(act(A,p),act(B,A[j]),-1));
export const basis=[[{'2,0':1},{'1,1':1}],[{'1,1':1},{'0,2':1}],[{'1,0':1},{}],[{'0,1':1},{}],[{'0,0':1},{}],[{},{'1,0':1}],[{},{'0,1':1}],[{},{'0,0':1}]];
const mons=['0,0','1,0','0,1','2,0','1,1','0,2'];
const flatten=V=>V.flatMap(p=>mons.map(k=>p[k]||0));
function solve(A,b){const rows=A.map((r,i)=>[...r,b[i]]),n=A[0].length;let pos=0;const piv=[];for(let j=0;j<n;j++){let k=pos;while(k<rows.length&&Math.abs(rows[k][j])<1e-10)k++;if(k===rows.length)continue;[rows[pos],rows[k]]=[rows[k],rows[pos]];const v=rows[pos][j];rows[pos]=rows[pos].map(x=>x/v);for(let i=0;i<rows.length;i++)if(i!==pos){const d=rows[i][j];rows[i]=rows[i].map((x,k)=>x-d*rows[pos][k]);}piv.push(j);pos++;}for(const r of rows)if(r.slice(0,n).every(x=>Math.abs(x)<1e-9)&&Math.abs(r[n])>1e-8)throw Error('Fuera del espacio generado');const x=Array(n).fill(0);piv.forEach((j,i)=>x[j]=rows[i][n]);return x;}
export const coordinates=V=>{for(const p of V)for(const k of Object.keys(p))if(!mons.includes(k))throw Error('Grado fuera de la base');const cols=basis.map(flatten);return solve(cols[0].map((_,j)=>cols.map(c=>c[j])),flatten(V));};
export const structure=basis.map(A=>basis.map(B=>coordinates(bracket(A,B))));
export const coordBracket=(a,b)=>Array.from({length:8},(_,k)=>a.reduce((s,u,i)=>s+b.reduce((t,v,j)=>t+u*v*structure[i][j][k],0),0));
export const unit=i=>Array.from({length:8},(_,j)=>i===j?1:0);
export function span(rows){const R=rows.map(r=>[...r]);let p=0;for(let j=0;j<8;j++){let k=p;while(k<R.length&&Math.abs(R[k][j])<1e-9)k++;if(k===R.length)continue;[R[p],R[k]]=[R[k],R[p]];const d=R[p][j];R[p]=R[p].map(x=>x/d);for(let i=0;i<R.length;i++)if(i!==p){const q=R[i][j];R[i]=R[i].map((x,l)=>x-q*R[p][l]);}p++;}return R.slice(0,p);}
export function closure(indices){let rows=span(indices.map(unit)),dims=[rows.length];for(let k=0;k<8;k++){const next=span([...rows,...rows.flatMap(a=>rows.map(b=>coordBracket(a,b)))]);if(next.length===rows.length)break;rows=next;dims.push(rows.length);}return {rows,dims};}
export function derived(indices){let rows=span(indices.map(unit)),dims=[rows.length];for(let k=0;k<9&&rows.length;k++){const next=span(rows.flatMap(a=>rows.map(b=>coordBracket(a,b))));dims.push(next.length);if(next.length===rows.length)break;rows=next;}return dims;}
export const flameField=[{'0,1':1},{'0,1':1,'1,0':-.25,'2,0':.25}];
export const flameDerivatives=(()=>{const all=[];let p=[{'1,0':1},{'0,1':1}];for(let k=0;k<4;k++){p=p.map(q=>act(flameField,q));all.push(p);}return all;})();
export function stepFlame(p,h,method='rk4'){
 const f=([x,y])=>[y,y-x/4+x*x/4];
 if(method==='lie'){let q=[...p],factor=1;for(let k=0;k<4;k++){factor*=h/(k+1);q=q.map((z,j)=>z+factor*value(flameDerivatives[k][j],...p));}return q;}
 const a=f(p),b=f(p.map((z,j)=>z+h*a[j]/2)),c=f(p.map((z,j)=>z+h*b[j]/2)),d=f(p.map((z,j)=>z+h*c[j]));return p.map((z,j)=>z+h*(a[j]+2*b[j]+2*c[j]+d[j])/6);
}
export function integrateFlame(initial,end=3,h=.05,method='rk4'){const n=Math.ceil(Math.abs(end)/h),dt=end/n,rows=[[0,...initial]];let p=[...initial];for(let i=0;i<n;i++){p=stepFlame(p,dt,method);if(!p.every(Number.isFinite)||Math.max(...p.map(Math.abs))>1e4)break;rows.push([(i+1)*dt,...p]);}return rows;}
export const mm=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>s+x*B[k][j],0)));
export const add=(A,B,t=1)=>A.map((r,i)=>r.map((x,j)=>x+t*B[i][j]));
export const comm=(A,B)=>add(mm(A,B),mm(B,A),-1);
export const jordan=(A,B)=>add(mm(A,B),mm(B,A));
