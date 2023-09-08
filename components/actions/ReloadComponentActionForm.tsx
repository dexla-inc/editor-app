import { ActionsForm } from "@/components/actions/ActionsForm";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { Action, ReloadComponentAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect } from "react";

type FormValues = Omit<ReloadComponentAction, "name">;

type Props = {
  id: string;
};

export const ReloadComponentActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<ReloadComponentAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo
  );
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );

  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);
  const [copied, { open, close }] = useDisclosure(false);

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo
  );

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

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<ReloadComponentAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          componentId: values.componentId,
          onMountActionId: values.onMountActionId,
        },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
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
