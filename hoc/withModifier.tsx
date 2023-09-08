import { useEditorStore } from "@/stores/editor";
import { Component, getComponentById } from "@/utils/editor";
import { ComponentType } from "react";

type WithModifier = {
  selectedComponent: Component | null;
  language: string;
  componentProps: any;
  currentState: string;
};

export const withModifier = (Modifier: ComponentType<WithModifier>) => {
  const Config = () => {
    const editorTree = useEditorStore((state) => state.tree);
    const selectedComponentId = useEditorStore(
      (state) => state.selectedComponentId
    );
    const language = useEditorStore((state) => state.language);
    const currentTreeComponentsStates = useEditorStore(
      (state) => state.currentTreeComponentsStates
    );

    const selectedComponent = getComponentById(
      editorTree.root,
      selectedComponentId as string
    );

    const componentProps = selectedComponent?.props || {};

    const currentState =
      currentTreeComponentsStates?.[selectedComponentId || ""] ?? "default";

    return (
      <Modifier
        {...{
          language,
          selectedComponent,
          componentProps,
          currentState,
        }}
      />
    );
  };

  return Config;
};
