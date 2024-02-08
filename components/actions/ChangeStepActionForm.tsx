import { useEditorStore } from "@/stores/editor";
import { ChangeStepAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<ChangeStepAction, "name">>;
};

const controls = [
  { label: "Previous", value: "previous" },
  { label: "Next", value: "next" },
];

export const ChangeStepActionForm = ({ form }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);

  const steppers = getAllComponentsByName(editorTree.root, "Stepper");

  return (
    <Stack spacing="xs">
      <Select
        required
        size="xs"
        label="Stepper to change step"
        placeholder="Select a stepper"
        data={steppers.map((stepper: Component) => {
          return {
            label: stepper.description ?? stepper.id,
            value: stepper.id!,
          };
        })}
        {...form.getInputProps("stepperId")}
      />
      <Select
        required
        size="xs"
        label="Control"
        placeholder="Select a control"
        data={controls.map((control) => {
          return {
            label: control.label,
            value: control.value,
          };
        })}
        {...form.getInputProps("control")}
      />
    </Stack>
  );
};
