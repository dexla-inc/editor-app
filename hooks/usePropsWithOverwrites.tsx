import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";
import { useMemo } from "react";
import { useComponentStates } from "./useComponentStates";
import { useEditorTreeStore } from "@/stores/editorTree";
import { omit } from "next/dist/shared/lib/router/utils/omit";

export const usePropsWithOverwrites = (
  component: Component,
  isEditorMode: boolean,
  currentState: string = "default",
  triggers: any,
) => {
  const language = useEditorStore((state) => state.language);
  const { isDisabledState, handleComponentIfDisabledState } =
    useComponentStates(component.name, currentState);

  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const hoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (currentState === "default" && "hover" in (component?.states ?? {})) {
      // When a component is hover, that means when I unhover it, I want to go back to the previous state
      const toBePreviousState =
        useEditorTreeStore.getState().componentMutableAttrs[component.id!]
          ?.onLoad?.currentState;

      updateTreeComponentAttrs({
        componentIds: [e.currentTarget.id],
        attrs: {
          onLoad: {
            currentState: {
              static: "return 'hover';",
              dataType: "boundCode",
            },
            previousState: toBePreviousState,
          },
        },
        save: false,
      });
    }
  };

  const leaveHoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (currentState === "hover" || currentState === "checked") {
      const previousState =
        useEditorTreeStore.getState().componentMutableAttrs[component.id!]
          ?.onLoad?.previousState;
      updateTreeComponentAttrs({
        componentIds: [e.currentTarget.id],
        attrs: {
          onLoad: {
            currentState: previousState,
          },
        },
        save: false,
      });
    }
  };

  return useMemo(() => {
    return merge(
      {},
      isEditorMode ? omit(component.props ?? {}, ["error"]) : component.props,
      component.languages?.[language],
      component.states?.[currentState],
      {
        disabled: isDisabledState,
        triggers: !isEditorMode && {
          ...triggers,
          // Critical Rerender Bug: Commenting this out doesn't stop the re render, think it is DataProvider as it
          // stopped when I commented out parts from editor store
          onMouseOver: triggers?.onHover ?? hoverStateFunc,
          onMouseLeave: leaveHoverStateFunc,
          onKeyDown: handleComponentIfDisabledState,
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, currentState, triggers]);
};
