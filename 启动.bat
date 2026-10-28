@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PORT=8126

set PY=
where py >nul 2>nul && set PY=py -3
if "%PY%"=="" (where python >nul 2>nul && set PY=python)
if "%PY%"=="" (
  echo 未找到 Python，请安装 Python，或用任意 HTTP 服务托管本目录
  pause
  exit /b 1
)

echo 正在启动《潜伏之赤途》离线版 ...
start "" /b %PY% -m http.server %PORT% --bind 127.0.0.1
ping -n 3 127.0.0.1 >nul 2>nul
start "" "http://127.0.0.1:%PORT%/"
echo.
echo 服务已启动: http://127.0.0.1:%PORT%/
echo 玩完关掉本窗口即可停止服务。
pause >nul
