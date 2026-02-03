#!/bin/bash
# Build verification script for Murukulu Dashboard

echo "================================"
echo "🔍 Build Verification Report"
echo "================================"
echo ""

echo "✅ Step 1: Checking Node.js version..."
node --version

echo ""
echo "✅ Step 2: Checking npm version..."
npm --version

echo ""
echo "✅ Step 3: Checking git status..."
git status

echo ""
echo "✅ Step 4: Verifying project structure..."
echo "Required files:"
if [ -f "package.json" ]; then echo "  ✓ package.json"; else echo "  ✗ package.json MISSING"; fi
if [ -f "next.config.js" ]; then echo "  ✓ next.config.js"; else echo "  ✗ next.config.js MISSING"; fi
if [ -f "pages/index.js" ]; then echo "  ✓ pages/index.js"; else echo "  ✗ pages/index.js MISSING"; fi
if [ -f "pages/api/upload.js" ]; then echo "  ✓ pages/api/upload.js"; else echo "  ✗ pages/api/upload.js MISSING"; fi
if [ -f "utils/parsePdf.js" ]; then echo "  ✓ utils/parsePdf.js"; else echo "  ✗ utils/parsePdf.js MISSING"; fi
if [ -f "styles/dashboard.module.css" ]; then echo "  ✓ styles/dashboard.module.css"; else echo "  ✗ styles/dashboard.module.css MISSING"; fi

echo ""
echo "✅ Step 5: Checking dependencies..."
npm list --depth=0

echo ""
echo "✅ Step 6: Build test (this may take a minute)..."
npm run build && echo "✓ Build successful" || echo "✗ Build failed"

echo ""
echo "================================"
echo "✅ Verification Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Create GitHub repository"
echo "2. Push code: git push origin main"
echo "3. Deploy to Vercel"
echo ""
echo "For detailed instructions, see: GITHUB_VERCEL_SETUP.md"
