import { InformationAlert } from "@/components/Alerts";
import { useAppStore } from "@/stores/app";
import { Button, Stack } from "@mantine/core";
import { useRouter } from "next/router";

type EmptyDatasourcesPlaceholderProps = {
  projectId: string;
};

export default function DataSourcesContainer({
  projectId,
}: EmptyDatasourcesPlaceholderProps) {
  const router = useRouter();
  const startLoading = useAppStore((state) => state.startLoading);

  const goToSettings = async (projectId: string) => {
    startLoading({
      id: "go-to-settings",
      title: "Loading Settings",
      message: "Wait while we load the settings for your project",
    });

    router.push(`/projects/${projectId}/settings`);
  };

  return (
    <Stack>
      <InformationAlert text="You have no data sources yet. Set up a new data source to get started."></InformationAlert>
      <Button onClick={() => goToSettings(projectId)}>Set up</Button>
    </Stack>
  );
}
