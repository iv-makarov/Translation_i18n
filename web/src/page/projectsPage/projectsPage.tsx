import ProjectCreate from "@/page/projectsPage/projectCreate";
import ProjectTable from "@/page/projectsPage/projectTable";

export default function ProjectsPage({projects}) {
  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <div className="p-4 border rounded-md flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Проекты</h3>
            <p className="text-muted-foreground">Управление проектами</p>
          </div>
          <ProjectCreate />
        </div>

        <ProjectTable projects={projects} />
      </div>
    </>
  );
}
