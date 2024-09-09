import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import React, { createContext, useContext, useEffect } from "react";

type CodeInjectionContextType = {
  handleSetVariable: (variableId: string, value: any) => void;
  handleGetVariable: (variableId: string) => any;
};

const CodeInjectionContext = createContext<
  CodeInjectionContextType | undefined
>(undefined);

export const CodeInjectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  const handleGetVariable = (id: string) => {
    const variable = useVariableStore.getState().variableList[id];
    return variable?.value ?? variable?.defaultValue ?? undefined;
  };

  const handleSetVariable = (variableId: string, value: any) => {
    const variableList = useVariableStore.getState().variableList;
    const selectedVariable = variableList[variableId];
    if (selectedVariable) {
      useVariableStore.getState().setVariable({ ...selectedVariable, value });
    } else {
      // do nothing
    }
  };
  const handlers = {
    GET_VARIABLE: handleGetVariable,
    SET_VARIABLE: handleSetVariable,
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, params } = event.data;
      if (type in handlers) {
        const handler = handlers[type as keyof typeof handlers];
        // @ts-ignore
        const result = handler(...params);
        if (type === "GET_VARIABLE") {
          event.source?.postMessage(
            {
              type: "GET_VARIABLE_RESPONSE",
              variableId: params[0],
              value: result,
            },
            { targetOrigin: "*" },
          );
        }
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
      value={{ handleSetVariable, handleGetVariable }}
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
