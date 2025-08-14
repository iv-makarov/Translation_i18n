# Система безопасности и авторизации

## Обзор

Реализована безопасная система авторизации с использованием JWT токенов, куки и защитой API.

## Компоненты безопасности

### 1. JWT Токены
- **Access Token**: Срок действия 15 минут, используется для доступа к API
- **Refresh Token**: Срок действия 7 дней, используется для обновления access token
- Токены подписываются с использованием секретных ключей
- Включают информацию о пользователе (ID, email, роль)

### 2. Куки
- **httpOnly**: Предотвращает доступ к токенам через JavaScript
- **Secure**: В продакшене требует HTTPS
- **SameSite**: Защищает от CSRF атак
- **Path**: Ограничивает область действия куки

### 3. Хеширование паролей
- Используется bcrypt с 12 раундами соли
- Пароли никогда не хранятся в открытом виде
- Автоматическое хеширование при создании/обновлении

### 4. Защита API
- Все маршруты по умолчанию защищены
- Публичные маршруты помечаются декоратором `@Public()`
- JWT Guard проверяет валидность токенов
- Автоматическое отклонение неавторизованных запросов

## Маршруты авторизации

### Публичные маршруты
- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему
- `GET /auth/health` - Проверка состояния сервиса

### Защищенные маршруты
- `POST /auth/refresh` - Обновление токенов
- `POST /auth/logout` - Выход из системы
- `GET /auth/profile` - Получение профиля пользователя
- `GET /user/*` - Управление пользователями
- `GET /projects/*` - Управление проектами
- `GET /sub-projects/*` - Управление подпроектами
- `GET /translations/*` - Управление переводами

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Environment
NODE_ENV=development
PORT=3000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

## Использование на фронтенде

### Вход в систему
```typescript
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Важно для куки
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { user, tokens } = await response.json();
```

### Запросы к защищенным API
```typescript
const response = await fetch('/projects', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  credentials: 'include',
});
```

### Обновление токенов
```typescript
const response = await fetch('/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    refreshToken: refreshToken
  })
});

const { tokens } = await response.json();
```

## Безопасность

### Защита от атак
- **XSS**: httpOnly куки, валидация входных данных
- **CSRF**: SameSite куки, проверка токенов
- **SQL Injection**: MikroORM с параметризованными запросами
- **Brute Force**: Ограничение попыток входа (рекомендуется добавить rate limiting)

### Рекомендации по продакшену
1. Измените секретные ключи JWT
2. Включите HTTPS
3. Настройте CORS для вашего домена
4. Добавьте rate limiting
5. Настройте логирование безопасности
6. Регулярно обновляйте зависимости

## Обновление базы данных

После внесения изменений в сущности, обновите схему базы данных:

```bash
# Создание новой схемы
pnpm run db:create

# Обновление существующей схемы
pnpm run db:update
```
