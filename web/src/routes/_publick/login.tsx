import LoginPage from '@/page/login/loginPage';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_publick/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage />;
}
