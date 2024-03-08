import { Icon } from "@/components/Icon";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { ActionsForm } from "@/components/actions/ActionsForm";
import {
  updateActionInTree,
  useActionData,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Action, ChangeLanguageAction } from "@/utils/actions";
import { Button, Divider, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
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
  const [addSequentialForm, { open: openSequential, close: closeSequential }] =
    useDisclosure(false);

  const editorTree = useEditorTreeStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentIds?.at(-1),
  );
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  console.log("ActionSettingsForm");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const onSubmit = (updateValues: any) => {
    try {
      updateActionInTree<ChangeLanguageAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id: action.id,
        updateValues,
        updateTreeComponentAttrs,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing="xs">
      {children && children({ form })}
      {action.action.name === "apiCall" && (
        <Button
          size="xs"
          type="button"
          onClick={openSequential}
          variant="light"
          mt="xs"
          leftIcon={<Icon name="IconPlus"></Icon>}
        >
          Add Sequential Action
        </Button>
      )}
      {addSequentialForm && (
        <>
          <Divider my="lg" label="Sequential Action" labelPosition="center" />
          <ActionsForm close={closeSequential} sequentialTo={action.id} />
        </>
      )}
      <ActionButtons
        actionId={action.id}
        componentActions={componentActions}
      ></ActionButtons>
    </Stack>
  );
};
