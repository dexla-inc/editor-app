import { ActionIconTransparent } from "@/components/ActionIconTransparent";
import { useDraggable } from "@/hooks/useDraggable";
import { useOnDragStart } from "@/hooks/useOnDragStart";
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
  EditorTreeCopy,
  addComponent,
  getComponentIndex,
  getComponentParent,
  removeComponent,
  removeComponentFromParent,
} from "@/utils/editor";
import { Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo } from "react";

type Props = {
  customComponentModal: any;
};

export const ComponentToolbox = ({ customComponentModal }: Props) => {
  const isResizing = useEditorStore((state) => state.isResizing);
  const isPreviewMode = useUserConfigStore((state) => state.isPreviewMode);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const editorTheme = useThemeStore((state) => state.theme);

  // Move to functions
  const editorTree = useEditorStore((state) => state.tree as EditorTreeCopy);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const setSelectedComponentIds = useEditorStore(
    (state) => state.setSelectedComponentIds,
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentIds?.at(-1),
  );

  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);

  const component = useEditorStore(
    (state) => state.componentMutableAttrs[selectedComponentId!],
  );

  const id = component?.id;
  const componentData = componentMapper[component?.name || ""];
  let toolboxActions = componentData?.toolboxActions || [];

  const isBody = component?.id === "content-wrapper";
  const isMainContent = component?.id === "main-content";

  if (isMainContent) {
    toolboxActions = toolboxActions.filter(
      (action) =>
        action.id !== "add-column-to-parent" && action.id !== "insert-row",
    );
  } else if (isBody) {
    toolboxActions = [];
  }

  const blockedToolboxActions = componentData?.blockedToolboxActions || [];

  const parentTree = useMemo(
    () => (id ? getComponentParent(editorTree.root, id) : null),
    [editorTree.root, id],
  );

  const onDragStart = useOnDragStart();

  const draggable = useDraggable({
    id: id || "",
    onDragStart,
    currentWindow: iframeWindow,
    ghostImagePosition: isTabPinned ? NAVBAR_WIDTH : 0,
  });

  const calculatePosition = useCallback(() => {
    if (component?.id && !isPreviewMode) {
      const canvas = document.getElementById("iframe-canvas");
      const toolbox = document.getElementById("toolbox");
      const comp = iframeWindow?.document.getElementById(component.id);

      if (toolbox && comp && canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const toolboxRect = toolbox.getBoundingClientRect();
        const compRect = comp.getBoundingClientRect();

        toolbox.style.top = `${
          canvasRect.top + compRect.top - toolboxRect.height
        }px`;
        toolbox.style.left = `${canvasRect.left + compRect.left}px`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    component?.id,
    iframeWindow?.document,
    isPreviewMode,
    editorTree.timestamp,
  ]);

  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  useEffect(() => {
    const el = iframeWindow?.document.querySelector(
      ".iframe-canvas-ScrollArea-viewport",
    );
    el?.addEventListener("scroll", calculatePosition);
    return () => el?.removeEventListener("scroll", calculatePosition);
  }, [calculatePosition, iframeWindow]);

  if (!component || isPreviewMode || !id || isResizing) {
    return null;
  }

  const haveNonRootParent = parentTree && parentTree.id !== "root";

  if (!selectedComponentId || !component) {
    return null;
  }

  const canMove =
    !component.fixedPosition && !blockedToolboxActions.includes("move");
  const canWrapWithContainer = !blockedToolboxActions.includes(
    "wrap-with-container",
  );

  return (
    <Group
      id="toolbox"
      px={4}
      h={24}
      noWrap
      spacing={2}
      top={-24}
      left={0}
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
            });

            if (container.props && container.props.style) {
              container.props.style = {
                ...container.props.style,
                width: "fit-content",
                padding: "0px",
              };
            }

            const containerId = addComponent(
              editorTree.root,
              container,
              {
                id: parentTree?.id!,
                edge: "left",
              },
              getComponentIndex(parentTree!, id),
            );

            addComponent(editorTree.root, component, {
              id: containerId,
              edge: "left",
            });

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
      {!isMainContent && !isBody && (
        <>
          <ActionIconTransparent
            iconName={ICON_DELETE}
            tooltip="Delete"
            onClick={() => {
              removeComponent(editorTree.root, component?.id!);
              setEditorTree(editorTree, {
                action: `Removed ${component?.name}`,
              });
            }}
          />
          {customComponentModal && (
            <ActionIconTransparent
              iconName="IconDeviceFloppy"
              tooltip="Save as custom component"
              onClick={() => {
                customComponentModal.open();
              }}
            />
          )}
        </>
      )}
    </Group>
  );
};
