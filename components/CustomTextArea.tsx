import { useMantineTheme } from "@mantine/core";
import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";

type JsProps = {
  value?: string;
  componentProps: Record<string, any>;
  onChange?: any;
  selectedItem?: string;
};

const RETURN_ERROR_CODE = 1108;

export function CustomTextArea({
  value = "",
  componentProps,
  onChange,
}: JsProps) {
  const monacoRef = useRef<any>(null);

  const theme = useMantineTheme();

  const [completionDisposable, setCompletionDisposable] = useState<any>();

  const debouncedOnChange = useCallback(
    debounce((value) => {
      onChange(value);
    }, 200),
    [],
  );

  useEffect(() => {
    return () => {
      if (
        completionDisposable?.dispose &&
        typeof completionDisposable.dispose === "function"
      ) {
        completionDisposable.dispose();
      }
    };
  }, [completionDisposable]);

  // useEffect(() => {
  //   const selection = monacoRef?.current?.getSelection();
  //   if (selectedItem && selection) {
  //     const row = selection.positionLineNumber - 1;
  //     const column = selection.positionColumn - 1;

  //     const isValueEmpty = value === "";
  //     const prefixWhenEmpty = "return ";

  //     const lines = (isValueEmpty ? prefixWhenEmpty : value).split("\n");
  //     const targetLineChars = lines[row].split("");
  //     targetLineChars.splice(
  //       isValueEmpty ? column + prefixWhenEmpty.length : column,
  //       0,
  //       ...selectedItem,
  //     );
  //     lines[row] = targetLineChars.join("");

  //     onChange(lines.join("\n"));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedItem]);

  return (
    <>
      <style>{CustomTextAreaStyles}</style>
      <Editor
        width="100%"
        height="100px"
        defaultLanguage="javascript"
        // language="html"
        onChange={debouncedOnChange}
        onMount={(editor) => {
          monacoRef.current = editor;
        }}
        theme={theme.colorScheme === "dark" ? "vs-dark" : "light"}
        value={value}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          contextmenu: true,
          wordWrap: "on",
          wordWrapColumn: -1,
          lineNumbers: "off",
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
            verticalScrollbarSize: 0,
            horizontalScrollbarSize: 0,
          },
          glyphMargin: false,
          folding: false,
        }}
        beforeMount={async (monaco) => {
          // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          //   diagnosticCodesToIgnore: [RETURN_ERROR_CODE],
          // });

          setCompletionDisposable(
            monaco.languages.registerCompletionItemProvider("javascript", {
              provideCompletionItems: () => {
                console.log("componentProps", componentProps);
                return {
                  suggestions: [
                    {
                      label: componentProps?.name,
                      kind: monaco.languages.CompletionItemKind.Text,
                      insertText: "testing",
                    },
                    ...Object.keys(componentProps).map((prop) => ({
                      label: prop,
                      kind: monaco.languages.CompletionItemKind.Property,
                      insertText: `{{${prop}}}`,
                    })),
                  ],
                };
              },
            }),
          );
        }}
      />
    </>
  );
}

const CustomTextAreaStyles = `
  .monaco-editor .suggest-widget { width: 500px !important;
    transform: translateX(50%) !important;
  }
`;
