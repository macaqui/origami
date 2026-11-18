@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo   ORIGAMI - paso 2 de 2: arrancar la aplicacion
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 echo [X] No encontre Node.js. Instalalo desde https://nodejs.org - version LTS - y vuelve a ejecutar.
if errorlevel 1 echo.
if errorlevel 1 pause
if errorlevel 1 exit /b 1

echo [1/4] Dependencias del backend...
cd server
if exist "node_modules" echo   (ya estaban instaladas, se omiten)
if not exist "node_modules" call npm ci
if not exist "node_modules" call npm install
if not exist ".env" copy ".env.example" ".env" >nul
echo.

echo [2/4] Dependencias del frontend...
cd ..\client
if exist "node_modules" echo   (ya estaban instaladas, se omiten)
if not exist "node_modules" call npm ci
if not exist "node_modules" call npm install
echo.

echo [3/4] Compilando la interfaz...
call npm run build
if not exist "dist\index.html" echo.
if not exist "dist\index.html" echo [X] La interfaz no se pudo compilar. Causas tipicas:
if not exist "dist\index.html" echo     - Este PC no tiene internet y las dependencias no estaban instaladas.
if not exist "dist\index.html" echo     - En ese caso usa  arrancar-sin-internet.bat  (la version que ya trae todo).
if not exist "dist\index.html" echo.
echo.

echo [4/4] Arrancando el servidor...
cd ..\server
echo.
echo   ---------------------------------------------------------
echo    Abre en el navegador:  http://localhost:3001
echo    Deja esta ventana abierta.  Para detener:  Ctrl + C
echo   ---------------------------------------------------------
echo.
echo   Si la pagina dice que no se pudieron cargar las hojas,
echo   ejecuta primero:  preparar-base-de-datos.bat
echo.
node src\index.js
echo.
pause
