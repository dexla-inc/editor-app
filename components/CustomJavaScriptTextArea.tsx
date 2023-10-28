import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { pick } from "next/dist/lib/pick";

type JsProps = {
  language: "javascript" | "typescript" | "json";
  value?: string;
  variables?: Record<string, any>;
  onChange?: any;
  selectedItem?: any;
};

const RETURN_ERROR_CODE = 1108;

export function CustomJavaScriptTextArea({
  language: defaultLanguage,
  value = "",
  variables = {},
  onChange,
  selectedItem,
}: JsProps) {
  const monacoRef = useRef<any>(null);
  const browser = useRouter();

  const [completionDisposable, setCompletionDisposable] = useState<any>();

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

      const lines = value.split("\n");
      const targetLineChars = lines[row].split("");
      targetLineChars.splice(column, 0, ...selectedItem);
      lines[row] = targetLineChars.join("");

      onChange(lines.join("\n"));
    }
  }, [selectedItem]);

  return (
    <Editor
      width="100%"
      height="150px"
      defaultLanguage={defaultLanguage ?? "javascript"}
      onChange={onChange}
      onMount={(editor) => {
        monacoRef.current = editor;
      }}
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
                ],
              };
            },
          }),
        );
      }}
    />
  );
}
