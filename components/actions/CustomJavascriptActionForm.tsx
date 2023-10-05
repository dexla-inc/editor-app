import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { CustomJavascriptAction } from "@/utils/actions";
import { Button, Card, Flex, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import Editor from "@monaco-editor/react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useState } from "react";
import { transpile } from "typescript";

type Props = {
  id: string;
};

type FormValues = Omit<CustomJavascriptAction, "name">;

export const CustomJavascriptActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<CustomJavascriptAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const [codeResult, setCodeResult] = useState<any>();

  const form = useForm<FormValues>({
    initialValues: {
      // @ts-ignore
      code: action.action.code,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<CustomJavascriptAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { code: values.code },
        updateTreeComponentActions,
      });
      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const onClickRunCode = () => {
    let result = transpile(form.values.code);
    setCodeResult(eval(result));
  };

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <Flex w="100%" justify="space-between" align="center">
            <Text size="sm" weight={500}>
              Custom Javascript
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
            <div
              style={{ height: 200, width: "100%", border: "1px solid #000" }}
            >
              {codeResult}
            </div>
          )}

          <ActionButtons
            actionId={action.id}
            componentActions={componentActions}
            canAddSequential={true}
          ></ActionButtons>
        </Stack>
      </form>
    </>
  );
};
