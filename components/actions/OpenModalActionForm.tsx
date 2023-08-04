import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, OpenModalAction } from "@/utils/actions";
import { Component, getAllModals, getComponentById } from "@/utils/editor";
import { Button, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

export const OpenModalActionForm = ({ id }: Props) => {
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
  const openModalAction = action.action as OpenModalAction;

  const form = useForm({
    initialValues: {
      modalId: openModalAction.modalId,
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
                modalId: values.modalId,
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

  const modals = getAllModals(editorTree.root);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Select
          size="xs"
          label="Modal to Open"
          placeholder="Select a modal"
          data={modals.map((modal: Component) => {
            return {
              label: modal.props?.title ?? modal.id,
              value: modal.id!,
            };
          })}
          {...form.getInputProps("modalId")}
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
