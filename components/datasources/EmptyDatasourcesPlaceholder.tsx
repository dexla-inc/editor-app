import { InformationAlert } from "@/components/Alerts";
import { Icon } from "@/components/Icon";
import { useQuickAccess } from "@/hooks/editor/useQuickAccess";
import { Button, Stack } from "@mantine/core";

type EmptyDatasourcesPlaceholderProps = {
  projectId: string;
};

export default function EmptyDatasourcesPlaceholder({
  projectId,
}: EmptyDatasourcesPlaceholderProps) {
  const { openModal } = useQuickAccess({ projectId });

  return (
    <Stack>
      <InformationAlert text="You have no data sources yet. Set up a new data source to get started." />
      <Button
        onClick={openModal}
        leftIcon={<Icon name="IconDatabaseImport" />}
        // component={Link}
        //href={`/projects/${projectId}/settings/datasources/new`}
        //target="_blank"
      >
        Set up
      </Button>
    </Stack>
  );
}
