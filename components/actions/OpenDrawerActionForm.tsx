import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { OpenDrawerAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

type FormValues = Omit<OpenDrawerAction, "name">;

export const OpenDrawerActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<OpenDrawerAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      drawerId: action.action.drawerId,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<OpenDrawerAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { drawerId: values.drawerId },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const drawers = getAllComponentsByName(editorTree.root, "Drawer");

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Select
          size="xs"
          label={
            action.action.name === "openDrawer"
              ? "Drawer to Open"
              : "Drawer to Close"
          }
          placeholder="Select a drawer"
          data={drawers.map((drawer: Component) => {
            return {
              label: drawer.props?.title ?? drawer.id,
              value: drawer.id!,
            };
          })}
          {...form.getInputProps("drawerId")}
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
