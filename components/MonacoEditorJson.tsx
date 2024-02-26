import { useMantineTheme } from "@mantine/core";
import Editor, { EditorProps } from "@monaco-editor/react";

type Props = {} & EditorProps;

export function MonacoEditorJson({ ...props }: Props) {
  const theme = useMantineTheme();

  return (
    <Editor
      height="100px"
      theme={theme.colorScheme === "dark" ? "vs-dark" : "light"}
      defaultLanguage="json"
      {...props}
      options={{
        fontSize: 12,
        wordWrap: "on",
        lineNumbers: "off",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        ...props.options,
      }}
    />
  );
}
