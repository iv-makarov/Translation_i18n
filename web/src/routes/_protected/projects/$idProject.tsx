import { createFileRoute, Link, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/projects/$idProject")({
  component: RouteComponent,
});

function RouteComponent() {
  const { idProject } = useParams({ from: "/projects/$idProject" });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Проект ID: {idProject}</h2>
        <Link
          to="/projects/$idProject/edit"
          params={{ idProject }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Редактировать проект
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold p-4 border-b">Переводы</h3>
        <div className="p-4">
          <p>Здесь будет таблица переводов для проекта {idProject}</p>
        </div>
      </div>
    </div>
  );
}
