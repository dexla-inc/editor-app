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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { nodesData } from "@/utils/logicFlows";
import { IconCopy, IconDots, IconEdit, IconTrashX } from "@tabler/icons-react";
import { Edge, Node } from "reactflow";
import { decodeSchema } from "@/utils/compression";
import { LogicFlowResponse } from "@/requests/logicflows/types";

dayjs.extend(relativeTime);

type FlowCardProps = {
  flow: Partial<LogicFlowResponse>;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onEdit?: () => void;
};

export const LogicFlowCard = ({
  flow,
  onDelete,
  onDuplicate,
  onEdit,
}: FlowCardProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.();
  };

  const data = JSON.parse(decodeSchema(flow.data as string)) as unknown as {
    nodes: Node[];
    edges: Edge[];
  };

  const avatars = data.nodes.reduce(
    (avatars: any[], node: any) => {
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
      onClick={() =>
        router.push(
          `/projects/${router.query.id}/editor/${router.query.page}/flows/${flow.id}`,
        )
      }
      sx={{
        cursor: "pointer",
        "&:hover": {
          outline: "4px solid",
          outlineColor: theme.fn.rgba("gray", 0.05),
        },
      }}
    >
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
                onDuplicate?.();
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
            <Menu.Item icon={<IconTrashX size={14} />} onClick={handleDelete}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Card.Section mt="sm">
        <Divider color={theme.colors.gray[2]} />
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
                    ? nodesData[a.type as keyof typeof nodesData].NodeAvatar
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
