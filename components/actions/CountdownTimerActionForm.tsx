import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { UnitInput } from "@/components/UnitInput";
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
import { findComponentProp } from "@/utils/findComponentProp";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

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

  const { componentActions, action } = useActionData<CountdownTimerAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      componentId: action.action?.componentId,
      selectedProp: action.action?.selectedProp,
      interval: action.action?.interval ?? "1seconds",
    },
  });

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
          onPickComponent={() => {
            setPickingComponentToBindTo(undefined);
            setComponentToBind(undefined);
          }}
          {...form.getInputProps(`componentId`)}
          onChange={(value) => {
            const selectedProp = findComponentProp(value.bindedId as string);
            form.setValues({
              componentId: value,
              selectedProp,
            });
          }}
        />
        <UnitInput
          {...form.getInputProps("interval")}
          options={[
            { label: "secs", value: "seconds" },
            { label: "mins", value: "minutes" },
          ]}
          disabledUnits={["%", "auto", "fit-content", "px", "rem", "vh", "vw"]}
          onChange={(value) => form.setFieldValue("interval", value)}
        />
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
