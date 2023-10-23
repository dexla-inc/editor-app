import { DashboardShell } from "@/components/DashboardShell";
import GeneralSettings from "@/components/settings/GeneralSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { usePropelAuthStore } from "@/stores/propelAuth";

import { Tabs } from "@mantine/core";
import { useRouter } from "next/router";

export default function Settings() {
  const user = usePropelAuthStore((state) => state.user);
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
