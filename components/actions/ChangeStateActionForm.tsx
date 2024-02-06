import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
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
import { ChangeStateAction, StateType } from "@/utils/actions";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { getComponentById } from "@/utils/editor";
import { Select, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { SegmentedControlInput } from "../SegmentedControlInput";

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

  const { components } = useDataContext()!;

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const form = useForm<FormValues>({
    initialValues: {
      componentId: action.action?.componentId,
      state: action.action?.state,
      type: action.action?.type ?? "component",
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
          componentId: values.componentId,
          state: values.state,
          type: values.type,
        },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  // const onChange = (val: string | null, key: string, i: number) => {
  //   const newValue = cloneDeep(form.values.conditionRules) as any;
  //   newValue[i][key] = val;
  //   form.setFieldValue("conditionRules", newValue);
  // };

  // Change State, choose component to change
  // Use case: Change the state of any component when I perform an action like clicking on a button
  // Use case: Bind a variable to state of a component from any value such as query string, variable etc
  // Component, State (Bindable)

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <SegmentedControlInput
          label="Type"
          data={[
            {
              label: "Component",
              value: "component",
            },
            {
              label: "Bindable",
              value: "bindable",
            },
          ]}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as StateType);
          }}
        />
        {form.values.type === "component" ? (
          <Select
            label="Component"
            searchable
            data={Object.entries(components.list).map(([value, label]) => ({
              value,
              label: label.name,
            }))}
          />
        ) : (
          <ComponentToBindFromInput
            componentId={component?.id}
            onPickComponent={() => {
              setPickingComponentToBindTo(undefined);
              setComponentToBind(undefined);
            }}
            {...form.getInputProps("componentId")}
          />
        )}

        <Select
          size="xs"
          label="State"
          //onChange={(val) => onChange(val, "state", i)}
          data={getComponentsStates()}
          placeholder="Select State"
          nothingFound="Nothing found"
          searchable
          //value={state}
          styles={{ label: { width: "100%" } }}
          {...AUTOCOMPLETE_OFF_PROPS}
        />

        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
