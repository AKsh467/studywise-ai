$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\backend"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting StudyWise AI Backend (FastAPI)" -ForegroundColor Cyan
Write-Host "  URL: http://localhost:8000" -ForegroundColor Green
Write-Host "  Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

& ".\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
