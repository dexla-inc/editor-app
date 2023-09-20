import { Select, Stack } from "@mantine/core";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "./_BaseActionFunctions";
import { BindPlaceDataAction } from "@/utils/actions";
import { useForm } from "@mantine/form";
import { ActionButtons } from "./ActionButtons";
import { Component, getAllComponentsByName } from "@/utils/editor";

type Props = {
  id: string;
};

type FormValues = {
  componentId: string;
};

export const BindPlaceDataActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<BindPlaceDataAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const containers = getAllComponentsByName(editorTree.root, "Container");

  const form = useForm<FormValues>({
    initialValues: {
      componentId: action.action.componentId,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });
    try {
      updateActionInTree<BindPlaceDataAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { componentId: values.componentId },
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
          label="Component To Bind"
          placeholder="Select a component"
          data={containers.map((container: Component) => {
            return {
              label: container.description ?? container.id,
              value: container.id!,
            };
          })}
          {...form.getInputProps("componentId")}
        />
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
