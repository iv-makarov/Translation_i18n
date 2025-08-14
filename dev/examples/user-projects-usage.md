# Примеры использования связей User и Projects

## Создание пользователя

```typescript
const user = em.create(User, {
  firstName: 'Иван',
  lastName: 'Иванов',
  password: 'hashedPassword123',
  role: 'user',
});
em.persist(user);
await em.flush();
```

## Создание проекта для пользователя

```typescript
const createProjectDto = {
  name: 'Мой первый проект',
  description: 'Описание проекта',
  isBlocked: false,
  userId: 'user-id-here',
};

const project = await projectsService.createProject(createProjectDto);
```

## Получение всех проектов пользователя

```typescript
const userProjects = await projectsService.getProjectsByUser('user-id-here', {
  page: 1,
  limit: 10,
});
```

## Получение пользователя с его проектами

```typescript
const user = await em.findOne(
  User,
  { id: 'user-id-here' },
  {
    populate: ['projects'],
  },
);

console.log(
  `Пользователь ${user.firstName} имеет ${user.projects.length} проектов`,
);
```

## Получение проекта с информацией о пользователе

```typescript
const project = await em.findOne(
  Projects,
  { id: 'project-id-here' },
  {
    populate: ['user'],
  },
);

console.log(
  `Проект ${project.name} принадлежит ${project.user.firstName} ${project.user.lastName}`,
);
```

## API Endpoints

### GET /projects - Получить все проекты

### GET /projects/user/:userId - Получить проекты конкретного пользователя

### POST /projects - Создать новый проект (требует userId)

### DELETE /projects/:id - Удалить проект

## Структура связей

- **User** (1) ←→ (N) **Projects**
- Один пользователь может иметь много проектов
- Каждый проект принадлежит одному пользователю
- Связь настроена через `@OneToMany` в User и `@ManyToOne` в Projects
