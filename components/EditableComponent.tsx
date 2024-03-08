import { useComputeCurrentState } from "@/hooks/reactQuery/useComputeCurrentState";
import { useAppMode } from "@/hooks/useAppMode";
import {
  useComponentContextEventHandler,
  useComponentContextMenu,
} from "@/hooks/useComponentContextMenu";
import { useEditorShadows } from "@/hooks/useEditorShadows";
import {
  handleBackground,
  useComputeChildStyles,
  useEditorClickHandler,
  usePropsWithOverwrites,
} from "@/hooks/useMergedProps";
import { useTriggers } from "@/hooks/useTriggers";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { ComponentTree } from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { PropsWithChildren, cloneElement } from "react";

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
  console.log("EditableComponent");
  const { isPreviewMode } = useAppMode();
  const isLive = useEditorStore((state) => state.isLive);
  const isEditorMode = !isPreviewMode && !isLive;
  const component = useEditorTreeStore(
    (state) => state.componentMutableAttrs[id] ?? {},
  );

  let currentState = useComputeCurrentState(component);

  if (shareableContent?.parentState)
    currentState = shareableContent.parentState;

  const isResizing = useEditorStore((state) => state.isResizing);
  const { computeChildStyles } = useComputeChildStyles();

  const { componentContextMenu, forceDestroyContextMenu } =
    useComponentContextMenu();

  const handleContextMenu = useComponentContextEventHandler(
    { ...{}, ...componentTree, ...component },
    componentContextMenu,
  );

  const triggers = useTriggers({
    entity: component,
  });

  const { isPicking, droppable, tealOutline } = useEditorShadows({
    componentId: id,
    isSelected,
    selectedByOther,
  });

  const propsWithOverwrites = usePropsWithOverwrites(
    component,
    isEditorMode,
    currentState,
    triggers,
  );

  const childStyles = computeChildStyles(
    propsWithOverwrites,
    currentState,
    isEditorMode,
  );

  handleBackground(component, childStyles);

  delete propsWithOverwrites.style;

  const handleClick = useEditorClickHandler(
    id,
    isEditorMode,
    forceDestroyContextMenu,
    propsWithOverwrites,
    isPicking,
  );

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
    </>
  );
};
