import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { deleteCustomComponent } from "@/requests/components/mutations";
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
import { PropsWithChildren } from "react";
import { useDnd } from "../hooks/useDnd";

type Props = {
  id: string;
  data: any;
  isDeletable: boolean;
} & BoxProps;

export const Draggable = ({
  id,
  children,
  data,
  isDeletable,
  ...props
}: PropsWithChildren<Props>) => {
  const { id: projectId } = useEditorParams();
  const theme = useMantineTheme();
  const activeCompany = usePropelAuthStore((state) => state.activeCompany);
  const { onDragStart, onDragEnd, onDrag } = useDnd();
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
      sx={{ cursor: "move" }}
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
          <Box
            data-type={data.name}
            draggable
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            w="100%"
          >
            {children}
          </Box>
        </Group>
      </Card>
    </Box>
  );
};
