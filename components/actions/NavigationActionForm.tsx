import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, NavigationAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

export const NavigationActionForm = ({ id }: Props) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions
  );
  const pages = useEditorStore((state) => state.pages);

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.actions ?? [];
  const action: Action = componentActions.find(
    (a: Action) => a.id === id
  ) as Action;
  const navigationAction = action.action as NavigationAction;

  const form = useForm({
    initialValues: {
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

      updateTreeComponentActions(
        selectedComponentId!,
        componentActions.map((action: Action) => {
          if (action.id === id) {
            return {
              ...action,
              action: {
                ...action.action,
                pageId: values.pageId,
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
        return a.id !== action.id && a.sequentialTo !== action.id;
      })
    );
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Select
          size="xs"
          placeholder="Select a page"
          label="Page"
          searchable
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
          color="red"
        >
          Remove
        </Button>
      </Stack>
    </form>
  );
};
