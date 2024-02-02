import { useMantineTheme } from "@mantine/core";
import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

type JsProps = {
  language: "javascript" | "typescript" | "json";
  value?: string;
  variables?: Record<string, any>;
  components?: Record<string, any>;
  onChange?: any;
  selectedItem?: string;
};

const RETURN_ERROR_CODE = 1108;

export function CustomJavaScriptTextArea({
  language: defaultLanguage,
  value = "",
  variables = {},
  components = {},
  onChange,
  selectedItem,
}: JsProps) {
  const monacoRef = useRef<any>(null);
  const browser = useRouter();

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

  useEffect(() => {
    const selection = monacoRef?.current?.getSelection();
    if (selectedItem && selection) {
      const row = selection.positionLineNumber - 1;
      const column = selection.positionColumn - 1;

      const isValueEmpty = value === "";
      const prefixWhenEmpty = "return ";

      const lines = (isValueEmpty ? prefixWhenEmpty : value).split("\n");
      const targetLineChars = lines[row].split("");
      targetLineChars.splice(
        isValueEmpty ? column + prefixWhenEmpty.length : column,
        0,
        ...selectedItem,
      );
      lines[row] = targetLineChars.join("");

      onChange(lines.join("\n"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  return (
    <Editor
      width="100%"
      height="150px"
      defaultLanguage={defaultLanguage ?? "javascript"}
      onChange={debouncedOnChange}
      onMount={(editor) => {
        monacoRef.current = editor;
      }}
      theme={theme.colorScheme === "dark" ? "vs-dark" : "light"}
      value={value}
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        contextmenu: false,
        wordWrap: "on",
        wordWrapColumn: -1,
      }}
      beforeMount={async (monaco) => {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          diagnosticCodesToIgnore: [RETURN_ERROR_CODE],
        });

        setCompletionDisposable(
          monaco.languages.registerCompletionItemProvider("typescript", {
            provideCompletionItems: () => {
              return {
                suggestions: [
                  ...Object.entries(variables).map(([id, variable]) => ({
                    label: `variables[${variable.name}]`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `variables[/* ${variable.name} */'${id}']`,
                  })),
                  ...Object.entries(
                    pick(browser, [
                      "asPath",
                      "basePath",
                      "pathname",
                      "query",
                      "route",
                    ]),
                  ).map(([key]) => ({
                    label: `browser[${key}]`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `browser['${key}']`,
                  })),
                  ...Object.entries(components).map(([id, component]) => ({
                    label: `components[${component.description}]`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `components[/* ${component.description} */'${id}']`,
                  })),
                ],
              };
            },
          }),
        );
      }}
    />
  );
}
