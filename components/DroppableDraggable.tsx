import React, { PropsWithChildren } from "react";
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
import { Component, getComponentParent } from "@/utils/editor";
import {
  IconArrowUp,
  IconDeviceFloppy,
  IconGripVertical,
  IconNewSection,
} from "@tabler/icons-react";
import { DROP_INDICATOR_WIDTH, ICON_SIZE } from "@/utils/config";
import { useDraggable } from "@/hooks/useDraggable";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useHover } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateComponent } from "@/requests/components/mutations";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { encodeSchema } from "@/utils/compression";
import { getComponentList } from "@/requests/components/queries";

type Props = {
  id: string;
  component: Component;
  customComponentModal: any;
} & BoxProps;

export const DroppableDraggable = ({
  id,
  children,
  component,
  customComponentModal,
  ...props
}: PropsWithChildren<Props>) => {
  const { hovered, ref } = useHover();
  const router = useRouter();
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const queryClient = useQueryClient();
  const componentList = useQuery({
    queryKey: ["components"],
    queryFn: () => getComponentList(router.query.id as string),
    enabled: !!router.query.id,
  });

  const updateComponentMutation = useMutation(updateComponent, {
    onSettled(_, err) {
      if (err) {
        console.log(err);
        showNotification({
          title: "Oops",
          message: "Something went wrong while trying to update the component.",
          autoClose: true,
          color: "red",
          withBorder: true,
        });
      } else {
        showNotification({
          title: "Component Saved",
          message: "Your Component was saved successfully.",
          autoClose: true,
          withBorder: true,
        });
        queryClient.invalidateQueries(["components"]);
      }
    },
  });

  const parent = getComponentParent(editorTree.root, id);

  const onDragStart = useOnDragStart();
  const onDrop = useOnDrop();

  const draggable = useDraggable({
    id,
    onDragStart,
    currentWindow: iframeWindow,
  });
  const { edge, ...droppable } = useDroppable({
    id,
    activeId: selectedComponentId,
    onDrop,
    currentWindow: iframeWindow,
  });

  const isSelected = selectedComponentId === id;

  const baseBorder = `1px solid ${theme.colors.teal[6]}`;
  const isOver = currentTargetId === id || hovered;

  const borders = isOver
    ? {
        borderTop:
          edge === "top"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : baseBorder,
        borderBottom:
          edge === "bottom"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : baseBorder,
        borderLeft:
          edge === "left"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : baseBorder,
        borderRight:
          edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : baseBorder,
      }
    : isSelected
    ? { border: baseBorder }
    : {};

  const isContentWrapper = id === "content-wrapper";
  const haveNonRootParent = parent && parent.id !== "root";

  return (
    <Box
      ref={ref}
      id={id}
      {...props}
      pos="relative"
      sx={{
        width: component.props?.style?.width ?? "auto",
        ...borders,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedComponentId(id);
      }}
    >
      <Box
        w="100%"
        h="auto"
        pos="relative"
        sx={{
          display: "flex",
        }}
        {...droppable}
        {...props}
      >
        {children}
      </Box>
      {!isContentWrapper && (
        <Box
          pos="absolute"
          h={36}
          top={-36}
          sx={{
            zIndex: 90,
            display: isSelected ? "block" : "none",
            background: theme.colors.teal[6],
            borderTopLeftRadius: theme.radius.sm,
            borderTopRightRadius: theme.radius.sm,
          }}
        >
          <Group py={4} px={8} h={36} noWrap spacing="xs" align="center">
            {!component.props?.fixedPosition && (
              <UnstyledButton
                sx={{ cursor: "move", alignItems: "center", display: "flex" }}
                {...draggable}
              >
                <IconGripVertical
                  size={ICON_SIZE}
                  color="white"
                  strokeWidth={1.5}
                />
              </UnstyledButton>
            )}
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
                customComponentModal.open();
              }}
            >
              <IconNewSection
                size={ICON_SIZE}
                color="white"
                strokeWidth={1.5}
              />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                /* updateComponentMutation.mutate({
                  projectId: router.query.id as string,
                  values: {
                    id: component.id,
                    content: encodeSchema(JSON.stringify(component)) as string,
                    description: component.description,
                    type: component.name,
                    name: component.name,
                    scope:
                      componentList.data?.results.find(
                        (c) => c.id === component.id
                      )?.scope ?? "GLOBAL",
                  },
                }); */
              }}
            >
              <IconDeviceFloppy
                size={ICON_SIZE}
                color="white"
                strokeWidth={1.5}
              />
            </ActionIcon>
          </Group>
        </Box>
      )}
    </Box>
  );
};
