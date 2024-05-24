"use client";

import { DashboardShell } from "@/components/DashboardShell";
import GeneralSettings from "@/components/settings/GeneralSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

import { Tabs } from "@mantine/core";
import { useParams } from "next/navigation";

export default function Settings() {
  const { id, name } = useParams<{ id: string; name: string }>();

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
