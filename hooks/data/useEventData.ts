import { useEditorTreeStore } from "@/stores/editorTree";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";

export const useEventData = () => {
  const selectedComponentId = useEditorTreeStore(selectedComponentIdSelector)!;
  const selectedComponentName = useEditorTreeStore(
    (state) => state.componentMutableAttrs[selectedComponentId]?.name,
  );
  const inputValue = useInputsStore(
    useShallow((state) => state.inputValues[selectedComponentId]),
  );

  const eventKeyMapper: Record<string, string> = {
    Input: "value",
    Select: "value",
    Textarea: "value",
    Radio: "value",
    DateInput: "value",
    Autocomplete: "value",
    CheckboxGroup: "value",
    Checkbox: "checked",
    Switch: "checked",
    FileButton: "files",
    FileUpload: "files",
  };

  const eventKey = eventKeyMapper?.[selectedComponentName];

  if (!eventKey) {
    return [];
  }

  return [
    {
      target: {
        [eventKey]: inputValue,
      },
    },
  ];
};
