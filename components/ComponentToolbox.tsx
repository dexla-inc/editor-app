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
} from "@/utils/editor";
import { Group, Text, Tooltip, UnstyledButton, Box } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import { memo, useState, useCallback, useEffect, useRef } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";

const COLUMN_WIDTH = 96; // 96fr
const ROW_HEIGHT = 10; // 10px

const ComponentToolboxInner = () => {
  const isResizing = useEditorStore((state) => state.isResizing);
  const setIsResizing = useEditorStore((state) => state.setIsResizing);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const editorTheme = useThemeStore((state) => state.theme);
  const component = useEditorTreeStore(
    useShallow((state) => {
      const selectedComponentId = selectedComponentIdSelector(state);
      const componentProps = {
        ...(pick(state.componentMutableAttrs[selectedComponentId!], [
          "id",
          "name",
          "description",
          "fixedPosition",
          "props",
        ]) || {}),
      };
      componentProps.props = {
        style: {
          gridColumn: componentProps.props?.style.gridColumn,
          gridRow: componentProps.props?.style?.gridRow,
        },
      };
      return componentProps;
    }),
  );
  // const [resizeDirection, setResizeDirection] = useState("");
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [compRect, setCompRect] = useState<DOMRect | null>(null);

  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setIsCustomComponentModalOpen = useUserConfigStore(
    (state) => state.setIsCustomComponentModalOpen,
  );

  const onDragStart = useOnDragStart();

  const draggable = useDraggable({
    id: component.id || "",
    onDragStart,
    currentWindow: iframeWindow,
  });

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
  const canMove =
    !component.fixedPosition && !blockedToolboxActions.includes("move");

  const comp = (iframeWindow?.document.querySelector(
    `[data-id="${component.id}"]`,
  ) ?? iframeWindow?.document.getElementById(component.id!)) as HTMLElement;

  useEffect(() => {
    if (comp) {
      const newRect = comp.getBoundingClientRect();
      setCompRect(newRect);
    }
  }, [
    component.id,
    component.props?.style?.gridColumn,
    component.props?.style?.gridRow,
  ]);

  const boxStyle = compRect
    ? {
        position: "absolute" as const,
        top: `${Math.abs(compRect.top) - 8}px`,
        left: `${Math.abs(compRect.left) - 8}px`,
        width: `${compRect.width + 14}px`,
        height: `${compRect.height + 16}px`,
        border: `2px solid ${theme.colors.blue[5]}`,
        pointerEvents: "none" as const,
        zIndex: 100,
      }
    : {};

  const handleStyle = {
    position: "absolute" as const,
    width: "9px",
    height: "min(25px, 60%)",
    backgroundColor: "#ffffff",
    border: `2px solid ${theme.colors.blue[5]}`,
    pointerEvents: "auto" as const,
    cursor: "pointer",
    borderRadius: "4px",
  };

  const handlePositions = [
    {
      top: "50%",
      left: "-6px",
      transform: "translateY(-50%)",
      cursor: "ew-resize",
      direction: "left",
    },
    {
      top: "-6px",
      left: "50%",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
      width: "min(25px, 60%)",
      height: "9px",
      direction: "top",
    },
    {
      top: "50%",
      right: "-6px",
      transform: "translateY(-50%)",
      cursor: "ew-resize",
      direction: "right",
    },
    {
      bottom: "-6px",
      left: "50%",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
      width: "min(25px, 60%)",
      height: "9px",
      direction: "bottom",
    },
  ];

  const resizeBoxStartCoords = useRef<any>(null);
  const compNewCoords = useRef<any>(null);
  const resizeDirection = useRef<string>("");
  const handleResizeStart = (direction: string, event: React.MouseEvent) => {
    setIsResizing(true);
    resizeDirection.current = direction;
    const resizeBoxRect = iframeWindow?.document
      .getElementById("resize-box")
      ?.getBoundingClientRect();
    resizeBoxStartCoords.current = {
      startWidth: resizeBoxRect!.width,
      startHeight: resizeBoxRect!.height,
      startX: event.clientX,
      startY: event.clientY,
      startTop: resizeBoxRect!.top,
      startLeft: resizeBoxRect!.left,
    };
    // setInitialSize({ width: compRect!.width, height: compRect!.height });
    // setInitialPosition({ x: event.clientX, y: event.clientY });
    console.log(`Started resizing ${direction}`, event.target);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    // @ts-ignore
    resizeDirection.current = null;
    // setResizeDirection("");
    console.log("Ended resizing");
    const { updateTreeComponentAttrs, componentMutableAttrs } =
      useEditorTreeStore.getState();
    const componentAttrs = componentMutableAttrs[comp.id!];
    console.log("--->", compNewCoords.current);
    updateTreeComponentAttrs({
      componentIds: [comp.id!],
      attrs: {
        props: {
          style: { ...componentAttrs?.props?.style, ...compNewCoords.current },
        },
      },
    });
  };

  const handleResize = useCallback(
    (event: React.MouseEvent) => {
      if (isResizing && comp) {
        const resizeBoxElement =
          iframeWindow?.document.getElementById("resize-box")!;

        const totalColumns = 96;
        const rowHeight = 10; // in pixels
        const viewportWidth = iframeWindow?.innerWidth;

        const columnWidth = viewportWidth! / totalColumns;
        const currentStyle = window.getComputedStyle(comp);

        // Parse gridColumn and gridRow
        const [gridColumnStart, gridColumnEnd] = currentStyle.gridColumn
          .split(" / ")
          .map((value) => {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? 1 : parsed;
          });
        const [gridRowStart, gridRowEnd] = currentStyle.gridRow
          .split(" / ")
          .map((value) => {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? 1 : parsed;
          });

        let value = "";
        switch (resizeDirection.current) {
          case "left":
            resizeBoxElement.style.width = `${resizeBoxStartCoords?.current!.startWidth + (resizeBoxStartCoords.current!.startX - event.clientX)}px`;
            resizeBoxElement.style.left = `${resizeBoxStartCoords?.current!.startLeft + (event.clientX - resizeBoxStartCoords.current!.startX)}px`;
            const newLeftColumn = Math.max(
              1,
              Math.floor(parseInt(resizeBoxElement.style.left) / columnWidth) +
                1,
            );
            value = `${newLeftColumn} / ${gridColumnEnd}`;
            compNewCoords.current = {
              gridColumn: value,
            };
            comp.style.gridColumn = value;
            break;
          case "top":
            resizeBoxElement.style.height = `${resizeBoxStartCoords?.current!.startHeight + (resizeBoxStartCoords.current!.startY - event.clientY)}px`;
            resizeBoxElement.style.top = `${resizeBoxStartCoords?.current!.startTop + (event.clientY - resizeBoxStartCoords.current!.startY)}px`;
            const newTopRow = Math.max(
              1,
              Math.floor(parseInt(resizeBoxElement.style.top) / rowHeight) + 1,
            );
            value = `${newTopRow} / ${gridRowEnd}`;
            compNewCoords.current = {
              gridRow: value,
            };
            comp.style.gridRow = value;
            break;
          case "right":
            resizeBoxElement.style.width = `${resizeBoxStartCoords?.current!.startWidth + (event.clientX - resizeBoxStartCoords.current!.startX)}px`;
            const newRightColumn = Math.max(
              gridColumnStart + 1,
              Math.ceil(
                (parseInt(resizeBoxElement.style.left) +
                  parseInt(resizeBoxElement.style.width)) /
                  columnWidth,
              ),
            );
            value = `${gridColumnStart} / ${newRightColumn}`;
            compNewCoords.current = {
              gridColumn: value,
            };
            comp.style.gridColumn = value;
            break;
          case "bottom":
            resizeBoxElement.style.height = `${resizeBoxStartCoords?.current!.startHeight + (event.clientY - resizeBoxStartCoords.current!.startY)}px`;
            const newBottomRow = Math.max(
              gridRowStart + 1,
              Math.ceil(
                (parseInt(resizeBoxElement.style.top) +
                  parseInt(resizeBoxElement.style.height)) /
                  rowHeight,
              ),
            );
            value = `${gridRowStart} / ${newBottomRow}`;
            compNewCoords.current = {
              gridRow: value,
            };
            comp.style.gridRow = value;
            break;
        }

        // Ensure comp stays within resize-box
        const resizeBoxRect = resizeBoxElement.getBoundingClientRect();
        const compRect = comp.getBoundingClientRect();
        if (compRect.right > resizeBoxRect.right) {
          comp.style.width = `${resizeBoxRect.width}px`;
        }
        if (compRect.bottom > resizeBoxRect.bottom) {
          comp.style.height = `${resizeBoxRect.height}px`;
        }
      }
    },
    [isResizing, comp, resizeDirection, initialPosition, iframeWindow],
  );

  if (!iframeWindow?.document?.body || !compRect) return null;

  return createPortal(
    <>
      <Box
        id="resize-box"
        style={boxStyle}
        onMouseMove={handleResize}
        onMouseUp={handleResizeEnd}
        onMouseLeave={handleResizeEnd}
      >
        {handlePositions.map((pos, index) => (
          <Box
            key={index}
            style={{ ...handleStyle, ...pos } as React.CSSProperties}
            onMouseDown={(e) => handleResizeStart(pos.direction, e)}
          />
        ))}
      </Box>
      {/* <Group
        id="toolbox"
        p={10}
        h={24}
        noWrap
        spacing={2}
        top={`${Math.abs(compRect.top) - 34}px`}
        left={`${Math.abs(compRect.left - 6)}px`}
        pos="absolute"
        style={{ zIndex: 200 }}
        bg={theme.colors.blue[5]}
        sx={(theme) => ({
          borderRadius: theme.radius.sm,
          boxShadow: "0px 0.8px 10.8px 0px #8B8B8B8C",
        })}
      >
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
        <Text color="white" size="xs">
          {component.description}
        </Text>
      </Group> */}
    </>,
    iframeWindow?.document?.body as any,
  );
};

export const ComponentToolbox = memo(ComponentToolboxInner);
