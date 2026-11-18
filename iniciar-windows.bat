@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo   ORIGAMI - arranque automatico en Windows
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 goto sin_node

rem ---------------- 1/5 Base de datos ----------------
if exist "server\.base-importada" goto base_lista

echo [1/5] Importando la base de datos. Puede pedirte la contrasena de root.
set "MYSQL_EXE="
where mysql >nul 2>nul
if not errorlevel 1 set "MYSQL_EXE=mysql"
if not defined MYSQL_EXE if exist "C:\xampp\mysql\bin\mysql.exe" set "MYSQL_EXE=C:\xampp\mysql\bin\mysql.exe"
if not defined MYSQL_EXE goto sin_mysql

"%MYSQL_EXE%" -u root -p < "server\database.sql"
if errorlevel 1 goto error_base

echo ok> "server\.base-importada"
goto base_lista

:sin_mysql
echo    [!] No encontre el comando mysql en el PATH.
echo        Importa la base a mano, una sola vez:
echo            mysql -u root -p ^< server\database.sql
goto base_lista

:error_base
echo    [!] No se pudo importar la base.
echo        Revisa la contrasena de root o importala con MySQL Workbench.
goto base_lista

:base_lista
echo.

rem ---------------- 2/5 Backend ----------------
echo [2/5] Instalando dependencias del backend...
cd server
call npm ci
if errorlevel 1 call npm install
if not exist ".env" copy ".env.example" ".env" >nul
echo.

rem ---------------- 3/5 Frontend ----------------
echo [3/5] Instalando dependencias del frontend...
cd ..\client
call npm ci
if errorlevel 1 call npm install
echo.

rem ---------------- 4/5 Compilar ----------------
echo [4/5] Compilando la interfaz...
call npm run build
if errorlevel 1 goto error_build
echo.

rem ---------------- 5/5 Arrancar ----------------
echo [5/5] Arrancando el servidor...
cd ..\server
echo.
echo   ---------------------------------------------------------
echo    Abre en el navegador:  http://localhost:3001
echo    Deja esta ventana abierta.  Para detener:  Ctrl + C
echo   ---------------------------------------------------------
echo.
node src\index.js
goto fin

:error_build
echo.
echo [X] Fallo la compilacion de la interfaz.
echo     Prueba a mano:  cd client   y luego   npm run build
goto fin

:sin_node
echo [X] No encontre Node.js en este equipo.
echo     Instalalo desde https://nodejs.org - version LTS - y vuelve a ejecutar.
goto fin

:fin
echo.
pause
