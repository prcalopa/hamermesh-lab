// Models use ξ,η for the infinitesimals (called X,Y in Arrigo).
export function flow(kind,x,y,e){
 if(kind==='dilation')return [Math.exp(e)*x,Math.exp(-e)*y];
 if(kind==='rotation')return [x*Math.cos(e)-y*Math.sin(e),x*Math.sin(e)+y*Math.cos(e)];
 if(kind==='parabola')return [x+e,y+2*x*e+e*e];
 if(kind==='reciprocal')return 1-e*x>0&&1-e*y>0?[x/(1-e*x),y/(1-e*y)]:[NaN,NaN];
 throw new Error('Unknown flow');
}
export function generator(kind,x,y){return {dilation:[x,-y],rotation:[-y,x],parabola:[1,2*x],reciprocal:[x*x,y*y]}[kind];}
export function canonical(kind,x,y){return {dilation:[x*y,Math.log(Math.abs(x))],rotation:[x*x+y*y,Math.atan2(y,x)],parabola:[y-x*x,x],reciprocal:[1/x-1/y,-1/y]}[kind];}
export function lieResidual(F,Fx,Fy,xi,eta,xx,xy,ex,ey,x,y){const p=F(x,y);return ex+(ey-xx)*p-xy*p*p-xi*Fx(x,y)-eta*Fy(x,y);}
export const linear=(x,C=1,l=1)=>x/l-1/(l*l)+C*Math.exp(-l*x);
export const bernoulli=(x,C=-2,sign=1)=>sign===0?0:Math.log(x)+C<0?sign/(x*Math.sqrt(-2*(Math.log(x)+C))):NaN;
export const bernoulliFlow=(x,y,e)=>1-2*e*x*x*y*y>0?y/Math.sqrt(1-2*e*x*x*y*y):NaN;
export const riccati2=(x,C=1)=>Math.exp(x)-Math.exp(4*x)/(Math.exp(3*x)/3+C);
export const riccatiFlow=(x,y,e)=>{const q=y-Math.exp(x),d=1-e*Math.exp(-4*x)*q;return d>0?Math.exp(x)+q/d:NaN;};
export const exactM=(x,y)=>2*x**4*y+y**4;
export const exactN=(x,y)=>x**5-2*x*y**3;
export const exactIntegral=(x,y)=>y*(2*x**4-y**3)/(x*x);
export const integratingFactor=(x,y)=>1/(5*x*y*(2*x**4-y**3));
export function scalingJets(jets,a,b,e){return jets.map((v,k)=>v*Math.exp((b-k*a)*e));}
export function shearJets(p,q,z,e){const d=1+e*p;return [p/d,q/d**3,z/d**4-3*e*q*q/d**5];}
export function rk4(rhs,initial,start,end,h=.01){
 const n=Math.max(1,Math.ceil(Math.abs(end-start)/h)),dt=(end-start)/n,rows=[[start,...initial]];let y=initial.slice(),t=start;
 for(let i=0;i<n;i++){
  const a=rhs(t,y),b=rhs(t+dt/2,y.map((v,j)=>v+dt*a[j]/2)),c=rhs(t+dt/2,y.map((v,j)=>v+dt*b[j]/2)),d=rhs(t+dt,y.map((v,j)=>v+dt*c[j]));
  y=y.map((v,j)=>v+dt*(a[j]+2*b[j]+2*c[j]+d[j])/6);t=start+(i+1)*dt;
  if(y.some(v=>!Number.isFinite(v)||Math.abs(v)>1e9))break;rows.push([t,...y]);
 }return rows;
}
export const blasius=(a=.47,end=8,h=.015)=>rk4((x,[y,p,q])=>[p,q,-y*q],[0,0,a],0,end,h);
export function shootBlasius(end=8,h=.015){let lo=.1,hi=1;for(let i=0;i<32;i++){const a=(lo+hi)/2,p=blasius(a,end,h).at(-1)[2];if(p<1)lo=a;else hi=a;}return (lo+hi)/2;}
export const nonlinearSecond=(x,A=1,B=1,C=2)=>(2*A*x+B)/(A*x*x+B*x+C);
export function secondFlow(x,y,e){const d=1+2*e*y*y;if(d<=0||y===0)return [NaN,NaN];return [x+(Math.sqrt(d)-1)/y,y/Math.sqrt(d)];}
export function coupled(t,x0,y0){const U0=x0+y0,V0=y0-x0;if(1-U0*t<=0||1-V0*t<=0)return [NaN,NaN];const U=U0/(1-U0*t),V=V0/(1-V0*t);return [(U-V)/2,(U+V)/2];}
export function central(t,L=1,u0=1.2,w0=-.2,theta0=0){
 const k=L*L+1,A=w0*w0+k/(u0*u0),B=2*u0*w0,R=A*t*t+B*t+u0*u0,u=Math.sqrt(R),w=(A*t+B/2)/u;
 const theta=theta0+L/Math.sqrt(k)*(Math.atan((A*t+B/2)/Math.sqrt(k))-Math.atan(B/(2*Math.sqrt(k))));
 return {x:u*Math.cos(theta),y:u*Math.sin(theta),u,w,theta,omega:L/R,L,E:A/2};
}
// Marching squares for implicit first integrals; each segment stays in its grid cell.
export function contours(fn,K,bounds,n=65){const [xa,xb,ya,yb]=bounds,segs=[];const interp=(a,b,va,vb)=>a.map((v,i)=>v+(b[i]-v)*(K-va)/(vb-va));
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){const x=xa+(xb-xa)*i/n,y=ya+(yb-ya)*j/n,dx=(xb-xa)/n,dy=(yb-ya)/n,P=[[x,y],[x+dx,y],[x+dx,y+dy],[x,y+dy]],V=P.map(p=>fn(...p)),hits=[];
  for(let e=0;e<4;e++){const f=(e+1)%4;if((V[e]<=K&&V[f]>K)||(V[f]<=K&&V[e]>K))hits.push(interp(P[e],P[f],V[e],V[f]));}
  for(let h=0;h+1<hits.length;h+=2)segs.push({a:hits[h],b:hits[h+1]});
 }return segs;
}
