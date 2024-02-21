import { useFlowsQuery } from "@/hooks/reactQuery/useFlowsQuery";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { ActionFormProps, TriggerLogicFlowAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";

type Props = ActionFormProps<Omit<TriggerLogicFlowAction, "name">>;

export const TriggerLogicFlowActionForm = ({ form }: Props) => {
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
