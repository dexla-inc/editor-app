import { VariablePicker } from "@/components/VariablePicker";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { BindVariableToComponentAction } from "@/utils/actions";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";

type Props = {
  id: string;
};

type FormValues = Omit<BindVariableToComponentAction, "name">;

export const BindVariableToComponentActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } =
    useActionData<BindVariableToComponentAction>({
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

  const form = useForm<FormValues>({
    initialValues: {
      component: action.action.component,
      variable: action.action.variable,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<BindVariableToComponentAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: values,
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
            form.setFieldValue("component", componentToBind);

            setPickingComponentToBindTo(undefined);
            setComponentToBind(undefined);
          }}
          {...form.getInputProps("component")}
        />

        <TextInput
          size="xs"
          placeholder="Select a variable"
          label="Variable"
          {...form.getInputProps("variable")}
          rightSection={
            <VariablePicker
              onSelectValue={(selected) => {
                form.setFieldValue("variable", selected);
              }}
            />
          }
        />

        <ActionButtons actionId={id} componentActions={componentActions} />
      </Stack>
    </form>
  );
};
