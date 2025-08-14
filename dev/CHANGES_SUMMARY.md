# Резюме изменений для связывания User и Projects

## Обновленные файлы

### 1. dev/db/entitis/User.ts

- Добавлен импорт `Collection` из `@mikro-orm/core`
- Обновлена связь `@OneToMany` с Projects
- Добавлено поле `role` для определения роли пользователя
- Использован `Collection<Projects>` для правильной работы связей

### 2. dev/db/entitis/Projects.ts

- Добавлен импорт `ManyToOne` и `User`
- Добавлена связь `@ManyToOne` с User
- Поле `user` обязательно для заполнения (`nullable: false`)

### 3. dev/src/modules/projects/dto/createProjects.dto.ts

- Добавлено поле `userId: string` для связи с пользователем

### 4. dev/src/modules/projects/dto/project.dto.ts

- Создан `UserResponseDto` для отображения информации о пользователе
- Добавлено поле `user` в `ProjectResponseDto`

### 5. dev/src/modules/projects/projects.service.ts

- Добавлен импорт `User` и `BadRequestException`
- Добавлен метод `getProjectsByUser()` для получения проектов конкретного пользователя
- Обновлен метод `createProject()` для правильной связи с пользователем
- Добавлена валидация существования пользователя
- Обновлены методы для загрузки связанных данных (`populate: ['user']`)

### 6. dev/src/modules/projects/projects.controller.ts

- Добавлен новый эндпоинт `GET /projects/user/:userId`
- Добавлена документация Swagger для нового эндпоинта

### 7. dev/src/modules/projects/projects.module.ts

- Добавлена сущность `User` в `MikroOrmModule.forFeature()`

### 8. dev/db/config/mikro-orm.config.ts

- Добавлена сущность `User` в список entities

## Новые возможности

1. **Создание проекта для пользователя**: Теперь при создании проекта обязательно указывается `userId`
2. **Получение проектов пользователя**: Новый эндпоинт `/projects/user/:userId`
3. **Связь данных**: Автоматическая загрузка связанных данных пользователя при запросе проектов
4. **Валидация**: Проверка существования пользователя при создании проекта

## Структура связей

```
User (1) ←→ (N) Projects
```

- Один пользователь может иметь много проектов
- Каждый проект принадлежит одному пользователю
- Связь настроена через `@OneToMany` в User и `@ManyToOne` в Projects

## API Endpoints

- `GET /projects` - Получить все проекты
- `GET /projects/user/:userId` - Получить проекты конкретного пользователя
- `POST /projects` - Создать новый проект (требует userId)
- `DELETE /projects/:id` - Удалить проект
