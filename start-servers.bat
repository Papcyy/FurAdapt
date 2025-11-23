@echo off
echo Starting FurAdapt Application...
echo.

echo Killing existing Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting Backend Server...
start "FurAdapt Backend" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "FurAdapt Frontend" cmd /k "cd /d %~dp0furadapt && npm run dev"

echo.
echo ✅ Both servers are starting up!
echo.
echo Backend: http://192.168.100.9:5001
echo Frontend: http://192.168.100.9:5173
echo.
echo Press any key to close this window...
pause >nul