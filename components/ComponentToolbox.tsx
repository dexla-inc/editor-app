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
import { memo, useState } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";

const ComponentToolboxInner = () => {
  const isResizing = useEditorStore((state) => state.isResizing);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const editorTheme = useThemeStore((state) => state.theme);
  const component = useEditorTreeStore(
    useShallow((state) => {
      const selectedComponentId = selectedComponentIdSelector(state);
      return {
        ...(pick(state.componentMutableAttrs[selectedComponentId!], [
          "name",
          "description",
          "fixedPosition",
        ]) || {}),
        id: state.selectedComponentIds?.at(-1),
      };
    }),
  );
  const [isResizingComponent, setIsResizingComponent] = useState(false);

  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
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

  const comp = (iframeWindow?.document.querySelector(
    `[data-id="${component.id}"]`,
  ) ?? iframeWindow?.document.getElementById(component.id!)) as HTMLElement;

  if (isResizing || !comp) {
    return null;
  }

  const compRect = comp?.getBoundingClientRect();
  const boxStyle = {
    position: "absolute" as const,
    top: `${Math.abs(compRect.top) - 6}px`,
    left: `${Math.abs(compRect.left) - 6}px`,
    width: `${compRect.width + 12}px`,
    height: `${compRect.height + 12}px`,
    border: `2px solid ${theme.colors.blue[5]}`,
    pointerEvents: "none" as const,
    zIndex: 100,
  };

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
    },
    {
      top: "-4px",
      left: "50%",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
      width: "min(25px, 60%)",
      height: "7px",
    },
    {
      top: "50%",
      right: "-4px",
      transform: "translateY(-50%)",
      cursor: "ew-resize",
    },
    {
      bottom: "-4px",
      left: "50%",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
      width: "min(25px, 60%)",
      height: "7px",
    },
  ];

  const handleResizeStart = (direction: string) => {
    setIsResizingComponent(true);
    console.log(`Started resizing ${direction}`);
  };

  const handleResizeEnd = () => {
    setIsResizingComponent(false);
    console.log("Ended resizing");
  };

  const handleResize = (event: React.MouseEvent, direction: string) => {
    if (isResizingComponent) {
      // Implement your resize logic here
      console.log(`Resizing ${direction}`, event.clientX, event.clientY);
      console.log(comp);
      if (comp) {
        const rect = comp.getBoundingClientRect();
        const dx = event.clientX - rect.left;
        const dy = event.clientY - rect.top;

        switch (direction) {
          case "left":
            comp.style.width = `${rect.width - dx}px`;
            comp.style.left = `${rect.left + dx}px`;
            break;
          case "top":
            comp.style.height = `${rect.height - dy}px`;
            comp.style.top = `${rect.top + dy}px`;
            break;
          case "right":
            comp.style.width = `${rect.width + (event.clientX - rect.right)}px`;
            break;
          case "bottom":
            comp.style.height = `${rect.height + (event.clientY - rect.bottom)}px`;
            break;
        }
      }
    }
  };

  if (!iframeWindow?.document?.body) return null;

  return createPortal(
    <>
      <Box
        style={boxStyle}
        onMouseMove={(e) => isResizingComponent && handleResize(e, "current")}
        onMouseUp={handleResizeEnd}
        onMouseLeave={handleResizeEnd}
      >
        {handlePositions.map((pos, index) => (
          <Box
            key={index}
            style={{ ...handleStyle, ...pos }}
            onMouseDown={() => handleResizeStart(Object.keys(pos)[0])}
          />
        ))}
      </Box>
      <Group
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
        <Text color="white" size="xs">
          {component.name}
        </Text>
        {/* ... rest of the toolbox content ... */}
      </Group>
    </>,
    iframeWindow?.document?.body as any,
  );
};

export const ComponentToolbox = memo(ComponentToolboxInner);
