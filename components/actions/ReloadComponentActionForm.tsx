import { ActionsForm } from "@/components/actions/ActionsForm";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, ReloadComponentAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect } from "react";

type FormValues = {
  componentId?: string;
  onMountActionId?: string;
};

type Props = {
  id: string;
};

export const ReloadComponentActionForm = ({ id }: Props) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const editorTree = useEditorStore((state) => state.tree);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo
  );
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions
  );

  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);
  const [copied, { open, close }] = useDisclosure(false);

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.actions ?? [];

  const action: Action = componentActions.find(
    (a: Action) => a.id === id
  ) as Action;

  const filteredComponentActions = componentActions.filter((a: Action) => {
    return a.id === action.id || a.sequentialTo === action.id;
  });

  const reloadAction = action.action as ReloadComponentAction;

  const form = useForm<FormValues>({
    initialValues: {
      componentId: reloadAction.componentId ?? "",
      onMountActionId: reloadAction.onMountActionId ?? "",
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
                componentId: values.componentId,
                onMountActionId: values.onMountActionId,
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

  const copyAction = () => {
    setCopiedAction(filteredComponentActions);
    open();
  };

  useEffect(() => {
    const timeout = setTimeout(() => copied && close(), 2000);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    if (pickingComponentToBindTo) {
      if (
        componentToBind &&
        pickingComponentToBindTo.componentId === component?.id
      ) {
        form.setFieldValue("componentId", componentToBind);
        const _componentToBind = getComponentById(
          editorTree.root,
          componentToBind
        );
        const onMountAction = _componentToBind?.actions?.find(
          (action) => action.trigger === "onMount"
        );

        form.setFieldValue("onMountActionId", onMountAction?.id);

        setPickingComponentToBindTo(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component?.id, componentToBind, pickingComponentToBindTo]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <TextInput
            size="xs"
            label="Component to reload"
            {...form.getInputProps("componentId")}
            rightSection={
              <ActionIcon
                onClick={() => {
                  setPickingComponentToBindTo({
                    componentId: component?.id!,
                    trigger: action.trigger,
                    bindedId: form.values.componentId ?? "",
                  });
                }}
              >
                <IconCurrentLocation size={ICON_SIZE} />
              </ActionIcon>
            }
            autoComplete="off"
          />
          <Button size="xs" type="submit">
            Save
          </Button>
          <Button
            size="xs"
            type="button"
            variant="light"
            color="pink"
            onClick={copyAction}
          >
            {copied ? "Copied" : "Copy"}
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
      <ActionsForm sequentialTo={action.id} />
    </>
  );
};
