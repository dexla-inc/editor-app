import { VariableSelect } from "@/components/variables/VariableSelect";
import { useEditorStore } from "@/stores/editor";
import { ChangeVariableAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { ComponentToBindFromInput } from "../ComponentToBindFromInput";

type Props = {
  form: UseFormReturnType<Omit<ChangeVariableAction, "name">>;
};

export const ChangeVariableActionForm = ({ form }: Props) => {
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  return (
    <Stack spacing="xs">
      <VariableSelect required {...form.getInputProps("variableId")} />
      <ComponentToBindFromInput
        required
        label="Value"
        componentId={selectedComponentId}
        {...form.getInputProps("value")}
      />
    </Stack>
  );
};
