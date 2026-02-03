const pdfParse = require('pdf-parse');
const fs = require('fs');

const filePath = 'c:\\Users\\srina\\Downloads\\new murukulu.pdf';
const fileBuffer = fs.readFileSync(filePath);

pdfParse(fileBuffer).then(data => {
  const lines = data.text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  console.log(`=== PDF LINES 20-100 (Raw Format) ===\n`);
  for (let i = 20; i < 100 && i < lines.length; i++) {
    console.log(`[${i}] "${lines[i]}"`);
  }
}).catch(err => console.error('Error:', err));
