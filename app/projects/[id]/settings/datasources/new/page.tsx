import { DashboardShell } from "@/components/DashboardShell";
import DataSourceNewInitialView from "@/components/datasources/DataSourceNewInitialView";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  const name = router.query.name as string;

  return (
    <DashboardShell>
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
