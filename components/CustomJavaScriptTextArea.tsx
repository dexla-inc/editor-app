import Editor from "@monaco-editor/react";

type JsProps = {
  language: "javascript" | "typescript" | "json";
  value?: string;
  variables?: Record<string, any>;
  onChange?: any;
};

export function CustomJavaScriptTextArea({
  language: defaultLanguage,
  value,
  variables = {},
  onChange,
}: JsProps) {
  // We need to write our own completion providers in JavaScript for Variables, datasources and components.
  // https://www.npmjs.com/package/@monaco-editor/react#for-nextjs-users

  return (
    <Editor
      width="100%"
      height="150px"
      defaultLanguage={defaultLanguage ?? "javascript"}
      onChange={onChange}
      value={value}
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        contextmenu: false,
      }}
      beforeMount={async (monaco) => {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true,
        });

        monaco.languages.registerCompletionItemProvider("typescript", {
          provideCompletionItems: () => {
            return {
              suggestions: Object.entries(variables).map(([id, variable]) => ({
                label: `variables[${variable.name}]`,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: `variables[/* ${variable.name} */'${id}']`,
              })),
            };
          },
        });
      }}
    />
  );
}
