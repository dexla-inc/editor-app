import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, NavigationAction, actions } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import startCase from "lodash.startcase";

export const NavigationActionForm = () => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const pages = useEditorStore((state) => state.pages);

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.props?.actions ?? [];
  const action: Action = componentActions.find(
    (a: Action) => a.action.name === "navigation"
  );
  const navigationAction = action.action as NavigationAction;

  const form = useForm({
    initialValues: {
      action: navigationAction.name,
      pageId: navigationAction.pageId,
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
          if (action.action.name === "navigation") {
            return {
              ...action,
              action: {
                ...action.action,
                pageId: values.pageId,
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
      actions: componentActions.filter((action: Action) => {
        return action.action.name !== "navigation";
      }),
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
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
        <Select
          size="xs"
          placeholder="Select a page"
          label="Page"
          data={pages.map((page) => {
            return {
              label: page.title,
              value: page.id,
            };
          })}
          {...form.getInputProps("pageId")}
        />
        <Button size="xs" type="submit">
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
