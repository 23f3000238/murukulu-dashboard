# Murukulu & Balamrutham Dashboard

A production-ready Next.js dashboard for parsing and analyzing government PDF reports with tabular indent data.

## Features

✅ **PDF Upload & Parsing** - Upload government-style PDF reports with tabular data
✅ **Data Extraction** - Robust extraction of Sector Name, AWC Name, Murukulu, and Balamrutham quantities
✅ **Sector Grouping** - Automatic grouping by sector with expandable details
✅ **AWC Breakdown** - View AWC-wise data within each sector
✅ **Grand Totals** - Automatic calculation of sector and grand totals
✅ **Excel Export** - Download processed data as Excel file
✅ **Mobile Responsive** - Clean, mobile-friendly interface
✅ **Production Ready** - Vercel-compatible, optimized build

## Tech Stack

- **Frontend**: Next.js, React, CSS Modules
- **Backend**: Next.js API Routes, Node.js
- **PDF Processing**: pdf-parse
- **File Upload**: formidable
- **Export**: xlsx
- **Hosting**: Vercel

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

1. **Upload PDF**: Click "Choose PDF File" to select your government indent report
2. **View Data**: Sectors are displayed in collapsible cards
3. **Expand Sectors**: Click on a sector to view AWC-wise breakdown
4. **Export**: Click "Download as Excel" to export the summary

## PDF Format

The parser expects PDF documents with tabular data containing:
- Column 1: Sector Name (e.g., "Bonakal 1", "Madhira 2")
- Column 2: AWC Name
- Column 3: Murukulu Indent quantity (number)
- Column 4: Balamrutham Indent quantity (number)

The parser is robust and handles:
- Variable spacing and alignment
- Decimal numbers
- Tab or space-separated columns
- Header and footer lines
- Inconsistent formatting

## API Endpoints

### POST /api/upload

Uploads and processes a PDF file.

**Request:**
- `multipart/form-data` with file field

**Response:**
```json
{
  "success": true,
  "sectors": [
    {
      "sectorName": "Bonakal 1",
      "totalMurukulu": 100,
      "totalBalamrutham": 50,
      "awcBreakdown": [
        {
          "awcName": "AWC-001",
          "murukulu": 50,
          "balamrutham": 25
        }
      ]
    }
  ],
  "grandTotals": {
    "totalMurukulu": 1000,
    "totalBalamrutham": 500,
    "totalItems": 1500
  },
  "rowCount": 50,
  "message": "Successfully parsed 50 rows from PDF"
}
```

## File Structure

```
/
├── package.json
├── next.config.js
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js (Dashboard)
│   └── api/
│       └── upload.js (API endpoint)
├── utils/
│   └── parsePdf.js (PDF parser)
├── styles/
│   ├── globals.css
│   └── dashboard.module.css
└── tmp/ (temporary file storage)
```

## Deployment to Vercel

```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

**Important Notes for Vercel:**
- Temporary files are stored in `/tmp` directory
- The `/tmp` directory is ephemeral and cleaned between deployments
- File uploads are processed and deleted immediately
- Max file size: 50MB

## Performance Optimizations

- Automatic minification and compression
- Disabled source maps in production
- Optimized font loading
- CSS modules for scoped styling
- Efficient state management

## Troubleshooting

### "Failed to parse PDF"
- Ensure the PDF contains the expected table format
- Check that column values are readable
- Try with a different PDF file

### "No file uploaded"
- Make sure you selected a file before uploading
- Verify the file is not corrupted

### Upload timeout
- Check file size (max 50MB)
- Ensure PDF is not overly complex

## Future Enhancements

- Multiple PDF upload and batch processing
- Data visualization with charts
- Database integration for historical data
- Advanced filtering and search
- User authentication
- Email notifications
- Data validation and error reporting

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
