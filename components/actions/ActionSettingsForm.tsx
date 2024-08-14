import { Icon } from "@/components/Icon";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { ActionsForm } from "@/components/actions/ActionsForm";
import {
  updateActionInTree,
  useActionData,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Action, ChangeLanguageAction } from "@/utils/actions";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
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

  const form = useForm({
    initialValues: { ...defaultValues, ...action.action },
  });

  const { componentActions } = useActionData<ChangeLanguageAction>();

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout = "";
    if (form.isTouched() && form.isDirty()) {
      timeout = setTimeout(async () => {
        await onSubmit(form.values);
      }, 500);
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const onSubmit = async (updatedValues: any) => {
    const selectedComponentId = selectedComponentIdSelector(
      useEditorTreeStore.getState(),
    );

    try {
      await updateActionInTree<ChangeLanguageAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id: action.id,
        updatedValues,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing="xs">
      {children && children({ form })}
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
