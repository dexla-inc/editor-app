"use client";

import { DashboardShell } from "@/components/DashboardShell";
import GeneralSettings from "@/components/settings/GeneralSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

import { Tabs } from "@mantine/core";
import { useOldRouter } from "@/hooks/data/useOldRouter";

export default function Settings() {
  const {
    query: { id, name },
  } = useOldRouter();

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="general" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="general" pt="xs">
          <GeneralSettings projectId={id} />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
