import { Title, Text, Button, Flex, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function UnauthorisedPage() {
  const router = useRouter();

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
      <Button size="md" compact={false} onClick={() => router.push("/")}>
        Back to home
      </Button>
    </Flex>
  );
}
