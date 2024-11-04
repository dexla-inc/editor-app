import MantineStyledButton from "@/components/datasources/DataSourceOptionButton";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { generateIntegrationUrl } from "@/requests/integrations/queries";
import { Grid, Stack, Title } from "@mantine/core";

export default function DataSourceNewInitialView() {
  const { id: projectId } = useEditorParams();

  const handleAirtableClick = async () => {
    const result = await generateIntegrationUrl("airtable");
    window.location.href = result.url;
  };

  return (
    <Stack p="xl">
      <Title order={3} pb="xl">
        Select a datasource
      </Title>
      <Grid>
        <Grid.Col span={12} md={4}>
          <MantineStyledButton
            title="OpenAPI"
            description="Copy and paste your swagger file to get started."
            caption="Great for internal APIs"
            logoUrl="/swagger_logo.svg"
            href={`/projects/${projectId}/settings/datasources/swagger`}
          />
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <MantineStyledButton
            title="Supabase"
            description="Connect to your Supabase database."
            caption="Great for Postgres databases"
            logoUrl="/supabase_logo.png"
            href={`/projects/${projectId}/settings/datasources/supabase`}
          />
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <MantineStyledButton
            title="Airtable"
            description="Connect your Airtable."
            caption="Great for Airtable databases"
            logoUrl="/airtable_logo.svg"
            onClick={handleAirtableClick}
          />
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <MantineStyledButton
            title="Add Manually"
            description="Manually add your API the old fashioned way."
            caption="Good for public APIs"
            logoUrl="/manual-api-icon.svg"
            href={`/projects/${projectId}/settings/datasources/manual`}
          />
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <MantineStyledButton
            title="Build with AI"
            description="Type what API you want and watch it build."
            caption="Great for public APIs"
            logoUrl="/openai_log.png"
            href={`/projects/${projectId}/settings/datasources/ai`}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
