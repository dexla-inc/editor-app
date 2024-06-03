import { useEditorTreeStore } from "@/stores/editorTree";
import { Select } from "@mantine/core";

const LanguageSelector = () => {
  const language = useEditorTreeStore((state) => state.language);
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
      value={language}
      onChange={setLanguage}
      withinPortal
      size="xs"
      data={[
        { value: "en", label: "English" },
        { value: "fr", label: "French" },
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
