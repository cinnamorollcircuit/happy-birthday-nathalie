const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<!-- 6. CINEMATIC ANIMATED BOUQUET');
const end = html.indexOf('<!-- 6. WISH / CAKE SECTION -->');
const section = html.slice(start, end);
const stack = [];
const re = /<\/?([\w-]+)((?:"[^"]*"|'[^']*'|[^"'>])*)\/?>/g;
const voids = new Set(['img','br','input','hr','meta','link','path','circle','rect','ellipse','stop','use','feDropShadow','feGaussianBlur','feMerge','feMergeNode','feFlood','feComposite','feColorMatrix','feTurbulence','feOffset','source','track','wbr','area','base','col','embed','param','image']);
let m;
let ok = true;
while ((m = re.exec(section))) {
  const t = m[0];
  if (t.startsWith('<!--')) continue;
  const tag = m[1];
  const selfClosing = /\/\s*>$/.test(t);
  if (t.startsWith('</')) {
    const top = stack.pop();
    if (top !== tag) { console.log('MISMATCH: expected </' + top + '> got </' + tag + '> at', m.index); ok = false; }
  } else if (!selfClosing && !voids.has(tag)) {
    stack.push(tag);
  }
}
console.log('Unclosed:', stack);
if (stack.length === 0 && ok) console.log('HTML BALANCE OK');
