import { useDraggable } from "@/hooks/useDraggable";
import { deleteCustomComponent } from "@/requests/components/mutations";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Box,
  BoxProps,
  Card,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback } from "react";

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

  const onDragStart = useCallback(() => {
    setComponentToAdd(data);
  }, [data, setComponentToAdd]);

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
        console.error(err);
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
        <Group position="apart" noWrap sx={{ textAlign: "center" }}>
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
