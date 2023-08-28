import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, OpenDrawerAction } from "@/utils/actions";
import { Component, getAllDrawers, getComponentById } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

export const OpenDrawerActionForm = ({ id }: Props) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.actions ?? [];
  const action: Action = componentActions.find(
    (a: Action) => a.id === id
  ) as Action;
  const openDrawerAction = action.action as OpenDrawerAction;

  const form = useForm({
    initialValues: {
      drawerId: openDrawerAction.drawerId,
    },
  });

  const onSubmit = (values: any) => {
    try {
      startLoading({
        id: "saving-action",
        title: "Saving Action",
        message: "Wait while we save your changes",
      });

      updateTreeComponentActions(
        selectedComponentId!,
        componentActions.map((action: Action) => {
          if (action.id === id) {
            return {
              ...action,
              action: {
                ...action.action,
                drawerId: values.drawerId,
              },
            };
          }

          return action;
        })
      );

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
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== action.id;
      })
    );
  };

  const drawers = getAllDrawers(editorTree.root);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Select
          size="xs"
          label="Drawer to Open"
          placeholder="Select a drawer"
          data={drawers.map((drawer: Component) => {
            return {
              label: drawer.props?.title ?? drawer.id,
              value: drawer.id!,
            };
          })}
          {...form.getInputProps("drawerId")}
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
