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

  useEffect(() => {
    setCustomCurrentState(currentState);
  }, [currentState]);

  const hoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (
      component.id! === e.currentTarget.id &&
      Object.keys(component?.states?.hover ?? {}).length
    ) {
      setCustomCurrentState("hover");
    }
  };

  const leaveHoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (
      component.id! === e.currentTarget.id &&
      Object.keys(component?.states?.hover ?? {}).length
    ) {
      setCustomCurrentState(currentState);
    }
  };

  const omittingProps = ["showBorder", "pages", "theme"];
  if (isEditorMode) {
    omittingProps.push("error");
  }

  return useMemo(() => {
    return merge(
      {},
      omit(component.props ?? {}, omittingProps),
      component.states?.[customCurrentState],
      {
        error: component.props?.hasError
          ? component.onLoad.validationMessage ??
            `${component.description} is required`
          : undefined,
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
