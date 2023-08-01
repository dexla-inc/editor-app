import { useEditorStore } from "@/stores/editor";
import { Action, SequentialTrigger, actions } from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { getComponentById } from "@/utils/editor";
import { Box, Button, Divider, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";

type Props = {
  sequentialTo?: string;
};

export const ActionsForm = ({ sequentialTo }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const form = useForm({
    initialValues: {
      trigger: "",
      action: "",
    },
  });

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentName = component?.name;

  if (!componentName) return null;

  const isSequential = !!sequentialTo;

  const ComponentDefinition = componentMapper[componentName];
  const availableTriggers = isSequential
    ? ComponentDefinition.sequentialTriggers.filter(
        (t) =>
          !(component?.props?.actions ?? []).find(
            (a: Action) =>
              (a.trigger as SequentialTrigger) === t &&
              a.sequentialTo === sequentialTo
          )
      )
    : ComponentDefinition.actionTriggers.filter(
        (t) =>
          !(component?.props?.actions ?? []).find(
            (a: Action) => a.trigger === t
          )
      );

  const onSubmit = (values: any) => {
    updateTreeComponent(selectedComponentId!, {
      actions: (component?.props?.actions ?? []).concat({
        id: nanoid(),
        sequentialTo: sequentialTo,
        trigger: values.trigger,
        action: {
          name: values.action,
        },
      }),
    });

    form.reset();
  };

  return (
    <Box my={isSequential ? "md" : undefined}>
      {isSequential && (
        <Divider labelPosition="center" label="Sequential Actions" />
      )}
      <form
        name={isSequential ? sequentialTo : "actions"}
        onSubmit={form.onSubmit(onSubmit)}
      >
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
                label: startCase(action),
                value: action,
              };
            })}
            {...form.getInputProps("action")}
          />
          <Button size="xs" type="submit" mt="xs" variant="light">
            Add {isSequential ? `sequential action` : `action`}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
