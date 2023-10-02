import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { OpenPopOverAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

type FormValues = Omit<OpenPopOverAction, "name">;

export const OpenPopOverActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<OpenPopOverAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      popOverId: action.action.popOverId,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<OpenPopOverAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { popOverId: values.popOverId },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const popOvers = getAllComponentsByName(editorTree.root, "PopOver");

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Select
          size="xs"
          label={
            action.action.name === "openPopOver"
              ? "PopOver to Open"
              : "PopOver to Close"
          }
          placeholder="Select a popOver"
          data={popOvers.map((popOver: Component) => {
            return {
              label: popOver.props?.title ?? popOver.id,
              value: popOver.id!,
            };
          })}
          {...form.getInputProps("popOverId")}
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
