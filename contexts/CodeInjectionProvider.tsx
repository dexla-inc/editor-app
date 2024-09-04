import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import React, { createContext, useContext, useEffect } from "react";

type CodeInjectionContextType = {
  handleSetVariable: (variableId: string, value: any) => void;
};

const CodeInjectionContext = createContext<
  CodeInjectionContextType | undefined
>(undefined);

export const CodeInjectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  const handleSetVariable = (variableId: string, value: any) => {
    const variableList = useVariableStore.getState().variableList;
    const selectedVariable = variableList[variableId];
    if (selectedVariable) {
      useVariableStore.getState().setVariable({ ...selectedVariable, value });
    } else {
      console.error("Variable not found:", variableId);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SET_VARIABLE") {
        handleSetVariable(event.data.variableId, event.data.value);
      }
    };

    const targetWindow = iframeWindow || window;
    targetWindow.addEventListener("message", handleMessage);

    return () => {
      targetWindow.removeEventListener("message", handleMessage);
    };
  }, [iframeWindow]);

  return (
    <CodeInjectionContext.Provider value={{ handleSetVariable }}>
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
