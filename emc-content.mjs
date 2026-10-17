import {tex} from './math.mjs';
export const T=String.raw,P=s=>`<p>${s}</p>`,B=s=>tex(s,true);
let index=0;
const question=([q,answer,b,c,why])=>{const a=[answer,b,c],k=index++%3;return {q,a:[...a.slice(k),...a.slice(0,k)],correct:(3-k)%3,why};};
export function S(title,nav,reference,pages,intro,steps,problem,questions,code=''){
 return {lesson:{title,nav,reference,pages,desc:intro},note:P(intro)+steps.map(([h,p,f])=>`<h3>${h}</h3>${P(p)}${f?B(f):''}`).join('')+`<details class="extension" open><summary>Problema desarrollado</summary><div class="detail-body">${problem}</div></details>`+(code?`<h3>Reproducir en R</h3><p>Ejemplo autónomo con funciones de R base. Este bloque se muestra para copiarlo; el navegador ejecuta el laboratorio equivalente en JavaScript.</p><pre class="emc-code"><code>${code.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}</code></pre>`:''),quizzes:questions.map(question)};
}
export const assemble=rows=>({lessons:rows.map(r=>r.lesson),notes:rows.map(r=>r.note),quizzes:rows.map(r=>r.quizzes)});
