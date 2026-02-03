const { parsePdfReportFromBuffer } = require('./utils/parsePdf');
const fs = require('fs');

(async () => {
  try {
    console.log('Testing fixed parser...\n');
    
    // Test original PDF
    console.log('=== ORIGINAL PDF (new murukulu.pdf) ===');
    const origBuf = fs.readFileSync('c:\\Users\\srina\\Downloads\\new murukulu.pdf');
    const origResult = await parsePdfReportFromBuffer(origBuf);
    
    console.log(`✓ Sectors found: ${origResult.sectors.length}`);
    console.log(`✓ Murukulu total: ${origResult.grandTotals.totalMurukulu}`);
    console.log(`✓ Balamrutham total: ${origResult.grandTotals.totalBalamrutham}`);
    console.log(`✓ Rows parsed: ${origResult.rowCount}`);
    console.log(`✓ Message: ${origResult.message}`);
    
    console.log('\n--- Sector Breakdown ---');
    origResult.sectors.forEach(s => {
      console.log(`${s.sectorName}: M=${s.totalMurukulu} B=${s.totalBalamrutham} (${s.awcBreakdown.length} AWCs)`);
      s.awcBreakdown.slice(0, 3).forEach(awc => {
        console.log(`  - ${awc.awcName}: M=${awc.murukulu} B=${awc.balamrutham}`);
      });
      if (s.awcBreakdown.length > 3) console.log(`  ... and ${s.awcBreakdown.length - 3} more`);
    });
    
    // Test reference PDF
    console.log('\n\n=== REFERENCE PDF (MurukuluIndents (2)-2 - Google Sheets.pdf) ===');
    const refBuf = fs.readFileSync('c:\\Users\\srina\\Downloads\\MurukuluIndents (2)-2 - Google Sheets.pdf');
    const refResult = await parsePdfReportFromBuffer(refBuf);
    
    console.log(`✓ Sectors found: ${refResult.sectors.length}`);
    console.log(`✓ Murukulu total: ${refResult.grandTotals.totalMurukulu}`);
    console.log(`✓ Balamrutham total: ${refResult.grandTotals.totalBalamrutham}`);
    console.log(`✓ Rows parsed: ${refResult.rowCount}`);
    console.log(`✓ Message: ${refResult.message}`);
    
    console.log('\n--- Sector Breakdown ---');
    refResult.sectors.forEach(s => {
      console.log(`${s.sectorName}: M=${s.totalMurukulu} B=${s.totalBalamrutham} (${s.awcBreakdown.length} AWCs)`);
      s.awcBreakdown.slice(0, 3).forEach(awc => {
        console.log(`  - ${awc.awcName}: M=${awc.murukulu} B=${awc.balamrutham}`);
      });
      if (s.awcBreakdown.length > 3) console.log(`  ... and ${s.awcBreakdown.length - 3} more`);
    });
    
    // Comparison
    console.log('\n\n=== COMPARISON ===');
    console.log(`Sectors: Original=${origResult.sectors.length}, Reference=${refResult.sectors.length}`);
    console.log(`Rows: Original=${origResult.rowCount}, Reference=${refResult.rowCount}`);
    console.log(`Murukulu: Original=${origResult.grandTotals.totalMurukulu}, Reference=${refResult.grandTotals.totalMurukulu}`);
    console.log(`Balamrutham: Original=${origResult.grandTotals.totalBalamrutham}, Reference=${refResult.grandTotals.totalBalamrutham}`);
    
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  }
  process.exit(0);
})();
