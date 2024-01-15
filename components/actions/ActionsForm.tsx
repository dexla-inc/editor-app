import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { Action, SequentialTrigger, actions } from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";
import { useEffect, useMemo } from "react";

type ActionProps = {
  sequentialTo?: string;
  close?: () => void;
};

export const ActionsForm = ({ sequentialTo, close }: ActionProps) => {
  const selectedComponentId = useEditorStore.getState().selectedComponentId;
  const editorTree = useEditorStore.getState().tree;
  const updateTreeComponentActions =
    useEditorStore.getState().updateTreeComponentActions;
  const copiedAction = useEditorStore.getState().copiedAction;
  const setCopiedAction = useEditorStore.getState().setCopiedAction;
  const setSequentialTo = useEditorStore.getState().setSequentialTo;
  const openAction = useEditorStore.getState().openAction;
  const setOpenAction = useEditorStore.getState().setOpenAction;

  const form = useForm({
    initialValues: {
      trigger: "",
      action: "",
    },
  });

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.actions ?? [];

  const isCopiedAction = !!copiedAction && !!copiedAction.length;

  const componentName = component?.name;
  const isSequential = !!sequentialTo;
  const availableTriggers = useMemo(() => {
    if (!componentName) return [];

    const ComponentDefinition = componentMapper[componentName];
    const triggers = isSequential
      ? ComponentDefinition.sequentialTriggers
      : ComponentDefinition.actionTriggers;

    return triggers.filter(
      (t) =>
        !(component?.actions ?? []).find((a: Action) =>
          isSequential
            ? (a.trigger as SequentialTrigger) === t &&
              a.sequentialTo === sequentialTo
            : a.trigger === t,
        ),
    );
  }, [componentName, isSequential, sequentialTo]);

  useEffect(() => {
    if (availableTriggers.length > 0) {
      form.setFieldValue("trigger", availableTriggers[0]);
    }
  }, [availableTriggers, form]);

  const pasteAction = (copiedAction: Action[]) => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.concat(copiedAction),
    );
    setCopiedAction(undefined);
  };

  const handleClose = () => {
    isSequential ? setSequentialTo(undefined) : close && close();
  };

  const onSubmit = (values: any) => {
    const id = nanoid();
    const isAllowedInOpenAction =
      openAction?.componentId === selectedComponentId &&
      openAction?.actionIds &&
      sequentialTo &&
      openAction?.actionIds.includes(sequentialTo ?? "");
    updateTreeComponentActions(
      selectedComponentId!,
      (component?.actions ?? []).concat({
        id,
        sequentialTo: sequentialTo,
        trigger: values.trigger,
        action: {
          name: values.action,
        },
      }),
    );
    const actionIds = isAllowedInOpenAction
      ? [...(openAction?.actionIds ?? []), `seq_${id}`]
      : [id];
    setOpenAction({ actionIds, componentId: selectedComponentId });
    isSequential ? setSequentialTo(undefined) : close && close();
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs" sx={{ position: "relative" }}>
        <ActionIcon
          onClick={handleClose}
          color="gray"
          variant="light"
          radius="xl"
          size="sm"
          sx={{ position: "absolute", top: "-5px", right: "0px", zIndex: 30 }}
        >
          <Icon name="IconX" size={ICON_SIZE} />
        </ActionIcon>
        <Select
          size="xs"
          placeholder="Select a trigger"
          label="Trigger"
          data={availableTriggers?.map((trigger) => {
            return {
              label: startCase(trigger),
              value: trigger,
            };
          })}
          {...form.getInputProps("trigger")}
        />
        <Select
          size="xs"
          placeholder="Select an action"
          label="Action"
          searchable
          nothingFound="No actions found"
          data={actions.map((action) => {
            return {
              label: startCase(action.name),
              value: action.name,
              group: action.group,
            };
          })}
          {...form.getInputProps("action")}
        />
        <Button size="xs" type="submit" mt="xs" variant="light">
          Save {isSequential ? `sequential action` : `action`}
        </Button>
        {isCopiedAction &&
          componentActions.every((action) =>
            copiedAction.every((a) => a.id !== action.id),
          ) && (
            <Button
              size="xs"
              type="button"
              variant="light"
              color="pink"
              onClick={() => pasteAction(copiedAction)}
            >
              Paste Action
            </Button>
          )}
      </Stack>
    </form>
  );
};
