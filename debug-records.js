const pdfParse = require('pdf-parse');
const fs = require('fs');

async function debugParse() {
  console.log('=== DEBUG REFERENCE PDF ===\n');
  const buf = fs.readFileSync('c:\\Users\\srina\\Downloads\\MurukuluIndents (2)-2 - Google Sheets.pdf');
  const data = await pdfParse(buf);
  
  const lines = data.text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  console.log(`Total lines: ${lines.length}\n`);

  // Skip obvious headers
  let dataLines = lines.filter(line => {
    const lower = line.toLowerCase();
    if (line.match(/^(Department|Government|Commodity|Murukulu|Month|District|Project|Sector|AWC|Indent|Code|Name|Contact)/i)) return false;
    if (line.match(/^[=\-*\s]*$/)) return false;
    if (line.length < 2) return false;
    return true;
  });

  console.log(`Data lines after filtering: ${dataLines.length}\n`);
  console.log('Lines 1-100:\n');
  dataLines.slice(0, 100).forEach((l, i) => {
    console.log(`[${i}] ${l}`);
  });

  // Try to group into 11-field records
  console.log('\n\n=== TRYING TO GROUP INTO 11-FIELD RECORDS ===\n');
  let buffer = [];
  let recordCount = 0;
  
  for (let i = 0; i < dataLines.length; i++) {
    buffer.push(dataLines[i]);
    
    if (buffer.length === 11) {
      recordCount++;
      if (recordCount <= 5) {
        console.log(`\nRecord ${recordCount}:`);
        buffer.forEach((f, idx) => {
          console.log(`  [${idx}] ${f}`);
        });
      }
      buffer = [];
    }
  }
  
  console.log(`\n\nTotal complete 11-field records: ${recordCount}`);
  console.log(`Remaining lines in buffer: ${buffer.length}`);
  if (buffer.length > 0) {
    console.log('\nRemaining lines:');
    buffer.forEach((l, i) => {
      console.log(`  [${i}] ${l}`);
    });
  }
}

debugParse().catch(e => console.error('Error:', e.message));
