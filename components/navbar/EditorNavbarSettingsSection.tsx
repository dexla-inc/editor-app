import { SettingsButton } from "@/components/navbar/SettingsButtons";
import { Stack } from "@mantine/core";
import { ProjectSettings } from "../datasources/ProjectSettings";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

export const EditorNavbarSettingsSection = () => {
  const { id: projectId } = useEditorParams();

  const settings = (
    <Stack p="xs" pr={0} justify="space-between" sx={{ height: "89vh" }}>
      <Stack>
        <ProjectSettings />
      </Stack>
      <Stack>
        <SettingsButton
          iconName="IconSettings"
          text="General"
          href={`/projects/${projectId}/settings`}
        />
        <SettingsButton
          iconName="IconDatabase"
          text="Data Sources"
          href={`/projects/${projectId}/settings/datasources`}
        />
        <SettingsButton
          iconName="IconWorldWww"
          text="Domain"
          href={`/projects/${projectId}/settings/domain`}
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
