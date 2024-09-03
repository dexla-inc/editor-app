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
  const [resizeDirection, setResizeDirection] = useState("");
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
    iframeWindow,
  ]);

  const boxStyle = compRect
    ? {
        position: "absolute" as const,
        top: `${Math.abs(compRect.top) - 6}px`,
        left: `${Math.abs(compRect.left) - 6}px`,
        width: `${compRect.width + 12}px`,
        height: `${compRect.height + 12}px`,
        border: `2px solid ${theme.colors.blue[5]}`,
        pointerEvents: "none" as const,
        zIndex: 100,
      }
    : {};

  const handleStyle = {
    position: "absolute" as const,
    width: "7px",
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
      left: "-4px",
      transform: "translateY(-50%)",
      cursor: "ew-resize",
      direction: "left",
    },
    {
      top: "-4px",
      left: "50%",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
      width: "min(25px, 60%)",
      height: "7px",
      direction: "top",
    },
    {
      top: "50%",
      right: "-4px",
      transform: "translateY(-50%)",
      cursor: "ew-resize",
      direction: "right",
    },
    {
      bottom: "-4px",
      left: "50%",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
      width: "min(25px, 60%)",
      height: "7px",
      direction: "bottom",
    },
  ];

  const resizeBoxStartCoords = useRef<any>(null);
  const handleResizeStart = (direction: string, event: React.MouseEvent) => {
    setIsResizing(true);
    setResizeDirection(direction);
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
    setInitialSize({ width: compRect!.width, height: compRect!.height });
    setInitialPosition({ x: event.clientX, y: event.clientY });
    console.log(`Started resizing ${direction}`, event.target);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeDirection("");
    console.log("Ended resizing");
  };

  const handleResize = useCallback(
    (event: React.MouseEvent) => {
      if (isResizing && comp) {
        console.log("resizeBoxStartCoords", resizeBoxStartCoords.current);
        const resizeBoxElement =
          iframeWindow?.document.getElementById("resize-box")!;

        const totalColumns = 96;
        const rowHeight = 10; // in pixels
        const viewportWidth = iframeWindow?.innerWidth;
        const viewportHeight = iframeWindow?.innerHeight;

        const columnWidth = viewportWidth! / totalColumns;
        const cursorColumn = Math.floor(event.clientX / columnWidth) + 1;
        const cursorRow = Math.floor(event.clientY / rowHeight) + 1;

        // console.log(`Cursor is in column ${cursorColumn} and row ${cursorRow}`);

        const dx = event.clientX - initialPosition.x;
        const dy = event.clientY - initialPosition.y;
        // console.log("dx", event.clientX, initialPosition.x, dx);
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
        // console.log(gridColumnStart, gridColumnEnd)
        switch (resizeDirection) {
          case "left":
            // comp.style.gridColumn = `${Math.max(1, newLeftColumns)} / ${gridColumnEnd}`;
            resizeBoxElement.style.width = `${resizeBoxStartCoords?.current!.startWidth + (resizeBoxStartCoords.current!.startX - event.clientX)}px`;
            resizeBoxElement.style.left = `${resizeBoxStartCoords?.current!.startLeft + (event.clientX - resizeBoxStartCoords.current!.startX)}px`;
            break;
          case "top":
            const newTopRows =
              dy < 0
                ? Math.ceil(dy / ROW_HEIGHT) // Moving up (increasing size)
                : Math.floor(dy / ROW_HEIGHT); // Moving down (decreasing size)
            // comp.style.gridRow = `${Math.max(1, cursorRow)} / ${gridRowEnd}`;

            resizeBoxElement.style.height = `${resizeBoxStartCoords?.current!.startHeight + (resizeBoxStartCoords.current!.startY - event.clientY)}px`;
            resizeBoxElement.style.top = `${resizeBoxStartCoords?.current!.startTop + (event.clientY - resizeBoxStartCoords.current!.startY)}px`;
            break;
          case "right":
            const newRightColumns =
              dx > 0
                ? Math.floor(dx / COLUMN_WIDTH) // Moving right (increasing size)
                : Math.ceil(dx / COLUMN_WIDTH); // Moving left (decreasing size)
            const newColumnSpan =
              gridColumnEnd - gridColumnStart + newRightColumns;
            // comp.style.gridColumn = `${gridColumnStart} / ${Math.max(1, cursorColumn)}`;
            resizeBoxElement.style.width = `${resizeBoxStartCoords?.current!.startWidth + (event.clientX - resizeBoxStartCoords.current!.startX)}px`;
            break;
          case "bottom":
            const newBottomRows =
              dy > 0
                ? Math.floor(dy / ROW_HEIGHT) // Moving down (increasing size)
                : Math.ceil(dy / ROW_HEIGHT); // Moving up (decreasing size)
            const newRowSpan = gridRowEnd - gridRowStart + newBottomRows;
            // comp.style.gridRow = `${gridRowStart} / ${Math.max(1, cursorRow)}`;
            resizeBoxElement.style.height = `${resizeBoxStartCoords?.current!.startHeight + (event.clientY - resizeBoxStartCoords.current!.startY)}px`;
            break;
        }
      }
    },
    [isResizing, comp, resizeDirection, initialPosition],
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
