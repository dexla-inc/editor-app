import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ChangeStepAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<ChangeStepAction, "name">;

const controls = [
  { label: "Previous", value: "previous" },
  { label: "Next", value: "next" },
];

export const ChangeStepFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const setTree = useEditorStore((state) => state.setTree);
  const editorTree = useEditorStore((state) => state.tree);

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

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

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
