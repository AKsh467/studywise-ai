@echo off
echo Starting StudyWise AI Integrated Full-Stack System...
start "StudyWise Backend (FastAPI)" cmd /c "%~dp0run-backend.bat"
timeout /t 2 /nobreak >nul
start "StudyWise Frontend (Vite)" cmd /c "%~dp0run-frontend.bat"
echo Both servers are launching!
echo Backend: http://localhost:8000 (Swagger: http://localhost:8000/docs)
echo Frontend: http://localhost:5173
pause
