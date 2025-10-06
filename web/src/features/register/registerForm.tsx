import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const validationSchema = z.object({
  organizationName: z.string().min(1),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterFormValues = z.infer<typeof validationSchema>;

interface RegisterFormProps {
  initialValues?: RegisterFormValues;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

export default function RegisterForm({
  initialValues = {
    organizationName: "",
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  },
  onSubmit,
}: RegisterFormProps) {
  const navigate = useNavigate();
  return (
    <Formik
      validationSchema={toFormikValidationSchema(validationSchema)}
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values).then(() => {
          setSubmitting(false);
        });
      }}
    >
      {({ values, setFieldValue, isSubmitting, isValid }) => (
        <Form className="grid gap-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Organization Name"
                required
                value={values.organizationName}
                onChange={(e) =>
                  setFieldValue("organizationName", e.target.value)
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                required
                value={values.lastName}
                onChange={(e) => setFieldValue("lastName", e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                required
                value={values.firstName}
                onChange={(e) => setFieldValue("firstName", e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
                value={values.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
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
              Register
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?
            <Button type="button" className="pl-1.5" variant="link" onClick={() => navigate({ to: "/login" })}>
              Login
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
