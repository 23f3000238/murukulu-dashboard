const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extract and parse tabular data from PDF buffer (Vercel serverless compatible)
 */
async function parsePdfReportFromBuffer(dataBuffer) {
  try {
    const data = await pdfParse(dataBuffer);
    return await processPdfText(data.text);
  } catch (error) {
    console.error('PDF Parsing Error:', error);
    return {
      success: false,
      message: `Error parsing PDF: ${error.message}`,
      error: error.message,
      sectors: [],
      grandTotals: { totalMurukulu: 0, totalBalamrutham: 0, totalItems: 0 }
    };
  }
}

/**
 * Extract and parse tabular data from government-style PDF reports
 * Handles: Sector Name, AWC Name, Murukulu Indent, Balamrutham Indent
 */
async function parsePdfReport(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    return parsePdfReportFromBuffer(dataBuffer);
  } catch (error) {
    console.error('PDF Parsing Error:', error);
    return {
      success: false,
      message: `Error parsing PDF: ${error.message}`,
      error: error.message,
      sectors: [],
      grandTotals: { totalMurukulu: 0, totalBalamrutham: 0, totalItems: 0 }
    };
  }
}

/**
 * Process extracted PDF text and return structured data
 */
async function processPdfText(text) {
  try {
    // Split into lines and clean
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Parse rows with robust error handling
    const sectorData = {};
    const allRows = [];

    // First, try to parse as columnar format (one field per line - typical of many PDFs)
    let columnarData = parseColumnarFormat(lines);
    
    if (columnarData && columnarData.length > 0) {
      // Use columnar format data
      for (const rowData of columnarData) {
        if (rowData && validateRow(rowData)) {
          allRows.push(rowData);

          // Group by sector
          const sector = rowData.sectorName;
          if (!sectorData[sector]) {
            sectorData[sector] = {
              sectorName: sector,
              totalMurukulu: 0,
              totalBalamrutham: 0,
              awcBreakdown: []
            };
          }

          sectorData[sector].awcBreakdown.push({
            awcName: rowData.awcName,
            murukulu: rowData.murukulu,
            balamrutham: rowData.balamrutham
          });

          sectorData[sector].totalMurukulu += rowData.murukulu;
          sectorData[sector].totalBalamrutham += rowData.balamrutham;
        }
      }
    } else {
      // Fallback: try line-by-line parsing for tabular formats
      for (const line of lines) {
        // Skip header/metadata lines
        if (isHeaderLine(line)) continue;

        // Try multiple parsing strategies
        let rowData = parseDataRow(line);
        if (!rowData) rowData = parseAlternativeFormat(line);
        if (!rowData) rowData = parseTabSeparated(line);

        if (rowData && validateRow(rowData)) {
          allRows.push(rowData);

          // Group by sector
          const sector = rowData.sectorName;
          if (!sectorData[sector]) {
            sectorData[sector] = {
              sectorName: sector,
              totalMurukulu: 0,
              totalBalamrutham: 0,
              awcBreakdown: []
            };
          }

          sectorData[sector].awcBreakdown.push({
            awcName: rowData.awcName,
            murukulu: rowData.murukulu,
            balamrutham: rowData.balamrutham
          });

          sectorData[sector].totalMurukulu += rowData.murukulu;
          sectorData[sector].totalBalamrutham += rowData.balamrutham;
        }
      }
    }

    // Calculate grand totals
    let grandMurukulu = 0;
    let grandBalamrutham = 0;

    Object.values(sectorData).forEach(sector => {
      grandMurukulu += sector.totalMurukulu;
      grandBalamrutham += sector.totalBalamrutham;
    });

    return {
      sectors: Object.values(sectorData).sort((a, b) => a.sectorName.localeCompare(b.sectorName)),
      grandTotals: {
        totalMurukulu: grandMurukulu,
        totalBalamrutham: grandBalamrutham,
        totalItems: grandMurukulu + grandBalamrutham
      },
      rowCount: allRows.length,
      success: true,
      message: `Successfully parsed ${allRows.length} rows from PDF`
    };
  } catch (error) {
    console.error('Text Processing Error:', error);
    return {
      success: false,
      message: `Error processing PDF text: ${error.message}`,
      error: error.message,
      sectors: [],
      grandTotals: { totalMurukulu: 0, totalBalamrutham: 0, totalItems: 0 }
    };
  }
}

function isHeaderLine(line) {
  const lowerLine = line.toLowerCase();
  
  // Skip decorative lines
  if (line.match(/^[=\-*\s]+$/)) return true;
  
  // Skip very short lines
  if (line.length < 3) return true;
  
  // Skip lines with metadata keywords
  if (lowerLine.includes('department') ||
      lowerLine.includes('government') ||
      lowerLine.includes('contact') ||
      lowerLine.includes('agency') ||
      lowerLine.includes('month & year') ||
      lowerLine.includes('indent number') ||
      lowerLine.includes('supplying agency') ||
      lowerLine.includes('commodity')) {
    return true;
  }

  // Skip lines that are clearly header column labels
  // These typically have multiple header keywords in sequence
  const headerKeywords = ['month', 'year', 'district', 'code', 'project', 'sector', 'awc', 'indent', 'murukulu', 'balamrutham'];
  const keywordMatches = headerKeywords.filter(kw => lowerLine.includes(kw)).length;
  
  // If line has many header keywords, it's likely a header row
  if (keywordMatches >= 4) return true;
  
  return false;
}

/**
 * Columnar format parsing (one field per line)
 * This handles PDFs where each field is on a separate line
 * Format: Lines are grouped in sets of 11
 * [0]=Month, [1]=DistCode, [2]=District, [3]=ProjCode, [4]=ProjName, [5]=SectorCode, 
 * [6]=SectorName, [7]=AWCCode, [8]=AWCName, [9]=Murukulu, [10]=Balamrutham
 */
function parseColumnarFormat(lines) {
  const records = [];
  
  // Look for numeric patterns that indicate data rows
  let recordBuffer = [];
  let skipUntilValidDate = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip obvious headers/metadata
    if (isHeaderLine(line)) continue;
    
    // Skip lines that are column headers in columnar format (Month, District, ProjectCode, etc.)
    if (line.match(/^(Month|District|Project|Sector|AWC|Indent|Code|Name|Year|DistrictCode|DistrictName|ProjectCode|ProjectName|Sector Code|SectorCode|SectorName|AWC Code|AWC Name|MurukuluIndent|Balamrutham Indent)/i)) {
      if (recordBuffer.length > 0 && recordBuffer.length < 11) {
        recordBuffer = []; // Reset if we hit a header mid-record
      }
      skipUntilValidDate = true; // Next valid date marks start of real data
      continue;
    }
    
    // Skip AWC codes (numeric 7-digit values that appear as first field of some records)
    // These are not real data rows
    if (recordBuffer.length === 0 && line.match(/^\d{7}$/)) {
      continue;
    }
    
    // Look for lines that match the date pattern (MM/YYYY) to start collecting records
    if (line.match(/^\d{2}\/\d{4}$/)) {
      skipUntilValidDate = false;
    }
    
    if (skipUntilValidDate && line.match(/^\d{2}\/\d{4}$/)) {
      skipUntilValidDate = false;
      recordBuffer = [line]; // Start new record with date
      continue;
    }
    
    if (!skipUntilValidDate) {
      recordBuffer.push(line);
      
      // When we have 11 fields, try to parse as a record
      if (recordBuffer.length === 11) {
        const record = parseColumnarRecord(recordBuffer);
        if (record) {
          records.push(record);
        }
        recordBuffer = [];
      }
    }
  }
  
  return records.length > 0 ? records : null;
}

/**
 * Parse a single columnar record (11 fields, one per line)
 */
function parseColumnarRecord(fields) {
  if (fields.length < 11) return null;
  
  // Extract fields at expected positions
  const sectorName = fields[6];  // SectorName
  const awcName = fields[8];     // AWCName
  const murukulu = parseFloat(fields[9]);    // Murukulu
  const balamrutham = parseFloat(fields[10]); // Balamrutham
  
  // Validate
  if (!sectorName || sectorName.length < 2 || !awcName || awcName.length < 2) return null;
  if (isNaN(murukulu) || isNaN(balamrutham) || murukulu < 0 || balamrutham < 0) return null;
  
  return {
    sectorName: sectorName.trim(),
    awcName: awcName.trim(),
    murukulu: murukulu,  // Keep decimals
    balamrutham: balamrutham   // Keep decimals
  };
}

/**
 * Primary parsing strategy: extract numbers from end, split names
 */
function parseDataRow(line) {
  const normalized = line.replace(/\s+/g, ' ').trim();
  const parts = normalized.split(/\s+/);

  if (parts.length < 4) return null;

  // Extract last 2 numeric values (MurukuluIndent, Balamrutham Indent)
  let balamrutham = null;
  let murukulu = null;
  let endIdx = parts.length - 1;

  // Get last number (Balamrutham)
  const lastNum = parseFloat(parts[endIdx]);
  if (!isNaN(lastNum) && lastNum >= 0) {
    balamrutham = Math.round(lastNum);
    endIdx--;
  } else {
    return null;
  }

  // Get second-to-last number (Murukulu)
  const secondLastNum = parseFloat(parts[endIdx]);
  if (!isNaN(secondLastNum) && secondLastNum >= 0) {
    murukulu = Math.round(secondLastNum);
    endIdx--;
  } else {
    return null;
  }

  // AWC Name is typically before the numbers (one part or two)
  // Try to find AWC name - usually 1-2 words before numbers
  let awcName = parts[endIdx];
  if (!awcName || awcName.length < 2) {
    return null;
  }

  // Sector name is everything before the AWC name
  const sectorParts = parts.slice(0, endIdx);
  if (sectorParts.length === 0) return null;
  
  const sectorName = sectorParts.join(' ');

  return {
    sectorName,
    awcName,
    murukulu,
    balamrutham
  };
}

/**
 * Alternative parsing for decimal numbers
 */
function parseAlternativeFormat(line) {
  const match = line.match(/(.+?)\s+([\d.]+)\s+([\d.]+)\s*$/);
  if (!match) return null;

  const namePart = match[1].trim();
  const murukulu = parseFloat(match[2]);
  const balamrutham = parseFloat(match[3]);

  if (isNaN(murukulu) || isNaN(balamrutham)) return null;

  const parts = namePart.split(/\s{2,}|,/).map(p => p.trim()).filter(p => p);
  if (parts.length < 2) return null;

  return {
    sectorName: parts[0],
    awcName: parts.slice(1).join(' '),
    murukulu: Math.round(murukulu),
    balamrutham: Math.round(balamrutham)
  };
}

/**
 * Tab or multiple-space separated parsing
 * Format: MonthYear | DistCode | District | ProjectCode | ProjectName | SectorCode | SectorName | AWCCode | AWCName | Murukulu | Balamrutham
 * Column indices: 0=Month, 1=DistCode, 2=District, 3=ProjCode, 4=ProjName, 5=SectorCode, 6=Sector, 7=AWCCode, 8=AWC, 9=Murukulu, 10=Balamrutham
 */
function parseTabSeparated(line) {
  let parts = [];
  
  if (line.includes('\t')) {
    parts = line.split(/\t+/).map(p => p.trim()).filter(p => p);
  } else if (line.match(/\s{2,}/)) {
    parts = line.split(/\s{2,}/).map(p => p.trim()).filter(p => p);
  }

  // Need at least 11 columns for the standard format
  if (parts.length < 11) return null;

  // Extract fixed column positions
  const sectorName = parts[6];  // Sector name at index 6
  const awcName = parts[8];     // AWC name at index 8
  const murukulu = parseFloat(parts[9]);   // Murukulu at index 9
  const balamrutham = parseFloat(parts[10]); // Balamrutham at index 10

  // Validate
  if (isNaN(murukulu) || isNaN(balamrutham) || murukulu < 0 || balamrutham < 0) return null;
  if (!sectorName || sectorName.length < 2 || !awcName || awcName.length < 2) return null;

  return {
    sectorName: sectorName.trim(),
    awcName: awcName.trim(),
    murukulu: Math.round(murukulu),
    balamrutham: Math.round(balamrutham)
  };
}

function validateRow(row) {
  return (
    row.sectorName &&
    row.awcName &&
    row.sectorName.length >= 2 &&
    row.awcName.length >= 2 &&
    row.murukulu >= 0 &&
    row.balamrutham >= 0 &&
    !isNaN(row.murukulu) &&
    !isNaN(row.balamrutham)
  );
}

module.exports = { parsePdfReport, parsePdfReportFromBuffer };
