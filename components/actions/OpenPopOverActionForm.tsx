import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, OpenPopOverAction } from "@/utils/actions";
import { Component, getAllPopOvers, getComponentById } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

export const OpenPopOverActionForm = ({ id }: Props) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.props?.actions ?? [];
  const action: Action = componentActions.find((a: Action) => a.id === id);
  const openPopOverAction = action.action as OpenPopOverAction;

  const form = useForm({
    initialValues: {
      popOverId: openPopOverAction.popOverId,
    },
  });

  const onSubmit = (values: any) => {
    try {
      startLoading({
        id: "saving-action",
        title: "Saving Action",
        message: "Wait while we save your changes",
      });

      updateTreeComponent(selectedComponentId!, {
        actions: componentActions.map((action: Action) => {
          if (action.id === id) {
            return {
              ...action,
              action: {
                ...action.action,
                popOverId: values.popOverId,
              },
            };
          }

          return action;
        }),
      });

      stopLoading({
        id: "saving-action",
        title: "Action Saved",
        message: "Your changes were saved successfully",
      });
    } catch (error) {
      stopLoading({
        id: "saving-action",
        title: "Failed",
        message: "Oops, something went wrong while saving your changes",
        isError: true,
      });
    }
  };

  const removeAction = () => {
    updateTreeComponent(selectedComponentId!, {
      actions: componentActions.filter((a: Action) => {
        return a.id !== action.id;
      }),
    });
  };

  const popOvers = getAllPopOvers(editorTree.root);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Select
          size="xs"
          label="PopOver to Open"
          placeholder="Select a popOver"
          data={popOvers.map((popOver: Component) => {
            return {
              label: popOver.props?.title ?? popOver.id,
              value: popOver.id!,
            };
          })}
          {...form.getInputProps("popOverId")}
        />
        <Button size="xs" type="submit" mt="xs">
          Save
        </Button>
        <Button
          size="xs"
          type="button"
          variant="default"
          onClick={removeAction}
        >
          Remove
        </Button>
      </Stack>
    </form>
  );
};
