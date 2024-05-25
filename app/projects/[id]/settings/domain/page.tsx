"use client";

import { DashboardShell } from "@/components/DashboardShell";
import DomainSettings from "@/components/settings/DomainSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";
import { useOldRouter } from "@/hooks/data/useOldRouter";

export default function Domain() {
  const {
    query: { id, name },
  } = useOldRouter();
  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="domain" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="domain" pt="xs">
          <DomainSettings projectId={id} />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
