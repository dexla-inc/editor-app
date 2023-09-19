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
import { ChangeStateAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ComponentToBindInput } from "@/components/ComponentToBindInput";

type Props = {
  id: string;
};

type FormValues = Omit<ChangeStateAction, "name">;

export const ChangeStateActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
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

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const form = useForm<FormValues>({
    initialValues: {
      componentId: action.action.componentId,
      state: action.action.state,
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      updateActionInTree<ChangeStateAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          componentId: values.componentId ?? "",
          state: values.state ?? "default",
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
        <ComponentToBindInput
          {...form.getInputProps("componentId")}
          componentId={component?.id}
          onPick={(componentToBind: string) => {
            form.setFieldValue("componentId", componentToBind);

            setPickingComponentToBindTo(undefined);
            setComponentToBind(undefined);
          }}
        />
        <Select
          size="xs"
          label="State"
          data={[
            { label: "Default", value: "default" },
            { label: "Hover", value: "hover" },
            { label: "Disabled", value: "disabled" },
            { label: "Checked", value: "checked" },
            ...Object.keys(
              form.values.componentId
                ? getComponentById(editorTree.root, form.values.componentId!)
                    ?.states ?? {}
                : {},
            ).reduce((acc, key) => {
              if (key === "hover" || key === "disabled" || key === "checked")
                return acc;

              return acc.concat({
                label: key,
                value: key,
              });
            }, [] as any[]),
          ]}
          placeholder="Select State"
          nothingFound="Nothing found"
          searchable
          {...form.getInputProps("state")}
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
