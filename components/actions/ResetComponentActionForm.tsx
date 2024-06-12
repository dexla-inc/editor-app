import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputsStore } from "@/stores/inputs";
import { ActionFormProps, ResetComponentAction } from "@/utils/actions";
import { MultiSelect, SelectItem } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";

type Props = ActionFormProps<Omit<ResetComponentAction, "name">>;

export const ResetComponentActionForm = ({ form }: Props) => {
  const inputsStore = useInputsStore((state) => state.inputValues);
  const components = useEditorTreeStore(
    useShallow((state) =>
      Object.keys(inputsStore).reduce((acc, key) => {
        const [componentId, _] = key.split("-related-");
        const { description } = state.componentMutableAttrs[componentId] ?? {};
        acc.push({ label: description, value: componentId });

        return acc;
      }, [] as SelectItem[]),
    ),
  );

  return (
    <MultiSelect
      label="Components"
      size="xs"
      searchable
      clearable
      data={components}
      {...form.getInputProps("componentIds")}
      nothingFound="No components found"
    />
  );
};
