# Deployment & Setup Guide

## Project Overview

**Murukulu & Balamrutham Dashboard** - A production-ready Next.js application for parsing government PDF reports and analyzing tabular indent data.

### ✅ What's Included

1. **Frontend Dashboard**
   - Modern, responsive UI with gradient design
   - Collapsible sector cards with AWC breakdown
   - Real-time data display
   - Mobile-friendly layout

2. **Backend Processing**
   - Robust PDF parsing with multiple strategies
   - Automatic data grouping by sector
   - Error handling and validation
   - Support for various PDF formats

3. **Data Export**
   - Excel file generation with formatting
   - Sector-wise breakdown included
   - Date-stamped filenames

4. **Production Ready**
   - Optimized build configuration
   - Vercel-compatible deployment
   - Security best practices
   - Performance optimizations

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd "c:\Users\srina\Downloads\murukulu-dashboard (1)"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

**Build Output:**
- ✓ Production build completed successfully
- ✓ All pages compiled and optimized
- ✓ Static assets generated
- ✓ Ready for deployment

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Connect repo to [Vercel Dashboard](https://vercel.com)
3. Automatic deploys on each push

### Option 3: Manual Deployment

1. Build locally: `npm run build`
2. Upload `.next` folder to your server
3. Set environment variables (if any)
4. Start with: `npm start`

## Environment Configuration

Create `.env.local` for development:

```
API_ROUTE=/api/upload
NODE_ENV=development
```

For production on Vercel, add environment variables in Dashboard.

## Project Structure

```
murukulu-dashboard/
├── pages/
│   ├── _app.js              # App wrapper
│   ├── _document.js         # HTML document
│   ├── index.js             # Dashboard page (Main UI)
│   └── api/
│       └── upload.js        # PDF upload endpoint
├── utils/
│   └── parsePdf.js          # PDF parsing logic
├── styles/
│   ├── globals.css          # Global styles
│   └── dashboard.module.css # Component styles
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
├── .gitignore               # Git ignore rules
└── README.md                # Documentation
```

## API Reference

### Upload Endpoint: `POST /api/upload`

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` (PDF file)
- Max Size: 50MB

**Response Success (200):**
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

**Response Error (400/500):**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Features Breakdown

### 1. PDF Upload
- Drag-and-drop ready
- File type validation
- Size limit: 50MB
- Progress indicator

### 2. Data Processing
- **Multiple parsing strategies** for robust extraction:
  - Standard numeric extraction
  - Decimal number support
  - Tab/space separated parsing
  - Alternative format detection
  
- **Data validation:**
  - Sector name validation (minimum 2 chars)
  - AWC name validation
  - Numeric value validation
  - Header/footer detection

- **Automatic grouping:**
  - Sectors sorted alphabetically
  - AWC data organized by sector
  - Automatic total calculation

### 3. Frontend Display
- **Summary cards** showing:
  - Total sectors count
  - Total Murukulu quantity
  - Total Balamrutham quantity
  - Combined total

- **Collapsible sectors:**
  - Click to expand/collapse
  - Smooth animations
  - AWC-wise breakdown table
  - Sector subtotals

- **Data table:**
  - Responsive design
  - Mobile-optimized
  - Number formatting
  - Hover effects

### 4. Export Functionality
- Excel file generation
- Formatted headers
- Column widths optimized
- Date-stamped filename
- All data included

## Performance Optimizations

1. **Build Optimization**
   - SWC minification enabled
   - Production source maps disabled
   - CSS modules for scoped styling

2. **Runtime Optimization**
   - Automatic code splitting
   - Lazy component loading
   - Efficient state management
   - CSS optimization

3. **Vercel Specific**
   - Edge caching
   - Automatic compression
   - CDN distribution
   - Zero cold start

## Security Features

1. **File Upload**
   - MIME type validation
   - File extension checking
   - Size limits enforced
   - Temp files auto-deleted

2. **Input Validation**
   - Data type checking
   - Range validation
   - Format verification
   - Error isolation

3. **Production Settings**
   - Powered-by header removed
   - Security headers enabled
   - CORS configured
   - Environment variables protected

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### PDF Not Parsing
- Ensure PDF contains expected table format
- Check column structure matches requirements
- Verify numeric values are readable
- Try alternative PDF

### Upload Timeout
- Check file size
- Verify network connection
- Try with smaller PDF first
- Check server logs

### Development Issues
```bash
# Clear all cache
npm run clean  # If script exists
# or manually
rm -rf .next build dist

# Restart dev server
npm run dev
```

## Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^14.0.0 | React framework |
| react | ^18.2.0 | UI library |
| react-dom | ^18.2.0 | React DOM |
| pdf-parse | ^1.1.1 | PDF extraction |
| formidable | ^3.5.1 | File upload |
| xlsx | ^0.18.5 | Excel export |

## Testing the Application

### Manual Testing

1. **Upload Test:**
   - Go to http://localhost:3000
   - Upload a valid PDF
   - Verify data displays correctly

2. **Data Verification:**
   - Check sector grouping
   - Verify totals are correct
   - Expand sectors and check breakdown

3. **Export Test:**
   - Click "Download as Excel"
   - Verify file downloads
   - Open and check formatting

### Sample PDF Format

The parser expects PDFs with table structure:

```
Bonakal 1       AWC-001       50    25
Bonakal 1       AWC-002       50    25
Madhira 2       AWC-003       75    40
```

Flexible parsing handles:
- Extra spaces
- Tab characters
- Decimal numbers
- Various headers/footers

## Monitoring & Logging

On Vercel:
1. Dashboard shows deployment status
2. Real-time logs available
3. Error tracking enabled
4. Performance metrics included

For local development:
```bash
# View console output in dev mode
npm run dev

# Check Next.js build output
npm run build -- --verbose
```

## Next Steps & Enhancements

1. **Data Persistence**
   - Add database (PostgreSQL/MongoDB)
   - Store processing history
   - User accounts and authentication

2. **Advanced Features**
   - Multiple PDF upload
   - Batch processing
   - Data visualization charts
   - Custom report generation

3. **Integrations**
   - Email notifications
   - Cloud storage (AWS S3)
   - Data warehouse integration
   - API for external access

4. **Performance**
   - Database caching
   - Redis for session management
   - Image optimization
   - PWA capabilities

## Support & Documentation

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Deployment:** https://vercel.com/docs
- **React Docs:** https://react.dev
- **PDF Parse:** https://www.npmjs.com/package/pdf-parse

## Maintenance

### Regular Tasks
- Keep dependencies updated: `npm update`
- Run security audit: `npm audit`
- Monitor Vercel dashboard
- Review server logs

### Deployment Updates
```bash
# Update dependencies
npm update

# Test locally
npm run build
npm run start

# Deploy to Vercel
vercel
```

## Success Checklist

✅ Project structure created
✅ Dependencies installed
✅ Build completed successfully
✅ No compilation errors
✅ API endpoints functional
✅ Frontend rendering
✅ CSS modules loaded
✅ Responsive design verified
✅ Export functionality working
✅ Ready for Vercel deployment

---

**Version:** 1.0.0
**Last Updated:** February 3, 2026
**Status:** Production Ready ✅
