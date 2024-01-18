import { useFlowStore } from "@/stores/flow";
import { CustomJavascriptAction } from "@/utils/actions";
import { Button, Card, Flex, Stack, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import Editor from "@monaco-editor/react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useState } from "react";
import { transpile } from "typescript";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<CustomJavascriptAction, "name">;

export const CustomJavascriptFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const [codeResult, setCodeResult] = useState<any>();

  const onClickRunCode = () => {
    let result = transpile(form.values.code);
    setCodeResult(eval(result));
  };

  return (
    <Stack spacing="xs">
      <Flex w="100%" justify="space-between" align="center">
        <Text size="sm" weight={500}>
          Custom Javascript
        </Text>
        <Button
          variant="default"
          sx={{ marginRight: 0 }}
          size="xs"
          leftIcon={<IconPlayerPlayFilled size={8} />}
          type="button"
          onClick={onClickRunCode}
        >
          Run Code
        </Button>
      </Flex>
      <Card style={{ overflow: "visible" }} withBorder radius="sm" px={0}>
        <Editor
          width="100%"
          height="150px"
          defaultLanguage="typescript"
          defaultValue="// write your code here"
          {...form.getInputProps("code")}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            contextmenu: false,
            language: {
              javascript: {
                globalKnownSymbols: {
                  data: true,
                },
              },
            },
          }}
        />
      </Card>

      {codeResult && (
        <div style={{ height: 200, width: "100%", border: "1px solid #000" }}>
          {codeResult}
        </div>
      )}

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
