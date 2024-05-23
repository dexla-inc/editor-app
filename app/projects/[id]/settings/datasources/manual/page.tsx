"use client";

import { DashboardShell } from "@/components/DashboardShell";
import ApiInfoFormNew from "@/components/datasources/ApiInfoFormNew";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Container, Stack, Tabs, Title } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  const { name } = router.query as { id: string; name: string };

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />
        <Tabs.Panel value="datasources" pt="xs">
          <Container py="xl">
            <Stack spacing="xl">
              <Title order={2}>Data Source Settings</Title>
              <ApiInfoFormNew />
            </Stack>
          </Container>
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
