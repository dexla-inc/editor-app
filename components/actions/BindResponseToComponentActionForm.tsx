import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, BindResponseToComponentAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { IconCurrentLocation } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { useRouter } from "next/router";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";

type Props = {
  id: string;
};

export const BindResponseToComponentActionForm = ({ id }: Props) => {
  const router = useRouter();
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo
  );
  const editorTree = useEditorStore((state) => state.tree);
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const projectId = router.query.id as string;
  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.props?.actions ?? [];
  const action: Action = componentActions.find((a: Action) => a.id === id);
  const bindResponseToComponent =
    action.action as BindResponseToComponentAction;

  const originalAction = componentActions.find(
    (a: Action) => a.id === action.sequentialTo
  );

  const form = useForm({
    initialValues: {
      componentToBind: bindResponseToComponent.componentToBind,
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
                componentToBind: values.componentToBind,
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

  useEffect(() => {
    if (componentToBind && pickingComponentToBindTo) {
      const pickingData = pickingComponentToBindTo.split("++");
      if (pickingData[0] === component?.id) {
        form.setFieldValue(`componentToBind`, componentToBind);

        setPickingComponentToBindTo(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component?.id, componentToBind, pickingComponentToBindTo]);

  useEffect(() => {
    const getEndpoint = async () => {
      const { results } = await getDataSourceEndpoints(
        projectId,
        originalAction.action.datasource.id
      );

      const endpoint = results.find(
        (e) => e.id === originalAction.action.endpoint
      );
      console.log({ action, originalAction, endpoint });
    };

    getEndpoint();
  }, [action, originalAction, projectId]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <TextInput
          size="xs"
          label="Component to bind"
          {...form.getInputProps(`componentToBind`)}
          rightSection={
            <ActionIcon
              onClick={() => {
                setPickingComponentToBindTo(
                  `${component!.id}++${action.trigger}++componentToBind++${
                    bindResponseToComponent?.componentToBind ?? ""
                  }`
                );
              }}
            >
              <IconCurrentLocation size={ICON_SIZE} />
            </ActionIcon>
          }
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
