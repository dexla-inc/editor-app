import { useEditorStore } from "@/stores/editor";
import { Component, getComponentById } from "@/utils/editor";
import { ComponentType, useMemo } from "react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";

type WithModifier = {
  selectedComponent: Component | null;
};

export const withModifier = (Modifier: ComponentType<WithModifier>) => {
  const Config = ({ initiallyOpened }: any) => {
    const editorTree = useEditorStore((state) => state.tree);
    const selectedComponentId = useEditorStore(
      (state) => state.selectedComponentId,
    );
    const language = useEditorStore((state) => state.language);
    const currentTreeComponentsStates = useEditorStore(
      (state) => state.currentTreeComponentsStates,
    );

    const selectedComponent = cloneDeep(
      getComponentById(editorTree.root, selectedComponentId as string),
    );

    const currentState =
      currentTreeComponentsStates?.[selectedComponentId || ""] ?? "default";

    const mergedCustomData = useMemo(() => {
      merge(
        selectedComponent?.props,
        selectedComponent?.languages?.[language],
        selectedComponent?.states?.[currentState],
      );
      return selectedComponent;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent, currentState, language]);

    if (!initiallyOpened) {
      return null;
    }

    return (
      <Modifier
        {...{
          selectedComponent: mergedCustomData as Component,
        }}
      />
    );
  };

  return Config;
};
