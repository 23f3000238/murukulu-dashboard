import { useState } from 'react';
import * as XLSX from 'xlsx';
import styles from '../styles/dashboard.module.css';

export default function Home() {
  const [data, setData] = useState(null);
  const [expandedSectors, setExpandedSectors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to parse PDF');
      }

      setData(result);
      setExpandedSectors({});
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'An error occurred during upload');
      setData(null);
    } finally {
      setLoading(false);
      // Reset file input
      e.target.value = '';
    }
  }

  function toggleSector(sectorName) {
    setExpandedSectors(prev => ({
      ...prev,
      [sectorName]: !prev[sectorName]
    }));
  }

  function downloadExcel() {
    if (!data?.sectors) return;

    const wsData = [];

    // Add title
    wsData.push(['Murukulu & Balamrutham Report']);
    wsData.push([]);

    // Add header
    wsData.push(['Sector Name', 'AWC Name', 'Murukulu Indent', 'Balamrutham Indent']);

    // Add data
    data.sectors.forEach(sector => {
      sector.awcBreakdown.forEach((awc, index) => {
        wsData.push([
          index === 0 ? sector.sectorName : '',
          awc.awcName,
          awc.murukulu,
          awc.balamrutham
        ]);
      });

      // Add sector totals
      wsData.push([
        `${sector.sectorName} Total`,
        '',
        sector.totalMurukulu,
        sector.totalBalamrutham
      ]);

      wsData.push([]); // Empty row for spacing
    });

    // Add grand totals
    wsData.push([]);
    wsData.push([
      'GRAND TOTAL',
      '',
      data.grandTotals.totalMurukulu,
      data.grandTotals.totalBalamrutham
    ]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws['!cols'] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 18 },
      { wch: 18 }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    // Download
    XLSX.writeFile(wb, `murukulu-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📊 Murukulu & Balamrutham Dashboard</h1>
        <p className={styles.subtitle}>Upload PDF reports to view and analyze data by sector</p>
      </header>

      <div className={styles.uploadSection}>
        <label className={styles.fileLabel}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={loading}
            className={styles.fileInput}
          />
          <span className={styles.uploadButton}>
            {loading ? 'Processing...' : '📁 Choose PDF File'}
          </span>
        </label>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className={styles.contentSection}>
          <div className={styles.summaryBox}>
            <h2>Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <div className={styles.cardLabel}>Total Sectors</div>
                <div className={styles.cardValue}>{data.sectors.length}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.cardLabel}>Total Murukulu</div>
                <div className={styles.cardValue}>{data.grandTotals.totalMurukulu.toLocaleString()}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.cardLabel}>Total Balamrutham</div>
                <div className={styles.cardValue}>{data.grandTotals.totalBalamrutham.toLocaleString()}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.cardLabel}>Grand Total Items</div>
                <div className={styles.cardValue}>{data.grandTotals.totalItems.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className={styles.sectorsSection}>
            <h2>Sector Breakdown</h2>
            <div className={styles.sectorsList}>
              {data.sectors.map((sector, index) => (
                <div key={index} className={styles.sectorCard}>
                  <div
                    className={styles.sectorHeader}
                    onClick={() => toggleSector(sector.sectorName)}
                  >
                    <div className={styles.sectorTitle}>
                      <span className={styles.expandIcon}>
                        {expandedSectors[sector.sectorName] ? '▼' : '▶'}
                      </span>
                      <strong>{sector.sectorName}</strong>
                    </div>
                    <div className={styles.sectorStats}>
                      <span className={styles.stat}>
                        M: <strong>{sector.totalMurukulu}</strong>
                      </span>
                      <span className={styles.stat}>
                        B: <strong>{sector.totalBalamrutham}</strong>
                      </span>
                    </div>
                  </div>

                  {expandedSectors[sector.sectorName] && (
                    <div className={styles.sectorDetails}>
                      <table className={styles.detailsTable}>
                        <thead>
                          <tr>
                            <th>AWC Name</th>
                            <th>Murukulu</th>
                            <th>Balamrutham</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sector.awcBreakdown.map((awc, awcIndex) => (
                            <tr key={awcIndex}>
                              <td>{awc.awcName}</td>
                              <td className={styles.numericCell}>{awc.murukulu}</td>
                              <td className={styles.numericCell}>{awc.balamrutham}</td>
                            </tr>
                          ))}
                          <tr className={styles.sectorTotalRow}>
                            <td>Sector Total</td>
                            <td className={styles.numericCell}>
                              <strong>{sector.totalMurukulu}</strong>
                            </td>
                            <td className={styles.numericCell}>
                              <strong>{sector.totalBalamrutham}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actionsSection}>
            <button onClick={downloadExcel} className={styles.downloadButton}>
              📥 Download as Excel
            </button>
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div className={styles.emptyState}>
          <p>👆 Start by uploading a PDF file to view sector-wise data</p>
        </div>
      )}
    </div>
  );
}
