import { useFlowsQuery } from "@/hooks/editor/reactQuery/useFlowsQuery";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { ActionFormProps, TriggerLogicFlowAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { useEffect } from "react";

type Props = ActionFormProps<Omit<TriggerLogicFlowAction, "name">>;

export const TriggerLogicFlowActionForm = ({ form }: Props) => {
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
  const { data: flows } = useFlowsQuery(projectId);

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
        searchable
        {...form.getInputProps("logicFlowId")}
      />
    </Stack>
  );
};
