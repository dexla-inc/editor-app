import { Shell } from "@/components/AppShell";
import { ProjectParams, createProject } from "@/requests/projects/mutations";
import { useAppStore } from "@/stores/app";
import { Button, Container, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

export default function New() {
  const router = useRouter();
  const isLoading = useAppStore((state) => state.isLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const form = useForm({
    initialValues: {
      description: "",
    },
  });

  const onSubmit = async (values: ProjectParams) => {
    startLoading({
      id: "creating-project",
      title: "Creating Project",
      message: "Wait while your project is being created",
    });
    const project = await createProject(values);
    stopLoading({
      id: "creating-project",
      title: "Project Created",
      message: "The project was created successfully",
    });
    router.push(`/projects/${project.id}`);
  };

  return (
    <Shell>
      <Container size="xs" py={60}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Project Description"
              description="Describe what the project is about to help AI create tailored pages for you"
              required
              withAsterisk={false}
              {...form.getInputProps("description")}
            />
            <Group position="left">
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                Create Project
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Shell>
  );
}
