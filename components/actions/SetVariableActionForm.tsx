import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { VariablesButton } from "@/components/variables/VariablesButton";
import { listVariables } from "@/requests/variables/queries";
import { useEditorStore } from "@/stores/editor";
import { SetVariableAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

type Props = {
  id: string;
};

type FormValues = Omit<SetVariableAction, "name">;

export const SetVariableActionForm = ({ id }: Props) => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  const { componentActions, action } = useActionData<SetVariableAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const { data: variables } = useQuery({
    queryKey: ["variables", projectId, pageId],
    queryFn: async () => {
      const response = await listVariables(projectId, { pageId });
      return response;
    },
    enabled: !!projectId && !!pageId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      variable: action.action.variable
        ? JSON.parse(action.action.variable).id
        : "",
      value: action.action.value,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<SetVariableAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          variable: JSON.stringify(
            (variables?.results ?? []).find((v) => v.id === values.variable),
          ),
          value: values.value,
        },
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
          label="Variable"
          data={(variables?.results ?? []).map((variable) => {
            return {
              value: variable.id,
              label: variable.name,
            };
          })}
          {...form.getInputProps("variable")}
        />
        <ComponentToBindFromInput
          placeholder="value"
          label="Value"
          componentId={selectedComponentId}
          onPickComponent={(componentToBindId: string) => {
            form.setFieldValue("value", `valueOf_${componentToBindId}`);

            setComponentToBind(undefined);
            setPickingComponentToBindTo(undefined);
          }}
          onPickVariable={(variable: string) => {
            form.setFieldValue("value", variable);
          }}
          {...form.getInputProps("value")}
        />
        <VariablesButton size="xs" pageId={pageId} projectId={projectId} />
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        />
      </Stack>
    </form>
  );
};
