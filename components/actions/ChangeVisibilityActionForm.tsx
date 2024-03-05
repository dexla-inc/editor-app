import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, TogglePropsAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { VisibilityModifier } from "../data/VisibilityModifier";

type Props = ActionFormProps<Omit<TogglePropsAction, "name">>;

export const ChangeVisibilityActionForm = ({ form }: Props) => {
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentIds?.at(-1),
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );

  const component = useEditorStore(
    (state) => state.componentMutableAttrs[selectedComponentId!],
  );

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        componentId={selectedComponentId}
        label="Component to change"
        onPickComponent={() => {
          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps("componentId")}
      />
      <VisibilityModifier
        componentId={component?.id!}
        componentName={component?.name as string}
        form={form}
        isVisibilityActionForm={true}
      />
    </Stack>
  );
};
