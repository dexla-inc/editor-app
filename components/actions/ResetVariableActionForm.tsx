import { ActionFormProps, ResetVariableAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { VariableMultiSelect } from "../variables/VariableMultiSelect";
import { useEffect } from "react";

type Props = ActionFormProps<Omit<ResetVariableAction, "name">>;

export const ResetVariableActionForm = ({ form }: Props) => {
  useEffect(() => {
    if (form.values.variableId) {
      form.setValues({
        variableIds: [form.values.variableId],
        variableId: "",
      });
    }
  }, []);

  return (
    <Stack spacing="xs">
      <VariableMultiSelect
        required
        {...form.getInputProps("variableIds")}
        setVariableType={() => form.setValues({})}
      />
    </Stack>
  );
};
