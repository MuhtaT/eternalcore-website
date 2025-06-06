# EternalCore - Сайт автодоната для Minecraft сервера

Веб-сайт для донат-системы Minecraft сервера EternalCore, разработанный на Next.js.

## Возможности

- Отображение статуса сервера и количества игроков онлайн в реальном времени
- Система доната с привилегиями и пакетами
- Автоматическая выдача привилегий на сервере через интеграцию с плагином
- Современный и отзывчивый интерфейс

## Требования

- Node.js 18+
- Minecraft сервер с установленным плагином EternalCore (требуется для взаимодействия)

## Установка и запуск

1. Клонировать репозиторий
   ```bash
   git clone https://github.com/yourusername/eternalcore-web.git
   cd eternalcore-web
   ```

2. Установить зависимости
   ```bash
   npm install
   # или
   pnpm install
   ```

3. Создать файл .env.local с настройками окружения
   ```
   MINECRAFT_API_SECRET=your_super_secure_secret_key
   MINECRAFT_SERVER_URL=http://eternalcore.ru:25567/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Запустить сервер разработки
   ```bash
   npm run dev
   # или
   pnpm dev
   ```

5. Открыть [http://localhost:3000](http://localhost:3000) в браузере

## API для интеграции с Minecraft сервером

Для взаимодействия с сервером Minecraft используется защищенный API с HMAC-аутентификацией.

### Эндпоинты API

#### GET `/api/minecraft/online`

Получает информацию о количестве игроков онлайн с сервера Minecraft.

**Ответ:**
```json
{
  "online": 42,
  "cached": false
}
```

#### Тестовые эндпоинты

- `GET /api/minecraft/test` - Имитирует ответ сервера Minecraft для тестирования
- `GET /api/test-client` - Выполняет тестовый запрос к эндпоинту /minecraft/test

## Minecraft плагин

Для полной функциональности требуется плагин для Minecraft сервера, который обрабатывает запросы от веб-сайта.

Подробная документация по интеграции плагина находится в файле [minecraft-plugin-guide.md](minecraft-plugin-guide.md).

## Структура проекта

- `/app` - Страницы и маршруты приложения (Next.js App Router)
- `/components` - React компоненты
- `/lib` - Утилиты и вспомогательные функции
- `/public` - Статические файлы

## Взаимодействие с сервером Minecraft

Веб-сайт взаимодействует с сервером Minecraft через защищенный API. Каждый запрос подписывается HMAC-подписью для обеспечения безопасности.

Детали реализации и примеры кода для Minecraft плагина доступны в [minecraft-plugin-guide.md](minecraft-plugin-guide.md).

## Лицензия

[MIT](LICENSE)
