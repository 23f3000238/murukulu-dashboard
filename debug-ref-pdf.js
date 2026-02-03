const pdfParse = require('pdf-parse');
const fs = require('fs');

async function inspectPDFs() {
  try {
    console.log('=== REFERENCE PDF Analysis ===\n');
    const refBuf = fs.readFileSync('c:\\Users\\srina\\Downloads\\MurukuluIndents (2)-2 - Google Sheets.pdf');
    const refData = await pdfParse(refBuf);
    
    const lines = refData.text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    console.log(`Total lines: ${lines.length}\n`);
    console.log('Lines 1-150:\n');
    for (let i = 0; i < Math.min(150, lines.length); i++) {
      console.log(`[${i}] ${lines[i]}`);
    }
    
    // Write to file for easier inspection
    fs.writeFileSync('reference-pdf-text.txt', lines.join('\n'));
    console.log('\n\nData saved to reference-pdf-text.txt');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

inspectPDFs();
