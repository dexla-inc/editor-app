"use client";

import { DashboardShell } from "@/components/DashboardShell";
import DataSourceSettings from "@/components/settings/DataSourceSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";
import { useOldRouter } from "@/hooks/data/useOldRouter";

export default function DataSources() {
  const {
    query: { id, name },
  } = useOldRouter();

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="datasources" pt="xs">
          <DataSourceSettings projectId={id} />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
