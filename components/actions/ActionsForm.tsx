import { useEditorStore } from "@/stores/editor";
import { Action, actions } from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { getComponentById } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import startCase from "lodash.startcase";

export const ActionsForm = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const actionTriggers = componentMapper[component!.name].actionTriggers;

  const form = useForm({
    initialValues: {
      trigger: "",
      action: "",
    },
  });

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

  const availableTriggers = actionTriggers.filter(
    (t) =>
      !(component?.props?.actions ?? []).find((a: Action) => a.trigger === t)
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs" px="md">
        <Select
          size="xs"
          placeholder="Select a trigger"
          label="Trigger"
          data={availableTriggers.map((trigger) => {
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
