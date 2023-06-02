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
} from "@mantine/core";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { IconGripHorizontal } from "@tabler/icons-react";

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
  const dropTarget = useEditorStore((state) => state.dropTarget);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const { setNodeRef: setDroppableRef } = useDroppable({ id });

  const isOver = dropTarget?.id === id && !isDragging;
  const isSlected = selectedComponentId === id;

  const borders = isOver
    ? {
        borderTop: dropTarget?.edge === "top" ? `2px solid blue` : undefined,
        borderBottom:
          dropTarget?.edge === "bottom" ? `2px solid blue` : undefined,
        borderLeft: dropTarget?.edge === "left" ? `2px solid blue` : undefined,
        borderRight:
          dropTarget?.edge === "right" ? `2px solid blue` : undefined,
      }
    : isSlected
    ? {
        border: `1px solid blue`,
      }
    : {};

  const style = {
    transform: CSS.Translate.toString(transform),
    ...borders,
  };

  return (
    <Box
      {...props}
      pos="relative"
      sx={{ zIndex: isDragging ? 9999 : undefined }}
      w={`${
        component.columns === 0 ? "auto" : `${(component.columns * 100) / 12}%`
      }`}
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
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponentId(id);
        }}
      >
        {children}
      </Box>
      <Box
        pos="absolute"
        h={30}
        top={-30}
        sx={{
          zIndex: 99999,
          display: isSlected && !isDragging ? "block" : "none",
          background: "blue",
          borderTopLeftRadius: theme.radius.sm,
          borderTopRightRadius: theme.radius.sm,
        }}
      >
        <Group py={4} px={8} noWrap>
          <Text color="white" size="xs">
            {component.name}
          </Text>
          <UnstyledButton
            sx={{ cursor: "grab" }}
            {...listeners}
            {...attributes}
          >
            <IconGripHorizontal color="white" strokeWidth={1.5} />
          </UnstyledButton>
        </Group>
      </Box>
    </Box>
  );
};
