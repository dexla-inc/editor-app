import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  Action,
  ActionTrigger,
  ActionType,
  SequentialTrigger,
  actions,
} from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
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
  const selectedComponentId = useEditorTreeStore
    .getState()
    .selectedComponentIds?.at(-1);
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;
  const copiedAction = useEditorStore.getState().copiedAction;
  const setCopiedAction = useEditorStore.getState().setCopiedAction;
  const setSequentialTo = useEditorStore.getState().setSequentialTo;
  const openAction = useEditorStore.getState().openAction;
  const setOpenAction = useEditorStore.getState().setOpenAction;

  const form = useForm({
    initialValues: {
      trigger: "onClick" as ActionTrigger,
      action: "",
    },
  });

  const component = useEditorTreeStore(
    (state) => state.componentMutableAttrs[selectedComponentId!],
  );
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
  }, [componentName, isSequential, component?.actions, sequentialTo]);

  useEffect(() => {
    if (availableTriggers.length > 0) {
      form.setFieldValue("trigger", availableTriggers[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTriggers]);

  const pasteAction = (copiedAction: Action[]) => {
    updateTreeComponentAttrs({
      componentIds: [selectedComponentId!],
      attrs: { actions: componentActions.concat(copiedAction) },
    });
    setCopiedAction(undefined);
  };

  const handleClose = () => {
    isSequential ? setSequentialTo(undefined) : close && close();
  };

  const saveAction = (trigger: ActionTrigger, action: string) => {
    const id = nanoid();

    updateTreeComponentAttrs({
      componentIds: [selectedComponentId!],
      attrs: {
        actions: [
          ...(component?.actions ?? []),
          {
            id,
            sequentialTo: sequentialTo,
            trigger: trigger as ActionTrigger,
            action: {
              name: action as any,
            } as ActionType,
          },
        ],
      },
    });
    handleOpenAction(id);
    form.reset();
  };

  const handleOpenAction = (id: string) => {
    const isAllowedInOpenAction =
      openAction?.componentId === selectedComponentId &&
      openAction?.actionIds &&
      sequentialTo &&
      openAction?.actionIds.includes(sequentialTo ?? "");
    const actionIds = isAllowedInOpenAction
      ? [...(openAction?.actionIds ?? []), `seq_${id}`]
      : [id];
    setOpenAction({ actionIds, componentId: selectedComponentId });
    handleClose();
  };

  return (
    // TODO: Remove form and make it controlled instead
    <form>
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
          onChange={(value) => {
            form.setFieldValue("trigger", value as ActionTrigger);
          }}
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
          onChange={(value) => {
            saveAction(form.values.trigger, value as string);
          }}
        />
        {isCopiedAction &&
          componentActions.every((action: any) =>
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
