// Modelos de la guía: magnitudes positivas salvo donde se indica otro dominio.
export const mod=(k,n)=>((k%n)+n)%n;
// r^k s^f; AB aplica B y después A.
export function dihedral(a,b,n=6){return [mod(a[0]+(a[1]?-b[0]:b[0]),n),mod(a[1]+b[1],2)];}
export function vertexMap(k,f,n=6){return Array.from({length:n},(_,j)=>mod(k+(f?-j:j),n));}
export function rotate(x,y,s){return [x*Math.cos(s)-y*Math.sin(s),x*Math.sin(s)+y*Math.cos(s)];}
export function slope(Fx,Fy,Gx,Gy,p){const d=Fx+Fy*p;return Math.abs(d)<1e-12?null:(Gx+Gy*p)/d;}
export function odeSolution(x,C){const w=Math.exp(x)+C;return w>0?Math.log(w):null;}
// Aproximación de erfc: error absoluto de orden 1.5e-7, argumento no negativo.
export function erfc(x){if(x<0)return 2-erfc(-x);const t=1/(1+.3275911*x);return (((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);}
export const heat=(x,t,k=1)=>erfc(x/(2*Math.sqrt(k*t)));
export function nonlinear(x,t,s){const w=1+s*(t+x*x/2);return w>0?-2*Math.log(w):null;}
export function nonlinearResidual(x,t,s){const w=1+s*(t+x*x/2);const ux=-2*s*x/w,ut=-2*s/w,uxx=-2*s/w+2*s*s*x*x/(w*w);return ut+ux*ux/2-uxx;}
export function nullspace(matrix,tol=1e-10){
 const a=matrix.map(r=>r.slice()),m=a.length,n=a[0].length,pivots=[];let row=0;
 for(let col=0;col<n&&row<m;col++){let best=row;for(let i=row+1;i<m;i++)if(Math.abs(a[i][col])>Math.abs(a[best][col]))best=i;if(Math.abs(a[best][col])<tol)continue;[a[row],a[best]]=[a[best],a[row]];const v=a[row][col];a[row]=a[row].map(x=>x/v);for(let i=0;i<m;i++)if(i!==row){const q=a[i][col];a[i]=a[i].map((x,j)=>x-q*a[row][j]);}pivots.push(col);row++;}
 const free=Array.from({length:n},(_,i)=>i).filter(i=>!pivots.includes(i));const basis=free.map(f=>{const v=Array(n).fill(0);v[f]=1;pivots.forEach((p,i)=>v[p]=-a[i][f]);return v;});return {rank:pivots.length,basis,rref:a};
}
export const dimensions={drag:{names:['D','ρ','U','r','μ'],matrix:[[1,1,0,0,1],[1,-3,1,1,-1],[-2,0,-1,0,-1]]},kepler:{names:['G','M','m','a','b','T'],matrix:[[-1,1,1,0,0,0],[3,0,0,1,1,0],[-2,0,0,0,0,1]]},contact:{names:['F','E','R','a'],matrix:[[1,1,0,0],[1,-1,1,1],[-2,-2,0,0]]}};
export function dimensionalResidual(matrix,exponents){return matrix.map(row=>row.reduce((s,v,i)=>s+v*exponents[i],0));}
export function rescale(q,matrix,logs){return q.map((v,j)=>v*Math.exp(matrix.reduce((s,row,i)=>s+row[j]*logs[i],0)));}
export function dragNumbers(D,rho,U,r,mu){return {cd:D/(.5*rho*U*U*Math.PI*r*r),re:2*rho*U*r/mu};}
export const stokes=(mu,U,r)=>6*Math.PI*mu*U*r;
export const keplerPi=(q,e)=>4*Math.PI*Math.PI/((1+q)*Math.pow(1-e*e,.75));
export const period=(a,q=0)=>2*Math.PI*Math.sqrt(a*a*a/(1+q));
export const mach=(U,gamma,R,T)=>U/Math.sqrt(gamma*R*T);
export const capillary=(sigma,rho,g,d,theta)=>4*sigma*Math.cos(theta)/(rho*g*d);
export const dropTime=(rho,r,sigma)=>Math.sqrt(rho*r*r*r/sigma);
export const rowing=(n,model)=>Math.pow(n,model==='similar'?1/9:model==='fixed'?0:1/6);
