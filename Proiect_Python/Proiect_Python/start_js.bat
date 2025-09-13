@echo off
title Axa Cronologica JavaScript
echo ========================================
echo    AXA CRONOLOGICA UNIVERSALA (JS)
echo    15 Miliarde î.Hr. - 2100 d.Hr.
echo ========================================
echo.
echo Pornesc aplicația...
echo.

REM Verifică dacă există Python pentru server HTTP simplu
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Pornesc serverul HTTP local cu Python...
    echo Aplicația va fi disponibilă la: http://localhost:8000
    echo.
    echo Pentru a închide aplicația, apasă Ctrl+C
    echo.
    python -m http.server 8000
) else (
    echo Python nu este instalat. Încerc cu Node.js...
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Pornesc serverul HTTP local cu Node.js...
        echo Aplicația va fi disponibilă la: http://localhost:8000
        echo.
        npx http-server -p 8000
    ) else (
        echo Nu s-a găsit Python sau Node.js pentru server HTTP.
        echo Deschid fișierul HTML direct în browser...
        start index.html
    )
)

pause
