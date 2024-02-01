import BindingPopover from "@/components/BindingPopover";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { useFlowStore } from "@/stores/flow";
import { ChangeVariableAction } from "@/utils/actions";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<ChangeVariableAction, "name">;

export const ChangeVariableFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  return (
    <Stack spacing="xs">
      <VariableSelect required {...form.getInputProps("variableId")} />

      <BindingPopover style="iconButton" {...form.getInputProps("value")} />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
