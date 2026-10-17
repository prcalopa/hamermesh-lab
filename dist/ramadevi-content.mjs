import {tex} from './math.mjs';
export const T=String.raw;
export const P=s=>`<p>${s}</p>`,B=s=>tex(s,true);
let counter=0;
export const Q=(q,a,correct,why)=>{const k=counter++%a.length;return {q,a:[...a.slice(k),...a.slice(0,k)],correct:(correct-k+a.length)%a.length,why};};
export function S(title,nav,reference,pages,intro,steps,problem,quizzes){return {lesson:{title,nav,reference,pages,desc:intro},note:P(intro)+steps.map(([h,p,f])=>`<h3>${h}</h3>${P(p)}${f?B(f):''}`).join('')+`<details class="extension" open><summary>Problema desarrollado</summary><div class="detail-body">${problem}</div></details>`,quizzes};}
export const assemble=rows=>({lessons:rows.map(r=>r.lesson),notes:rows.map(r=>r.note),quizzes:rows.map(r=>r.quizzes)});
