import { InformationAlert } from "@/components/Alerts";
import { Button, Stack } from "@mantine/core";
import Link from "next/link";
import { Icon } from "../Icon";

type EmptyDatasourcesPlaceholderProps = {
  projectId: string;
};

export default function EmptyDatasourcesPlaceholder({
  projectId,
}: EmptyDatasourcesPlaceholderProps) {
  return (
    <Stack>
      <InformationAlert text="You have no data sources yet. Set up a new data source to get started." />
      <Button
        component={Link}
        href={`/projects/${projectId}/settings/datasources/new`}
        target="_blank"
        leftIcon={<Icon name="IconExternalLink" />}
      >
        Set up
      </Button>
    </Stack>
  );
}
