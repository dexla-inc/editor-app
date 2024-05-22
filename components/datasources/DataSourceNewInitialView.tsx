import MantineStyledButton from "@/components/datasources/DataSourceOptionButton";
import { Container, Flex, Title } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function DataSourceNewInitialView() {
  const router = useRouter();
  const projectId = router.query.id;
  return (
    <Container py="xl">
      <Title order={3} pb="xl">
        How do you want to add a datasource?
      </Title>
      <Flex gap="xl">
        <MantineStyledButton
          title="Use Swagger"
          description="Copy and paste your swagger file to get started."
          caption="Great for internal APIs"
          logoUrl="/swagger_logo.svg"
          href={`/projects/${projectId}/settings/datasources/swagger`}
        />
        <MantineStyledButton
          title="Build with AI"
          description="Type what API you want and watch it build."
          caption="Great for public APIs"
          logoUrl="/openai_log.png"
          href={`/projects/${projectId}/settings/datasources/ai`}
        />
        <MantineStyledButton
          title="Add Manually"
          description="Manually add your API the old fashioned way."
          caption="Good for public APIs"
          logoUrl="/manual-api-icon.svg"
          href={`/projects/${projectId}/settings/datasources/manual`}
        />
      </Flex>
    </Container>
  );
}
