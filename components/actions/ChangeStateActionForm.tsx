import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useDataContext } from "@/contexts/DataProvider";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useEditorStore } from "@/stores/editor";
import { ChangeStateAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

type FormValues = Omit<ChangeStateAction, "name">;

export const ChangeStateActionForm = ({ id }: Props) => {
  const theme = useMantineTheme();

  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<ChangeStateAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const { getComponentsStates } = useComponentStates();

  const { computeValue } = useDataContext()!;

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const form = useForm<FormValues>({
    initialValues: {
      componentId: action.action?.componentId,
      state: action.action?.state,
    },
  });

  const pickedId = computeValue({ value: form.values.componentId });

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      updateActionInTree<ChangeStateAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          componentId: values.componentId,
          state: values.state,
        },
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
          componentId={component?.id}
          onPickComponent={() => {
            setPickingComponentToBindTo(undefined);
            setComponentToBind(undefined);
          }}
          {...form.getInputProps("componentId")}
        />

        <ComponentToBindFromSelect
          label="State"
          placeholder="Select State"
          nothingFound="Nothing found"
          searchable
          data={getComponentsStates([pickedId])}
          {...form.getInputProps("state")}
        />

        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
