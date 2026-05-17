@echo off
git rm -rf src/app/pro-grafik
git add .
git commit -m remove_pro_grafik --no-verify
git push origin main
