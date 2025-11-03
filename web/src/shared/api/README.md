# API Usage Guide

Этот файл описывает, как использовать сгенерированные API и типы из orval.

## Импорт API

### Импорт всех API из одного файла

```typescript
import {
  // Auth хуки
  useAuthControllerLogin,
  useAuthControllerRegister,
  useAuthControllerLogout,
  useAuthControllerRefreshToken,

  // Projects хуки
  useProjectsControllerGetProjects,
  useProjectsControllerCreateProject,
  useProjectsControllerDeleteProject,
  useProjectsControllerGetProjectsByUser,

  // User хуки
  useUserControllerGetProfile,
  useUserControllerUpdateProfile,
  useUserControllerUpdateUserPassword,

  // Типы
  LoginDto,
  RegisterDto,
  CreateProjectDto,
  ProjectsListResponseDto,

  // Axios instance (если нужен прямой доступ)
  axiosInstance,
  API_URL,
} from "@/shared/api";
```

### Импорт из конкретных модулей

```typescript
import { useAuthControllerLogin } from "@/shared/api/endpoints/auth/auth";
import { useProjectsControllerGetProjects } from "@/shared/api/endpoints/projects/projects";
import type { LoginDto } from "@/shared/api/schemas.ts";
```

## Примеры использования

### 1. Использование мутаций (Mutations)

#### Авторизация (Login)

```typescript
import { useAuthControllerLogin } from "@/shared/api";
import type { LoginDto } from "@/shared/api";
import { toast } from "sonner";

function LoginComponent() {
  const loginMutation = useAuthControllerLogin({
    mutation: {
      onSuccess: (data) => {
        toast.success("Успешный вход!");
        // data содержит ответ от сервера
        console.log(data.data);
      },
      onError: (error) => {
        toast.error("Ошибка входа");
        console.error(error);
      },
    },
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      const loginData: LoginDto = {
        email,
        password,
      };

      await loginMutation.mutateAsync({ data: loginData });
    } catch (error) {
      // Ошибка уже обработана в onError
    }
  };

  return (
    <button
      onClick={() => handleLogin("user@example.com", "password")}
      disabled={loginMutation.isPending}
    >
      {loginMutation.isPending ? "Вход..." : "Войти"}
    </button>
  );
}
```

#### Регистрация (Register)

```typescript
import { useAuthControllerRegister } from "@/shared/api";
import type { RegisterDto } from "@/shared/api";

function RegisterComponent() {
  const registerMutation = useAuthControllerRegister({
    mutation: {
      onSuccess: () => {
        toast.success("Регистрация успешна!");
      },
      onError: (error) => {
        toast.error("Ошибка регистрации");
      },
    },
  });

  const handleRegister = async (formData: RegisterDto) => {
    await registerMutation.mutateAsync({ data: formData });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister({
          email: "user@example.com",
          password: "password",
          firstName: "Иван",
          lastName: "Иванов",
          organizationName: "Компания",
        });
      }}
    >
      {/* Форма */}
      <button type="submit" disabled={registerMutation.isPending}>
        Зарегистрироваться
      </button>
    </form>
  );
}
```

#### Создание проекта

```typescript
import { useProjectsControllerCreateProject } from "@/shared/api";
import type { CreateProjectDto } from "@/shared/api";
import { useQueryClient } from "@tanstack/react-query";

function CreateProjectComponent() {
  const queryClient = useQueryClient();

  const createProjectMutation = useProjectsControllerCreateProject({
    mutation: {
      onSuccess: () => {
        // Инвалидируем кеш проектов после успешного создания
        queryClient.invalidateQueries({
          queryKey: ["/projects"],
        });
        toast.success("Проект создан!");
      },
    },
  });

  const handleCreate = async (projectData: CreateProjectDto) => {
    await createProjectMutation.mutateAsync({ data: projectData });
  };

  return (
    <button
      onClick={() =>
        handleCreate({
          name: "Новый проект",
          description: "Описание",
          whiteUrls: ["https://example.com"],
          nameSpaces: ["namespace1"],
        })
      }
      disabled={createProjectMutation.isPending}
    >
      Создать проект
    </button>
  );
}
```

### 2. Использование запросов (Queries)

#### Получение списка проектов

```typescript
import { useProjectsControllerGetProjects } from "@/shared/api";
import type { ProjectsListResponseDto } from "@/shared/api";

function ProjectsListComponent() {
  const { data, isLoading, isError, error, refetch } =
    useProjectsControllerGetProjects(undefined, {
      query: {
        // Опциональные параметры запроса
        enabled: true, // Включить/выключить запрос
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 минут
      },
    });

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка: {error?.message}</div>;

  return (
    <div>
      <h2>Проекты</h2>
      <button onClick={() => refetch()}>Обновить</button>
      <ul>
        {data?.data?.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### Получение профиля пользователя

```typescript
import { useUserControllerGetProfile } from "@/shared/api";

function UserProfileComponent() {
  const {
    data: profile,
    isLoading,
    error,
  } = useUserControllerGetProfile({
    query: {
      retry: 1,
      staleTime: 10 * 60 * 1000, // 10 минут
    },
  });

  if (isLoading) return <div>Загрузка профиля...</div>;
  if (error) return <div>Ошибка загрузки профиля</div>;

  return (
    <div>
      <h2>Профиль пользователя</h2>
      <p>Email: {profile?.data?.email}</p>
      <p>Имя: {profile?.data?.firstName}</p>
    </div>
  );
}
```

#### Получение проектов пользователя с параметрами

```typescript
import { useProjectsControllerGetProjectsByUser } from "@/shared/api";

function UserProjectsComponent({ userId }: { userId: string }) {
  const { data, isLoading } = useProjectsControllerGetProjectsByUser(
    userId,
    undefined, // params
    {
      query: {
        enabled: !!userId, // Запрос выполнится только если userId есть
      },
    }
  );

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Проекты пользователя</h2>
      {data?.data?.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

### 3. Использование типов

```typescript
import type {
  LoginDto,
  RegisterDto,
  CreateProjectDto,
  ProjectsListResponseDto,
  UserResponseDto,
} from "@/shared/api";

// Типы для форм
const loginForm: LoginDto = {
  email: "user@example.com",
  password: "password123",
};

const registerForm: RegisterDto = {
  email: "user@example.com",
  password: "password123",
  firstName: "Иван",
  lastName: "Иванов",
  organizationName: "Компания",
};

const projectData: CreateProjectDto = {
  name: "Проект",
  description: "Описание",
  whiteUrls: ["https://example.com"],
  nameSpaces: ["namespace1"],
};
```

### 4. Прямое использование функций (без хуков)

Иногда может понадобиться вызвать API напрямую, без использования React Query:

```typescript
import {
  authControllerLogin,
  projectsControllerGetProjects,
} from "@/shared/api/endpoints/auth/auth";
import type { LoginDto } from "@/shared/api";

// В async функции или в обработчике события
async function handleLogin() {
  try {
    const loginData: LoginDto = {
      email: "user@example.com",
      password: "password",
    };

    const response = await authControllerLogin(loginData);
    console.log("Успешный вход:", response.data);
  } catch (error) {
    console.error("Ошибка входа:", error);
  }
}
```

### 5. Использование с Formik

```typescript
import { Formik, Form } from "formik";
import { useAuthControllerLogin } from "@/shared/api";
import type { LoginDto } from "@/shared/api";

function LoginForm() {
  const loginMutation = useAuthControllerLogin();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={async (values: LoginDto) => {
        try {
          await loginMutation.mutateAsync({ data: values });
          // Успешный вход
        } catch (error) {
          // Ошибка обработана
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <input name="email" type="email" />
          <input name="password" type="password" />
          <button
            type="submit"
            disabled={isSubmitting || loginMutation.isPending}
          >
            {loginMutation.isPending ? "Вход..." : "Войти"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
```

## Важные моменты

1. **Все хуки автоматически используют axiosInstance** с настройками для cookies и interceptors
2. **QueryClient передается автоматически** из QueryClientProvider
3. **Типы генерируются автоматически** из Swagger схемы
4. **Ошибки обрабатываются через ErrorType** из axiosInstance

## Обновление API

После изменения Swagger схемы на бэкенде:

1. Обновите `swagger.json` файл
2. Запустите `pnpm run dev` (orval автоматически сгенерирует новые типы и хуки)
3. Или запустите `pnpm exec orval` для генерации без запуска dev сервера
