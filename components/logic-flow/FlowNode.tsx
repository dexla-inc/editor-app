import { Card, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { nodesData } from "@/utils/logicFlows";
import { useDragStart } from "@/hooks/logic-flow/useDragStart";
import { nanoid } from "nanoid";

type FlowNodeProps = {
  type: keyof typeof nodesData;
};

export const FlowNode = ({ type }: FlowNodeProps) => {
  const theme = useMantineTheme();
  const onDragStart = useDragStart();
  const data = nodesData[type].data;
  const Avatar = nodesData[type].NodeAvatar;

  return (
    <Card
      withBorder
      radius="sm"
      draggable
      sx={{
        cursor: "grab",
        "&:hover": {
          boxShadow: theme.shadows.xs,
        },
      }}
      onDragStart={(event) =>
        onDragStart({
          id: nanoid(),
          event,
          type,
          data,
        })
      }
    >
      <Group noWrap>
        <Avatar />
        <Stack spacing={0}>
          <Text size="sm">{data.label}</Text>
          <Text size="xs" color="dimmed">
            {data.description}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
};
