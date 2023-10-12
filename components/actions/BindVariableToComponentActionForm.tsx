import { ComponentToBindInput } from "@/components/ComponentToBindInput";
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
import { getComponentById } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

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
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);

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

  useEffect(() => {
    if (componentToBind && pickingComponentToBindTo) {
      if (pickingComponentToBindTo.componentId === component?.id) {
        form.setValues({
          component: componentToBind,
        });

        setPickingComponentToBindTo(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component?.id, componentToBind, pickingComponentToBindTo]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <ComponentToBindInput
          onPick={(componentToBind: string) => {
            form.setFieldValue("component", componentToBind);

            setPickingComponentToBindTo(undefined);
            setComponentToBind(undefined);
          }}
          bindAttributes={{
            trigger: action.trigger,
            componentId: component?.id!,
            bindedId: action.action.component ?? "",
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
