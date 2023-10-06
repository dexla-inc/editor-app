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
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect } from "react";
import { VariablePicker } from "@/components/VariablePicker";

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
        <TextInput
          size="xs"
          label="Component to bind"
          {...form.getInputProps(`component`)}
          rightSection={
            <ActionIcon
              onClick={() => {
                setPickingComponentToBindTo({
                  componentId: component?.id!,
                  trigger: action.trigger,
                  bindedId: action.action.component ?? "",
                });
              }}
            >
              <IconCurrentLocation size={ICON_SIZE} />
            </ActionIcon>
          }
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
