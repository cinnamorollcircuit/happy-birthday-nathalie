const fs = require('fs');
const cssPath = 'css/style.css';
let lines = fs.readFileSync(cssPath, 'utf8').split('\n');

// Verify boundaries
if (!lines[1963].startsWith('/* \u2550\u2550') ) {
  console.log('BAD START at 1964: ' + JSON.stringify(lines[1963].slice(0,40)));
  process.exit(1);
}
if (!lines[2284].includes('}')) {
  console.log('BAD END at 2285: ' + JSON.stringify(lines[2284].slice(0,40)));
  process.exit(1);
}

const newBlock = fs.readFileSync('scratch/new_cinematic.css', 'utf8').replace(/\n+$/, '\n');

const before = lines.slice(0, 1964 - 1).join('\n');
const after = lines.slice(2285).join('\n');
const result = before + '\n' + newBlock + '\n' + after;

fs.writeFileSync(cssPath, result, 'utf8');
console.log('CSS block replaced. New length:', result.length);
