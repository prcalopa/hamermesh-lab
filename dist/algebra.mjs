export const names = ['e', 'r', 'r²', 's', 'rs', 'r²s'];
export const permutations = [[0,1,2],[1,2,0],[2,0,1],[0,2,1],[1,0,2],[2,1,0]];
export const composePerm = (a,b) => b.map(i=>a[i]);
export function multiply(a,b) { return permutations.findIndex(p=>p.every((v,i)=>v===composePerm(permutations[a],permutations[b])[i])); }
export function inverse(a) { return names.findIndex((_,b)=>multiply(a,b)===0&&multiply(b,a)===0); }
export function order(a) { let p=0; for(let n=1;n<=6;n++){p=multiply(a,p);if(p===0)return n;} }
export function cycles(p, labels=p.map((_,i)=>String(i+1))) { const seen=new Set(), out=[]; for(let i=0;i<p.length;i++){if(seen.has(i))continue;const c=[];let j=i;while(!seen.has(j)){seen.add(j);c.push(labels[j]);j=p[j];}if(c.length>1)out.push('('+c.join(' ')+')');}return out.join('')||'e'; }
export const parity = a => a<3 ? 1 : -1;
export function subgroupCheck(h) { if(!h.length)return {valid:false,reason:'El conjunto vacío no contiene la identidad.'}; if(!h.includes(0))return {valid:false,reason:'Falta e, la identidad.'};for(const a of h){if(!h.includes(inverse(a)))return {valid:false,reason:`Falta el inverso de ${names[a]}: ${names[inverse(a)]}.`};for(const b of h){const c=multiply(a,b);if(!h.includes(c))return {valid:false,reason:`No hay cierre: ${names[a]} · ${names[b]} = ${names[c]}, que no está en H.`};}}return {valid:true,reason:'Contiene e, todos los inversos y todos los productos. La asociatividad se hereda de S₃.'}; }
export function cosets(h, side='left') { if(!subgroupCheck(h).valid)return [];const result=[],seen=new Set();for(let g=0;g<6;g++){if(seen.has(g))continue;const set=[...new Set(h.map(a=>side==='left'?multiply(g,a):multiply(a,g)))].sort((a,b)=>a-b);set.forEach(a=>seen.add(a));result.push({representative:g,elements:set});}return result; }
export const conjugate = (x,g) => multiply(multiply(x,g),inverse(x));
export function conjugacyClass(g) { return [...new Set(names.map((_,x)=>conjugate(x,g)))].sort((a,b)=>a-b); }
export const isNormal = h => subgroupCheck(h).valid&&names.every((_,x)=>h.every(g=>h.includes(conjugate(x,g))));
export const factorial = n => n<2 ? 1 : n*factorial(n-1);
export function partitions(n,max=n){if(n===0)return [[]];const result=[];for(let k=Math.min(n,max);k>=1;k--)for(const tail of partitions(n-k,k))result.push([k,...tail]);return result;}
export function symmetricClasses(n) { return partitions(n).map(parts=>{const counts={};parts.forEach(k=>counts[k]=(counts[k]||0)+1);const divisor=Object.entries(counts).reduce((v,[k,c])=>v*Number(k)**c*factorial(c),1);return {parts,size:factorial(n)/divisor,even:(n-parts.length)%2===0};}); }
