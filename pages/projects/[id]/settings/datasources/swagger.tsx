import { DashboardShell } from "@/components/DashboardShell";
import DataSourceAddSwagger from "@/components/settings/DataSourceAddSwagger";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();

  const name = router.query.name as string;

  return (
    <DashboardShell user={user}>
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
