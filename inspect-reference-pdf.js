const pdf = require('pdf-parse');
const fs = require('fs');

async function inspectPDF() {
  const buf = fs.readFileSync('c:\\Users\\srina\\Downloads\\MurukuluIndents (2)-2 - Google Sheets.pdf');
  const data = await pdf(buf);
  const lines = data.text.split('\n').map(l => l.trim()).filter(l => l && l.length > 2);
  
  console.log('=== PDF FILE (Filtered/Calculated Reference) ===');
  console.log(`Total lines: ${lines.length}\n`);
  console.log('First 100 lines:\n');
  lines.slice(0, 100).forEach((l, i) => console.log(`[${i}] ${l}`));
  
  console.log('\n\n=== SEARCHING FOR DATA PATTERNS ===');
  console.log('Looking for sector names and totals...\n');
  
  for (let i = 0; i < lines.length; i++) {
    // Look for lines that look like sector totals (contain numbers and sector names)
    if (lines[i].match(/^[A-Z\s\d\-]+\s+[\d.]+\s+[\d.]+/)) {
      console.log(`[${i}] ${lines[i]}`);
    }
  }
}

inspectPDF().catch(err => console.error('Error:', err));
