import {tex} from './math.mjs';
import {depthMarkup} from './depth-common.mjs';
import {arrigoDepth} from './depth-arrigo.mjs';
import {cantwellDepth} from './depth-cantwell.mjs';
import {hamermeshDepth} from './depth-hamermesh.mjs';
export const extensions={arrigo:arrigoDepth,cantwell:cantwellDepth,hamermesh:hamermeshDepth};
export function applyDepth(materials){
 for(const material of materials)for(const chapter of material.chapters){
  const entries=extensions[material.id]?.[chapter.id];if(!entries||chapter.deepening)continue;
  if(entries.length!==chapter.lessons.length)throw Error(`Ampliación incompleta: ${material.id}/${chapter.id}`);
  chapter.deepening=entries;
  chapter.notes=chapter.notes.map((html,j)=>html+depthMarkup(entries[j]));
  chapter.quizzes=chapter.quizzes.map((questions,j)=>{const q=entries[j].quiz,offset=j%q.a.length;return [...questions,{...q,a:[...q.a.slice(offset),...q.a.slice(0,offset)],correct:(q.correct-offset+q.a.length)%q.a.length}];});
 }
}
export function renderDepthBridge(root,entry,href){
 if(!entry)return;
 root.insertAdjacentHTML('beforeend',`<aside class="card depth-bridge" aria-label="Conexión con la derivación"><span class="note-label">AMPLÍA EL RAZONAMIENTO</span><h3>${entry.title}</h3><p>${entry.intro}</p>${tex(entry.formula,true)}<a class="depth-link" href="#${href}">Ver derivación y problema resuelto →</a></aside>`);
}
