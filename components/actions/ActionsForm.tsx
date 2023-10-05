import { useEditorStore } from "@/stores/editor";
import { Action, SequentialTrigger, actions } from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { getComponentById } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";

type ActionProps = {
  sequentialTo?: string;
  close?: () => void;
  open?: () => void;
};

export const ActionsForm = ({ sequentialTo, close }: ActionProps) => {
  const {
    selectedComponentId,
    tree: editorTree,
    updateTreeComponentActions,
    copiedAction,
    setCopiedAction,
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

    close && close();
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
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
          Add {isSequential ? `sequential action` : `action`}
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
