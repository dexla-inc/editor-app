import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { UnitInput } from "@/components/UnitInput";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { CountdownTimerAction } from "@/utils/actions";
import { findComponentProp } from "@/utils/findComponentProp";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<CountdownTimerAction, "name">;

export const CountdownTimerActionFlowForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        componentId={selectedComponentId}
        onPickComponent={() => {
          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps(`componentId`)}
        onChange={(value) => {
          const selectedProp = findComponentProp(value.bindedId as string);
          form.setValues({
            componentId: value,
            selectedProp,
          });
        }}
      />
      <UnitInput
        {...form.getInputProps("interval")}
        options={[
          { label: "secs", value: "seconds" },
          { label: "mins", value: "minutes" },
        ]}
        disabledUnits={["%", "auto", "fit-content", "px", "rem", "vh", "vw"]}
        onChange={(value) => form.setFieldValue("interval", value)}
      />
      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
