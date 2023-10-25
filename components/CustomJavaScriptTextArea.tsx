import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

type JsProps = {
  language: "javascript" | "typescript" | "json";
  value?: string;
  variables?: Record<string, any>;
  onChange?: any;
};

const RETURN_ERROR_CODE = 1108;

export function CustomJavaScriptTextArea({
  language: defaultLanguage,
  value,
  variables = {},
  onChange,
}: JsProps) {
  // We need to write our own completion providers in JavaScript for Variables, datasources and components.
  // https://www.npmjs.com/package/@monaco-editor/react#for-nextjs-users

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

  return (
    <Editor
      width="100%"
      height="150px"
      defaultLanguage={defaultLanguage ?? "javascript"}
      onChange={onChange}
      value={value ?? "return "}
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
                suggestions: Object.entries(variables).map(
                  ([id, variable]) => ({
                    label: `variables[${variable.name}]`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `variables[/* ${variable.name} */'${id}']`,
                  }),
                ),
              };
            },
          }),
        );
      }}
    />
  );
}
