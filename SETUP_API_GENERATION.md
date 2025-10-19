# 🚀 Настройка автоматической генерации API

## ✅ Что уже сделано:

1. ✅ Backend автоматически генерирует `generatedApi.json` при запуске
2. ✅ Orval настроен для генерации TypeScript типов
3. ✅ Axios instance настроен с `withCredentials: true` и автообновлением токенов
4. ✅ Scripts добавлены в package.json

## 🔧 Как использовать:

### 1. Запустите backend:

```bash
cd dev
pnpm run start:dev
```

При запуске вы должны увидеть:
```
✅ OpenAPI спецификация сохранена: /path/to/web/src/shared/api/generatedApi.json
🚀 Сервер запущен на http://localhost:3000
📚 Swagger UI: http://localhost:3000/api
📄 OpenAPI JSON: http://localhost:3000/api.json
```

### 2. Сгенерируйте TypeScript типы:

```bash
cd web
pnpm run generate:api
```

Или в watch режиме:
```bash
pnpm run generate:api:watch
```

### 3. Используйте сгенерированные типы:

```typescript
import { api } from '@/shared/api/$api';
import type { ProjectDto, CreateProjectDto } from '@/shared/api/generated';

// Все типы автоматически из OpenAPI спецификации
const createProject = async (data: CreateProjectDto): Promise<ProjectDto> => {
  const { data: project } = await api.post('/projects', data);
  return project;
};
```

## 📂 Структура файлов:

```
web/src/shared/api/
├── $api.ts                  # Axios instance (ручной)
├── generatedApi.json        # OpenAPI спецификация (автогенерация)
├── generated.ts             # TypeScript типы (Orval)
└── ...
```

## 🔄 Workflow:

### Автоматический режим (рекомендуется):

1. Терминал 1: `cd dev && pnpm run start:dev`
2. Терминал 2: `cd web && pnpm run generate:api:watch`
3. При изменении API на бэке - файлы автоматически обновятся

### Ручной режим:

1. Запустите backend
2. После изменений: `cd web && pnpm run generate:api`

## ⚙️ Конфигурация:

### Backend (`dev/src/main.ts`):

```typescript
// Автоматическая генерация swagger.json при старте
if (process.env.NODE_ENV !== 'production') {
  const outputPath = path.join(
    process.cwd(),
    '../web/src/shared/api/generatedApi.json',
  );
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
}
```

### Frontend (`web/orval.config.ts`):

```typescript
export default defineConfig({
  api: {
    input: {
      target: './src/shared/api/generatedApi.json',
    },
    output: {
      target: './src/shared/api/generated.ts',
      client: 'axios',
      override: {
        mutator: {
          path: './src/shared/api/$api.ts',
          name: 'api', // использует наш axios instance
        },
      },
    },
  },
});
```

## 🎨 Преимущества:

✅ **Типобезопасность** - все типы из backend  
✅ **Автокомплит** - IDE знает все endpoints  
✅ **Синхронизация** - фронт всегда синхронизирован с бэком  
✅ **Cookies** - автоматическая работа с HttpOnly cookies  
✅ **Auto-refresh** - автообновление токенов при 401  

## 🐛 Troubleshooting:

### Файл generatedApi.json не создается:

1. Убедитесь, что `NODE_ENV !== 'production'`
2. Проверьте логи при запуске backend
3. Проверьте права на запись в директорию `web/src/shared/api/`

### Orval не работает:

1. Убедитесь, что `generatedApi.json` существует
2. Проверьте пути в `orval.config.ts`
3. Попробуйте: `rm src/shared/api/generated.ts && pnpm run generate:api`

### Ошибки TypeScript:

1. Перезапустите TypeScript сервер в IDE
2. Проверьте, что `$api.ts` экспортирует `api`
3. Перегенерируйте файлы

## 📝 Примеры использования:

### С React Query:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api/$api';
import type { ProjectDto, CreateProjectDto } from '@/shared/api/generated';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get<{ data: ProjectDto[] }>('/projects');
      return data.data;
    },
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: async (project: CreateProjectDto) => {
      const { data } = await api.post<ProjectDto>('/projects', project);
      return data;
    },
  });
};
```

### Простое использование:

```typescript
import { api } from '@/shared/api/$api';

// Login (токены автоматически в cookies)
await api.post('/auth/login', { email, password });

// Защищенный запрос (cookies автоматически отправляются)
const { data } = await api.get('/projects');

// Logout (cookies очищаются)
await api.post('/auth/logout');
```

## 🔗 Полезные ссылки:

- Swagger UI: http://localhost:3000/api
- OpenAPI JSON: http://localhost:3000/api.json
- Документация Orval: https://orval.dev/
- Документация аутентификации: `dev/docs/AUTH_FLOW.md`

