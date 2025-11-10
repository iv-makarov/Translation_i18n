import { createFileRoute, Link, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/projects/$idProject/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { idProject } = useParams({ from: "/_protected/projects/$idProject/edit" });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Редактирование проекта {idProject}</h2>
        <Link
          to="/projects/$idProject"
          params={{ idProject }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Назад к проекту
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p>Здесь будет форма редактирования проекта {idProject}</p>
      </div>
    </div>
  );
}
