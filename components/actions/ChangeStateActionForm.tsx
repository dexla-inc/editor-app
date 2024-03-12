import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { useDataContext } from "@/contexts/DataProvider";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useEditorStore } from "@/stores/editor";
import { ChangeStateAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<ChangeStateAction, "name">>;
};

export const ChangeStateActionForm = ({ form }: Props) => {
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const { getComponentsStates } = useComponentStates();

  const componentStatesList = getComponentsStates();

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        label="Component to change"
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
