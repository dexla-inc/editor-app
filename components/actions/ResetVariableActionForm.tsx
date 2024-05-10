import { VariableSelect } from "@/components/variables/VariableSelect";
import { ActionFormProps, ResetVariableAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { VariableMultiSelect } from "../variables/VariableMultiSelect";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

type Props = ActionFormProps<Omit<ResetVariableAction, "name">>;

export const ResetVariableActionForm = ({ form }: Props) => {
  return (
    <Stack spacing="xs">
      <SegmentedControlYesNo
        label="Reset Multiple"
        {...form.getInputProps("multiple")}
        onChange={(value) => {
          form.setValues({ multiple: value });
          if (value) {
            form.setValues({
              variableIds: [form.values.variableId],
              variableId: "",
            });
          } else {
            const firstVariableId = form.values.variableIds[0] || "";
            form.setValues({
              variableId: firstVariableId,
              variableIds: [],
            });
          }
        }}
      />
      {form.values.multiple ? (
        <VariableMultiSelect
          required
          {...form.getInputProps("variableIds")}
          setVariableType={() => form.setValues({})}
        />
      ) : (
        <VariableSelect
          required
          {...form.getInputProps("variableId")}
          setVariableType={() => form.setValues({})}
        />
      )}
    </Stack>
  );
};
