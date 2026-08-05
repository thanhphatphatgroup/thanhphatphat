@echo off
chcp 65001 > nul
title CAP NHAT GALLERY ANH - THANH PHAT PHAT PLASTIC

python update-gallery.py

echo.
echo ==================================================
echo Da nien WebP va cap nhat file gallery.json thanh cong!
echo ==================================================
pause