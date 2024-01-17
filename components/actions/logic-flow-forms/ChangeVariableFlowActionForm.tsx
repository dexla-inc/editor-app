import BindingPopover from "@/components/BindingPopover";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { useFlowStore } from "@/stores/flow";
import { ChangeVariableAction } from "@/utils/actions";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<ChangeVariableAction, "name">;

export const ChangeVariableFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const [isBindable, { toggle: onTogglePopover, close: onClosePopover }] =
    useDisclosure(false);

  return (
    <Stack spacing="xs">
      <VariableSelect
        label="Variable"
        required
        onPick={(variable) => {
          form.setFieldValue("variableId", variable.id);
        }}
        {...form.getInputProps("variableId")}
      />

      <BindingPopover
        opened={isBindable}
        onTogglePopover={onTogglePopover}
        onClosePopover={onClosePopover}
        bindingType={form.values.bindingType ?? "JavaScript"}
        onChangeBindingType={(bindingType: any) => {
          form.setFieldValue("bindingType", bindingType);
        }}
        onChangeJavascriptCode={(javascriptCode: any) => {
          form.setFieldValue("javascriptCode", javascriptCode);
        }}
        javascriptCode={form.values.javascriptCode ?? ""}
        style="iconButton"
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
