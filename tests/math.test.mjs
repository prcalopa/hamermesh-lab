import test from 'node:test';
import assert from 'node:assert/strict';
import katex from '../dist/vendor/katex/katex.mjs';
import {notationToTex as convert,decorateMathMarkup as decorate,mathMLToTex,tex} from '../dist/math.mjs';
import {materials} from '../dist/catalog.mjs';
const decode=s=>s.replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
test('La conversión conserva productos, potencias y denominadores',()=>{
 assert.equal(convert('xy³'),'x {y}^{3}');
 assert.equal(convert('2xy³/(x−y)²'),'\\frac{2 x {y}^{3}}{{\\left(x - y\\right)}^{2}}');
 assert.equal(convert('e⁻²ᵋ'),'{e}^{- 2 \\varepsilon }');
 assert.equal(convert('d²s/dr²'),'\\frac{\\mathrm{d}^{2}s}{\\mathrm{d}r^{2}}');
 assert.equal(convert('∂x'),'\\partial_{x}');
 assert.equal(convert('∂/∂y⁽ᵏ⁾'),'\\frac{\\partial}{\\partial y^{\\left(k\\right)}}');
 assert.equal(convert('U̇=U²'),'\\dot{U} = {U}^{2}');
 assert.equal(convert('3̅'),'\\overline{3}');
 assert.equal(convert('Cₙh'),'{C}_{n h}');
 assert.equal(convert('2/m'),'2/\\mathrm{m}');
 assert.equal(convert('4/mmm'),'4/\\mathrm{mmm}');
 assert.equal(convert('1/√(1+r²)'),'\\frac{1}{\\sqrt{1 + {r}^{2}}}');
 assert.equal(convert('|G|/|H|'),'\\frac{\\lvert G\\rvert}{\\lvert H\\rvert}');
 assert.equal(convert('ε/μ(x)'),'\\frac{\\varepsilon }{\\mu \\left(x\\right)}');
 assert.equal(convert('xgx⁻¹'),'x g {x}^{- 1}');
 assert.equal(convert('ℓ₁'),' {\\ell }_{1}'.trim());
 assert.equal(convert('Tᵦ'),' {T}_{\\beta }'.trim());
});
test('La estructura MathML conserva paréntesis y primas dentro de fracciones',()=>{
 const n=(localName,textContent='',...children)=>({localName,textContent,children});
 const numerator=n('msup','',n('mrow','',n('mo','('),n('mi','x'),n('mi','y'),n('mo','+'),n('mn','1'),n('mo',')')),n('mn','3'));
 const fraction=n('mfrac','',numerator,n('msup','',n('mi','x'),n('mn','5')));
 assert.equal(mathMLToTex(fraction),'\\frac{{( x y + 1 )}^{3}}{{x}^{5}}');
 assert.equal(mathMLToTex(n('msup','',n('mi','y'),n('mo','′'))),'{y}^{\\prime}');
});
test('La anotación protege el castellano, los atributos y el TeX explícito',()=>{
 const plain='<p>y no cambia, a cada paso e identidad.</p>';
 assert.equal(decorate(plain),plain);
 const explicit=tex(String.raw`\Gamma^{(n)}=\sum_{k=1}^n\eta^{(k)}`);
 assert.equal(decorate(explicit),explicit);
 const markup=decorate('<p title="y=x">En (y=x), usa y⁻² y conserva 2/m.</p>');
 assert.ok(markup.includes('title="y=x"'));
 assert.ok(markup.includes('data-tex="\\left(y = x\\right)"'));
 assert.ok(decorate('<p>por y=x).</p>').includes('</span>).'));
 assert.equal((markup.match(/data-tex=/g)||[]).length,3);
 assert.ok(decorate('<p>3/2 relaciona ejes.</p>').includes('data-tex="3/2"'));
 const fraction=decorate('<p>(Y_x+Y_y p)/(X_x+X_y p)</p>');
 assert.equal((fraction.match(/data-tex=/g)||[]).length,1);
 assert.ok(decorate('<p>x&lt;0</p>').includes('data-tex="x &lt; 0"'));
});
test('Las expresiones de apuntes y cuestionarios de toda la biblioteca renderizan',()=>{
 let count=0;
 for(const material of materials)for(const chapter of material.chapters){
  const strings=[...chapter.notes,...chapter.quizzes.flat().flatMap(q=>[q.q,...q.a,q.why])];
  for(const html of strings)for(const match of decorate(html).matchAll(/data-tex="([^"]*)"/g)){
   const source=decode(match[1]);
   assert.doesNotThrow(()=>katex.renderToString(source,{throwOnError:true,strict:'ignore',trust:false}),`${material.id}/${chapter.id}: ${source}`);count++;
  }
 }
 assert.ok(count>1200);
});
