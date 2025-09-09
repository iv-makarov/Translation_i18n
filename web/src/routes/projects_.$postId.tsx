import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects_/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  console.log("projects/$postId");
  return <div>Hello "/projects/$postId"!</div>
}
