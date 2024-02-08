import { useForm } from "@mantine/form";
import { Action, ChangeLanguageAction } from "@/utils/actions";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { Stack } from "@mantine/core";

type Props = {
  action: Action;
  defaultValues: Record<string, any>;
  children?: (props: any) => JSX.Element;
};

export const ActionSettingsForm = ({
  action,
  defaultValues,
  children,
}: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );

  const form = useForm({
    initialValues: { ...defaultValues, ...action.action },
  });

  const { componentActions } = useActionData<ChangeLanguageAction>({
    actionId: action.id,
    editorTree,
    selectedComponentId,
  });

  const onSubmit = (updateValues: any) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<ChangeLanguageAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id: action.id,
        updateValues,
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
        {children && children({ form })}
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
          canAddSequential={action.action.name === "apiCall"}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
