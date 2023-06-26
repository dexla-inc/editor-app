import { Shell } from "@/components/AppShell";
import { updateProject } from "@/requests/projects/mutations";
import { useAppStore } from "@/stores/app";
import { Button, Container, Flex, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectId = router.query.id as string;

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
        id: "updating",
        title: "Updating Settings",
        message: "Wait while your data source setting are being updated",
      });
      setIsLoading(true);

      form.validate();

      await updateProject(projectId, values);

      stopLoading({
        id: "updating",
        title: "Project Updated",
        message: "The data source setting were updated successfully",
      });
      setIsLoading(false);
    } catch (error) {}
  };

  return (
    <Shell navbarType="project" user={user}>
      <Container py="xl" size="lg">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack spacing="xl">
            <Title order={2}>Data Source Settings</Title>

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
