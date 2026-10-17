import {sample,mean,sum,ols,normalQuantile,gammaCDF} from './emc-math.mjs';
export {sample,mean,sum,normalQuantile};
export function simulate({phi=[],theta=[],mu=0,sigma=1,n=120,seed=81,burn=400}={}){
 const m=Math.max(phi.length,theta.length),eps=sample(n+burn+m,seed,0,sigma),y=Array(eps.length).fill(0);
 for(let t=m;t<y.length;t++)y[t]=sum(phi.map((a,j)=>a*y[t-j-1]))+eps[t]+sum(theta.map((b,j)=>b*eps[t-j-1]));
 return {values:y.slice(-n).map(x=>x+mu),innovations:eps.slice(-n)};
}
export function acf(y,maxLag=20){const m=mean(y),c=y.map(x=>x-m),den=sum(c.map(x=>x*x));if(!den)throw RangeError('ACF indefinida para una serie constante');return Array.from({length:Math.min(maxLag,y.length-1)+1},(_,h)=>sum(c.slice(h).map((x,i)=>x*c[i]))/den);}
export function pacf(rho){const result=[1];let prev=[];for(let k=1;k<rho.length;k++){const den=1-sum(prev.map((a,j)=>a*rho[j+1])),num=rho[k]-sum(prev.map((a,j)=>a*rho[k-j-1]));if(Math.abs(den)<1e-12){result.push(null);break;}const a=num/den,next=prev.map((v,j)=>v-a*prev[k-j-2]);next.push(a);result.push(a);prev=next;}return result;}
export function difference(y,lag=1,d=1){let a=[...y];for(let k=0;k<d;k++)a=a.slice(lag).map((x,i)=>x-a[i]);return a;}
export function integrate(diffs,last){const out=[];let value=last;for(const d of diffs){value+=d;out.push(value);}return out;}
export function detrend(y){const t=y.map((_,i)=>i),fit=ols(t.map(x=>[1,x]),y);return {...fit,values:fit.res};}
export const stationaryAR2=(a,b)=>b>-1&&b<1&&a+b<1&&b-a<1;
export function arRoots(a,b=0){if(Math.abs(b)<1e-12)return Math.abs(a)<1e-12?[]:[{r:1/a,i:0}];const D=a*a+4*b;if(D>=0)return [{r:(-a+Math.sqrt(D))/(2*b),i:0},{r:(-a-Math.sqrt(D))/(2*b),i:0}];return [{r:-a/(2*b),i:Math.sqrt(-D)/(2*Math.abs(b))},{r:-a/(2*b),i:-Math.sqrt(-D)/(2*Math.abs(b))}];}
export function theoreticalMA(theta,maxLag=20){const b=[1,...theta],den=sum(b.map(x=>x*x));return Array.from({length:maxLag+1},(_,h)=>h>=b.length?0:sum(b.slice(h).map((x,j)=>x*b[j]))/den);}
export function impulse(phi=[],theta=[],n=30){const psi=[1];for(let j=1;j<n;j++)psi[j]=(theta[j-1]??0)+sum(phi.map((a,k)=>a*(psi[j-k-1]??0)));return psi;}
export function fitAR(y,p=1,start=p){if(!p){const a=y.slice(start),mu=mean(a),res=a.map(x=>x-mu);return {beta:[mu],phi:[],mu,intercept:mu,res,sse:sum(res.map(x=>x*x)),n:res.length,p};}const X=y.slice(start).map((_,i)=>[1,...Array.from({length:p},(_,j)=>y[start+i-j-1])]),fit=ols(X,y.slice(start)),phi=fit.beta.slice(1),intercept=fit.beta[0],den=1-sum(phi);return {...fit,phi,intercept,mu:Math.abs(den)>1e-10?intercept/den:null,n:fit.res.length,p};}
export function residuals11(y,phi,theta,mu=0){const res=[];for(let t=0;t<y.length;t++)res.push(y[t]-mu-phi*((y[t-1]??mu)-mu)-theta*(res[t-1]??0));return res;}
// Conditional sum of squares for a centered ARMA(1,1), not exact Gaussian MLE.
export function fitCSS11(y){const mu=mean(y),score=(a,b)=>sum(residuals11(y,a,b,mu).map(x=>x*x));let best={phi:0,theta:0,sse:Infinity};for(let a=-.9;a<=.9001;a+=.15)for(let b=-.9;b<=.9001;b+=.15){const sse=score(a,b);if(sse<best.sse)best={phi:a,theta:b,sse};}for(const step of [.05,.01,.002])for(let pass=0;pass<30;pass++){let changed=false;for(const [da,db] of [[step,0],[-step,0],[0,step],[0,-step]]){const a=best.phi+da,b=best.theta+db;if(Math.max(Math.abs(a),Math.abs(b))>=.98)continue;const sse=score(a,b);if(sse<best.sse-1e-12){best={phi:a,theta:b,sse};changed=true;}}if(!changed)break;}return {...best,mu,res:residuals11(y,best.phi,best.theta,mu)};}
export function criteria(logLikelihood,k,n){const aic=-2*logLikelihood+2*k;return {aic,aicc:n>k+1?aic+2*k*(k+1)/(n-k-1):null,bic:-2*logLikelihood+k*Math.log(n)};}
export function conditionalCriteria(res,p){const n=res.length,sse=sum(res.map(x=>x*x)),logLikelihood=-n/2*(Math.log(2*Math.PI)+1+Math.log(sse/n)),k=p+2;return {...criteria(logLikelihood,k,n),logLikelihood,k,n};}
export function ljungBox(res,lags=12,fitdf=0){const n=res.length,rho=acf(res,lags),h=rho.length-1,Q=n*(n+2)*sum(rho.slice(1).map((r,j)=>r*r/(n-j-1))),df=h-fitdf;return {Q,df,p:df>0?1-gammaCDF(Q/2,df/2):null};}
export function forecastARMA11({last=0,lastInnovation=0,phi=.6,theta=0,mu=0,sigma=1,h=12,level=.95}={}){const psi=impulse([phi],[theta],h),z=normalQuantile((1+level)/2),out=[];let x=last-mu,varSum=0;for(let j=0;j<h;j++){x=phi*x+(j===0?theta*lastInnovation:0);varSum+=sigma*sigma*psi[j]*psi[j];const center=mu+x,se=Math.sqrt(varSum);out.push({h:j+1,mean:center,se,lo:center-z*se,hi:center+z*se});}return out;}
export function forecastWalk({last=0,drift=0,sigma=1,h=12,level=.95}={}){const z=normalQuantile((1+level)/2);return Array.from({length:h},(_,j)=>{const se=sigma*Math.sqrt(j+1),center=last+(j+1)*drift;return {h:j+1,mean:center,se,lo:center-z*se,hi:center+z*se};});}
export function seasonalSeries({n=120,s=12,slope=.05,amplitude=2,seed=42}={}){const e=simulate({phi:[.4],n,seed}).values;return e.map((x,t)=>10+slope*t+amplitude*Math.sin(2*Math.PI*t/s)+.4*x);}
// (1-Phi B^s)(1-B)y=(1+theta B)epsilon; zero initial states.
export function sarimaSeries({Phi=.7,theta=-.5,s=12,n=144,seed=72}={}){const e=sample(n,seed),w=[],y=[];for(let t=0;t<n;t++){w.push(Phi*(w[t-s]??0)+e[t]+theta*(e[t-1]??0));y.push((y[t-1]??0)+w[t]);}return {values:y,differences:w,innovations:e};}
export function seasonalFilter(y,Phi,theta,s=12){const w=difference(y),u=w.map((x,i)=>x-Phi*(w[i-s]??0)),res=[];for(let i=0;i<u.length;i++)res.push(u[i]-theta*(res[i-1]??0));return {w,u,res};}
export function rollingAR1(y,start=40,h=1){const rows=[];for(let end=start;end+h<=y.length;end++){const fit=fitAR(y.slice(0,end),1),a=fit.phi[0];let pred=y[end-1];for(let j=0;j<h;j++)pred=fit.intercept+a*pred;rows.push({origin:end,target:end+h,actual:y[end+h-1],pred,naive:y[end-1]});}return {rows,rmse:Math.sqrt(mean(rows.map(r=>(r.actual-r.pred)**2))),naiveRMSE:Math.sqrt(mean(rows.map(r=>(r.actual-r.naive)**2)))};}
export function kalman(observations,Q=.1,R=1,initial=0,P0=1){let x=initial,P=P0;return observations.map(z=>{const prior=x,Pprior=P+Q,K=Pprior/(Pprior+R);x=prior+K*(z-prior);P=(1-K)*Pprior;return {prior,estimate:x,K,P,innovation:z-prior};});}
