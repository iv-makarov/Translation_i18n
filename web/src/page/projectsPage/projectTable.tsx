import type { ProjectResponseDto } from "@/shared/api/schemas/projectResponseDto";
import type { ProjectsListResponseDto } from "@/shared/api/schemas/projectsListResponseDto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function ProjectTable({ projects }: { projects: ProjectsListResponseDto }) {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const handleDeleteProject = async (projectId: string) => {
    console.log("Delete", projectId);

  };

  return (
    <div>
      {/* Информация о количестве проектов */}
      {projects.total > 0 && (
        <div className="mb-4 text-sm text-muted-foreground">
          Всего проектов: {projects.total}
        </div>
      )}

      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 whitespace-nowrap">
              <TableHead className="h-9 py-2">Название</TableHead>
              <TableHead className="h-9 py-2">URL</TableHead>
              <TableHead className="h-9 py-2">Пространство</TableHead>
              <TableHead className="h-9 py-2">Статус</TableHead>
              <TableHead className="h-9 py-2">Создан</TableHead>
              <TableHead className="h-9 py-2 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-x-auto">
            {projects.data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Проекты не найдены
                </TableCell>
              </TableRow>
            ) : (
              projects.data.map((project) => (
                <TableRow
                  className="cursor-pointer"
                  key={project.id}
                  onClick={() => {
                    console.log("Project", project.id);
                  }}
                >
                  <TableCell className="py-2 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      {project.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {project.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {project.whiteUrls && project.whiteUrls.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {project.whiteUrls.map((whiteUrl, index) => (
                          <a
                            key={index}
                            href={whiteUrl.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {whiteUrl.url}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {project.nameSpaces && project.nameSpaces.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {project.nameSpaces.map((nameSpace, index) => (
                          <span
                            key={index}
                            className="text-sm font-mono bg-muted px-2 py-1 rounded"
                          >
                            {nameSpace.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={project.isBlocked ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {project.isBlocked ? "Заблокирован" : "Активен"}
                      </Badge>
                      <Badge
                        variant={project.isVerified ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {project.isVerified ? "Проверен" : "Не проверен"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {new Date(project.createdAt).toLocaleDateString("ru-RU")}
                  </TableCell>
                  <TableCell className="py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex justify-end items-center">
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Edit", project.id);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Verify", project.id);
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" /> Проверить
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Пагинация */}
      {projects.total > filters.limit && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Показано {(filters.page - 1) * filters.limit + 1} -{" "}
            {Math.min(filters.page * filters.limit, projects.total)} из{" "}
            {projects.total} проектов
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={filters.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Предыдущая
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm">
                Страница {filters.page} из{" "}
                {Math.ceil(projects.total / filters.limit)}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={
                filters.page >= Math.ceil(projects.total / filters.limit)
              }
            >
              Следующая
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
