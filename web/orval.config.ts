import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      // Путь к сгенерированному swagger.json
      target: './src/shared/api/generatedApi.json',
    },
    output: {
      // Куда генерировать файлы
      target: './src/shared/api/generated.ts',
      // Используем axios instance
      client: 'axios',
      // Настройки генерации
      mode: 'tags-split',
      // Импорт axios instance
      override: {
        mutator: {
          path: './src/shared/api/$api.ts',
          name: 'api',
        },
      },
      clean: true,
    },
    hooks: {
      // Генерируем React Query hooks
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

