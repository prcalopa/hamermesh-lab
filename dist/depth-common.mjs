import {tex} from './math.mjs';
export const T=String.raw;
// Each extension contains a derivation, a worked problem and a contextual check.
export function depth(title,intro,formula,derivation,workedFormula,worked,challenge,answers,correct,reason){
 return {title,intro,formula,derivation,workedFormula,worked,challenge,quiz:{q:challenge,a:answers,correct,why:reason}};
}
export function depthMarkup(d){return `<section class="depth-reading" aria-label="Desarrollo matemático ampliado"><span class="note-label">DESARROLLO MATEMÁTICO AMPLIADO</span><h3>${d.title}</h3><p>${d.intro}</p>${tex(d.formula,true)}<h3>Derivación y condiciones</h3><p>${d.derivation}</p><details class="extension" open><summary>Problema resuelto · comprueba cada paso</summary><div class="detail-body">${tex(d.workedFormula,true)}<p>${d.worked}</p></div></details><p><strong>Antes de pasar de sección:</strong> intenta responder la nueva pregunta de Practicar justificando las hipótesis usadas.</p></section>`;}
