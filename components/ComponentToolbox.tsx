import { ActionIconTransparent } from "@/components/ActionIconTransparent";
import { useDraggable } from "@/hooks/editor/useDraggable";
import { useOnDragStart } from "@/hooks/editor/useOnDragStart";
import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { useUserConfigStore } from "@/stores/userConfig";
import { theme } from "@/utils/branding";
import {
  ToolboxAction,
  componentMapper,
  structureMapper,
} from "@/utils/componentMapper";
import { ICON_DELETE, ICON_SIZE, NAVBAR_WIDTH } from "@/utils/config";
import {
  ComponentStructure,
  EditorTreeCopy,
  addComponent,
  getComponentIndex,
  getComponentParent,
  getComponentTreeById,
  removeComponent,
  removeComponentFromParent,
  Component,
} from "@/utils/editor";
import { Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { createPortal } from "react-dom";

type Props = {
  component: Component;
};

const ComponentToolboxInner = ({ component }: Props) => {
  const isResizing = useEditorStore((state) => state.isResizing);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const editorTheme = useThemeStore((state) => state.theme);

  const editorTree = useEditorTreeStore(
    (state) => state.tree as EditorTreeCopy,
  );
  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const [toolboxStyle, setToolboxStyle] = useState({
    top: "-24px",
    left: "0px",
  });
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setIsCustomComponentModalOpen = useUserConfigStore(
    (state) => state.setIsCustomComponentModalOpen,
  );

  const componentData = componentMapper[component?.name || ""];
  let toolboxActions = componentData?.toolboxActions || [];

  const isMainContent = component.id === "main-content";

  if (isMainContent) {
    toolboxActions = toolboxActions.filter(
      (action) =>
        action.id !== "add-column-to-parent" && action.id !== "insert-row",
    );
  }

  const blockedToolboxActions = componentData?.blockedToolboxActions || [];

  const parentTree = useMemo(
    () =>
      component.id
        ? getComponentParent(
            editorTree.root,
            component.id?.split("-related-")[0],
          )
        : null,
    [editorTree.root, component.id],
  );

  const onDragStart = useOnDragStart();

  const draggable = useDraggable({
    id: component.id || "",
    onDragStart,
    currentWindow: iframeWindow,
    ghostImagePosition: isTabPinned ? NAVBAR_WIDTH : 0,
  });

  const calculatePosition = useCallback(() => {
    const comp =
      iframeWindow?.document.querySelector(`[data-id="${component.id}"]`) ??
      iframeWindow?.document.getElementById(component.id!);

    if (comp) {
      const compRect = comp.getBoundingClientRect();

      setToolboxStyle({
        top: `${Math.abs(compRect.top) - 24}px`,
        left: `${Math.abs(compRect.left)}px`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component.id, editorTree.root]);

  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  if (isResizing) {
    return null;
  }

  const haveNonRootParent = parentTree && parentTree.id !== "root";

  const canMove =
    !component.fixedPosition && !blockedToolboxActions.includes("move");
  const canWrapWithContainer = !blockedToolboxActions.includes(
    "wrap-with-container",
  );

  return createPortal(
    <>
      <Group
        id="toolbox"
        px={4}
        h={24}
        noWrap
        spacing={2}
        top={toolboxStyle.top}
        left={toolboxStyle.left}
        pos="absolute"
        style={{ zIndex: 200 }}
        bg={theme.colors.teal[6]}
        sx={(theme) => ({
          borderTopLeftRadius: theme.radius.sm,
          borderTopRightRadius: theme.radius.sm,
        })}
      >
        <Tooltip label="Move" fz="xs">
          <UnstyledButton
            sx={{
              cursor: !canMove ? "default" : "move",
              alignItems: "center",
              display: "flex",
            }}
            {...(!canMove ? {} : draggable)}
          >
            {canMove && (
              <IconGripVertical
                size={ICON_SIZE}
                color="white"
                strokeWidth={1.5}
              />
            )}
          </UnstyledButton>
        </Tooltip>
        <Text color="white" size="xs" pr={haveNonRootParent ? 8 : "xs"}>
          {(component.description || "").length > 20
            ? `${component.description?.substring(0, 20)}...`
            : component.description}
        </Text>
        {haveNonRootParent && (
          <ActionIconTransparent
            iconName="IconArrowUp"
            tooltip="Go up"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedComponentIds(() => [parentTree.id!]);
            }}
          />
        )}
        {canWrapWithContainer && (
          <ActionIconTransparent
            iconName="IconBoxMargin"
            tooltip="Wrap container"
            onClick={() => {
              const container = structureMapper["Container"].structure({
                theme: editorTheme,
              }) as ComponentStructure;

              const selectedComponentId = selectedComponentIdSelector(
                useEditorTreeStore.getState(),
              );

              const componentToBeWrapped = getComponentTreeById(
                editorTree.root,
                selectedComponentId!,
              )! as ComponentStructure;

              if (container.props && container.props.style) {
                container.props.style = {
                  ...container.props.style,
                  width: "fit-content",
                  padding: "0px",
                };
                container.children = [componentToBeWrapped];
              }

              addComponent(
                editorTree.root,
                container,
                {
                  id: parentTree?.id!,
                  edge: "left",
                },
                getComponentIndex(parentTree!, component.id!),
              );

              removeComponentFromParent(
                editorTree.root,
                component,
                parentTree?.id!,
              );
              setEditorTree(editorTree, {
                action: `Wrapped ${component.name} with a Container`,
              });
            }}
          />
        )}
        {toolboxActions.map((toolBoxAction: ToolboxAction) => {
          return (
            <ActionIconTransparent
              key={toolBoxAction.id}
              iconName={toolBoxAction.icon}
              tooltip={toolBoxAction.name}
              onClick={() => {
                toolBoxAction.onClick({ component, parent });
              }}
            />
          );
        })}
        {!isMainContent && (
          <>
            <ActionIconTransparent
              iconName={ICON_DELETE}
              tooltip="Delete"
              onClick={() => {
                removeComponent(editorTree.root, component.id!);
                setEditorTree(editorTree, {
                  action: `Removed ${component?.name}`,
                });
              }}
            />
            <ActionIconTransparent
              iconName="IconDeviceFloppy"
              tooltip="Save as custom component"
              onClick={(e) => {
                e.stopPropagation();
                setIsCustomComponentModalOpen(true);
              }}
            />
          </>
        )}
      </Group>
    </>,
    iframeWindow?.document?.body,
  );
};

export const ComponentToolbox = memo(ComponentToolboxInner);
