import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects_/$postId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  console.log("projects/$postId/edit");
  return <div>Hello "/projects/$postId/edit"!</div>
}
