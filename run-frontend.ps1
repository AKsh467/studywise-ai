$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\frontend"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting StudyWise AI Frontend (Vite)" -ForegroundColor Cyan
Write-Host "  URL: http://localhost:5173" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

npm.cmd run dev
