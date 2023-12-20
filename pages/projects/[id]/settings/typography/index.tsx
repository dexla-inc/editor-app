import { DashboardShell } from "@/components/DashboardShell";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";
import { useRouter } from "next/router";
import { TypographySettings } from "@/components/settings/TypographySettings";

export default function Typography() {
  const router = useRouter();
  const { id, name } = router.query as { id: string; name: string };

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="typography" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="typography" pt="xs">
          <TypographySettings projectId={id} />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
