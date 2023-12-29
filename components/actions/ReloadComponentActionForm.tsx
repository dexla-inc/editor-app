import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { ActionsForm } from "@/components/actions/ActionsForm";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { ReloadComponentAction } from "@/utils/actions";
import { Divider, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type FormValues = Omit<ReloadComponentAction, "name">;

type Props = {
  id: string;
};

export const ReloadComponentActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<ReloadComponentAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const sequentialTo = useEditorStore((state) => state.sequentialTo);

  const reloadAction = action.action as ReloadComponentAction;

  const form = useForm<FormValues>({
    initialValues: {
      componentId: reloadAction?.componentId ?? "",
      onMountActionId: reloadAction?.onMountActionId ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<ReloadComponentAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          componentId: values.componentId,
          onMountActionId: values.onMountActionId,
        },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <ComponentToBindFromInput
            key={form.values.componentId}
            componentId={selectedComponentId}
            onPickComponent={(componentToBind: string) => {
              form.setFieldValue("componentId", componentToBind);

              setComponentToBind(undefined);
              setPickingComponentToBindTo(undefined);
            }}
            onPickVariable={(variable: string) => {
              form.setFieldValue("componentId", variable);
            }}
            size="xs"
            label="Component to reload"
            {...form.getInputProps("componentId")}
          />
          <ActionButtons
            actionId={action.id}
            componentActions={componentActions}
            canAddSequential={true}
          ></ActionButtons>
        </Stack>
      </form>
      {sequentialTo === id && (
        <>
          <Divider my="lg" label="Sequential Action" labelPosition="center" />
          <ActionsForm sequentialTo={sequentialTo} />
        </>
      )}
    </>
  );
};
