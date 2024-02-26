import { useFlowsQuery } from "@/hooks/reactQuery/useFlowsQuery";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, TriggerLogicFlowAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { useEffect } from "react";

type Props = ActionFormProps<Omit<TriggerLogicFlowAction, "name">>;

export const TriggerLogicFlowActionForm = ({ form }: Props) => {
  const projectId = useEditorStore((state) => state.currentProjectId) as string;
  const { data: flows, isFetched } = useFlowsQuery(projectId);

  useEffect(() => {
    if (isFetched) {
      const selectedFlow = flows?.results.find(
        (flow: LogicFlowResponse) => flow.id === form.values.logicFlowId,
      );
      if (selectedFlow) {
        form.setFieldValue("logicFlow", selectedFlow);
      }
    }
  }, [isFetched]);

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label="Logic Flow to trigger"
        placeholder="Select a flow"
        data={
          flows?.results.map((flow: LogicFlowResponse) => {
            return {
              label: flow.name,
              value: flow.id,
            };
          }) ?? []
        }
        {...form.getInputProps("logicFlowId")}
      />
    </Stack>
  );
};
