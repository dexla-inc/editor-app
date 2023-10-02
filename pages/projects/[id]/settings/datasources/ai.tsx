import { DashboardShell } from "@/components/DashboardShell";
import DataSourceAddAPIWithAI from "@/components/datasources/DataSourceAddAPIWithAI";
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
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="datasources" pt="xs">
          <DataSourceAddAPIWithAI projectId={id} />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
