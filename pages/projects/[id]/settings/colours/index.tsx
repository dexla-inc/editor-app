import { DashboardShell } from "@/components/DashboardShell";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";
import { useRouter } from "next/router";
import { ColoursSettings } from "@/components/settings/ColoursSettings";

export default function Colours() {
  const router = useRouter();
  const { id, name } = router.query as { id: string; name: string };

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="colours" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="colours" pt="xs">
          <ColoursSettings />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
