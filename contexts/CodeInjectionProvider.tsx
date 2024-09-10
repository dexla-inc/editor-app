import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import React, { createContext, useContext, useEffect } from "react";

type CodeInjectionContextType = {
  handleSetVariable: (variableId: string, value: any) => void;
  handleGetVariables: () => Record<string, any>;
  variables: Record<string, any>;
};

const CodeInjectionContext = createContext<
  CodeInjectionContextType | undefined
>(undefined);

export const CodeInjectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const variables = useVariableStore((state) =>
    Object.values(state.variableList).reduce(
      (curr, item) => {
        curr[item.id] = item.value ?? item.defaultValue ?? undefined;
        return curr;
      },
      {} as Record<string, any>,
    ),
  );

  const handleGetVariables = () => variables;

  const handleSetVariable = (variableId: string, value: any) => {
    const selectedVariable =
      useVariableStore.getState().variableList[variableId];
    if (selectedVariable) {
      useVariableStore.getState().setVariable({ ...selectedVariable, value });
    } else {
      // do nothing
    }
  };
  const handlers = {
    SET_VARIABLE: handleSetVariable,
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, params } = event.data;
      if (type in handlers) {
        const handler = handlers[type as keyof typeof handlers];
        // @ts-ignore
        const result = handler(...params);
      }
    };

    const targetWindow = iframeWindow || window;
    targetWindow.addEventListener("message", handleMessage);

    return () => {
      targetWindow.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeWindow]);

  return (
    <CodeInjectionContext.Provider
      value={{ handleSetVariable, handleGetVariables, variables }}
    >
      {children}
    </CodeInjectionContext.Provider>
  );
};

export const useCodeInjectionContext = () => {
  const context = useContext(CodeInjectionContext);
  if (context === undefined) {
    throw new Error(
      "useCodeInjectionContext must be used within a CodeInjectionProvider",
    );
  }
  return context;
};
