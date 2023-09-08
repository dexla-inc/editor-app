import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { OpenModalAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

type FormValues = Omit<OpenModalAction, "name">;

export const CloseModalActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<OpenModalAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      modalId: action.action.modalId,
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      updateActionInTree<OpenModalAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { modalId: values.modalId },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const modals = getAllComponentsByName(editorTree.root, "Modal");

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Select
          size="xs"
          label="Modal to Close"
          placeholder="Select a modal"
          data={modals.map((modal: Component) => {
            return {
              label: modal.props?.title ?? modal.id,
              value: modal.id!,
            };
          })}
          {...form.getInputProps("modalId")}
        />
        <ActionButtons
          actionId={id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
