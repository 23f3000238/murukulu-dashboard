const { parsePdfReportFromBuffer } = require('./utils/parsePdf');
const fs = require('fs');

async function testBothPDFs() {
  console.log('=== Testing ORIGINAL PDF (new murukulu.pdf) ===\n');
  const origBuf = fs.readFileSync('c:\\Users\\srina\\Downloads\\new murukulu.pdf');
  const origResult = await parsePdfReportFromBuffer(origBuf);
  
  console.log(`Sectors found: ${origResult.sectors.length}`);
  console.log(`Total Murukulu: ${origResult.grandTotals.totalMurukulu}`);
  console.log(`Total Balamrutham: ${origResult.grandTotals.totalBalamrutham}`);
  console.log('\nSectors:');
  origResult.sectors.forEach((s, i) => {
    console.log(`${i+1}. ${s.sectorName}: M=${s.totalMurukulu}, B=${s.totalBalamrutham}, AWCs=${s.awcBreakdown.length}`);
  });
  
  console.log('\n\n=== Testing REFERENCE PDF (MurukuluIndents (2)-2 - Google Sheets.pdf) ===\n');
  const refBuf = fs.readFileSync('c:\\Users\\srina\\Downloads\\MurukuluIndents (2)-2 - Google Sheets.pdf');
  const refResult = await parsePdfReportFromBuffer(refBuf);
  
  console.log(`Sectors found: ${refResult.sectors.length}`);
  console.log(`Total Murukulu: ${refResult.grandTotals.totalMurukulu}`);
  console.log(`Total Balamrutham: ${refResult.grandTotals.totalBalamrutham}`);
  console.log('\nSectors:');
  refResult.sectors.forEach((s, i) => {
    console.log(`${i+1}. ${s.sectorName}: M=${s.totalMurukulu}, B=${s.totalBalamrutham}, AWCs=${s.awcBreakdown.length}`);
  });
}

testBothPDFs().catch(err => console.error('Error:', err));
