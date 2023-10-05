import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { listLogicFlows } from "@/requests/logicflows/queries";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { TriggerLogicFlowAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

type Props = {
  id: string;
};

type FormValues = Omit<TriggerLogicFlowAction, "name">;

export const TriggerLogicFlowActionForm = ({ id }: Props) => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingState();
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

  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<TriggerLogicFlowAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      logicFlowId: action.action.logicFlowId,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<TriggerLogicFlowAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { logicFlowId: values.logicFlowId },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
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
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
