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
  const headerKeywords = ['sector', 'awc', 'indent', 'quantity', 'total', 'sl.no', 'name', 'balamrutham', 'murukulu'];
  const lowerLine = line.toLowerCase();
  const keywordMatch = headerKeywords.filter(kw => lowerLine.includes(kw)).length;
  
  return (
    line.match(/^[=\-*\s]+$/) ||
    keywordMatch >= 2 ||
    line.match(/^\d+\s*$/) ||
    line.length < 5
  );
}

/**
 * Primary parsing strategy: extract numbers from end, split names
 */
function parseDataRow(line) {
  const normalized = line.replace(/\s+/g, ' ').trim();
  const parts = normalized.split(/\s+/);

  if (parts.length < 3) return null;

  // Extract last 2 numeric values
  let murukulu = null;
  let balamrutham = null;
  let endIdx = parts.length - 1;

  // Get last number
  const lastNum = parseInt(parts[endIdx], 10);
  if (!isNaN(lastNum) && lastNum >= 0) {
    balamrutham = lastNum;
    endIdx--;
  } else {
    return null;
  }

  // Get second-to-last number
  const secondLastNum = parseInt(parts[endIdx], 10);
  if (!isNaN(secondLastNum) && secondLastNum >= 0) {
    murukulu = secondLastNum;
    endIdx--;
  } else {
    return null;
  }

  // Remaining parts form sector and awc names
  const namesPart = parts.slice(0, endIdx + 1).join(' ');
  const nameParts = namesPart.split(/\s{2,}|,/).map(p => p.trim()).filter(p => p);

  if (nameParts.length < 2) return null;

  return {
    sectorName: nameParts[0],
    awcName: nameParts.slice(1).join(' '),
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
 */
function parseTabSeparated(line) {
  let parts = [];
  
  if (line.includes('\t')) {
    parts = line.split(/\t+/).map(p => p.trim()).filter(p => p);
  } else if (line.match(/\s{3,}/)) {
    parts = line.split(/\s{3,}/).map(p => p.trim()).filter(p => p);
  }

  if (parts.length < 4) return null;

  const murukulu = parseInt(parts[parts.length - 2], 10);
  const balamrutham = parseInt(parts[parts.length - 1], 10);

  if (isNaN(murukulu) || isNaN(balamrutham)) return null;

  return {
    sectorName: parts[0],
    awcName: parts[1],
    murukulu,
    balamrutham
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
