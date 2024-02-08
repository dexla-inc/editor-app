import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { useDataContext } from "@/contexts/DataProvider";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useEditorStore } from "@/stores/editor";
import { ChangeStateAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<ChangeStateAction, "name">>;
};

export const ChangeStateActionForm = ({ form }: Props) => {
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
  const { getComponentsStates } = useComponentStates();

  const { computeValue } = useDataContext()!;

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const pickedId = computeValue({ value: form.values.componentId });
  const componentStatesList = getComponentsStates([pickedId]);

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

      {!!componentStatesList.length && (
        <ComponentToBindFromSelect
          label="State"
          placeholder="Select State"
          nothingFound="Nothing found"
          searchable
          data={componentStatesList}
          {...form.getInputProps("state")}
        />
      )}
    </Stack>
  );
};
