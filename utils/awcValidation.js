// sector-to-AWC mapping and validation logic

// Mapping of sectors to AWC (Anganwadi Center) identifiers
const sectorToAWCMapping = {
    "Sector 1": "AWC_001",
    "Sector 2": "AWC_002",
    // ... Add all relevant sector to AWC mappings here
};

// Function to validate AWC entries
function validateAWCEntries(sector, awcId) {
    const expectedAWC = sectorToAWCMapping[sector];
    if (!expectedAWC) {
        throw new Error(`Sector ${sector} not found in mapping.`);
    }
    if (expectedAWC !== awcId) {
        throw new Error(`Invalid AWC ID for sector ${sector}. Expected: ${expectedAWC}, Received: ${awcId}`);
    }
    return true; // Validation successful
}

// Export the mapping and validation function
module.exports = { sectorToAWCMapping, validateAWCEntries };