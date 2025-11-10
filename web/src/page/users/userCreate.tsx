import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Form, Formik } from "formik";

export default function UserCreate() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            lastName: "",
            firstName: "",
            email: "",
            password: "",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={values.lastName}
                  onChange={(e) => setFieldValue("lastName", e.target.value)}

                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={values.firstName}
                  onChange={(e) => setFieldValue("firstName", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={(e) => setFieldValue("password", e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                Create User
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
