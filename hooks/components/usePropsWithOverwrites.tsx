import { useEditorClickHandler } from "@/hooks/components/useEditorClickHandler";
import { useTriggers } from "@/hooks/components/useTriggers";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isEditorModeSelector } from "@/utils/componentSelectors";
import { Component } from "@/utils/editor";
import { SelectItem } from "@mantine/core";
import merge from "lodash.merge";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useRouterWithLoader } from "@/hooks/useRouterWithLoader";
import { useEffect, useMemo, useState } from "react";

export const usePropsWithOverwrites = (
  component: Component,
  shareableContent: Record<string, any>,
  currentState: string = "default",
) => {
  const isEditorMode = useEditorTreeStore(isEditorModeSelector);
  const router = useRouterWithLoader();
  const triggers = useTriggers({
    entity: component,
    router,
    shareableContent,
  });

  const [customCurrentState, setCustomCurrentState] =
    useState<string>(currentState);
  const handleClick = useEditorClickHandler(component.id!);

  useEffect(() => {
    setCustomCurrentState(currentState);
  }, [currentState]);

  const hoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (isEditorMode) return;

    if (
      component.id! === e.currentTarget.id &&
      Object.keys(component?.states?.hover ?? {}).length
    ) {
      setCustomCurrentState("hover");
    }
  };

  const leaveHoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (isEditorMode) return;

    if (
      component.id! === e.currentTarget.id &&
      Object.keys(component?.states?.hover ?? {}).length
    ) {
      setCustomCurrentState(currentState);
    }
  };

  const omittingProps = ["showBorder", "pages", "theme", "customAttributes"];
  if (isEditorMode) {
    omittingProps.push("error");
  }

  const customAttributes = (
    (component.props?.customAttributes ?? []) as SelectItem[]
  ).reduce((acc: Record<string, string>, curr) => {
    if (curr?.label) {
      acc[curr?.label] = curr?.value ?? "";
    }

    return acc;
  }, {});

  return useMemo(() => {
    return merge(
      {},
      omit(component.props ?? {}, omittingProps),
      customAttributes,
      component.states?.[customCurrentState],
      {
        error: component.props?.hasError
          ? component.onLoad.validationMessage ??
            `${component.description} is required`
          : undefined,
        disabled: customCurrentState === "disabled",
        triggers: {
          ...triggers,
          onClick: (e: any, func?: (...args: any[]) => void) => {
            const isEditorMode = isEditorModeSelector(
              useEditorTreeStore.getState(),
            );

            if (isEditorMode) {
              handleClick(e);
            } else {
              triggers?.onClick?.(e);
              func?.(e);
            }
          },
          onMouseOver: triggers?.onHover ?? hoverStateFunc,
          onMouseLeave: leaveHoverStateFunc,
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, customCurrentState, triggers]);
};
