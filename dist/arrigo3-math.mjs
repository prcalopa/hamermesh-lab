// Models use the normalizations of Arrigo chapter 3.
export const hj=(t,x,c=1)=>c*x+c*c*t;
export const envelope=(t,x)=>{if(t===0)throw new RangeError('t debe ser distinto de cero');return -x*x/(4*t);};
export const heat=(t,x)=>{if(t<=0)throw new RangeError('t debe ser positivo');return Math.exp(-x*x/(4*t))/Math.sqrt(t);};
export function coleHopf(t,x,a=1,k=1){
 if(a<=0)throw new RangeError('a debe ser positivo');
 const z=Math.log(a)+k*x+k*k*t,s=z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));
 return {u:-2*k*s,v:-2*(Math.max(0,z)+Math.log1p(Math.exp(-Math.abs(z)))),ux:-2*k*k*s*(1-s),ut:-2*k**3*s*(1-s),uxx:-2*k**3*s*(1-s)*(1-2*s)};
}
export const soliton=(t,x,c=1)=>{if(c<=0)throw new RangeError('c debe ser positivo');return 3*c/Math.cosh(Math.sqrt(c)*(x-c*t)/2)**2;};
export const radialDiffusion=(t,x,y)=>{if(t<=0)throw new RangeError('t debe ser positivo');return -(x*x+y*y)/(8*t);};
export const gravity=(x,y,z,a=1,b=2)=>{const w=a*z+b;if(w<=0)throw new RangeError('az+b debe ser positivo');return Math.log(w)+x*x-y*y;};
export function rk4(rhs,initial,end,step=.01){
 const rows=[[0,...initial]],n=Math.max(1,Math.ceil(Math.abs(end)/step)),h=end/n;let y=[...initial];
 for(let i=0;i<n;i++){const x=i*h,k1=rhs(x,y),k2=rhs(x+h/2,y.map((v,j)=>v+h*k1[j]/2)),k3=rhs(x+h/2,y.map((v,j)=>v+h*k2[j]/2)),k4=rhs(x+h,y.map((v,j)=>v+h*k3[j]));y=y.map((v,j)=>v+h*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6);if(!y.every(Number.isFinite)||Math.max(...y.map(Math.abs))>1e5)break;rows.push([(i+1)*h,...y]);}return rows;
}
export const expProfile=(a=0,end=2)=>rk4((r,[f,p])=>[p,-r*p/2-1-Math.exp(f)],[a,0],end);
export const powerProfile=(a=1,m=2,end=2)=>{if(m===1)throw new RangeError('m=1 no admite esta escala');return rk4((r,[f,p])=>[p,-r*p/2-f/(m-1)+f**m],[a,0],end);};
export const potentialProfile=(a=.4,end=2,g0=.3)=>rk4((r,[f,g])=>[(1+f*f)*(g-r*f)/2,f],[a,g0],end);
export const boussProfile=(a=.1,end=2)=>rk4((r,[f,p,q,s])=>[p,q,s,-(f+r*r/4)*q-p*p-7*r*p/4-2*f],[a,0,0,0],end);
export const hjWeights=(a,b,c,p)=> (2*b-a-c)*p*p;
export const heatWeights=(a,b)=>2*b-a;
export const powerWeights=(a,b,c,m)=>[2*b-a,(m-1)*c+a];
export const d1=(f,x,h=1e-4)=>(f(x+h)-f(x-h))/(2*h);
export const d2=(f,x,h=1e-3)=>(f(x+h)-2*f(x)+f(x-h))/(h*h);
export const d3=(f,x,h=2e-3)=>(f(x+2*h)-2*f(x+h)+2*f(x-h)-f(x-2*h))/(2*h**3);
