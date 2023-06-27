import React, { PropsWithChildren, useCallback } from "react";
import {
  BoxProps,
  Box,
  Card,
  useMantineTheme,
  ActionIcon,
  Group,
} from "@mantine/core";
import { ICON_SIZE } from "@/utils/config";
import { IconX } from "@tabler/icons-react";
import { deleteCustomComponent } from "@/requests/projects/mutations";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useDraggable } from "@/hooks/useDraggable";
import { useEditorStore } from "@/stores/editor";

type Props = {
  id: string;
  data: any;
  isDeletable: boolean;
} & BoxProps;

export const Draggable = ({
  id,
  children,
  style,
  data,
  isDeletable,
  ...props
}: PropsWithChildren<Props>) => {
  const router = useRouter();
  const theme = useMantineTheme();

  const setComponentToAdd = useEditorStore((state) => state.setComponentToAdd);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );

  const onDragStart = useCallback(() => {
    setSelectedComponentId(id);
    setComponentToAdd(data);
  }, [data, id, setComponentToAdd, setSelectedComponentId]);

  const draggable = useDraggable({
    id: `add-${id}`,
    onDragStart,
  });

  const styles = {
    ...style,
    cursor: "move",
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation(deleteCustomComponent, {
    onSettled(_, err) {
      if (err) {
        console.log(err);
      }

      queryClient.invalidateQueries(["components"]);
    },
  });

  return (
    <Box
      id={`add-${id}`}
      pos="relative"
      w="100%"
      {...props}
      style={{ ...styles }}
    >
      <Card
        w="100%"
        withBorder
        pos="relative"
        sx={{
          ":hover": {
            boxShadow: theme.shadows.sm,
          },
        }}
      >
        <Group position="apart" noWrap>
          <Box {...draggable} w="100%">
            {children}
          </Box>
          {isDeletable && (
            <ActionIcon
              size="xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                mutate({
                  projectId: router.query.id as string,
                  id,
                });
              }}
            >
              <IconX size={ICON_SIZE} />
            </ActionIcon>
          )}
        </Group>
      </Card>
    </Box>
  );
};
