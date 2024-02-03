import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { CountdownTimerAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Button, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<CountdownTimerAction, "name">;

export const CountdownTimerActionFlowForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const requiredProp =
    ["value", "name", "children"].find(
      (prop) => component?.props![prop] !== undefined,
    ) ?? "";

  useEffect(() => {
    if (form.isTouched("componentId")) {
      form.setFieldValue("selectedProp", requiredProp);
    }
  }, [form.values.componentId]);

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        componentId={selectedComponentId}
        onPickComponent={() => {
          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps(`componentId`)}
      />
      <TextInput
        label="Selected Prop"
        readOnly
        {...form.getInputProps("selectedProp")}
      />
      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
