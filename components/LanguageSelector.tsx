import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Select } from "@mantine/core";

const LanguageSelector = () => {
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
      defaultValue="default"
      onChange={setLanguage}
      withinPortal
      size="xs"
      data={[
        { value: "default", label: "United States", group: "Popular" },
        { value: "en-GB", label: "United Kingdom", group: "Popular" },
        { value: "es-ES", label: "Spanish", group: "Popular" },
        { value: "fr-FR", label: "French", group: "Popular" },
        { value: "pt-BR", label: "Brazil", group: "Popular" },
        { value: "en-NG", label: "Nigeria", group: "Popular" },
        { value: "de-DE", label: "German", group: "Popular" },
        { value: "ja-JP", label: "Japanese", group: "Popular" },
        { value: "pt-PT", label: "Portuguese", group: "Popular" },
        { value: "it-IT", label: "Italian", group: "Popular" },
        { value: "tr-TR", label: "Turkish", group: "Popular" },
        { value: "nl-NL", label: "Dutch, Flemish", group: "Popular" },
        { value: "pl-PL", label: "Polish", group: "Popular" },
        { value: "af-AF", label: "Afghanistan", group: "Other" },
        { value: "sq-AL", label: "Albania", group: "Other" },
        { value: "ar-DZ", label: "Algeria", group: "Other" },
        { value: "ca-AD", label: "Andorra", group: "Other" },
        { value: "pt-AO", label: "Angola", group: "Other" },
        { value: "en-AG", label: "Antigua and Barbuda", group: "Other" },
        { value: "es-AR", label: "Argentina", group: "Other" },
        { value: "hy-AM", label: "Armenia", group: "Other" },
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
