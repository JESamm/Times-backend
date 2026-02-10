# TMU TIMES Server Startup Script
# Run this script to start both backend and frontend servers

Write-Host "🚀 Starting TMU TIMES Servers..." -ForegroundColor Cyan

# Kill any existing node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start backend in a new window
Write-Host "📡 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\ejsam\OneDrive\Documents\TMU TIMES\backend'; node server.tmu.js"

Start-Sleep -Seconds 3

# Start frontend in a new window  
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\ejsam\OneDrive\Documents\TMU TIMES'; npm start"

Write-Host ""
Write-Host "✅ Servers starting in separate windows!" -ForegroundColor Green
Write-Host "   Backend: http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📝 Login with: STU-2024-001 / password123" -ForegroundColor Magenta
