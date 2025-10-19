# Система аутентификации

## 📋 Обзор

Система аутентификации основана на **JWT токенах**, которые хранятся в **HttpOnly cookies** для максимальной безопасности. Используется два типа токенов:

- **Access Token** (15 минут) - для доступа к защищенным эндпоинтам
- **Refresh Token** (7 дней) - для обновления access token

## 🔐 Принципы работы

### 1. Регистрация и Логин

При регистрации или логине:

1. Пользователь отправляет credentials (email, password)
2. Сервер проверяет данные
3. Создает новую **Session** в БД с токенами
4. Возвращает оба токена в **HttpOnly cookies**
5. Возвращает данные пользователя (без пароля) в теле ответа

```typescript
// Пример запроса логина
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Ответ
{
  "user": {
    "id": "...",
    "email": "...",
    "firstName": "...",
    ...
  }
}

// Cookies автоматически устанавливаются в заголовке Set-Cookie:
// accessToken=xxx; HttpOnly; Secure; SameSite=Strict; MaxAge=900
// refreshToken=yyy; HttpOnly; Secure; SameSite=Strict; MaxAge=604800
```

### 2. Защищенные запросы

Для доступа к защищенным эндпоинтам:

1. Браузер **автоматически** отправляет cookies с каждым запросом
2. `JwtStrategy` извлекает `accessToken` из cookie
3. Проверяет валидность токена
4. Если токен валиден - запрос проходит
5. Если токен истек - возвращается 401 Unauthorized

```typescript
// Пример защищенного запроса
GET / api / projects;
// Cookies отправляются автоматически браузером

// Если токен валиден - получаем данные
// Если токен истек - получаем 401
```

### 3. Обновление токенов (Refresh)

Когда `accessToken` истекает:

1. Фронтенд ловит ошибку 401
2. Отправляет запрос на `/auth/refresh`
3. Сервер извлекает `refreshToken` из cookie
4. Проверяет валидность refresh token и сессии в БД
5. Генерирует **новую пару токенов**
6. Обновляет сессию в БД
7. Устанавливает новые токены в cookies

```typescript
// Запрос на обновление токенов
POST /auth/refresh
// refreshToken отправляется автоматически в cookie

// Ответ
{
  "message": "Token refreshed successfully"
}

// Новые токены автоматически устанавливаются в cookies
```

### 4. Выход (Logout)

При выходе:

1. Фронтенд отправляет запрос на `/auth/logout`
2. Сервер извлекает токены из cookies
3. Находит сессию в БД и помечает её как `revoked: true`
4. Очищает cookies на клиенте
5. Возвращает успешный ответ

```typescript
// Запрос на выход
POST /auth/logout

// Ответ
{
  "message": "Logout successful"
}

// Cookies автоматически удаляются
```

## 🏗️ Архитектура

### Entities

**Session** - хранит информацию о сессиях пользователей:

```typescript
{
  accessToken: string;      // Текущий access token
  refreshToken: string;     // Текущий refresh token
  user: Users;              // Связь с пользователем
  expiresAt: Date;          // Время истечения сессии (7 дней)
  revoked: boolean;         // Флаг отзыва сессии
  device?: string;          // Информация об устройстве
  ip?: string;              // IP адрес
  createdAt: Date;          // Время создания
}
```

### Стратегии

**JwtStrategy** - извлекает `accessToken` из cookies и валидирует его:

```typescript
// Извлечение токена из cookie
const extractJwtFromCookie = (req) => {
  return req.cookies.accessToken || null;
};
```

**RefreshTokenStrategy** - извлекает `refreshToken` из cookies (если потребуется):

```typescript
const extractRefreshTokenFromCookie = (req) => {
  return req.cookies.refreshToken || null;
};
```

### Guards

**JwtAuthGuard** - защищает эндпоинты, требуя валидный `accessToken`:

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute() {
  // Этот роут доступен только с валидным токеном
}
```

**@Public()** - декоратор для публичных эндпоинтов:

```typescript
@Public()
@Post('login')
async login() {
  // Этот роут доступен без аутентификации
}
```

## 🌐 Взаимодействие с фронтендом

### Настройка Axios/Fetch

На фронтенде **НЕ НУЖНО** вручную управлять токенами! Браузер автоматически отправляет cookies.

**Важно:** нужно включить `credentials: 'include'` для отправки cookies:

```typescript
// Axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // 👈 ВАЖНО!
});

// Fetch
fetch('http://localhost:3000/api/projects', {
  credentials: 'include', // 👈 ВАЖНО!
});
```

### Обработка истечения токена

Создайте interceptor для автоматического обновления токена:

```typescript
// Axios Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если получили 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        await api.post('/auth/refresh');

        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (refreshError) {
        // Если refresh не удался - редиректим на логин
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
```

### Пример использования на фронте

```typescript
// Login
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // Токены автоматически сохранены в cookies
    return response.data.user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Защищенный запрос
const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    // Interceptor автоматически обновит токен при 401
    console.error('Fetch failed:', error);
    throw error;
  }
};

// Logout
const logout = async () => {
  try {
    await api.post('/auth/logout');
    // Cookies автоматически очищены
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## 🔒 Безопасность

### HttpOnly Cookies

Токены хранятся в **HttpOnly cookies**, что защищает от XSS атак:

- JavaScript на странице **не может** прочитать токены
- Токены **автоматически** отправляются с каждым запросом
- Токены **не могут** быть украдены через XSS

### SameSite

Cookies имеют `SameSite=Strict`, защищая от CSRF атак:

- Cookies отправляются **только** с запросами с того же домена
- Защита от Cross-Site Request Forgery

### Secure

В production включен флаг `Secure`:

- Cookies отправляются **только** через HTTPS
- Защита от перехвата токенов

### Отзыв сессий

Все сессии хранятся в БД:

- Можно отозвать сессию в любой момент
- При logout сессия помечается как `revoked`
- При refresh проверяется, не отозвана ли сессия

## 📝 API Endpoints

### POST /auth/register

Регистрация нового пользователя

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "My Company"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": { ... }
}
```

### POST /auth/login

Вход в систему

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": { ... }
}
```

### POST /auth/refresh

Обновление токенов (refreshToken берется из cookie)

**Response:**

```json
{
  "message": "Token refreshed successfully"
}
```

### POST /auth/logout

Выход из системы (требует валидный accessToken)

**Response:**

```json
{
  "message": "Logout successful"
}
```

## 🚀 Проверка работы

### 1. Регистрация

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "organizationName": "Test Org"
  }' \
  -c cookies.txt
```

### 2. Логин

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### 3. Защищенный запрос

```bash
curl http://localhost:3000/projects \
  -b cookies.txt
```

### 4. Обновление токена

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### 5. Выход

```bash
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

## ⚠️ Важные замечания

1. **CORS**: Убедитесь, что CORS настроен правильно с `credentials: true`
2. **Домен**: В production убедитесь, что фронт и бэк на одном домене или используйте правильные CORS настройки
3. **HTTPS**: В production **обязательно** используйте HTTPS
4. **Переменные окружения**: Настройте `JWT_SECRET` и `JWT_REFRESH_SECRET` в `.env`

## 🔧 Настройка CORS

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:5173', // URL фронтенда
  credentials: true, // 👈 ВАЖНО для cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## 📚 Дополнительные возможности

### Множественные сессии

Текущая реализация создает новую сессию при каждом логине. Можно:

- Ограничить количество активных сессий
- Показывать список активных устройств
- Удалять конкретные сессии

### Запоминание устройства

Можно добавить информацию об устройстве в Session:

```typescript
session.device = req.headers['user-agent'];
session.ip = req.ip;
```

### Автоматическое продление

При каждом запросе можно обновлять время истечения сессии, если пользователь активен.
