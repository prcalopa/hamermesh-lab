import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/emc8-math.mjs';
import {variance} from '../dist/emc-math.mjs';
import {materials} from '../dist/catalog.mjs';
import {emc8Configs} from '../dist/emc8.mjs';
const near=(a,b,eps=1e-9)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
test('Diferencias: identidades discretas, inversión y cancelación estacional',()=>{
 assert.deepEqual(T.difference([2,5,9,14]),[3,4,5]);assert.deepEqual(T.difference([2,5,9,14],1,2),[1,1]);assert.deepEqual(T.integrate([3,4,5],2),[5,9,14]);
 const y=Array.from({length:80},(_,t)=>3+.2*t+2*Math.sin(2*Math.PI*t/12));T.difference(y,12).forEach(x=>near(x,2.4));
 assert.deepEqual(T.difference(T.difference(y,12)),T.difference(T.difference(y),12));
 const noise=T.sample(40000,91),d=T.difference(noise);assert.ok(Math.abs(variance(d)/variance(noise)-2)<.03);assert.ok(Math.abs(T.acf(d,1)[1]+.5)<.02);
});
test('ACF: sumas independientes, escala, media y límites de definición',()=>{
 const y=[2,4,1,5,3],r=T.acf(y,4);near(r[0],1);const m=3,den=10;
 for(let h=1;h<5;h++){let num=0;for(let i=h;i<5;i++)num+=(y[i]-m)*(y[i-h]-m);near(r[h],num/den);}
 T.acf(y.map(x=>100*x+12),4).forEach((v,i)=>near(v,r[i]));assert.throws(()=>T.acf([1,1,1]),RangeError);
});
test('AR(1) y AR(2): raíces, estacionariedad y momentos de simulación',()=>{
 for(const [a,b] of [[.6,.35],[1.1,.2],[-.4,-.5],[.3,.9],[.8,0],[1,0]]){
  const roots=T.arRoots(a,b);assert.equal(T.stationaryAR2(a,b),roots.every(z=>Math.hypot(z.r,z.i)>1+1e-10));
  for(const z of roots){near(1-a*z.r-b*(z.r*z.r-z.i*z.i),0,1e-8);near(-a*z.i-2*b*z.r*z.i,0,1e-8);}
 }
 const a=.7,sigma=2,mu=3,y=T.simulate({phi:[a],sigma,mu,n:40000}).values;
 assert.ok(Math.abs(T.mean(y)-mu)<.12);assert.ok(Math.abs(variance(y)-sigma*sigma/(1-a*a))<.25);assert.ok(Math.abs(T.acf(y,3)[3]-a**3)<.025);
});
test('PACF: Durbin–Levinson frente a AR teóricos y Yule–Walker',()=>{
 for(const a of [-.8,0,.7]){const r=Array.from({length:15},(_,h)=>a**h),p=T.pacf(r);near(p[1],a);p.slice(2).forEach(x=>near(x,0));}
 const a=.6,b=.35,r=[1,a/(1-b)];for(let h=2;h<14;h++)r.push(a*r[h-1]+b*r[h-2]);const p=T.pacf(r);near(p[1],a/(1-b));near(p[2],b);p.slice(3).forEach(x=>near(x,0));
});
test('MA y ARMA: corte de ACF, pesos impulsionales y cancelación',()=>{
 const ma=T.theoreticalMA([.5],6);near(ma[0],1);near(ma[1],.4);assert.deepEqual(ma.slice(2),[0,0,0,0,0]);
 for(const [a,b] of [[.6,-.3],[-.5,.8],[.7,-.7]]){const psi=T.impulse([a],[b],15);near(psi[0],1);for(let j=1;j<psi.length;j++)near(psi[j],a**(j-1)*(a+b));}
 const data=T.simulate({phi:[.7],theta:[-.7],n:200});data.values.forEach((x,i)=>near(x,data.innovations[i],1e-12));
 const y=T.simulate({theta:[.5,-.2],n:40000}).values,r=T.acf(y,6),th=T.theoreticalMA([.5,-.2],6);r.forEach((x,i)=>assert.ok(Math.abs(x-th[i])<.025));
});
test('Estimación AR y CSS: regresión exacta y función objetivo mejorada',()=>{
 let x=.7;const y=[];for(let i=0;i<25;i++){y.push(x);x=1+.6*x;}
 const ar=T.fitAR(y,1);near(ar.intercept,1,1e-9);near(ar.phi[0],.6,1e-9);near(ar.mu,2.5,1e-9);
 const z=T.simulate({phi:[.6],theta:[-.3],n:180}).values,fit=T.fitCSS11(z),score=(a,b)=>T.sum(T.residuals11(z,a,b,fit.mu).map(x=>x*x));
 near(fit.sse,score(fit.phi,fit.theta));assert.ok(fit.sse<=score(0,0));assert.ok(fit.sse<=score(.6,-.3)+.02);assert.ok(Math.abs(fit.phi)<.98&&Math.abs(fit.theta)<.98);
 const res=T.residuals11([1,2,3],.5,.2,0);near(res[0],1);near(res[1],1.3);near(res[2],1.74);
});
test('SARIMA: expansión multiplicativa e innovaciones recuperadas tras inicialización',()=>{
 const Phi=.7,theta=-.5,d=T.sarimaSeries({Phi,theta,n:180});
 for(let t=13;t<180;t++)near(d.values[t],d.values[t-1]+Phi*d.values[t-12]-Phi*d.values[t-13]+d.innovations[t]+theta*d.innovations[t-1]);
 const recovered=T.seasonalFilter(d.values,Phi,theta).res;
 for(let i=70;i<recovered.length;i++)near(recovered[i],d.innovations[i+1],1e-10);
});
test('Previsión: recursión, varianza por ψ y simulación de errores futuros',()=>{
 const f=T.forecastARMA11({last:3,phi:.8,theta:0,h:10});near(f[1].mean,1.92);near(f[1].se**2,1.64);
 f.forEach((r,i)=>{near(r.mean,3*.8**(i+1));near(r.se*r.se,(1-.8**(2*(i+1)))/(1-.8*.8));assert.ok(r.lo<r.mean&&r.hi>r.mean);});
 const ma=T.forecastARMA11({last:3,lastInnovation:2,phi:.6,theta:-.3,h:4});near(ma[0].mean,1.2);near(ma[1].mean,.72);
 T.forecastWalk({last:2,drift:.1,sigma:2,h:8}).forEach((r,i)=>{near(r.mean,2+.1*(i+1));near(r.se*r.se,4*(i+1));});
 const random=T.sample(60000,13),psi=T.impulse([.6],[-.3],3),errors=Array.from({length:20000},(_,i)=>psi.reduce((s,p,j)=>s+p*random[3*i+j],0));
 assert.ok(Math.abs(variance(errors)-T.forecastARMA11({phi:.6,theta:-.3,h:3})[2].se**2)<.04);
});
test('Criterios y Ljung–Box: recuentos y fórmulas independientes',()=>{
 const c=T.criteria(-100,3,80);near(c.aic,206);near(c.aicc,206+24/76);near(c.bic,200+3*Math.log(80));assert.equal(T.criteria(-10,4,5).aicc,null);
 const res=[1,-2,1,3,-1,2,-3,1,2,-1],r=T.acf(res,4),Q=res.length*(res.length+2)*(r[1]**2/9+r[2]**2/8+r[3]**2/7+r[4]**2/6),check=T.ljungBox(res,4,2);near(check.Q,Q);near(check.p,Math.exp(-Q/2));
 assert.equal(T.ljungBox(res,2,2).p,null);
});
test('Origen móvil: ausencia de fuga, índices y filtro de Kalman',()=>{
 const y=T.simulate({phi:[.7],n:100}).values,a=T.rollingAR1(y,40,3),changed=[...y];changed[80]+=1000;const b=T.rollingAR1(changed,40,3);
 for(let i=0;i<a.rows.length;i++){const row=a.rows[i];assert.equal(row.target,row.origin+3);near(row.actual,y[row.target-1]);if(row.origin<=80)near(row.pred,b.rows[i].pred);}
 const k=T.kalman([3],1,1,0,1)[0];near(k.K,2/3);near(k.estimate,2);near(k.P,2/3);
 const fast=T.kalman([3],1,.1,0,1)[0],slow=T.kalman([3],1,10,0,1)[0];assert.ok(fast.K>slow.K);assert.ok(fast.P>=0&&slow.P>=0);
});
test('Cobertura del capítulo 8: veinte secciones, sesenta preguntas y fuente Parte 2',()=>{
 const m=materials.find(m=>m.id==='emc'),c=m.chapters.find(c=>c.id===8);assert.equal(c.lessons.length,20);assert.equal(c.notes.length,20);assert.equal(c.quizzes.flat().length,60);assert.equal(emc8Configs.length,20);assert.equal(c.pdfPart,2);assert.equal(c.pdfPages,'3–24');
 for(let i=0;i<20;i++){assert.ok(c.notes[i].length>1100);assert.ok(c.lessons[i].reference);assert.equal(c.quizzes[i].length,3);}
 assert.equal(m.chapters.length,8);assert.equal(m.chapters.flatMap(c=>c.lessons).length,88);
});
