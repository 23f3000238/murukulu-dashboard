const { parsePdfReportFromBuffer } = require('./utils/parsePdf');
const fs = require('fs');

const filePath = 'c:\\Users\\srina\\Downloads\\new murukulu.pdf';
const fileBuffer = fs.readFileSync(filePath);

console.log(`File size: ${fileBuffer.length} bytes`);

parsePdfReportFromBuffer(fileBuffer).then(result => {
  console.log('\n=== PARSING RESULT ===');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success && result.sectors.length > 0) {
    console.log('\n=== SECTOR SUMMARY ===');
    result.sectors.forEach((sector, i) => {
      console.log(`${i+1}. ${sector.sectorName}: Murukulu=${sector.totalMurukulu}, Balamrutham=${sector.totalBalamrutham}`);
    });
  }
}).catch(err => {
  console.error('Error:', err);
});
