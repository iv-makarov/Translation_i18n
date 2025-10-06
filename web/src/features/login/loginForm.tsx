import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Form, Formik } from "formik";
import { useNavigate } from "@tanstack/react-router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";

const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof validationSchema>;

interface LoginFormProps {
  initialValues?: LoginFormValues;
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
}

export default function LoginForm({
  initialValues = { email: "", password: "" },
  onSubmit,
}: LoginFormProps) {
  const navigate = useNavigate();
  return (
    <Formik
      validationSchema={toFormikValidationSchema(validationSchema)}
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        onSubmit(values)
          .then(() => {
            setSubmitting(false);
          })
          .finally(() => {
            resetForm({ values: { email: values.email, password: "" } });
          });
      }}
    >
      {({ values, setFieldValue, isSubmitting, isValid }) => (
        <Form className="grid gap-6">
          <div className="grid gap-6">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={values.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  className="ml-auto"
                  // onClick={() => navigate({to: "/password-recovery"})}
                >
                  Forgot your password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isValid}
            >
              Login
            </Button>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button
              type="button"
              className="pl-1.5"
              variant="link"
              onClick={() => navigate({ to: "/register" })}
            >
              Sign up
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
