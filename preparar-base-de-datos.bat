@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo   ORIGAMI - paso 1 de 2: preparar la base de datos
echo ============================================================
echo.
echo Importa server\database.sql en MySQL.
echo Te pedira la contrasena del usuario root. Si no tiene, pulsa Enter.
echo.

set "MYSQL_EXE="
where mysql >nul 2>nul
if not errorlevel 1 set "MYSQL_EXE=mysql"
if not defined MYSQL_EXE if exist "C:\xampp\mysql\bin\mysql.exe" set "MYSQL_EXE=C:\xampp\mysql\bin\mysql.exe"

if not defined MYSQL_EXE echo [!] No encontre el comando mysql en este equipo.
if not defined MYSQL_EXE echo     Opcion 1: importa server\database.sql con MySQL Workbench.
if not defined MYSQL_EXE echo     Opcion 2: si usas XAMPP, abre su consola y ejecuta el archivo a mano.
if not defined MYSQL_EXE echo.
if not defined MYSQL_EXE pause
if not defined MYSQL_EXE exit /b 1

echo Usando: %MYSQL_EXE%
echo.
"%MYSQL_EXE%" -u root -p < "server\database.sql"

if errorlevel 1 echo.
if errorlevel 1 echo [!] No se pudo importar. Causas tipicas:
if errorlevel 1 echo     - La contrasena de root esta mal.
if errorlevel 1 echo     - El servicio de MySQL no esta encendido.
if errorlevel 1 echo     - La base ya estaba creada y el usuario origami ya existia.
if errorlevel 1 echo.
if errorlevel 1 pause
if errorlevel 1 exit /b 1

echo.
echo Listo. La base origami_db quedo creada con sus 3 datos de ejemplo.
echo Ahora ejecuta:  iniciar-windows.bat
echo.
pause
