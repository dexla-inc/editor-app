import { VariableSelect } from "@/components/variables/VariableSelect";
import { ActionFormProps, ResetVariableAction } from "@/utils/actions";
import { Stack } from "@mantine/core";

type Props = ActionFormProps<Omit<ResetVariableAction, "name">>;

export const ResetVariableActionForm = ({ form }: Props) => {
  return (
    <Stack spacing="xs">
      <VariableSelect
        required
        {...form.getInputProps("variableId")}
        setVariableType={() => form.setValues({})}
      />
    </Stack>
  );
};
