import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../dist/emc-math.mjs';
import {materials} from '../dist/catalog.mjs';
import {emcLabConfigs} from '../dist/emc.mjs';
const near=(a,b,eps=1e-9)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
test('Descriptiva: momentos, unidades, cuantiles y rangos con empates',()=>{
 const a=[1,2,3];near(M.mean(a),2);near(M.variance(a),1);near(M.variance(a,0),2/3);
 near(M.variance(a.map(x=>10*x+5)),100);near(M.covariance(a,a.map(x=>-2*x)),-2);near(M.correlation(a,a.map(x=>-2*x)),-1);
 assert.deepEqual([0,.25,.5,.75,1].map(p=>M.quantile([4,1,3,2],p)),[1,1.75,2.5,3.25,4]);
 assert.deepEqual(M.ranks([3,1,1,4]),[3,1.5,1.5,4]);
 for(const k of [3,7,16]){const h=M.histogram(M.sample(120,28),k);assert.equal(M.sum(h.map(r=>r.n)),120);near(M.sum(h.map(r=>r.density*(r.hi-r.lo))),1);}
});
test('Distribuciones numéricas frente a casos cerrados y cuantiles conocidos',()=>{
 for(const x of [-4,-1,0,.5,2,5]){
  near(M.studentCDF(x,1),.5+Math.atan(x)/Math.PI,1e-12);
  near(M.studentCDF(x,2),.5+x/(2*Math.sqrt(x*x+2)),1e-12);
 }
 for(const x of [.1,.5,.9])near(M.betaCDF(x,1,1),x,1e-12);
 for(const x of [.1,1,3,10]){near(M.gammaCDF(x,1),1-Math.exp(-x),1e-12);near(M.fCDF(x,2,2),x/(1+x),1e-12);}
 near(M.studentQuantile(.975,22),2.0738730679040147,1e-10);
 near(M.normalQuantile(.975),1.959963984540054,2e-6);
 near(1-M.gammaCDF(2,.5),.04550026389635842,1e-12);
 for(const n of [5,20,80])for(const p of [.1,.3,.9]){const b=M.binomial(n,p);near(M.sum(b),1,2e-12);near(M.sum(b.map((v,k)=>k*v)),n*p,1e-10);}
});
test('Welch, ANOVA y chi-cuadrado: ejemplos reconstruidos y cambios de unidades',()=>{
 const a=[10,11,9,12,8],b=[12,13,10,14,11],w=M.welch(a,b);near(w.t,-2);near(w.df,8);near(w.p,.08051623795726257,1e-12);
 const scaled=M.welch(a.map(x=>3*x+8),b.map(x=>3*x+8));near(scaled.t,w.t);near(scaled.p,w.p);near(scaled.se,3*w.se);
 const groups=[[1,2,3],[3,4,5],[5,6,7]],an=M.anova(groups);near(an.between,24);near(an.within,6);near(an.F,12);near(an.p,.008,1e-12);
 const all=groups.flat();near(an.total,M.sum(all.map(x=>(x-M.mean(all))**2)));
 const c=M.chiSquare([[30,20],[20,30]]);near(c.stat,4);near(c.p,.04550026389635842,1e-12);assert.equal(c.df,1);assert.deepEqual(c.expected,[[25,25],[25,25]]);
});
test('Rangos exactos, potencia normal y Wilson con casos límite',()=>{
 const w=M.wilcoxon([1,2,3,4],[5,6,7,8]);near(w.U,0);near(w.p,2/70);assert.equal(w.total,70);
 near(M.wilcoxon([1,2,3,4],[1,2,3,4]).p,1);
 for(const n of [4,20,100])near(M.power(n,0,2,.05),.05,2e-7);
 assert.ok(M.power(100,1)>M.power(20,1));assert.ok(M.power(64,1)> .80&&M.power(64,1)<.82);
 const [lo,hi]=M.wilson(8,10);near(lo,.49016247153664183,1e-10);near(hi,.9433178485456247,1e-10);
 near(M.wilson(0,10)[0],0);near(M.wilson(10,10)[1],1);assert.equal(M.wilson(0,0),null);
});
test('K-means: objetivo no creciente, centroides y diagnóstico geométrico',()=>{
 const data=M.clusterData();for(const k of [1,2,3,5,6])for(const seed of [1,3,8]){
  const h=M.kmeans(data,k,seed);for(let i=1;i<h.length;i++)assert.ok(h[i].wss<=h[i-1].wss+1e-10);
  const last=h.at(-1);near(last.wss,M.sum(data.map((p,i)=>M.distance2(p,last.centers[last.labels[i]]))));
  last.centers.forEach((c,j)=>{const group=data.filter((_,i)=>last.labels[i]===j);if(group.length)c.forEach((v,q)=>near(v,M.mean(group.map(p=>p[q]))));});
  M.silhouette(data,last.labels).forEach(s=>assert.ok(s>=-1&&s<=1));
 }
 const z=M.standardize(data);for(let j=0;j<2;j++){near(M.mean(z.map(p=>p[j])),0);near(M.variance(z.map(p=>p[j])),1);}
 assert.deepEqual(M.dbscan([[0,0],[.1,0],[.2,0],[3,0]],.15,3),[0,0,0,-1]);
 assert.deepEqual(M.dbscan([[0,0],[1,0]],.1,2),[-1,-1]);
});
test('Apriori frente a enumeración exhaustiva, métricas y casos de confianza',()=>{
 const items=['A','B','C','D'];for(const threshold of [.1,.25,.3,.6,.8]){
  const brute=[];for(let mask=1;mask<16;mask++){const s=items.filter((_,j)=>mask&(1<<j));if(M.support(s)>=threshold)brute.push(s.join(''));}
  assert.deepEqual(M.apriori(M.baskets,threshold).result.map(r=>r.items.join('')).sort(),brute.sort());
 }
 const r=M.rule(['A'],['B']);near(r.sx,8/12);near(r.sy,8/12);near(r.joint,5/12);near(r.confidence,5/8);near(r.lift,15/16);
 assert.equal(M.rule(['Z'],['A']).confidence,null);
 const perfect=M.rule(['D'],['A'],[['D','A'],['A'],['B']]);assert.equal(perfect.conviction,Infinity);
 for(const a of M.apriori().result)for(const b of M.apriori().result)if(a.items.every(x=>b.items.includes(x)))assert.ok(a.support>=b.support);
});
test('QR: ecuaciones normales, coeficientes exactos, matriz de covarianza y rango',()=>{
 const X=[[1,0],[1,1],[1,2]],fit=M.ols(X,[1,2,5]);near(fit.beta[0],2/3);near(fit.beta[1],2);near(fit.sse,2/3);near(M.sum(fit.res),0);near(M.sum(fit.leverage),2);
 for(let j=0;j<2;j++)near(M.sum(fit.res.map((e,i)=>e*X[i][j])),0);
 near(fit.cov[1][1],1/3);near(fit.cov[0][0],5/9);near(fit.cov[0][1],-1/3);
 const x=Array.from({length:20},(_,i)=>i/10-1),A=x.map(v=>[1,v,v*v]),y=x.map(v=>2-3*v+.5*v*v),m=M.ols(A,y);[2,-3,.5].forEach((v,i)=>near(v,m.beta[i]));near(m.sse,0);
 assert.throws(()=>M.ols([[1,1,2],[1,2,4],[1,3,6],[1,4,8]],[1,2,3,4]),RangeError);
});
test('Ridge y estabilidad logística: penalización, gradiente y valores extremos',()=>{
 const x=[-2,-1,0,1,2],X=x.map(v=>[1,v]),y=x.map(v=>4+3*v);
 const a=M.ridge(X,y,0),b=M.ridge(X,y,10);near(a.beta[0],4);near(a.beta[1],3);near(b.beta[0],4);near(b.beta[1],1.5);
 for(const s of [-1000,-100,-1,0,1,100,1000]){assert.ok(Number.isFinite(M.softplus(s)));near(M.sigmoid(s)+M.sigmoid(-s),1);}
 assert.ok(Number.isFinite(M.logLoss([1,0],[-1000,1000])));near(M.logLoss([1,0],[-1000,1000]),1000);
 const xs=[-2,-1,1,2],ys=[0,1,0,1],beta=.7,eps=1e-5,loss=b=>M.logLoss(ys,xs.map(x=>b*x)),numerical=(loss(beta+eps)-loss(beta-eps))/(2*eps),gradient=M.mean(xs.map((x,i)=>x*(M.sigmoid(beta*x)-ys[i])));near(numerical,gradient,1e-9);
});
test('Entropía, ganancia, Bayes y pseudocuentas normalizadas',()=>{
 near(M.entropy([0,10]),0);near(M.entropy([5,5]),1);near(M.gini([5,5]),.5);near(M.splitGain([7,1],[1,7]),.45643555680040354);
 near(M.bayes(1/5000,1,.01),1/(1+49.99));near(M.bayes(.5,.8,.2),.8);
 const nb=M.nbPosterior(.4,[[.8,.2],[.6,.3]]);near(nb.posterior[0],.192/.228);near(M.sum(nb.posterior),1);
 for(const alpha of [0,.1,1,3])near(M.sum([10,0,0].map(n=>M.smooth(n,10,3,alpha))),1);
 const s=M.stump([-2,-1,1,2],[0,0,1,1],1);near(s.t,0);near(s.gain,1);near(s.pL,0);near(s.pR,1);
});
test('Confusión, ROC y AUC: pares exhaustivos, empates y orden inverso',()=>{
 const c=M.confusion([1,1,0,0],[.9,.4,.8,.2],.5);assert.deepEqual([c.tp,c.fp,c.tn,c.fn],[1,1,1,1]);near(c.precision,.5);near(c.recall,.5);
 assert.equal(M.confusion([1,0],[.2,.3],1).precision,null);
 const pairAUC=(labels,scores)=>{let win=0,n=0;labels.forEach((y,i)=>{if(y)labels.forEach((z,j)=>{if(!z){n++;win+=scores[i]>scores[j]?1:scores[i]===scores[j]?.5:0;}});});return win/n;};
 for(const scores of [[.8,.4,.6,.2],[.5,.5,.5,.5],[1,0,1,0]]){const labels=[1,1,0,0],r=M.roc(labels,scores);near(r.auc,pairAUC(labels,scores));near(M.roc(labels,scores.map(s=>-s)).auc,1-r.auc);assert.deepEqual(r.points.at(-1).x,1);assert.deepEqual(r.points.at(-1).y,1);}
 near(M.roc([1,1,0,0],[.8,.4,.6,.2]).auc,.75);
});
test('Cobertura EMC: siete capítulos, 68 laboratorios, 204 preguntas y sin capítulo 8',()=>{
 const m=materials.find(m=>m.id==='emc');assert.deepEqual(m.chapters.map(c=>c.id),[1,2,3,4,5,6,7]);assert.deepEqual(m.chapters.map(c=>c.lessons.length),[6,8,14,8,8,12,12]);
 assert.equal(m.chapters.flatMap(c=>c.lessons).length,68);assert.equal(m.chapters.flatMap(c=>c.quizzes).flat().length,204);
 for(const c of m.chapters){assert.equal(emcLabConfigs[c.id].length,c.lessons.length);for(let i=0;i<c.lessons.length;i++){assert.ok(c.notes[i].length>1000);assert.ok(c.lessons[i].reference);assert.equal(c.quizzes[i].length,3);}}
 assert.equal(materials.flatMap(m=>m.chapters).flatMap(c=>c.lessons).length,219);
});
