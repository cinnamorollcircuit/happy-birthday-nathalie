const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
let failures = 0;
const ok = (m) => console.log('  OK  ' + m);
const bad = (m) => { console.log('  FAIL ' + m); failures++; };

console.log('== 1. CSS brace balance ==');
const css = fs.readFileSync('css/style.css', 'utf8');
let depth = 0, inComment = false, inString = null;
for (let i = 0; i < css.length; i++) {
  const c = css[i], n = css[i + 1];
  if (inComment) { if (c === '*' && n === '/') { inComment = false; i++; } continue; }
  if (inString) { if (c === inString && css[i-1] !== '\\') inString = null; continue; }
  if (c === '/' && n === '*') { inComment = true; i++; continue; }
  if (c === '"' || c === "'") { inString = c; continue; }
  if (c === '{') depth++;
  if (c === '}') depth--;
  if (depth < 0) { bad('unbalanced } at ' + i); break; }
}
if (depth === 0) ok('CSS braces balanced');
else bad('CSS depth=' + depth);

console.log('== 2. Old garden/backdrop references removed ==');
const html = fs.readFileSync('index.html', 'utf8');
const gardenRefs = ['cinematic-garden', 'bouquet-garden-scene', 'cinematic-veil'];
for (const r of gardenRefs) {
  if (html.includes(r) || css.includes(r)) bad('still references ' + r);
}
if (gardenRefs.every(r => !html.includes(r) && !css.includes(r))) ok('no garden/veil backdrop remains');

console.log('== 2b. Removed ambience divs gone from HTML ==');
const removed = ['bouquet-sun-glow','bouquet-ambient-glow','bouquet-paper-grain'];
for (const r of removed) { if (html.includes('class="' + r) || html.includes('class="' + r + '"')) bad('html still has ' + r); }
if (removed.every(r => !html.includes('class="' + r))) ok('ambience divs removed from HTML');

console.log('== 3. New prop assets exist ==');
const props = ['bouquet-prop-tulip.svg','bouquet-prop-daisy.svg','bouquet-prop-pansy.svg','bouquet-prop-delphinium.svg','bouquet-prop-blossom.svg','bouquet-vine-left.svg','bouquet-vine-right.svg','bouquet-monarch-butterfly.svg'];
for (const p of props) {
  if (!fs.existsSync(path.join(ROOT, 'assets/images', p))) bad('missing ' + p);
}
if (props.every(p => fs.existsSync(path.join(ROOT, 'assets/images', p)))) ok('all prop sprites present');

console.log('== 4. HTML uses new accents + CSS covers them ==');
const need = ['cinematic-accents','cinematic-flower-tulip','cinematic-flower-daisy','cinematic-flower-pansy','cinematic-flower-delphinium','cinematic-flower-blossom','cinematic-butterfly','cinematic-vine-left','cinematic-vine-right','cinematic-settle'];
for (const n of need) {
  if (!html.includes(n)) bad('html missing ' + n);
  if (!css.includes(n)) bad('css missing ' + n);
}
if (need.every(n => html.includes(n) && css.includes(n))) ok('all accent classes wired in HTML + CSS');

console.log('== 5. Keyframes present ==');
const kfs = ['cinVineDrop','cinFlowerBloom','cinButterflyCross','cinButterflyWings','cinCaptionUp'];
for (const k of kfs) { if (!css.includes('@keyframes ' + k)) bad('missing @keyframes ' + k); }
if (kfs.every(k => css.includes('@keyframes ' + k))) ok('all cinematic keyframes present');

console.log('== 6. Reduced-motion + mobile present ==');
if (css.includes('prefers-reduced-motion')) ok('reduced-motion block present');
else bad('no prefers-reduced-motion');
if (css.includes('max-width: 640px')) ok('mobile block present');
else bad('no mobile block');

console.log('');
console.log(failures === 0 ? 'ALL CHECKS PASSED' : failures + ' FAILURE(S)');
process.exit(failures === 0 ? 0 : 1);
