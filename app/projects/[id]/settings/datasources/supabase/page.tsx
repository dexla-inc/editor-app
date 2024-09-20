"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Container, Stack, Tabs, Title } from "@mantine/core";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import DataSourceSupabaseForm from "@/components/datasources/DataSourceSupabaseForm";

export default function Settings() {
  const {
    query: { name },
  } = useOldRouter();

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />
        <Tabs.Panel value="datasources" pt="xs">
          <Container py="xl">
            <Stack spacing="xl">
              <Title order={2}>Data Source Settings</Title>
              <DataSourceSupabaseForm />
            </Stack>
          </Container>
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
