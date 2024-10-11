import { Title, Text, Button, Flex, Stack, Group } from "@mantine/core";
import { Icon } from "./Icon";
import { useAppStore } from "@/stores/app";
import { useRouterWithLoader } from "@/hooks/useRouterWithLoader";

export default function UnauthorisedPage() {
  const router = useRouterWithLoader();
  const refreshPage = () => window.location.reload();
  const stopLoading = useAppStore((state) => state.stopLoading);

  stopLoading({
    id: "go-to-editor",
    title: "Loading App",
    message: "Unauthorised access",
    isError: true,
  });

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      gap="xl"
      style={{ minHeight: "100vh" }}
    >
      <Title order={1}>Access Denied</Title>
      <Stack spacing="xs" align="center">
        <Text size="lg" color="dimmed">
          You are not authorized to access this project.
        </Text>
        <Text size="lg" color="dimmed">
          Please contact your admin for access.
        </Text>
      </Stack>
      <Group>
        <Button
          size="md"
          compact={false}
          onClick={() => router.push("/projects")}
          leftIcon={<Icon name="IconHome" />}
        >
          Back home
        </Button>
        <Button
          size="md"
          variant="default"
          compact={false}
          onClick={refreshPage}
          leftIcon={<Icon name="IconRefresh" />}
        >
          Refresh
        </Button>
      </Group>
    </Flex>
  );
}
