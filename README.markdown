# ЭкоПлатформа

ЭкоПлатформа — это веб-приложение для учета переработки отходов и отслеживания экологического вклада пользователей. Пользователи могут регистрироваться, добавлять отчеты о сданных отходах, просматривать статистику и получать достижения на основе накопленных эко-баллов. Приложение включает серверную часть на Node.js с базой данных SQLite и клиентскую часть с HTML, CSS и JavaScript.

## Особенности

- Регистрация и авторизация пользователей
- Просмотр списка пунктов приема отходов
- Добавление отчетов о сданных отходах (пластик, бумага, стекло)
- Отображение статистики пользователя (эко-баллы, объем сданных отходов)
- Система достижений (Эко-Новичок, Эко-Активист, Эко-Герой)
- Адаптивный дизайн с модальным окном для авторизации
- Интеграция с Telegram-ботом (ссылка в футере)
- Поиск пунктов приема (реализован в отдельной странице)

## Технологии

- **Backend**: Node.js, Express.js, SQLite3
- **Frontend**: HTML, CSS, JavaScript
- **Стилизация**: Пользовательский CSS с адаптивным дизайном
- **Дополнительно**: CORS для кросс-доменных запросов, LocalStorage для хранения данных авторизации

## Установка и запуск

### Предварительные требования

- Node.js (версия 14 или выше)
- npm (устанавливается вместе с Node.js)
- SQLite3 (должен быть установлен или доступен через npm)

### Инструкции

1. **Клонируйте репозиторий**:

   ```bash
   git clone https://github.com/your-username/eco-platform.git
   cd eco-platform
   ```

2. **Установите зависимости**:

   ```bash
   npm install
   ```

3. **Запустите сервер**:

   ```bash
   node server.js
   ```

4. **Откройте приложение**:

   - Перейдите по адресу `http://localhost:3000` в браузере.
   - Используйте `index.html` как главную страницу приложения.

5. **Дополнительно**:

   - Для использования Telegram-бота настройте соответствующий бот в Telegram и замените ссылку в `index.html` на актуальную.
   - Убедитесь, что файл `лого.jpg` (используемый для фона) и `icon.png` (иконка Telegram) находятся в корневой директории или замените их на свои изображения.


```

## Использование

1. **Авторизация**:

   - При первом входе введите имя пользователя в модальном окне.
   - Данные сохраняются в LocalStorage для последующих входов.

2. **Основные функции**:

   - Просмотрите список пунктов приема в разделе "Список пунктов приема".
   - Добавьте отчет о сданных отходах в разделе "Добавить отчет", указав тип отходов, вес и пункт приема.
   - Отслеживайте свои эко-баллы и статистику в разделе "Ваш экологический вклад".
   - Проверьте свои достижения в разделе "Достижения".


