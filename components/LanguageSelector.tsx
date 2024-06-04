import { useEditorStore } from "@/stores/editor";
import { Select } from "@mantine/core";

const LanguageSelector = () => {
  const language = useEditorStore((state) => state.language);
  const setLanguage = useEditorStore((state) => state.setLanguage);

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
      size="xs"
      data={[
        { value: "default", label: "English" },
        { value: "french", label: "French" },
        // Add more languages as needed
      ]}
      sx={{
        ...flexStyles,
        whiteSpace: "nowrap",
        width: "160px",
      }}
    />
  );
};

export default LanguageSelector;
