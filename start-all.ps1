$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Starting StudyWise AI Integrated Full-Stack System..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-File", "$ScriptDir\run-backend.ps1"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-File", "$ScriptDir\run-frontend.ps1"

Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8000 (Swagger docs: http://localhost:8000/docs)" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
