const { parsePdfReportFromBuffer } = require('./utils/parsePdf');
const fs = require('fs');
const pdfParse = require('pdf-parse');

(async () => {
  try {
    console.log('Testing parser with original PDF...');
    const buf = fs.readFileSync('c:\\Users\\srina\\Downloads\\new murukulu.pdf');
    console.log('Loaded original PDF:', buf.length, 'bytes');
    
    // Extract text
    const pdfData = await pdfParse(buf);
    console.log('Total pages:', pdfData.numpages);
    console.log('Text length:', pdfData.text.length);
    
    // Parse
    const result = await parsePdfReportFromBuffer(buf);
    console.log('\nParsed Results:');
    console.log('Sectors found:', result.sectors.length);
    console.log('Murukulu total:', result.grandTotals.totalMurukulu);
    console.log('Balamrutham total:', result.grandTotals.totalBalamrutham);
    console.log('Rows:', result.rowCount);
    
    console.log('\nSector breakdown:');
    result.sectors.forEach(s => {
      console.log(`  ${s.sectorName}: M=${s.totalMurukulu} B=${s.totalBalamrutham} (${s.awcBreakdown.length} AWCs)`);
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
})();
