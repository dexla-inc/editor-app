import { DashboardShell } from "@/components/DashboardShell";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import TeamSettings from "@/components/settings/TeamSettings";
import { Tabs } from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";

export default function DataSources() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();
  const { id, name } = router.query as { id: string; name: string };

  return (
    <DashboardShell user={user}>
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
