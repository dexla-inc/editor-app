import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { CountdownTimerAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { ComponentToBindFromInput } from "../ComponentToBindFromInput";

type Props = {
  id: string;
};

type FormValues = Omit<CountdownTimerAction, "name">;

export const CountdownTimerActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const requiredProp =
    ["value", "name", "children"].find(
      (prop) => component?.props![prop] !== undefined,
    ) ?? "";

  const { componentActions, action } = useActionData<CountdownTimerAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      componentId: action.action?.componentId,
      selectedProp: action.action?.selectedProp,
      duration: action.action?.duration,
    },
  });

  console.log(form.values);

  useEffect(() => {
    if (form.isTouched("componentId")) {
      form.setFieldValue("selectedProp", requiredProp);
    }
  }, [form.values.componentId]);

  const onSubmit = (updateValues: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<CountdownTimerAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues,
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <ComponentToBindFromInput
          componentId={selectedComponentId}
          onPickComponent={(componentToBind: string) => {
            form.setFieldValue("componentId", componentToBind);

            setPickingComponentToBindTo(undefined);
            setComponentToBind(undefined);
          }}
          {...form.getInputProps(`componentId`)}
        />
        <TextInput
          label="Selected Prop"
          readOnly
          {...form.getInputProps("selectedProp")}
        />
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
