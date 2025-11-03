import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    input: {
      target: "./src/shared/api/swagger.json",
    },
    output: {
      mode: "tags-split",
      client: "react-query",
      httpClient: "axios",
      target: "./src/shared/api/endpoints",
      schemas: "./src/shared/api/schemas",
      override: {
        mutator: {
          path: "./src/shared/api/instance/axiosInstance.ts",
          name: "axiosInstance",
        },
        query: {
          useQuery: true,
          useInfinite: false,
          useMutation: true,
          signal: true,
        },
      },
      mock: false,
    },
  },
});
