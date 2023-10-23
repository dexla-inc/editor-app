import { DashboardShell } from "@/components/DashboardShell";
import DataSourceSettings from "@/components/settings/DataSourceSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { Tabs } from "@mantine/core";
import { useRouter } from "next/router";

export default function DataSources() {
  const user = usePropelAuthStore((state) => state.user);
  const router = useRouter();
  const { id, name } = router.query as { id: string; name: string };

  return (
    <DashboardShell user={user}>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="datasources" pt="xs">
          <DataSourceSettings projectId={id} />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
