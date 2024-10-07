import {
  createLogicFlow,
  deleteLogicFlow,
} from "@/requests/logicflows/mutations";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { BORDER_COLOR } from "@/utils/branding";
import { decodeSchema } from "@/utils/compression";
import { nodesData } from "@/utils/logicFlows";
import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import LoadingOverlay from "@/components/LoadingOverlay";
import { IconCopy, IconDots, IconEdit, IconTrashX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Edge, Node } from "reactflow";
import { safeJsonParse } from "@/utils/common";

dayjs.extend(relativeTime);

type FlowCardProps = {
  flow: Partial<LogicFlowResponse>;
  onEdit?: () => void;
  onClick?: () => void;
};

export const LogicFlowCard = ({ flow, onEdit, onClick }: FlowCardProps) => {
  const theme = useMantineTheme();
  const client = useQueryClient();

  const projectId = useEditorTreeStore((state) => state.currentProjectId ?? "");

  const data = safeJsonParse(decodeSchema(flow.data as string)) as unknown as {
    nodes: Node[];
    edges: Edge[];
  };

  const deleteFlow = useMutation({
    mutationKey: ["logic-flow"],
    mutationFn: async (flowId: string) => {
      return await deleteLogicFlow(projectId, flowId);
    },
    onSettled: async () => {
      await client.refetchQueries({ queryKey: ["logic-flows", projectId] });
    },
  });

  const duplicateFlow = useMutation({
    mutationKey: ["logic-flow"],
    mutationFn: async (values: any) => {
      return createLogicFlow(projectId as string, values);
    },
    onSettled: async () => {
      await client.refetchQueries({ queryKey: ["logic-flows", projectId] });
    },
  });

  const avatars = data.nodes.reduce(
    (avatars: any[], node: any) => {
      if (node.type === "connectionCreatorNode") {
        return avatars;
      }

      if (avatars.find((a) => a.type === node.type)) {
        const counterIndex = avatars.findIndex((a) => a.type === "counter");
        const newAvatars = [...avatars];
        newAvatars[counterIndex] = {
          type: "counter",
          count: newAvatars[counterIndex].count + 1,
        };

        return newAvatars;
      }

      return [{ type: node.type }, ...avatars];
    },
    [{ type: "counter", count: 0 }],
  );

  return (
    <Card
      withBorder
      key={flow.id}
      radius="md"
      w={300}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        "&:hover": {
          outline: "4px solid",
          outlineColor: theme.fn.rgba("gray", 0.05),
        },
      }}
    >
      <LoadingOverlay
        visible={deleteFlow.isPending || duplicateFlow.isPending}
      />
      <Group position="apart" align="flex-start">
        <Stack spacing={0}>
          <Text size="sm">{flow.name}</Text>
          <Text size="xs" color="dimmed">
            {dayjs(new Date(flow.createdAt!)).fromNow()}
          </Text>
        </Stack>
        <Menu shadow="md" radius="md" width={140} position="right" withinPortal>
          <Menu.Target>
            <ActionIcon onClick={(e) => e.stopPropagation()}>
              <IconDots size={14} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={<IconCopy size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                duplicateFlow.mutate({
                  name: flow.name!,
                  data: flow.data,
                });
              }}
            >
              Duplicate
            </Menu.Item>
            <Menu.Item
              icon={<IconEdit size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              icon={<IconTrashX size={14} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteFlow.mutate(flow?.id!);
              }}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Card.Section mt="sm">
        <Divider color={BORDER_COLOR} />
        <Box p="xs">
          <Avatar.Group spacing="xs">
            {avatars
              .filter((a) =>
                a.type === "counter"
                  ? a.count > 0
                  : a.type !== "counter"
                    ? true
                    : false,
              )
              .map((a) => {
                const NodeAvatar =
                  a.type !== "counter"
                    ? nodesData[a.type as keyof typeof nodesData]?.NodeAvatar
                    : undefined;

                return (
                  <Avatar key={a.type} radius="xl" variant="outline" size="md">
                    {NodeAvatar ? <NodeAvatar size={14} /> : `+${a.count}`}
                  </Avatar>
                );
              })}
          </Avatar.Group>
        </Box>
      </Card.Section>
    </Card>
  );
};
