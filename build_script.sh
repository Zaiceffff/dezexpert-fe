#!/bin/bash

echo "Подключение к серверу..."
ssh root@${DEPLOY_HOST:-91.84.98.183} << 'EOF'
echo "Переход в директорию проекта..."
cd /root/dezexpert-fe

echo "Проверка npm..."
npm --version

echo "Установка зависимостей..."
npm install

echo "Выполнение билда..."
npm run build

echo "Проверка результата билда..."
ls -la .next/

echo "Билд завершен!"
EOF

echo "Скрипт выполнен!"

