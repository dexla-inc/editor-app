import React, { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  BoxProps,
  Box,
  Card,
  useMantineTheme,
  ActionIcon,
  Group,
} from "@mantine/core";
import { CSS } from "@dnd-kit/utilities";
import { ICON_SIZE } from "@/utils/config";
import { IconX } from "@tabler/icons-react";
import { deleteCustomComponent } from "@/requests/projects/mutations";
import { showNotification } from "@mantine/notifications";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data,
  });

  const styles = {
    transform: CSS.Translate.toString(transform),
    ...style,
    cursor: "move",
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation(deleteCustomComponent, {
    onSettled(_, err) {
      if (err) {
        console.log(err);
        showNotification({
          title: "Oops",
          message:
            "Something went wrong while trying to delete the custom component.",
          autoClose: true,
          color: "red",
          withBorder: true,
        });
      } else {
        queryClient.invalidateQueries(["components"]);
      }
    },
  });

  return (
    <Box
      pos="relative"
      ref={setNodeRef}
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
          <Box {...listeners} {...attributes} w="100%">
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
                  id: data?.id,
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
