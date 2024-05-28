import { Stack, Tabs } from "@mantine/core";
import { HistoryPageSection } from "./HistoryPageSection";
import { HistoryDeploymentSection } from "./HistoryDeploymentSection";

export const EditorHistorySection = () => {
  return (
    <Stack spacing="xs" pl="xs">
      <Tabs
        variant="default"
        defaultValue="deployment"
        p="xs"
        pr={0}
        keepMounted={false}
      >
        <Tabs.List grow>
          <Tabs.Tab value="page" sx={{ fontSize: 12 }}>
            Page
          </Tabs.Tab>

          <Tabs.Tab value="deployment" sx={{ fontSize: 12 }}>
            Deployment
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="page" pt="sm">
          <HistoryPageSection />
        </Tabs.Panel>

        <Tabs.Panel value="deployment" pt="sm">
          <HistoryDeploymentSection />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
