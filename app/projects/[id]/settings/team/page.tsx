"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import TeamSettings from "@/components/settings/TeamSettings";
import { Tabs } from "@mantine/core";
import { useParams } from "next/navigation";

export default function Team() {
  const { id, name } = useParams<{ id: string; name: string }>();

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="team" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="team" pt="xs">
          <TeamSettings projectId={id} />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
