@echo off
cd /d "c:\Users\srina\Downloads\murukulu-dashboard (1)"
git add .
git commit -m "Fix parser validation to capture all data centers - allow single-char names"
git push origin main
echo Done!
pause
