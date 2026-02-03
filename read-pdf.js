const pdfParse = require('pdf-parse');
const fs = require('fs');

const filePath = 'c:\\Users\\srina\\Downloads\\MurukuluIndents (4) 555.pdf';
const fileBuffer = fs.readFileSync(filePath);

pdfParse(fileBuffer).then(data => {
  const lines = data.text.split('\n');
  let output = `Total lines: ${lines.length}\n\n=== FIRST 200 LINES ===\n\n`;
  
  for (let i = 0; i < Math.min(200, lines.length); i++) {
    output += `[${String(i).padStart(3)}] ${lines[i]}\n`;
  }
  
  fs.writeFileSync('pdf-output.txt', output);
  console.log('Output written to pdf-output.txt');
}).catch(err => console.error('Error:', err));
