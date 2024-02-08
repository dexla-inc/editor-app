import { LogicFlowResponse } from "@/requests/logicflows/types";
import { TriggerLogicFlowAction } from "@/utils/actions";
import { LoadingOverlay, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useRequestProp } from "@/hooks/useRequestProp";

type Props = {
  form: UseFormReturnType<Omit<TriggerLogicFlowAction, "name">>;
};

export const TriggerLogicFlowActionForm = ({ form }: Props) => {
  const { useFlowsQuery } = useRequestProp();
  const { data: flows, isLoading } = useFlowsQuery();

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label="Logic Flow to trigger"
        placeholder="Select a flow"
        data={flows.map((flow: LogicFlowResponse) => {
          return {
            label: flow.name,
            value: flow.id,
          };
        })}
        {...form.getInputProps("logicFlowId")}
      />
    </Stack>
  );
};
