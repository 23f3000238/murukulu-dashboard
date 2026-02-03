const { parsePdfReportFromBuffer } = require('./utils/parsePdf');
const fs = require('fs');

async function testPdf() {
  try {
    const buf = fs.readFileSync('c:\\Users\\srina\\Downloads\\MurukuluIndents (4) 555.pdf');
    console.log('PDF file size:', buf.length, 'bytes\n');
    
    const result = await parsePdfReportFromBuffer(buf);
    
    console.log('Parse Result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    console.log('Sectors found:', result.sectors.length);
    console.log('Total Murukulu:', result.grandTotals.totalMurukulu);
    console.log('Total Balamrutham:', result.grandTotals.totalBalamrutham);
    console.log('Rows:', result.rowCount);
    
    console.log('\n=== SECTOR BREAKDOWN ===\n');
    result.sectors.forEach(s => {
      console.log(`${s.sectorName}: M=${s.totalMurukulu} B=${s.totalBalamrutham} (${s.awcBreakdown.length} AWCs)`);
    });
    
    // Write to file for reference
    fs.writeFileSync('parse-result.json', JSON.stringify(result, null, 2));
    console.log('\nResult saved to parse-result.json');
    
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  }
}

testPdf();
