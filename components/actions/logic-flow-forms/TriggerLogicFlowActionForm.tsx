import { useRequestProp } from "@/hooks/useRequestProp";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useFlowStore } from "@/stores/flow";
import { TriggerLogicFlowAction } from "@/utils/actions";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<TriggerLogicFlowAction, "name">;

export const TriggerLogicFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  const { flows } = useRequestProp();

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label="Logic Flow to trigger"
        placeholder="Select a flow"
        data={(flows ?? [])?.map((flow: LogicFlowResponse) => {
          return {
            label: flow.name,
            value: flow.id,
          };
        })}
        {...form.getInputProps("logicFlowId")}
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
