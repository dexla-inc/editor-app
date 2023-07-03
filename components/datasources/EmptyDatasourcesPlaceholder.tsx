import { InformationAlert } from "@/components/Alerts";
import { NavigationButton } from "@/components/NavigationButton";
import { Stack } from "@mantine/core";

type EmptyDatasourcesPlaceholderProps = {
  projectId: string;
};

export default function DataSourcesContainer({
  projectId,
}: EmptyDatasourcesPlaceholderProps) {
  return (
    <Stack>
      <InformationAlert text="You have no data sources yet. Set up a new data source to get started." />
      <NavigationButton
        basePath="/projects/[id]/settings/datasources/new"
        replacements={{ id: projectId }}
        text="Set up"
      ></NavigationButton>
    </Stack>
  );
}
