import katex from './vendor/katex/katex.mjs';

const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const textEscape=s=>s.replace(/[{}%#$&_]/g,c=>'\\'+c);
// New content can use explicit TeX. Existing marked formulae retain their notation
// through the deterministic adapter below; ordinary prose is never inferred here.
export const tex=(source,display=false)=>`<${display?'div':'span'} class="math-tex${display?' math-block':''}" data-tex="${escape(source)}"${display?' data-display="true"':''}>${escape(source)}</${display?'div':'span'}>`;
const greek={α:'alpha',β:'beta',γ:'gamma',δ:'delta',ε:'varepsilon',ϵ:'epsilon',ζ:'zeta',η:'eta',θ:'theta',κ:'kappa',λ:'lambda',μ:'mu',ν:'nu',ξ:'xi',π:'pi',ρ:'rho',σ:'sigma',τ:'tau',φ:'varphi',ϕ:'phi',χ:'chi',ψ:'psi',ω:'omega',Γ:'Gamma',Δ:'Delta',Θ:'Theta',Λ:'Lambda',Ξ:'Xi',Π:'Pi',Σ:'Sigma',Φ:'Phi',Ψ:'Psi',Ω:'Omega'};
const scripts={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'-','⁽':'(','⁾':')','ᵃ':'a','ᵇ':'b','ᶜ':'c','ᵈ':'d','ᵋ':'ε','ᵝ':'β','ᵏ':'k','ᵐ':'m','ⁿ':'n','ᵖ':'p','ᵣ':'r','ˢ':'s','ᵗ':'t','ᵘ':'u','ᵛ':'v','ˣ':'x','ᵧ':'y','ᶻ':'z','ᶦ':'i','ᵢ':'i'};
const subs={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','₊':'+','₋':'-','ₐ':'a','ₑ':'e','ₓ':'x','ᵧ':'y','ₙ':'n','ₖ':'k','ₕ':'h','ₛ':'s','ᵢ':'i','ⱼ':'j','ᵣ':'r','ₜ':'t','ᵦ':'β','ᵥ':'v','ₘ':'m'};
const ops={'−':'-','–':'-','×':'\\times ','·':'\\cdot ','÷':'\\div ','∘':'\\circ ','≠':'\\ne ','≈':'\\approx ','≅':'\\cong ','≡':'\\equiv ','≤':'\\le ','≥':'\\ge ','∈':'\\in ','∉':'\\notin ','⊂':'\\subset ','⊆':'\\subseteq ','◁':'\\triangleleft ','∪':'\\cup ','∩':'\\cap ','∖':'\\setminus ','→':'\\to ','↦':'\\mapsto ','⇒':'\\Rightarrow ','⇔':'\\Longleftrightarrow ','⇓':'\\Downarrow ','∞':'\\infty ','∂':'\\partial ','∫':'\\int ','Σ':'\\sum ','⟨':'\\langle ','⟩':'\\rangle ','…':'\\ldots ','⋯':'\\cdots ','°':'{}^{\\circ}'};
const functions=new Set(['sin','cos','tan','ln','log','exp','det','ker','im','Id','asinh','atan','atan2','mcm']);
export function notationToTex(input){
 if(/^(?:2|4|6)\/m{1,3}$/.test(String(input)))return String(input).replace(/m+/g,s=>'\\mathrm{'+s+'}');
 const s=String(input).replace(/ȳ/g,'y\u0304').replace(/([CDSTOY])([₀-₉ₙ]+)([hvdi])/g,(_,b,n,suffix)=>b+'_{'+[...n].map(c=>subs[c]).join('')+suffix+'}');let i=0;
 const plain=w=>functions.has(w)?(['asinh','atan','atan2','mcm','im','Id'].includes(w)?`\\operatorname{${w}}`:'\\'+w+' '):w.length>2&&!/^[abcdfghijklmnpqrstuvxyzABCEFGHIKMNOPRSTUVWXY]{1,8}$/.test(w)?`\\text{${textEscape(w)}}`:w;
 function parse(end=''){
  const out=[];const atom=t=>out.push({tex:t,atom:true});
  function argument(){const opening=s[i];if('({['.includes(opening)){i++;return parse({'(':')','{':'}','[':']'}[opening]);}let raw='';if(/[0-9]/.test(s[i]||'')){while(/[0-9]/.test(s[i]||''))raw+=s[i++];}else raw=s[i++]||'';return notationToTex(raw);}
  while(i<s.length){let ch=s[i];if(ch===end){i++;break;}
   const partial=/^∂\/∂([A-Za-z])([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾ᵏⁿ]*)/.exec(s.slice(i));if(partial){i+=partial[0].length;const power=[...partial[2]].map(c=>scripts[c]).join('');atom(`\\frac{\\partial}{\\partial ${partial[1]}${power?'^{'+notationToTex(power)+'}':''}}`);continue;}
   const shorthand=/^∂([xytpqrsvu])/.exec(s.slice(i));if(shorthand){i+=2;atom(`\\partial_{${shorthand[1]}}`);continue;}
   const derivative=/^d([²³ⁿ]?)([A-Za-z])\/d([A-Za-z])([²³ⁿ]?)/.exec(s.slice(i));if(derivative){i+=derivative[0].length;atom(`\\frac{\\mathrm{d}${derivative[1]?'^{'+scripts[derivative[1]]+'}':''}${derivative[2]}}{\\mathrm{d}${derivative[3]}${derivative[4]?'^{'+scripts[derivative[4]]+'}':''}}`);continue;}
   if(/\s/.test(ch)){i++;continue;}
   if(ch==='/'&&out.at(-1)?.atom){i++;const start=i;while(/\s/.test(s[i]||'')&&i<s.length)i++;let denominator;
    if(s[i]==='√'||s[i]==='∛'){const root=s[i++];denominator=`\\sqrt${root==='∛'?'[3]':''}{${argument()}}`;}
    else if(s[i]==='|'){i++;denominator=`\\lvert ${parse('|')}\\rvert`;}
    else if('({['.includes(s[i]||'\0')){
     const opening=s[i],inner=argument();denominator=inner;let suffix=false;
     while(s[i]==='^'||s[i]==='_'||scripts[s[i]]||subs[s[i]]){const ch=s[i];let value,kind;if(ch==='^'||ch==='_'){kind=ch;i++;value=argument();}else{kind=subs[ch]?'_':'^';let raw='';while((kind==='_'?subs[s[i]]:scripts[s[i]]))raw+=(kind==='_'?subs[s[i++]]:scripts[s[i++]]);value=notationToTex(raw);}if(!suffix&&opening==='(')denominator=`\\left(${denominator}\\right)`;denominator=`{${denominator}}${kind}{${value}}`;suffix=true;}
    }else {let j=i;while(/[\p{L}\p{N}]/u.test(s[i]||'')&&i<s.length)i++;if(j===i)i++;while(subs[s[i]]||scripts[s[i]]||s[i]==='^'||s[i]==='_'){if(s[i]==='^'||s[i]==='_'){i++;if('({['.includes(s[i]||'\0')){argument();}else i++;}else i++;}denominator=notationToTex(s.slice(j,i));if(s[i]==='(')denominator+=`\\left(${argument()}\\right)`;}
    if(i===start||!denominator){out.push({tex:'/',atom:false});continue;}const numerator=[];while(out.at(-1)?.atom)numerator.unshift(out.pop().tex);atom(`\\frac{${numerator.join(' ')}}{${denominator}}`);continue;
   }
   if(ch==='^'||ch==='_'){i++;const power=argument(),base=out.pop();atom(`{${base?.tex||''}}${ch}{${power}}`);continue;}
   const sub=subs[ch],power=scripts[ch];if((sub||power)&&out.at(-1)?.atom){const isSub=!!sub;let val='';while((isSub?subs[s[i]]:scripts[s[i]])){val+=(isSub?subs[s[i]]:scripts[s[i]]);i++;}const base=out.pop().tex;atom(`{${base}}${isSub?'_':'^'}{${notationToTex(val)}}`);continue;}
   if(ch==='\u0304'||ch==='\u0305'){i++;const b=out.pop();atom(`\\overline{${b?.tex||''}}`);continue;}
   if(ch==='\u0307'||ch==='\u0308'){i++;const b=out.pop();atom(`\\${ch==='\u0307'?'dot':'ddot'}{${b?.tex||''}}`);continue;}
   if(ch==='′'||ch==='″'||ch==='‴'||ch==="'"){i++;const b=out.pop();atom(`{${b?.tex||''}}^{${'\\prime'.repeat(ch==='″'?2:ch==='‴'?3:1)}}`);continue;}
   if(ch==='√'||ch==='∛'){i++;atom(`\\sqrt${ch==='∛'?'[3]':''}{${argument()}}`);continue;}
   if(ch==='½'){i++;atom('\\tfrac{1}{2}');continue;}
   if(ch==='ℓ'||ch==='ℤ'||ch==='∏'){i++;atom({'ℓ':'\\ell ','ℤ':'\\mathbb{Z}','∏':'\\prod '}[ch]);continue;}
   if('([{'.includes(ch)){i++;const inner=parse({'(':')','[':']','{':'}'}[ch]);atom(ch==='{'?`\\{${inner}\\}`:`\\left${ch}${inner}\\right${ch==='('?')':']'}`);continue;}
   if(ch==='|'&&s.indexOf('|',i+1)>i){i++;atom(`\\lvert ${parse('|')}\\rvert`);continue;}
   if(ch==='∂'||ch==='∫'){i++;atom(ops[ch]);continue;}
   if(greek[ch]){i++;atom(ch==='Σ'?'\\sum ':'\\'+greek[ch]+' ');continue;}
   if(ops[ch]){i++;out.push({tex:ops[ch],atom:false});continue;}
   if(/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(ch)){let w='';while(/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(s[i]||'')&&i<s.length)w+=s[i++];if(w==='atan'&&s[i]==='2'){w+='2';i++;}if(functions.has(w)||plain(w).startsWith('\\text'))atom(plain(w));else [...w].forEach(atom);continue;}
   if(/[0-9]/.test(ch)){let n='';while(/[0-9]/.test(s[i]||'')&&i<s.length)n+=s[i++];if(/[,.]/.test(s[i]||'')&&/[0-9]/.test(s[i+1]||'')){n+=s[i++]==='，'?',':s[i-1];while(/[0-9]/.test(s[i]||'')&&i<s.length)n+=s[i++];}atom(n.replace(/,/g,'{,}'));continue;}
   i++;out.push({tex:ch==='&'?'\\&':ch==='%'?'\\%':ch,atom:false});
  }return out.map(t=>t.tex).join(' ');
 }return parse();
}
// Mark compact, already-authored mathematical expressions inside lesson prose.
// No isolated Spanish a/e/y is interpreted as a mathematical variable.
export function decorateMathMarkup(html){
 const normalized=String(html).replace(/<sup>([^<>]*)<\/sup>/g,'^{$1}').replace(/<sub>([^<>]*)<\/sub>/g,'_{$1}');
 let skipDepth=0;const stack=[];
 return normalized.split(/(<[^>]*>)/g).map(part=>{
  if(part.startsWith('<')){const closing=/^<\//.test(part),tag=part.match(/^<\/?([a-z0-9]+)/i)?.[1]?.toLowerCase();if(closing){const last=stack.pop();if(last?.skip)skipDepth--;}
   else if(tag&&!['br','input','img','hr','meta','link'].includes(tag)&&!part.endsWith('/>')){const classes=part.match(/class=["']([^"']*)["']/)?.[1]?.split(/\s+/)||[],skip=/^math$|^script$|^style$/.test(tag)||classes.some(c=>['math','formula','math-tex'].includes(c))||/data-tex=/.test(part);stack.push({tag,skip});if(skip)skipDepth++;}return part;}
  if(skipDepth)return part;
  part=part.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  return part.replace(/[^\s;:!?]+(?:\s+[^\s;:!?]+)*/g,whole=>{
   // Spaces split expressions, except within an explicitly braced exponent.
   const pieces=[];let chunk='',depth=0;for(const ch of whole){if('({['.includes(ch))depth++;if(')}]'.includes(ch))depth--;if(/\s/.test(ch)&&depth<=0){if(chunk)pieces.push(chunk);pieces.push(ch);chunk='';}else chunk+=ch;}if(chunk)pieces.push(chunk);
   return pieces.map(chunk=>{
    if(!/[=<>^_²³⁴⁻⁺₀-₉ₙₓ′″‴∂ΓΔεσμξητπφΣ√∛/≠≈≅∈]/.test(chunk))return chunk;
    let trimmed=chunk.replace(/^[«“]/,'').replace(/[.,»”]+$/,'');if(!trimmed)return chunk;
    const balance=[...trimmed].reduce((n,c)=>n+(c==='('?1:c===')'?-1:0),0);if(balance>0&&trimmed.startsWith('('))trimmed=trimmed.slice(1);if(balance<0&&trimmed.endsWith(')'))trimmed=trimmed.slice(0,-1);
    const words=trimmed.match(/[A-Za-zÀ-ÿ]{3,}/g)||[];
    if(words.some(w=>!functions.has(w)&&!['atan','atan2'].includes(w)&&!/^[abcdfghijklmnpqrstuvxyzABCEFGHIKMNOPRSTUVWXY]{1,8}$/.test(w)))return chunk;
    if(/https?:|\\|&[a-z]+;/.test(trimmed))return chunk;
    let source=notationToTex(trimmed);if(trimmed==='3/2')source='3/2';
    return chunk.replace(trimmed,tex(source));
   }).join('');
  });
 }).join('');
}
export function mathMLToTex(node){
 const children=()=>[...node.children].map(mathMLToTex),t=node.localName;
 if(['math','mrow','mtd'].includes(t))return children().join(' ');
 if(t==='mo'){const value=node.textContent.trim();if(['(',')','[',']'].includes(value))return value;if(value==='{'||value==='}')return '\\'+value;if(value==='′')return '\\prime';return ops[value]||notationToTex(value);}
 if(['mi','mn','mtext'].includes(t)){if(/^∂[xytpqrsvu]$/.test(node.textContent))return '\\partial '+node.textContent[1];return notationToTex(node.textContent);}
 const c=children();if(t==='mfrac')return `\\frac{${c[0]}}{${c[1]}}`;
 if(t==='msup')return `{${c[0]}}^{${c[1]}}`;if(t==='msub')return `{${c[0]}}_{${c[1]}}`;if(t==='msubsup')return `{${c[0]}}_{${c[1]}}^{${c[2]}}`;
 if(t==='mover')return `\\overline{${c[0]}}`;if(t==='msqrt')return `\\sqrt{${c.join(' ')}}`;
 if(t==='mspace')return '\\quad ';if(t==='mtable')return `\\begin{aligned}${c.join('\\\\')}\\end{aligned}`;
 if(t==='mtr')return '&'+c.join('&');return c.join(' ');
}
function legacySource(el){
 const m=el.querySelector('math');if(m)return mathMLToTex(m);
 const clone=el.cloneNode(true);clone.querySelectorAll('sup,sub').forEach(n=>n.replaceWith(document.createTextNode((n.tagName==='SUP'?'^':'_')+'{'+n.textContent+'}')));clone.querySelectorAll('br').forEach(n=>n.replaceWith(document.createTextNode('\n')));
 return clone.textContent.split('\n').map(notationToTex).filter(Boolean).join('\\\\');
}
const selectors='[data-tex],.formula,.math,.result-equation,#reduction-equation,.chain-rule h3';
export function renderMath(root=document){
 for(const p of document.querySelectorAll('#content p.helper,#content .insight p,#content .chain-rule p,#content .derivation p,#reduction-domain')){
  if(p.querySelector('.katex,[data-tex]')||p.closest('[data-math-skip]'))continue;const html=decorateMathMarkup(p.innerHTML);if(html!==p.innerHTML)p.innerHTML=html;
 }
 const elements=[...(root.matches?.(selectors)?[root]:[]),...root.querySelectorAll(selectors)];
 for(const el of elements){
  if(el.closest('svg,select,option,.katex')||el.querySelector('.katex')||el.closest('[data-math-skip]'))continue;
  if(el.querySelector('[data-tex]'))continue;
  if(elements.some(p=>p!==el&&p.contains(el)&&!p.querySelector('[data-tex]')))continue;
  const explicit=el.dataset.tex!==undefined,raw=el.textContent.trim();if(!raw)continue;
  const display=el.dataset.display==='true'||el.classList.contains('formula');let source=explicit?el.dataset.tex:legacySource(el);
  if(!source)continue;if(!explicit&&!/[0-9=<>+−\-^_∂ΓΔεξ²³₁₂₃ₙₕₛᵢ/]/.test(raw)&&raw.split(/\s+/).some(w=>w.length>3))continue;
  if(source.includes('\\\\')&&!source.includes('\\begin'))source=`\\begin{gathered}${source}\\end{gathered}`;
  if(el.dataset.mathFailedSource===source)continue;const fallback=el.innerHTML;
  try{katex.render(source,el,{displayMode:display,throwOnError:true,strict:'ignore',trust:false,output:'htmlAndMathml'});el.classList.add('math-rendered');el.dataset.mathSource=source;delete el.dataset.mathError;delete el.dataset.mathFailedSource;
   if(display){el.classList.add('math-block');el.setAttribute('tabindex','0');const button=document.createElement('button');button.type='button';button.className='math-copy';button.textContent='Copiar LaTeX';button.setAttribute('aria-label','Copiar esta fórmula en LaTeX');button.onclick=async()=>{try{await navigator.clipboard.writeText(source);button.textContent='Copiado';setTimeout(()=>button.textContent='Copiar LaTeX',1600);}catch{button.textContent='No se pudo copiar';}};el.append(button);}
  }catch(error){el.innerHTML=fallback;el.dataset.mathError=error.message;el.dataset.mathFailedSource=source;console.error('Fórmula no renderizada:',source,error.message);}
 }
}
export function observeMath(){let pending=false;const observer=new MutationObserver(changes=>{if(changes.every(c=>c.target.parentElement?.closest('.katex,.math-copy')))return;if(!pending){pending=true;queueMicrotask(()=>{pending=false;renderMath(document);});}});observer.observe(document.querySelector('.page'),{subtree:true,childList:true,characterData:true});renderMath(document);return observer;}
