import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { TriggerLogicFlowAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

type Props = {
  form: UseFormReturnType<Omit<TriggerLogicFlowAction, "name">>;
};

export const TriggerLogicFlowActionForm = ({ form }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const { data: flows } = useQuery({
    queryKey: ["logic-flows", projectId, pageId],
    queryFn: async () => {
      const response = await listLogicFlows(projectId, { pageId });
      return response.results ?? [];
    },
    enabled: !!projectId && !!pageId,
  });

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
    </Stack>
  );
};
