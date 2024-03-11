import { VariableSelect } from "@/components/variables/VariableSelect";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, ChangeVariableAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { ComponentToBindFromInput } from "../ComponentToBindFromInput";

type Props = ActionFormProps<Omit<ChangeVariableAction, "name">>;

export const ChangeVariableActionForm = ({ form }: Props) => {
  return (
    <Stack spacing="xs">
      <VariableSelect required {...form.getInputProps("variableId")} />
      <ComponentToBindFromInput
        required
        label="Value"
        {...form.getInputProps("value")}
      />
    </Stack>
  );
};
