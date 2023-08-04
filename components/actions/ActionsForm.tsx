import { useEditorStore } from "@/stores/editor";
import { Action, SequentialTrigger, actions } from "@/utils/actions";
import { componentMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { Box, Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowDown } from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";
import { useState } from "react";

type Props = {
  sequentialTo?: string;
  hasAction?: boolean;
};

export const ActionsForm = ({ sequentialTo, hasAction }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleNewActionButtonClick = () => {
    setIsFormVisible(!isFormVisible);
    form.reset();
  };

  const handleSequentialActionButtonClick = () => {
    setIsFormVisible(true);
    form.reset();
  };

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
    setIsFormVisible(false);
  };

  return (
    <Box my={isSequential ? "md" : undefined}>
      {isSequential && (
        <>
          <Button
            size="xs"
            my="xs"
            fullWidth
            onClick={handleSequentialActionButtonClick}
            color="indigo"
            variant="light"
            leftIcon={<IconArrowDown size={ICON_SIZE} />}
            rightIcon={<IconArrowDown size={ICON_SIZE} />}
          >
            Add new sequential action
          </Button>
        </>
      )}

      {!isFormVisible && !isSequential && (
        <Button
          size="xs"
          onClick={handleNewActionButtonClick}
          mt="xs"
          fullWidth
          color="indigo"
          variant="filled"
        >
          Add new action
        </Button>
      )}

      {isFormVisible && (
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

            <Button size="xs" type="submit" mt="xs">
              Create {isSequential ? `sequential action` : `action`}
            </Button>
            <Button
              size="xs"
              onClick={handleNewActionButtonClick}
              variant="default"
              mt="xs"
            >
              Cancel
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
};
