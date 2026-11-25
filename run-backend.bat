@echo off
cd /d "%~dp0backend"
echo ==========================================
echo   Starting StudyWise AI Backend (FastAPI)
echo   URL: http://localhost:8000
echo   Docs: http://localhost:8000/docs
echo ==========================================
".\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pause
