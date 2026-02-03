const fs = require('fs');
const pdfParse = require('pdf-parse');

(async () => {
  try {
    console.log('=== ORIGINAL PDF TEXT ===\n');
    const buf = fs.readFileSync('c:\\Users\\srina\\Downloads\\new murukulu.pdf');
    const pdfData = await pdfParse(buf);
    
    const lines = pdfData.text.split('\n').slice(0, 100);
    lines.forEach((line, idx) => {
      console.log(`${String(idx).padStart(3)}: ${line}`);
    });
    
    console.log('\n\n=== REFERENCE PDF TEXT ===\n');
    const refBuf = fs.readFileSync('c:\\Users\\srina\\Downloads\\MurukuluIndents (2)-2 - Google Sheets.pdf');
    const refData = await pdfParse(refBuf);
    
    const refLines = refData.text.split('\n').slice(0, 100);
    refLines.forEach((line, idx) => {
      console.log(`${String(idx).padStart(3)}: ${line}`);
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
})();
