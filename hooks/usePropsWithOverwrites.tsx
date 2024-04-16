import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";
import { useMemo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { omit } from "next/dist/shared/lib/router/utils/omit";

export const usePropsWithOverwrites = (
  component: Component,
  isEditorMode: boolean,
  currentState: string = "default",
  triggers: any,
) => {
  const language = useEditorStore((state) => state.language);

  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  // Hover state function - if a component has a hover state, it should be triggered on hover
  // that means when a component is hovered then unhovered, it needs to go back to the previous state
  // here is store the currentState as previousState now, and we force the currentState to be hover
  // it shouldn't trigger if the component is disabled
  const hoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (
      currentState !== "hover" &&
      currentState !== "disabled" &&
      "hover" in (component?.states ?? {})
    ) {
      const toBePreviousStateDef =
        useEditorTreeStore.getState().componentMutableAttrs[component.id!]
          ?.onLoad?.currentState;

      updateTreeComponentAttrs({
        componentIds: [e.currentTarget.id],
        attrs: {
          onLoad: {
            currentState: {
              boundCode: "return 'hover'",
              dataType: "boundCode",
            },
            previousState: toBePreviousStateDef,
          },
        },
        save: false,
      });
    }
  };

  // Unhover state function - if a component has a hover state, it should be triggered on mouse leave
  // that means when a component is currently hovered, we need to force what the previousState that was stored before
  // to be the currentState now
  const leaveHoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (currentState === "hover") {
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
        disabled: currentState === "disabled",
        triggers: !isEditorMode && {
          ...triggers,
          // Critical Rerender Bug: Commenting this out doesn't stop the re render, think it is DataProvider as it
          // stopped when I commented out parts from editor store
          onMouseOver: triggers?.onHover ?? hoverStateFunc,
          onMouseLeave: leaveHoverStateFunc,
          // onKeyDown: handleComponentIfDisabledState,
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, currentState, triggers]);
};
