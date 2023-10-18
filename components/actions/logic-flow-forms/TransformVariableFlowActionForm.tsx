import { VariableSelect } from "@/components/variables/VariableSelect";
import { useFlowStore } from "@/stores/flow";
import { TransformVariableAction } from "@/utils/actions";
import { Button, Card, Stack, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import Editor from "@monaco-editor/react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { transpile } from "typescript";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<TransformVariableAction, "name">;

export const TransformVariableFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  const onClickRunCode = () => {
    const result = transpile(form.values.value);
    try {
      const codeResult = eval(result);
      console.log(codeResult);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
