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
import { memo } from "react";
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

  const comp =
    iframeWindow?.document.querySelector(`[data-id="${component.id}"]`) ??
    iframeWindow?.document.getElementById(component.id!);

  if (isResizing || !comp) {
    return null;
  }

  const compRect = comp?.getBoundingClientRect();
  const boxStyle = {
    position: "absolute" as const,
    top: `${Math.abs(compRect.top) - 4}px`,
    left: `${Math.abs(compRect.left) - 4}px`,
    width: `${compRect.width + 8}px`,
    height: `${compRect.height + 8}px`,
    border: `2px solid ${theme.colors.blue[5]}`,
    pointerEvents: "none" as const,
    zIndex: 100,
  };

  const handleStyle = {
    position: "absolute" as const,
    width: "5px",
    height: "25px",
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
      width: "25px",
      height: "5px",
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
      width: "25px",
      height: "5px",
    },
  ];

  const handleResize = (direction: string) => {
    console.log(`Resizing ${direction}`);
  };

  if (!iframeWindow?.document?.body) return null;

  return createPortal(
    <>
      <Box style={boxStyle}>
        {handlePositions.map((pos, index) => (
          <Box
            key={index}
            style={{ ...handleStyle, ...pos }}
            onClick={() => handleResize(Object.keys(pos)[0])}
          />
        ))}
      </Box>
      <Group
        id="toolbox"
        p={10}
        h={24}
        noWrap
        spacing={2}
        top={`${Math.abs(compRect.top) - 32}px`}
        left={`${Math.abs(compRect.left)}px`}
        pos="absolute"
        style={{ zIndex: 200 }}
        bg={theme.colors.blue[5]}
        sx={(theme) => ({
          borderRadius: theme.radius.sm,
          boxShadow: theme.shadows.md,
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
