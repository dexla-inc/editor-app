import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, TogglePropsAction } from "@/utils/actions";
import { Stack } from "@mantine/core";

type Props = ActionFormProps<Omit<TogglePropsAction, "name">>;

export const TogglePropsActionForm = ({ form }: Props) => {
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        componentId={selectedComponentId}
        onPickComponent={() => {
          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps("componentId")}
      />
    </Stack>
  );
};
