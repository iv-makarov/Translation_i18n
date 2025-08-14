import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import { useData } from "@/mock/useData";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Check, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function ProjectTable() {
  const { ProjectsList } = useData();
  console.log(ProjectsList);
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 whitespace-nowrap">
              <TableHead className="h-9 py-2">Name</TableHead>
              <TableHead className="h-9 py-2">Is Blocked</TableHead>
              <TableHead className="h-9 py-2">Is Verified</TableHead>
              <TableHead className="h-9 py-2">Created At</TableHead>
              <TableHead className="h-9 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-x-auto">
            {ProjectsList.map((project) => (
              <TableRow
                className="cursor-pointer"
                key={project.id}
                onClick={() => {
                  console.log("Project", project.id);
                }}
              >
                <TableCell className="py-2 whitespace-nowrap">
                  {project.name}
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant={project.isBlocked ? "default" : "outline"}>
                    {project.isBlocked ? "Yes" : "No"}
                  </Badge>
                </TableCell>

                <TableCell className="py-2">
                  <Badge variant={project.isVerified ? "default" : "outline"}>
                    {project.isVerified ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 whitespace-nowrap">
                  {new Date(project.createdAt).toLocaleDateString()}
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
                        <Edit /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Verify");
                        }}
                      >
                        <Check /> Verify
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete", project.id);
                        }}
                        className="focus:text-destructive"
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
