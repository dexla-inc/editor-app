import DataSourceSettings from "@/components/settings/DataSourceSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";

type Props = {
  name: string;
  id: string;
};

export const SettingsTabContent = ({ name, id }: Props) => {
  return (
    <>
      <SettingsTabs />
      <Tabs defaultValue="general" py="xs" variant="default">
        <SettingsTabHeader name={name} />

        <Tabs.Panel value="general" pt="xs">
          <GeneralSettings projectId={id} />
        </Tabs.Panel>

        <Tabs.Panel value="datasources" pt="xs">
          <DataSourceSettings projectId={id} />
        </Tabs.Panel>

        <Tabs.Panel value="users" pt="xs">
          Users
        </Tabs.Panel>

        <Tabs.Panel value="domain" pt="xs">
          Domain
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
