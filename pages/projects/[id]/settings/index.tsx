import { DashboardShell } from "@/components/DashboardShell";
import GeneralSettings from "@/components/settings/GeneralSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

import { Tabs } from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();

  const { id, name } = router.query as { id: string; name: string };

  return (
    <DashboardShell user={user}>
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
