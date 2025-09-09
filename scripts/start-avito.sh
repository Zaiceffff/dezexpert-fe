#!/bin/bash

# Скрипт для запуска Avito интеграции

echo "🚀 Запуск Avito интеграции..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker для запуска Avito backend."
    exit 1
fi

# Проверяем наличие docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose не установлен. Установите docker-compose для запуска Avito backend."
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f ".env.avito" ]; then
    echo "⚠️  Файл .env.avito не найден. Создайте его на основе .env.avito.example"
    echo "📝 Скопируйте .env.avito.example в .env.avito и заполните переменные:"
    echo "   - AVITO_CLIENT_ID"
    echo "   - AVITO_CLIENT_SECRET" 
    echo "   - OPENAI_API_KEY"
    echo "   - DEZEXPERT_API_KEY"
    echo "   - JWT_SECRET"
    echo "   - WEBHOOK_SIGNATURE_SECRET"
    exit 1
fi

# Загружаем переменные окружения
export $(cat .env.avito | grep -v '^#' | xargs)

# Проверяем обязательные переменные
required_vars=("AVITO_CLIENT_ID" "AVITO_CLIENT_SECRET" "OPENAI_API_KEY" "DEZEXPERT_API_KEY" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Переменная $var не установлена в .env.avito"
        exit 1
    fi
done

echo "✅ Все переменные окружения настроены"

# Запускаем Avito backend
echo "🐳 Запуск Avito backend через Docker Compose..."
docker-compose -f docker-compose.avito.yml up -d

# Ждем запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверяем статус сервисов
echo "🔍 Проверка статуса сервисов..."
docker-compose -f docker-compose.avito.yml ps

# Проверяем доступность Avito backend
echo "🌐 Проверка доступности Avito backend..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Avito backend запущен и доступен на http://localhost:3001"
else
    echo "❌ Avito backend недоступен. Проверьте логи:"
    echo "   docker-compose -f docker-compose.avito.yml logs avito-backend"
fi

echo ""
echo "🎉 Avito интеграция запущена!"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Откройте http://localhost:3000/app/dashboard"
echo "   2. Перейдите на вкладку 'Авито'"
echo "   3. Подключите ваш аккаунт Avito"
echo "   4. Синхронизируйте объявления"
echo "   5. Включите ИИ-ассистент для нужных объявлений"
echo ""
echo "🔧 Полезные команды:"
echo "   - Остановить: docker-compose -f docker-compose.avito.yml down"
echo "   - Логи: docker-compose -f docker-compose.avito.yml logs -f"
echo "   - Перезапуск: docker-compose -f docker-compose.avito.yml restart"
echo ""
