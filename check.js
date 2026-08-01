const fs = require('fs');
const html = fs.readFileSync('teacher.html', 'utf8');
const lines = html.split('\n');
console.log('Total lines:', lines.length);

// Find all script blocks
let i = 0, blockNum = 0;
while (true) {
  const start = html.indexOf('<script', i);
  if (start === -1) break;
  const end = html.indexOf('</script>', start);
  if (end === -1) { console.log('ERROR: Unclosed <script> at char', start); break; }
  blockNum++;
  const startLine = html.substring(0, start).split('\n').length;
  const endLine = html.substring(0, end).split('\n').length;
  console.log('Script block', blockNum, ': line', startLine, '-', endLine);
  i = end + 9;
}

// Check for common JS syntax issues in each script block
i = 0; blockNum = 0;
while (true) {
  const start = html.indexOf('<script', i);
  if (start === -1) break;
  const end = html.indexOf('</script>', start);
  if (end === -1) break;
  blockNum++;
  const code = html.substring(start, end);
  const opens = (code.match(/\{/g)||[]).length;
  const closes = (code.match(/\}/g)||[]).length;
  if (opens !== closes) {
    console.log('WARNING block', blockNum, ': { count:', opens, '} count:', closes, '(diff:', opens-closes, ')');
  }
  i = end + 9;
}
console.log('Done');
