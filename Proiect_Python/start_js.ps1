# Axa Cronologică JavaScript
# 15 Miliarde î.Hr. - 2100 d.Hr.

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AXA CRONOLOGICA UNIVERSALA (JS)" -ForegroundColor Yellow
Write-Host "   15 Miliarde î.Hr. - 2100 d.Hr." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pornesc aplicația..." -ForegroundColor Green
Write-Host ""

# Verifică dacă există Python pentru server HTTP simplu
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "Pornesc serverul HTTP local cu Python..." -ForegroundColor Green
        Write-Host "Aplicația va fi disponibilă la: http://localhost:8000" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Pentru a închide aplicația, apasă Ctrl+C" -ForegroundColor Red
        Write-Host ""
        
        # Deschide browserul
        Start-Process "http://localhost:8000"
        
        # Pornește serverul
        python -m http.server 8000
    }
}
catch {
    # Încearcă cu Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Host "Pornesc serverul HTTP local cu Node.js..." -ForegroundColor Green
            Write-Host "Aplicația va fi disponibilă la: http://localhost:8000" -ForegroundColor Yellow
            Write-Host ""
            
            # Deschide browserul
            Start-Process "http://localhost:8000"
            
            # Pornește serverul
            npx http-server -p 8000
        }
    }
    catch {
        Write-Host "Nu s-a găsit Python sau Node.js pentru server HTTP." -ForegroundColor Red
        Write-Host "Deschid fișierul HTML direct în browser..." -ForegroundColor Yellow
        Start-Process "index.html"
    }
}

Write-Host ""
Write-Host "Apasă orice tastă pentru a continua..." -ForegroundColor Gray
Read-Host
