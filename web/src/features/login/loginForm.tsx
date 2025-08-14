import {Button} from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {Input} from "@/shared/components/ui/input";
import {Label} from "@/shared/components/ui/label";
import {cn} from "@/shared/lib/utils";
import {Form, Formik} from "formik";
import {useNavigate} from "react-router";

export default function LoginForm() {
  const navigate = useNavigate();
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik initialValues={{email: "", password: ""}} onSubmit={() => {}}>
            {({values, setFieldValue, isSubmitting, isValid}) => (
              <Form>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
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
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Button
                          variant="link"
                          className="ml-auto cursor-pointer text-sm p-0 hover:underline font-normal"
                          onClick={() => navigate("/password-recovery")}
                        >
                          Forgot your password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={values.password}
                        onChange={(e) =>
                          setFieldValue("password", e.target.value)
                        }
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
                      className="cursor-pointer text-sm p-0 hover:underline"
                      variant="link"
                      onClick={() => navigate("/register")}
                    >
                      Sign up
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
