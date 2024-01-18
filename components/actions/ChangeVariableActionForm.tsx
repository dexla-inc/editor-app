import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { useEditorStore } from "@/stores/editor";
import { ChangeVariableAction } from "@/utils/actions";
import { debouncedTreeUpdate } from "@/utils/editor";
import { BindingType } from "@/utils/types";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { ComponentToBindFromInput } from "../ComponentToBindFromInput";

type Props = {
  id: string;
};

type FormValues = Omit<ChangeVariableAction, "name">;

const defaultValues = {
  variableId: "",
  bindingType: "JavaScript" as BindingType,
  javascriptCode: "return ",
  formulaCondition: "",
  formulaValue: "",
  value: "",
};

export const ChangeVariableActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<ChangeVariableAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: merge({}, defaultValues, action.action),
  });

  const onSubmit = (updateValues: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<ChangeVariableAction>({
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

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(selectedComponentId, { [key]: value });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <VariableSelect
          label="Variable"
          required
          onPick={(variable) => {
            form.setFieldValue("variableId", variable.id);
          }}
          {...form.getInputProps("variableId")}
        />
        <ComponentToBindFromInput
          label="Value"
          componentId={selectedComponentId}
          onPickVariable={(variable: string) =>
            setFieldValue("value", variable)
          }
          actionData={[]}
          javascriptCode={form.values.actionCode}
          onChangeJavascriptCode={(javascriptCode: string, label: string) => {
            setFieldValue(`actionCode.${label}`, javascriptCode);
          }}
          {...form.getInputProps("value")}
          onChange={(e) => setFieldValue("value", e.currentTarget.value)}
          required
        />

        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
