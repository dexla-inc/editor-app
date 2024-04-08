import { ActionButtons } from "@/components/actions/ActionButtons";
import { ActionsForm } from "@/components/actions/ActionsForm";
import {
  updateActionInTree,
  useActionData,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useFlowStore } from "@/stores/flow";
import { Action, ChangeLanguageAction } from "@/utils/actions";
import { Card, Divider, Flex, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { ActionIconDefault } from "../ActionIconDefault";
import { LogicFlowFormModal } from "../logic-flow/LogicFlowFormModal";
import { encodeSchema } from "@/utils/compression";

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
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);

  const form = useForm({
    initialValues: { ...defaultValues, ...action.action },
  });

  const { componentActions } = useActionData<ChangeLanguageAction>();

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout = "";
    if (form.isTouched() && form.isDirty()) {
      timeout = setTimeout(async () => {
        await onSubmit(form.values);
      }, 200);
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const onSubmit = async (updatedValues: any) => {
    const selectedComponentId = useEditorTreeStore
      .getState()
      .selectedComponentIds?.at(-1);

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

  const convertToLogicFlow = async () => {
    // Open Logic Flow Modal to create then pass in encoded componentActions
    // Then delete the current action on a successful save
    setShowFormModal(true);
  };

  return (
    <Stack spacing="xs">
      {children && children({ form })}
      <Card p="xs">
        <Text size="xs" color="dimmed" pb="xs">
          Actions
        </Text>
        <Flex gap="xs">
          {action.action.name === "apiCall" && (
            <ActionIconDefault
              onClick={openSequential}
              iconName="IconPlus"
              tooltip="Add Sequential Action"
            />
          )}
          {addSequentialForm && (
            <>
              <Divider
                my="lg"
                label="Sequential Action"
                labelPosition="center"
              />
              <ActionsForm close={closeSequential} sequentialTo={action.id} />
            </>
          )}
          <ActionButtons
            actionId={action.id}
            componentActions={componentActions}
          ></ActionButtons>
          {!addSequentialForm && (
            <>
              <ActionIconDefault
                onClick={convertToLogicFlow}
                iconName="IconGitBranch"
                tooltip="Convert to Logic Flow"
              />
              <LogicFlowFormModal
                data={encodeSchema(JSON.stringify(componentActions))}
              />
            </>
          )}
        </Flex>
      </Card>
    </Stack>
  );
};
