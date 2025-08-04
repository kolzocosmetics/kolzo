@echo off
REM KOLZO Production Deployment Script for Windows
REM This script helps deploy the full-stack application to production

echo 🚀 Starting KOLZO Production Deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [INFO] Prerequisites check passed ✓

REM Build frontend
echo [INFO] Building frontend...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)
echo [INFO] Frontend build completed ✓

REM Setup backend
echo [INFO] Setting up backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from template...
    copy .env.example .env
    echo [INFO] Created .env file from template. Please update with your values.
)

cd ..
echo [INFO] Backend setup completed ✓

REM Run tests (if available)
echo [INFO] Running tests...
call npm run test --if-present
cd backend
call npm run test --if-present
cd ..
echo [INFO] Tests completed ✓

REM Ask user for deployment preferences
echo.
echo Choose deployment option:
echo 1) Deploy frontend only (Vercel)
echo 2) Deploy backend only (Railway/Render)
echo 3) Deploy both (requires both CLIs)
echo 4) Manual deployment instructions
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto deploy_frontend
if "%choice%"=="2" goto deploy_backend
if "%choice%"=="3" goto deploy_both
if "%choice%"=="4" goto manual_instructions
echo [ERROR] Invalid choice
pause
exit /b 1

:deploy_frontend
echo [INFO] Deploying frontend to Vercel...
vercel --prod >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Please install it with: npm i -g vercel
    echo [INFO] You can deploy manually by pushing to your connected GitHub repository
)
goto end

:deploy_backend
echo [INFO] Deploying backend...
cd backend
railway up >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Railway CLI not found. Please install it or deploy manually
    echo [INFO] You can deploy to Railway, Render, or AWS manually
)
cd ..
goto end

:deploy_both
echo [INFO] Deploying both frontend and backend...
call :deploy_frontend
call :deploy_backend
goto end

:manual_instructions
echo.
echo 📋 Manual Deployment Instructions:
echo.
echo Frontend (Vercel):
echo 1. Push your code to GitHub
echo 2. Connect your repository to Vercel
echo 3. Set environment variables in Vercel dashboard
echo 4. Deploy automatically on push to main branch
echo.
echo Backend (Railway/Render/AWS):
echo 1. Set up your backend environment variables
echo 2. Deploy the backend to your preferred platform
echo 3. Update the frontend API URL to point to your backend
echo.
echo Environment Variables:
echo Frontend (.env):
echo VITE_API_URL=https://your-backend-domain.com/api
echo.
echo Backend (.env):
echo NODE_ENV=production
echo PORT=5000
echo MONGODB_URI=your-production-mongodb-uri
echo JWT_SECRET=your-production-jwt-secret
echo STRIPE_SECRET_KEY=your-stripe-secret
echo CLOUDINARY_URL=your-cloudinary-url
echo.
goto end

:end
echo [INFO] Deployment process completed! 🎉
pause 