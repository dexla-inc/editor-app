import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ActionButtons } from "@/components/actions/ActionButtons";
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
import { ReloadComponentAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Divider, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
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

  const {
    setPickingComponentToBindTo,
    sequentialTo,
    componentToBind,
    setComponentToBind,
    pickingComponentToBindTo,
  } = useEditorStore();

  const component = getComponentById(editorTree.root, selectedComponentId!);

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

  useEffect(() => {
    if (pickingComponentToBindTo) {
      if (
        componentToBind &&
        pickingComponentToBindTo.componentId === component?.id
      ) {
        form.setFieldValue("componentId", componentToBind);
        const _componentToBind = getComponentById(
          editorTree.root,
          componentToBind,
        );
        const onMountAction = _componentToBind?.actions?.find(
          (action) => action.trigger === "onMount",
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
          <ComponentToBindFromInput
            key={form.values.componentId}
            onPickComponent={(componentToBind: string) => {
              form.setValues({ ...form.values, componentId: componentToBind });
              setComponentToBind(undefined);
            }}
            onPickVariable={(variable: string) => {
              form.setValues({
                ...form.values,
                componentId: variable,
              });
            }}
            bindAttributes={{
              componentId: component?.id!,
              trigger: action.trigger,
              bindedId: form.values.componentId ?? "",
            }}
            size="xs"
            label="Component to reload"
            {...form.getInputProps("componentId")}
            // @ts-ignore
            value={componentToBind}
            onChange={(e) => {
              form.setValues({
                ...form.values,
                componentId: e.currentTarget.value,
              });
            }}
          />
          <ActionButtons
            actionId={action.id}
            componentActions={componentActions}
            canAddSequential={true}
          ></ActionButtons>
        </Stack>
      </form>
      {sequentialTo === id && (
        <>
          <Divider my="lg" label="Sequential Action" labelPosition="center" />
          <ActionsForm sequentialTo={sequentialTo} />
        </>
      )}
    </>
  );
};
