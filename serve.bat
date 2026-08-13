@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
echo 正在启动 Cdocs 预览服务器... （按 Ctrl+C 停止）
Cdocs.exe serve %*
if errorlevel 1 pause
