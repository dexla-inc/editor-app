import { useForm } from "@mantine/form";
import { Action, ChangeLanguageAction } from "@/utils/actions";
import {
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { Stack } from "@mantine/core";
import { useEffect } from "react";

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

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout = "";
    if (form.isTouched() && form.isDirty()) {
      timeout = setTimeout(() => onSubmit(form.values), 200);
    }

    return () => clearTimeout(timeout);
  }, [form.values]);

  const onSubmit = (updateValues: any) => {
    try {
      updateActionInTree<ChangeLanguageAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id: action.id,
        updateValues,
        updateTreeComponentActions,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing="xs">
      {children && children({ form })}
      <ActionButtons
        actionId={action.id}
        componentActions={componentActions}
        canAddSequential={action.action.name === "apiCall"}
      ></ActionButtons>
    </Stack>
  );
};
