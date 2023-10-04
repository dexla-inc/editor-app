import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { listVariables } from "@/requests/variables/queries";
import { SetVariableAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { VariablesButton } from "../variables/VariablesButton";

type Props = {
  id: string;
};

type FormValues = Omit<SetVariableAction, "name">;

export const SetVariableActionForm = ({ id }: Props) => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { setPickingComponentToBindFrom } = useEditorStore();

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
          onPick={(componentToBindId: string) => {
            setPickingComponentToBindFrom(undefined);
            form.setFieldValue("value", `valueOf_${componentToBindId}`);
          }}
          {...form.getInputProps("value")}
        />
        <VariablesButton size="xs" pageId={pageId} projectId={projectId} />
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
        />
      </Stack>
    </form>
  );
};
