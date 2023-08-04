import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, GoToUrlAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Button, Checkbox, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

export const GoToUrlForm = ({ id }: Props) => {
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
  const goToUrlAction = action.action as GoToUrlAction;

  const form = useForm({
    initialValues: {
      url: goToUrlAction.url,
      openInNewTab: goToUrlAction.openInNewTab,
    },
  });

  const onSubmit = (values: any) => {
    startLoading({
      id: "saving-action",
      title: "Saving Action",
      message: "Wait while we save your changes",
    });

    try {
      updateTreeComponent(selectedComponentId!, {
        actions: componentActions.map((action: Action) => {
          if (action.id === id) {
            return {
              ...action,
              action: {
                ...action.action,
                url: values.url,
                openInNewTab: values.openInNewTab,
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

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          size="xs"
          placeholder="Enter a URL"
          label="URL"
          {...form.getInputProps("url")}
        ></TextInput>
        <Checkbox
          label="Open in new tab"
          {...form.getInputProps("openInNewTab")}
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
