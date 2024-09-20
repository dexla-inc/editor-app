import MantineStyledButton from "@/components/datasources/DataSourceOptionButton";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { Flex, Stack, Title } from "@mantine/core";

export default function DataSourceNewInitialView() {
  const { id: projectId } = useEditorParams();
  return (
    <Stack p="xl">
      <Title order={3} pb="xl">
        How do you want to add a datasource?
      </Title>
      <Flex gap="xl">
        <MantineStyledButton
          title="OpenAPI"
          description="Copy and paste your swagger file to get started."
          caption="Great for internal APIs"
          logoUrl="/swagger_logo.svg"
          href={`/projects/${projectId}/settings/datasources/swagger`}
        />
        <MantineStyledButton
          title="Supabase"
          description="Connect to your Supabase database."
          caption="Great for Postgres databases"
          logoUrl="/supabase_logo.png"
          href={`/projects/${projectId}/settings/datasources/supabase`}
        />
        <MantineStyledButton
          title="Add Manually"
          description="Manually add your API the old fashioned way."
          caption="Good for public APIs"
          logoUrl="/manual-api-icon.svg"
          href={`/projects/${projectId}/settings/datasources/manual`}
        />
        <MantineStyledButton
          title="Build with AI"
          description="Type what API you want and watch it build."
          caption="Great for public APIs"
          logoUrl="/openai_log.png"
          href={`/projects/${projectId}/settings/datasources/ai`}
        />
      </Flex>
    </Stack>
  );
}
