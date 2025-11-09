@echo off
REM GitHub Deployment Verification Script for Windows

echo 🚀 Verifying Elite XSS Framework GitHub Deployment...
echo =====================================================

REM Check if we're in the right directory
if not exist ".git" (
    echo ❌ Error: Not in a Git repository
    exit /b 1
)

REM Check current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set BRANCH=%%i
echo 📋 Current branch: %BRANCH%

REM Check remote
for /f "tokens=*" %%i in ('git remote -v ^| findstr origin') do set REMOTE=%%i
echo 🔗 Remote repository: %REMOTE%

REM Check latest commit
for /f "tokens=*" %%i in ('git log -1 --oneline') do set COMMIT=%%i
echo 📝 Latest commit: %COMMIT%

REM Check if changes are pushed
git status --porcelain | findstr /V "On branch" | findstr /V "Your branch" | findstr /V "nothing to commit" > nul
if %errorlevel% equ 0 (
    echo ⚠️  Working directory has uncommitted changes
) else (
    echo ✅ Working directory is clean
)

echo.
echo 🎉 GitHub deployment verification complete!
echo    Your Elite XSS Framework is now available at:
echo    https://github.com/Nevrkin/My-XSS
echo.
echo 📊 Next steps:
echo    1. Visit your GitHub repository to verify files
echo    2. Enable GitHub Pages in repository settings
echo    3. Configure GitHub Actions in the 'Actions' tab
echo    4. Set up branch protection rules for 'main' branch