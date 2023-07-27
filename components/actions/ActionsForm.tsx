import { useEditorStore } from "@/stores/editor";
import { Action, actions } from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { getComponentById } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import startCase from "lodash.startcase";

type Props = {
  isSequential?: boolean;
};

export const ActionsForm = ({ isSequential }: Props) => {
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

  const ComponentDefinition = componentMapper[componentName];
  const availableTriggers = isSequential
    ? ComponentDefinition.sequentialTriggers.filter(
        (t) =>
          !(component?.props?.actions ?? []).find(
            (a: Action) => a.sequentialTrigger
          )
      )
    : ComponentDefinition.actionTriggers.filter(
        (t) => !(component?.props?.actions ?? []).find((a: Action) => a.trigger)
      );

  const onSubmit = (values: any) => {
    updateTreeComponent(selectedComponentId!, {
      actions: (component?.props?.actions ?? []).concat({
        trigger: values.trigger,
        action: {
          name: values.action,
        },
      }),
    });
  };
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs" px="md">
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
        <Button size="xs" type="submit" mt="xs">
          Add action
        </Button>
      </Stack>
    </form>
  );
};
