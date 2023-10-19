import { Editor } from "@monaco-editor/react";

type JsProps = {
  language: "javascript" | "typescript" | "json";
  value?: string;
};

export function CustomJavaScriptTextArea({
  language: defaultLanguage,
  value,
}: JsProps) {
  // We need to write our own completion providers in JavaScript for Variables, datasources and components.
  // https://www.npmjs.com/package/@monaco-editor/react#for-nextjs-users

  const defaultValue =
    "// Create a regular JavaScript function that returns\
      \n// a value and call it after.\
      \n// This way you can pass in test parameters";

  return (
    <Editor
      width="100%"
      height="150px"
      // if we can get intellisense working with typescript then do it
      defaultLanguage={defaultLanguage ?? "javascript"}
      value={value ?? defaultValue}
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
  );
}
