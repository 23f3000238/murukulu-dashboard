const pdfParse = require('pdf-parse');
const fs = require('fs');

async function inspect() {
  const buf = fs.readFileSync('c:\\Users\\srina\\Downloads\\MurukuluIndents (2)-2 - Google Sheets.pdf');
  const data = await pdfParse(buf);
  const lines = data.text.split('\n');
  
  console.log('REFERENCE PDF - First 200 lines:\n');
  for (let i = 0; i < Math.min(200, lines.length); i++) {
    const line = lines[i].trim();
    if (line) {
      console.log(`[${i}] ${line.substring(0, 100)}`);
    }
  }
}

inspect().catch(e => console.error(e.message));
