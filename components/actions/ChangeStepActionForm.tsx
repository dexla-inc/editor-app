import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { ChangeStepAction } from "@/utils/actions";
import {
  Component,
  getAllComponentsByName,
  getComponentById,
} from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEditorStore } from "@/stores/editor";
import { useEffect } from "react";

type Props = {
  id: string;
};

type FormValues = Omit<ChangeStepAction, "name">;

const controls = [
  { label: "Previous", value: "previous" },
  { label: "Next", value: "next" },
];

export const ChangeStepActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<ChangeStepAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      stepperId: action.action.stepperId,
      control: action.action.control ?? "next",
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<ChangeStepAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          stepperId: values.stepperId,
          control: values.control,
        },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const steppers = getAllComponentsByName(editorTree.root, "Stepper");

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Select
          required
          size="xs"
          label="Stepper to change step"
          placeholder="Select a stepper"
          data={steppers.map((stepper: Component) => {
            return {
              label: stepper.description ?? stepper.id,
              value: stepper.id!,
            };
          })}
          {...form.getInputProps("stepperId")}
        />
        <Select
          required
          size="xs"
          label="Control"
          placeholder="Select a control"
          data={controls.map((control) => {
            return {
              label: control.label,
              value: control.value,
            };
          })}
          {...form.getInputProps("control")}
        />
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
