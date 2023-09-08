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
import { TogglePropsAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect } from "react";

type Props = {
  id: string;
};

type FormValues = Omit<TogglePropsAction, "name">;

export const PreviousStepActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<TogglePropsAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo
  );
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const form = useForm<FormValues>({
    initialValues: {
      componentId: action.action.componentId,
      state: action.action.state,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<TogglePropsAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          componentId: values.componentId ?? "",
          state: values.state ?? "hidden",
        },
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
        form.setFieldValue("componentId", componentToBind);

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
          key={form.values.componentId}
          size="xs"
          label="Component to bind"
          {...form.getInputProps("componentId")}
          rightSection={
            <ActionIcon
              onClick={() => {
                setPickingComponentToBindTo({
                  componentId: component?.id!,
                  trigger: action.trigger,
                  bindedId: action.action.componentId ?? "",
                });
              }}
            >
              <IconCurrentLocation size={ICON_SIZE} />
            </ActionIcon>
          }
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
