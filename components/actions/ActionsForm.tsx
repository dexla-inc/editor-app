import { useEditorStore } from "@/stores/editor";
import { Action, SequentialTrigger, actions } from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";
import { Icon } from "../Icon";

type ActionProps = {
  sequentialTo?: string;
  close?: () => void;
};

export const ActionsForm = ({ sequentialTo, close }: ActionProps) => {
  const {
    selectedComponentId,
    tree: editorTree,
    updateTreeComponentActions,
    copiedAction,
    setCopiedAction,
    setSequentialTo,
  } = useEditorStore.getState();

  const form = useForm({
    initialValues: {
      trigger: "",
      action: "",
    },
  });

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentName = component?.name;
  const componentActions = component?.actions ?? [];

  const isSequential = !!sequentialTo;
  const isCopiedAction = !!copiedAction && !!copiedAction.length;

  if (!componentName) return null;

  const ComponentDefinition = componentMapper[componentName];
  const availableTriggers = isSequential
    ? ComponentDefinition.sequentialTriggers.filter(
        (t) =>
          !(component?.actions ?? []).find(
            (a: Action) =>
              (a.trigger as SequentialTrigger) === t &&
              a.sequentialTo === sequentialTo,
          ),
      )
    : ComponentDefinition.actionTriggers.filter(
        (t) => !(component?.actions ?? []).find((a: Action) => a.trigger === t),
      );

  const pasteAction = (copiedAction: Action[]) => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.concat(copiedAction),
    );
    setCopiedAction(undefined);
  };

  const handleClose = () => {
    close && close();
    setSequentialTo(undefined);
  };

  const onSubmit = (values: any) => {
    updateTreeComponentActions(
      selectedComponentId!,
      (component?.actions ?? []).concat({
        id: nanoid(),
        sequentialTo: sequentialTo,
        trigger: values.trigger,
        action: {
          name: values.action,
        },
      }),
    );
    setSequentialTo(undefined);
    close && close();
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
