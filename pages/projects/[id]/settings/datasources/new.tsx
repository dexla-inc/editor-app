import { DashboardShell } from "@/components/DashboardShell";
import DataSourceNewInitialView from "@/components/datasources/DataSourceNewInitialView";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { Tabs } from "@mantine/core";
import { useRouter } from "next/router";

export default function Settings() {
  const user = usePropelAuthStore((state) => state.user);
  const router = useRouter();

  const name = router.query.name as string;

  return (
    <DashboardShell user={user}>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="datasources" pt="xs">
          <DataSourceNewInitialView />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
