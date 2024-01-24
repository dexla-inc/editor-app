import { SettingsButton } from "@/components/navbar/SettingsButtons";
import { useRouter } from "next/router";

export const EditorNavbarSettingsSection = () => {
  const router = useRouter();

  const settings = (
    <>
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
      <SettingsButton
        iconName="IconLanguage"
        text="Language"
        href={`/projects/${router.query.id}/settings/language`}
        disabled
      />
    </>
  );
  return settings;
};
