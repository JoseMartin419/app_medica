#!/bin/bash

echo "🚀 Iniciando app_medica (backend + frontend)..."

osascript <<EOF
tell application "Terminal"
    activate
    do script "cd /Users/joseduran/MisProyectos/app_medica && python3 manage.py runserver"
end tell
EOF

sleep 2

osascript <<EOF
tell application "Terminal"
    do script "cd /Users/joseduran/MisProyectos/app_medica/frontend && npm start"
end tell
EOF
