import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      // Путь к сгенерированному swagger.json
      target: "./src/shared/api/generatedApi.json",
    },
    output: {
      // Куда генерировать файлы - отдельная папка, чтобы не удалять generatedApi.json
      target: "./src/shared/api/generated/index.ts",
      // Используем axios instance
      client: "axios",
      // Настройки генерации
      mode: "tags-split",
      // Импорт axios instance
      override: {
        mutator: {
          path: "../$api.ts",
          name: "api",
        },
      },
      clean: true, // Теперь безопасно - удаляет только папку generated/
    },
    hooks: {
      // Генерируем React Query hooks
      afterAllFilesWrite: "prettier --write",
    },
  },
});
