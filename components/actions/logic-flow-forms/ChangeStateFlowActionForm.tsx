import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { useDataContext } from "@/contexts/DataProvider";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ChangeStateAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { getComponentById } from "@/utils/editor";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<ChangeStateAction, "name">;

export const ChangeStateActionFlowForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const setTree = useEditorStore((state) => state.setTree);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const { computeValue } = useDataContext()!;
  const pickedId = computeValue({ value: form.values.componentId });

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const { getComponentsStates } = useComponentStates();

  const component = getComponentById(editorTree.root, selectedComponentId!);

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        componentId={component?.id}
        onPickComponent={() => {
          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps("componentId")}
      />

      <ComponentToBindFromSelect
        label="State"
        placeholder="Select State"
        nothingFound="Nothing found"
        searchable
        data={getComponentsStates([pickedId])}
        {...form.getInputProps("state")}
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
