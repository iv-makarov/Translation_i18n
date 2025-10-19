# 🚀 Автоматическая генерация API с Orval

Этот документ описывает процесс автоматической генерации типов TypeScript и функций API из OpenAPI спецификации.

## 📋 Как это работает

1. **Backend (NestJS)** при запуске автоматически генерирует `generatedApi.json` в `web/src/shared/api/`
2. **Orval** читает этот JSON и генерирует TypeScript типы и функции
3. **Фронтенд** использует сгенерированные типы и функции

## 🔧 Настройка

### 1. Создайте файл `.env.local` в папке `web/`:

```env
VITE_API_URL=http://localhost:3000
```

### 2. Запустите backend:

```bash
cd dev
pnpm run start:dev
```

При запуске вы увидите сообщение:
```
✅ OpenAPI спецификация сохранена: /path/to/web/src/shared/api/generatedApi.json
🚀 Сервер запущен на http://localhost:3000
📚 Swagger UI: http://localhost:3000/api
📄 OpenAPI JSON: http://localhost:3000/api.json
```

### 3. Сгенерируйте API клиент:

```bash
cd web
pnpm run generate:api
```

Или запустите в watch режиме для автоматической перегенерации:

```bash
pnpm run generate:api:watch
```

## 📂 Структура файлов

```
web/src/shared/api/
├── $api.ts                 # Axios instance с interceptors (ручной)
├── generatedApi.json       # OpenAPI спецификация (генерируется автоматически)
├── generated.ts            # Сгенерированные типы и функции (генерируется Orval)
└── ...                     # Другие файлы (опционально)
```

## 🎯 Использование сгенерированного API

### Пример 1: Простой запрос

```typescript
import { api } from '@/shared/api/$api';

// Сгенерированные типы автоматически подтягиваются
const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};
```

### Пример 2: С типами из Swagger

После генерации у вас будут доступны все типы:

```typescript
import type { ProjectDto, CreateProjectDto } from '@/shared/api/generated';

const createProject = async (data: CreateProjectDto): Promise<ProjectDto> => {
  const response = await api.post('/projects', data);
  return response.data;
};
```

### Пример 3: С React Query (если используете)

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/$api';
import type { ProjectDto } from '@/shared/api/generated';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get<ProjectDto[]>('/projects');
      return data;
    },
  });
};
```

## 🔄 Workflow разработки

### Вариант 1: Автоматическая генерация

1. Запустите backend в dev режиме:
   ```bash
   cd dev && pnpm run start:dev
   ```

2. Запустите генератор в watch режиме:
   ```bash
   cd web && pnpm run generate:api:watch
   ```

3. При изменении API на бэкенде:
   - Backend автоматически пересоздаст `generatedApi.json`
   - Orval watch автоматически перегенерирует типы

### Вариант 2: Ручная генерация

1. Запустите backend
2. После изменений в API выполните:
   ```bash
   cd web && pnpm run generate:api
   ```

## ⚙️ Конфигурация Orval

Файл: `web/orval.config.ts`

```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './src/shared/api/generatedApi.json',
    },
    output: {
      target: './src/shared/api/generated.ts',
      client: 'axios',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './src/shared/api/$api.ts',
          name: 'api',
        },
      },
      clean: true,
    },
  },
});
```

### Настройки:

- **input.target** - путь к OpenAPI спецификации
- **output.target** - куда генерировать файлы
- **client** - используемый HTTP клиент (axios)
- **mode: 'tags-split'** - разделять по тегам Swagger
- **mutator** - использовать наш axios instance с interceptors
- **clean** - очищать старые файлы перед генерацией

## 🎨 Преимущества

✅ **Типобезопасность** - все типы автоматически из backend  
✅ **Автокомплит** - IDE знает все доступные endpoints и типы  
✅ **Синхронизация** - фронт всегда синхронизирован с бэком  
✅ **Меньше ошибок** - TypeScript ловит несоответствия на этапе компиляции  
✅ **Документация** - OpenAPI спецификация как единый источник правды  

## 🔍 Проверка

### Swagger UI

Открыть в браузере: http://localhost:3000/api

Здесь можно:
- Посмотреть все endpoints
- Протестировать запросы
- Посмотреть схемы данных

### OpenAPI JSON

Прямая ссылка: http://localhost:3000/api.json

## 🐛 Troubleshooting

### Генерация не работает

1. Убедитесь, что backend запущен
2. Проверьте, что файл `generatedApi.json` существует
3. Попробуйте удалить и перегенерировать:
   ```bash
   rm src/shared/api/generated.ts
   pnpm run generate:api
   ```

### Типы не обновляются

1. Перезапустите backend (генерация происходит при старте)
2. Перезапустите TypeScript сервер в IDE
3. Перезапустите orval watch

### Ошибки TypeScript после генерации

1. Убедитесь, что `$api.ts` экспортирует `api` instance
2. Проверьте, что пути в `orval.config.ts` правильные
3. Попробуйте перезапустить TypeScript сервер

## 📝 Советы

1. **Коммитьте `generatedApi.json`** чтобы можно было работать без запущенного бэка
2. **Добавьте `generated.ts` в .gitignore** или коммитьте для удобства команды
3. **Используйте watch режим** во время активной разработки
4. **Документируйте API** через Swagger декораторы на бэкенде

