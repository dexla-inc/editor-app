import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";
import { useEffect, useMemo, useState } from "react";
import { omit } from "next/dist/shared/lib/router/utils/omit";

export const usePropsWithOverwrites = (
  component: Component,
  isEditorMode: boolean,
  currentState: string = "default",
  triggers: any,
) => {
  const [customCurrentState, setCustomCurrentState] =
    useState<string>(currentState);
  const language = useEditorStore((state) => state.language);

  useEffect(() => {
    setCustomCurrentState(currentState);
  }, [currentState]);

  const hoverStateFunc = () => {
    setCustomCurrentState("hover");
  };

  const leaveHoverStateFunc = () => {
    setCustomCurrentState(currentState);
  };

  return useMemo(() => {
    return merge(
      {},
      isEditorMode ? omit(component.props ?? {}, ["error"]) : component.props,
      component.languages?.[language],
      component.states?.[customCurrentState],
      {
        disabled: customCurrentState === "disabled",
        triggers: !isEditorMode && {
          ...triggers,
          onMouseOver: triggers?.onHover ?? hoverStateFunc,
          onMouseLeave: leaveHoverStateFunc,
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, customCurrentState, triggers]);
};
