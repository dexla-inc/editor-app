import { useEditorTreeStore } from "@/stores/editorTree";
import { Select } from "@mantine/core";

const LanguageSelector = () => {
  const language = useEditorTreeStore.getState().language;
  const setLanguage = useEditorTreeStore.getState().setLanguage;

  const flexStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <Select
      label="Language"
      defaultValue={language}
      onChange={setLanguage}
      withinPortal
      size="xs"
      data={[
        { value: "default", label: "English", group: "Popular" },
        { value: "fr-FR", label: "French", group: "Popular" },
      ]}
      sx={{
        ...flexStyles,
        whiteSpace: "nowrap",
        width: "220px",
      }}
    />
  );
};

export default LanguageSelector;
