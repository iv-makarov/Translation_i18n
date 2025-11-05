import Dashboard from '@/page/dashboard/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Dashboard />
}
