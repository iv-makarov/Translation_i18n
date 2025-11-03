/**
 * API endpoints - Экспорт всех сгенерированных API
 */

// Auth endpoints
export * from "./endpoints/auth/auth";

// Projects endpoints
export * from "./endpoints/projects/projects";

// User endpoints
export * from "./endpoints/user/user";

// Translations endpoints
export * from "./endpoints/translations/translations";

// Types and schemas
export * from "./schemas.ts";

// Axios instance
export { API_URL, axiosInstance } from "./axiosInstance";
export type { ErrorType } from "./axiosInstance";
