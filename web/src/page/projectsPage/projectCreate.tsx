import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Form, Formik } from "formik";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const ProjectCreate = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    description: string;
    whiteUrls: string[];
    nameSpaces: string[];
  }) => {
    console.log(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Создать проект</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать проект</DialogTitle>
          <DialogDescription>
            Создайте новый проект с указанными деталями.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{
            name: "",
            description: "",
            whiteUrls: [""],
            nameSpaces: [""],
          }}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, isSubmitting, setFieldValue }) => (
            <Form className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  name="name"
                  placeholder="Название проекта"
                  value={values.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Input
                  name="description"
                  placeholder="Описание проекта"
                  value={values.description}
                  onChange={handleChange}
                />
              </div>

              {/* Белый список URL */}
              <div className="grid gap-2">
                <Label>Белый список URL</Label>
                {values.whiteUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...values.whiteUrls];
                        newUrls[index] = e.target.value;
                        setFieldValue("whiteUrls", newUrls);
                      }}
                      type="url"
                    />
                    {values.whiteUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newUrls = values.whiteUrls.filter(
                            (_, i) => i !== index
                          );
                          setFieldValue("whiteUrls", newUrls);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFieldValue("whiteUrls", [...values.whiteUrls, ""])
                  }
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить URL
                </Button>
              </div>

              {/* Пространства имен */}
              <div className="grid gap-2">
                <Label>Пространства имен</Label>
                {values.nameSpaces.map((nameSpace, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="my-project-namespace"
                      value={nameSpace}
                      onChange={(e) => {
                        const newNameSpaces = [...values.nameSpaces];
                        newNameSpaces[index] = e.target.value;
                        setFieldValue("nameSpaces", newNameSpaces);
                      }}
                    />
                    {values.nameSpaces.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newNameSpaces = values.nameSpaces.filter(
                            (_, i) => i !== index
                          );
                          setFieldValue("nameSpaces", newNameSpaces);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFieldValue("nameSpaces", [...values.nameSpaces, ""])
                  }
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить пространство имен
                </Button>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  Создать
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreate;
