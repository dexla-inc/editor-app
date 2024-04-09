import { useComputeCurrentState } from "@/hooks/reactQuery/useComputeCurrentState";
import {
  useComponentContextEventHandler,
  useComponentContextMenu,
} from "@/hooks/useComponentContextMenu";
import { useEditorShadows } from "@/hooks/useEditorShadows";
import { useEditorClickHandler } from "@/hooks/useEditorClickHandler";
import { useComputeChildStyles } from "@/hooks/useComputeChildStyles";
import { usePropsWithOverwrites } from "@/hooks/usePropsWithOverwrites";
import { useTriggers } from "@/hooks/useTriggers";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { ComponentTree } from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { PropsWithChildren, cloneElement } from "react";
import { ComponentToolbox } from "@/components/ComponentToolbox";
import { memoize } from "proxy-memoize";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";

type Props = {
  id: string;
  component: ComponentTree;
  isSelected?: boolean;
  selectedByOther?: string;
  shareableContent?: any;
} & BoxProps;

export const EditableComponent = ({
  id,
  children,
  component: componentTree,
  isSelected,
  selectedByOther,
  shareableContent,
}: PropsWithChildren<Props>) => {
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
  const isLive = useEditorTreeStore((state) => state.isLive);
  const isEditorMode = !isPreviewMode && !isLive;
  const component = useEditorTreeStore(
    memoize((state) => state.componentMutableAttrs[id] ?? {}),
  );

  let currentState = useComputeCurrentState(component);

  if (shareableContent?.parentState)
    currentState = shareableContent.parentState;

  const isResizing = useEditorStore((state) => state.isResizing);

  const { componentContextMenu, forceDestroyContextMenu } =
    useComponentContextMenu();

  const handleContextMenu = useComponentContextEventHandler(
    { ...{}, ...componentTree, ...component },
    componentContextMenu,
  );

  const triggers = useTriggers({
    entity: component,
  });

  const { isVisible = true } = useComputeValue2({
    onLoad: component.onLoad,
    shareableContent,
  });

  const { isPicking, droppable, tealOutline } = useEditorShadows({
    componentId: id,
    isSelected: false,
    selectedByOther,
  });

  const propsWithOverwrites = usePropsWithOverwrites(
    component,
    isEditorMode,
    currentState,
    triggers,
  );

  const childStyles = useComputeChildStyles({
    component,
    propsWithOverwrites,
    currentState,
    isEditorMode,
  });

  const handleClick = useEditorClickHandler(
    id,
    isEditorMode,
    forceDestroyContextMenu,
    propsWithOverwrites,
    isPicking,
  );

  if (!isVisible) return null;

  return (
    <>
      {cloneElement(
        // @ts-ignore
        children,
        {
          component: {
            ...component,
            ...componentTree,
            props: propsWithOverwrites,
          },
          ...(isResizing || !isEditorMode ? {} : droppable),
          id: component.id,
          isPreviewMode: !isEditorMode,
          style: childStyles,
          sx: tealOutline,
          ...(isEditorMode && {
            onClick: handleClick,
            onContextMenu: handleContextMenu,
          }),
          shareableContent,
        },
      )}
      {isSelected && isEditorMode && <ComponentToolbox component={component} />}
    </>
  );
};
