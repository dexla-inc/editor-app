import { Shell } from "@/components/AppShell";
import { updateProject } from "@/requests/projects/mutations";
import { getProject } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import {
  Button,
  Container,
  Flex,
  Loader,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectId = router.query.id as string;

  useEffect(() => {
    const fetch = async () => {
      const project = await getProject(projectId);
      form.setValues(project);
    };

    fetch();
  }, [projectId]);

  const form = useForm({
    initialValues: {
      friendlyName: "",
    },
    validate: {
      friendlyName: (value) =>
        value.length > 50 ? "Description too long" : null,
    },
  });

  const onSubmit = async (values: { friendlyName: string }) => {
    try {
      startLoading({
        id: "updating-project",
        title: "Updating Project",
        message: "Wait while your project is being updated",
      });
      setIsLoading(true);

      form.validate();

      await updateProject(projectId, values);

      stopLoading({
        id: "updating-project",
        title: "Project Updated",
        message: "The project was updated successfully",
      });
      setIsLoading(false);
    } catch (error) {}
  };

  return (
    <Shell navbarType="project" user={user}>
      <Container py="xl">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack spacing="xl">
            <Title>General Settings</Title>
            <TextInput
              label="Project Name"
              required
              withAsterisk={true}
              {...form.getInputProps("friendlyName")}
              sx={{ maxWidth: "400px" }}
              rightSection={isLoading && <Loader size="xs" />}
            />
            <Flex>
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                Save
              </Button>
            </Flex>
          </Stack>
        </form>
      </Container>
    </Shell>
  );
}
