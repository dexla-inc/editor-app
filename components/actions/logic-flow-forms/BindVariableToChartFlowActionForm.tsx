import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { VariablePicker } from "@/components/VariablePicker";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { BindVariableToChartAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Component, getComponentById } from "@/utils/editor";
import { Button, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<BindVariableToChartAction, "name">;

export const BindVariableToChartFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const editorTree = useEditorStore((state) => state.tree);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setTree = useEditorStore((state) => state.setTree);
  const [component, setComponent] = useState<Component | null>(null);

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  useEffect(() => {
    if (form.values.component) {
      const _component = getComponentById(
        editorTree.root,
        form.values.component,
      );
      setComponent(_component);
    }
  }, [editorTree.root, form.values.component]);

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        isLogicFlow={true}
        onPickComponent={(componentToBind: string) => {
          form.setFieldValue("component", componentToBind);

          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps("component")}
        onChange={(e) => {
          form.setFieldValue("component", e.currentTarget.value);
        }}
      />

      <TextInput
        size="xs"
        placeholder="Series"
        label="Series"
        {...form.getInputProps("series")}
        rightSection={
          <VariablePicker
            onSelectValue={(selected) => {
              form.setFieldValue("series", selected);
            }}
          />
        }
      />

      <TextInput
        size="xs"
        placeholder="Labels"
        label="Labels"
        {...form.getInputProps("labels")}
        rightSection={
          <VariablePicker
            onSelectValue={(selected) => {
              form.setFieldValue("labels", selected);
            }}
          />
        }
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
