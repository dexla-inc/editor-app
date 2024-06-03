import { useMantineTheme } from "@mantine/core";
import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { pick } from "next/dist/lib/pick";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import { useBindingContext } from "@/components/bindingPopover/BindingContextProvider";

type JsProps = {
  language: "javascript" | "typescript" | "json";
  value?: string;
  onChange?: any;
  selectedItem?: string;
};

const RETURN_ERROR_CODE = 1108;

// Typing configuration to prevent the editor to understand our variables as unknown
const customTypes = `
declare var variables: {
  [key: string]: any;
};

declare var browser: {
  [key: string]: any;
};

declare var components: {
  [key: string]: any;
};

declare var actions: {
  [key: string]: any;
};

declare var item: {
  [key: string]: any;
};

declare var auth: {
  [key: string]: any;
};

declare var event: {
  [key: string]: any;
};
`;

export function CustomJavaScriptTextArea({
  language: defaultLanguage,
  value = "",
  onChange,
  selectedItem,
}: JsProps) {
  const { actions, variables, components } = useBindingContext();

  const monacoRef = useRef<any>(null);
  const browser = useOldRouter();

  const theme = useMantineTheme();

  const [completionDisposable, setCompletionDisposable] = useState<any>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          customTypes,
          "customTypes.d.ts",
        );

        // Auto-completion configuration
        setCompletionDisposable(
          monaco.languages.registerCompletionItemProvider("typescript", {
            provideCompletionItems: () => {
              return {
                suggestions: [
                  ...Object.entries(variables).map(([id, variable]) => ({
                    label: `variables[${variable.name}]`,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: `variables[/* ${variable.name} */'${id}']`,
                  })),
                  ...Object.entries(pick(browser, ["asPath", "query"])).map(
                    ([key]) => ({
                      label: `browser[${key}]`,
                      kind: monaco.languages.CompletionItemKind.Variable,
                      insertText: `browser['${key}']`,
                    }),
                  ),
                  ...Object.entries(components).map(([id, component]) => ({
                    label: `components[${component.description}]`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `components[/* ${component.description} */'${id}']`,
                  })),
                  ...Object.entries(actions).map(([id, action]) => ({
                    label: `actions[${action.name}]`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `actions[/* ${action.name} */'${id}']`,
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
