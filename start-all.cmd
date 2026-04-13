@echo off
REM Double-click launcher -- delegates to start-all.ps1 with a bypass policy.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-all.ps1"
pause
