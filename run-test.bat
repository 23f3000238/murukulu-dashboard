@echo off
cd /d "c:\Users\srina\Downloads\murukulu-dashboard (1)"
node test-new-pdf.js > test-result.txt 2>&1
type test-result.txt
pause
