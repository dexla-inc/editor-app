"use client";

import { DashboardShell } from "@/components/DashboardShell";
import DataSourceAddSwagger from "@/components/datasources/DataSourceAddSwagger";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";
import { useOldRouter } from "@/hooks/data/useOldRouter";

export default function Settings() {
  const {
    query: { name },
  } = useOldRouter();

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="datasources" pt="xs">
          <DataSourceAddSwagger />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
