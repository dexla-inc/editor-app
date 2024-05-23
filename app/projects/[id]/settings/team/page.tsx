"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import TeamSettings from "@/components/settings/TeamSettings";
import { Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Team() {
  const router = useRouter();
  const { id, name } = router.query as { id: string; name: string };

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
