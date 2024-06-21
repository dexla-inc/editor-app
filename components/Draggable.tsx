import { useDraggable } from "@/hooks/editor/useDraggable";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { deleteCustomComponent } from "@/requests/components/mutations";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import {
  ActionIcon,
  Box,
  BoxProps,
  Card,
  Group,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { id: projectId } = useEditorParams();
  const theme = useMantineTheme();

  const setComponentToAdd = useEditorStore((state) => state.setComponentToAdd);
  const activeCompany = usePropelAuthStore((state) => state.activeCompany);

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

  const { mutate } = useMutation({
    mutationFn: deleteCustomComponent,
    ...{
      onSettled(_, err) {
        if (err) {
          console.error(err);
        }

        queryClient.invalidateQueries({ queryKey: ["components"] });
      },
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
        h={92}
        withBorder
        pos="relative"
        sx={{
          ":hover": {
            boxShadow: theme.shadows.sm,
          },
        }}
      >
        {isDeletable && (
          <Card.Section>
            <Group position="right" noWrap>
              <ActionIcon
                size="xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  mutate({
                    projectId,
                    companyId: activeCompany.orgId,
                    id,
                  });
                }}
              >
                <Tooltip label="Delete" withArrow fz="xs" withinPortal>
                  <IconTrash
                    size={12}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                  />
                </Tooltip>
              </ActionIcon>
            </Group>
          </Card.Section>
        )}
        <Group position="apart" noWrap sx={{ textAlign: "center" }}>
          <Box {...draggable} w="100%">
            {children}
          </Box>
        </Group>
      </Card>
    </Box>
  );
};
