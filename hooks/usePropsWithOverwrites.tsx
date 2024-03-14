import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { removeKeysRecursive } from "@/utils/removeKeys";
import merge from "lodash.merge";
import { useMemo } from "react";
import { useComponentStates } from "./useComponentStates";
import { useEditorTreeStore } from "@/stores/editorTree";

export const usePropsWithOverwrites = (
  component: Component,
  isEditorMode: boolean,
  currentState: any,
  triggers: any,
) => {
  const language = useEditorStore((state) => state.language);
  const { checkIfIsDisabledState, handleComponentIfDisabledState } =
    useComponentStates();

  const isDisabledState = checkIfIsDisabledState(component.name, currentState);
  const setTreeComponentCurrentState = useEditorTreeStore(
    (state) => state.setTreeComponentCurrentState,
  );

  const hoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (currentState === "default" && component.states?.hover) {
      setTreeComponentCurrentState(e.currentTarget.id, "hover");
    }
  };

  const leaveHoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (currentState === "hover" || currentState === "checked") {
      setTreeComponentCurrentState(e.currentTarget.id, "default");
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
