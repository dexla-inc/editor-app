import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { removeKeysRecursive } from "@/utils/removeKeys";
import merge from "lodash.merge";
import { useMemo } from "react";
import { useComponentStates } from "./useComponentStates";
import { useEditorTreeStore } from "@/stores/editorTree";
import get from "lodash.get";

export const usePropsWithOverwrites = (
  component: Component,
  isEditorMode: boolean,
  currentState: string,
  triggers: any,
) => {
  const language = useEditorStore((state) => state.language);
  const { checkIfIsDisabledState, handleComponentIfDisabledState } =
    useComponentStates();

  const isDisabledState = checkIfIsDisabledState(component.name, currentState);
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const hoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (
      currentState === "default" &&
      !!Object.keys(get(component, "states.hover", {})).length
    ) {
      updateTreeComponentAttrs({
        componentIds: [e.currentTarget.id],
        attrs: {
          onLoad: {
            currentState: {
              static: "hover",
              dataType: "static",
            },
          },
        },
        save: false,
      });
    }
  };

  const leaveHoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (currentState === "hover" || currentState === "checked") {
      updateTreeComponentAttrs({
        componentIds: [e.currentTarget.id],
        attrs: {
          onLoad: {
            currentState: {
              static: "default",
              dataType: "static",
            },
          },
        },
        save: false,
      });
    }
  };

  return useMemo(() => {
    return merge(
      {},
      isEditorMode
        ? removeKeysRecursive(component.props ?? {}, ["error"])
        : component.props,
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
          ...(isDisabledState && {
            onKeyDown: handleComponentIfDisabledState,
          }),
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, currentState, triggers]);
};
