import React, { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  BoxProps,
  Box,
  Card,
  Group,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";

type Props = {
  id: string;
} & BoxProps;

export const DraggableComponent = ({
  id,
  children,
  style,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const styles = {
    transform: CSS.Translate.toString(transform),
    ...style,
  };

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
        <Group>
          <UnstyledButton
            sx={{ cursor: "grab", alignItems: "center", display: "flex" }}
            {...listeners}
            {...attributes}
          >
            <IconGripVertical size={ICON_SIZE} strokeWidth={1.5} />
          </UnstyledButton>
          {children}
        </Group>
      </Card>
    </Box>
  );
};
