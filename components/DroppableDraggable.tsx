import React, { PropsWithChildren } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  BoxProps,
  Text,
  useMantineTheme,
  Group,
  UnstyledButton,
  ActionIcon,
} from "@mantine/core";
import { useEditorStore } from "@/stores/editor";
import { Component, getComponentParent, removeComponent } from "@/utils/editor";
import { IconArrowUp, IconGripVertical, IconTrash } from "@tabler/icons-react";
import { DROP_INDICATOR_WIDTH, ICON_SIZE } from "@/utils/config";

type Props = {
  id: string;
  component: Component;
} & BoxProps;

export const DroppableDraggable = ({
  id,
  children,
  component,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const setTree = useEditorStore((state) => state.setTree);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const dropTarget = useEditorStore((state) => state.dropTarget);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const parent = getComponentParent(editorTree.root, id);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const { setNodeRef: setDroppableRef } = useDroppable({ id });

  const isOver = dropTarget?.id === id && !isDragging;
  const isSelected = selectedComponentId === id;

  const borders = isOver
    ? {
        border: `1px solid ${theme.colors.teal[6]}`,
        borderTop:
          dropTarget?.edge === "top"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
        borderBottom:
          dropTarget?.edge === "bottom"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
        borderLeft:
          dropTarget?.edge === "left"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
        borderRight:
          dropTarget?.edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
      }
    : isSelected
    ? {
        border: `1px solid ${theme.colors.teal[6]}`,
      }
    : {};

  const style = {
    transform: CSS.Translate.toString(transform),
    ...borders,
  };

  const haveNonRootParent = parent && parent.id !== "root";

  return (
    <Box
      {...props}
      pos="relative"
      sx={{
        zIndex: isDragging ? 9999 : undefined,
        width: component.props?.style?.width ?? "auto",
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedComponentId(id);
      }}
    >
      <Box
        ref={(ref) => {
          setDraggableRef(ref);
          setDroppableRef(ref);
        }}
        w="100%"
        h="100%"
        pos="relative"
        sx={{
          zIndex: isDragging ? 9999 : undefined,
          display: "flex",
          ...style,
        }}
        {...props}
      >
        {children}
      </Box>
      <Box
        pos="absolute"
        h={36}
        top={-36}
        sx={{
          zIndex: 99999,
          display: isSelected && !isDragging ? "block" : "none",
          background: theme.colors.teal[6],
          borderTopLeftRadius: theme.radius.sm,
          borderTopRightRadius: theme.radius.sm,
        }}
      >
        <Group py={4} px={8} h={36} noWrap spacing="xs" align="center">
          <UnstyledButton
            sx={{ cursor: "grab", alignItems: "center", display: "flex" }}
            {...listeners}
            {...attributes}
          >
            <IconGripVertical
              size={ICON_SIZE}
              color="white"
              strokeWidth={1.5}
            />
          </UnstyledButton>
          <Text color="white" size="xs" pr={haveNonRootParent ? 0 : "xs"}>
            {component.name}
          </Text>
          {haveNonRootParent && (
            <ActionIcon
              variant="transparent"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedComponentId(parent.id as string);
              }}
            >
              <IconArrowUp size={ICON_SIZE} color="white" strokeWidth={1.5} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="transparent"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearSelection();
              const copy = { ...editorTree };
              removeComponent(copy.root, component.id as string);
              setTree(copy);
            }}
          >
            <IconTrash size={ICON_SIZE} color="white" strokeWidth={1.5} />
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
};
