import { SettingsButton } from "@/components/navbar/SettingsButtons";
import { Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { ProjectSettings } from "../datasources/ProjectSettings";

export const EditorNavbarSettingsSection = () => {
  const router = useRouter();

  const settings = (
    <Stack p="xs" pr={0} justify="space-between" sx={{ height: "89vh" }}>
      <Stack>
        <ProjectSettings />
      </Stack>
      <Stack>
        <SettingsButton
          iconName="IconSettings"
          text="General"
          href={`/projects/${router.query.id}/settings`}
        />
        <SettingsButton
          iconName="IconDatabase"
          text="Data Sources"
          href={`/projects/${router.query.id}/settings/datasources`}
        />
        <SettingsButton
          iconName="IconWorldWww"
          text="Domain"
          href={`/projects/${router.query.id}/settings/domain`}
        />
        {/* <SettingsButton
        iconName="IconLanguage"
        text="Language"
        href={`/projects/${router.query.id}/settings/language`}
      /> */}
      </Stack>
    </Stack>
  );
  return settings;
};
