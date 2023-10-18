import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { TransformVariableAction } from "@/utils/actions";
import { Button, Card, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import Editor from "@monaco-editor/react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { transpile } from "typescript";
import { useEditorStore } from "@/stores/editor";

type Props = {
  id: string;
};

type FormValues = Omit<TransformVariableAction, "name">;

const defaultValues = {
  value: "",
  variableId: "",
  variableName: "",
  data: undefined,
};

export const TransformVariableActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<TransformVariableAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: action.action ?? defaultValues,
  });

  const onClickRunCode = () => {
    const result = transpile(form.values.value);
    try {
      const codeResult = eval(result);
      console.log(codeResult);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<TransformVariableAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          value: values.value,
          variableId: values.variableId,
          variableName: values.variableName,
          data: values.data,
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
        <VariableSelect
          label="Variable"
          onPick={(variable) => {
            let value = form.values.value;
            if (value === "" || form.values.variableId !== variable.id) {
              // TODO: Use variable ref instead of current value
              value = `const variable = /* var_${variable?.id} start */${
                variable?.value ?? variable?.defaultValue ?? '"var value"'
              }/* var_${variable?.id} end */\nfunction getValue() {\n  return variable;\n}\ngetValue();`;
            }

            form.setValues({
              ...form.values,
              variableId: variable.id,
              variableName: variable.name,
              value,
            });
          }}
          {...form.getInputProps("variableId")}
        />
        {form.values.variableId && (
          <Stack spacing="xs">
            <Text size="xs" weight={500}>
              Write Javascript to transform the selected variable
            </Text>
            <Button
              color="indigo"
              sx={{ marginRight: 0 }}
              size="xs"
              leftIcon={<IconPlayerPlayFilled size={8} />}
              type="button"
              onClick={onClickRunCode}
            >
              Run Code
            </Button>
            <Card style={{ overflow: "visible" }} withBorder radius="sm" px={0}>
              <Editor
                onValidate={() => {
                  const suggestWidget = window.document.querySelector(
                    ".editor-widget.suggest-widget",
                  );
                  if (suggestWidget) {
                    suggestWidget.setAttribute(
                      "style",
                      `${suggestWidget.getAttribute(
                        "style",
                      )}; width: 100% !important; left: 0 !important;`,
                    );
                  }
                }}
                width="100%"
                height="150px"
                defaultLanguage="typescript"
                {...form.getInputProps("value")}
                options={{
                  automaticLayout: true,
                  minimap: { enabled: false },
                  contextmenu: false,
                }}
              />
            </Card>
          </Stack>
        )}

        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
