import { Handle, NodeProps, Position } from "reactflow";
import { IconPlayerPlay } from "@tabler/icons-react";
import { NodeData, NodeOutput } from "@/components/logic-flow/nodes/CustomNode";
import { nanoid } from "nanoid";
import { Card, Stack, Text, useMantineTheme } from "@mantine/core";

interface StartNodeData extends NodeData {}

export const StartNode = (node: NodeProps<StartNodeData>) => {
  const theme = useMantineTheme();

  return (
    <Card
      p="sm"
      sx={{
        border: "1px solid",
        borderColor: node.selected
          ? theme.colors[theme.primaryColor][6]
          : theme.colors.gray[3],
        minWidth: "50px",

        "&:hover": {
          outline: "4px solid",
          outlineColor: theme.fn.rgba("gray", 0.05),
        },
        borderRadius: 50,
      }}
    >
      <Stack justify="center" align="center" spacing={2}>
        <NodeAvatar size={14} />
        <Text size={6} weight="bold">
          {data.label}
          {data?.form?.action && ` - ${data.form.action}`}
        </Text>
      </Stack>
      <Stack spacing={4}>
        {data.outputs.map((output: NodeOutput) => {
          return (
            <Handle
              key={output.id}
              id={output.id}
              type="source"
              position={Position.Bottom}
              style={{
                backgroundColor: theme.colors.gray[4],
                border: "none",
                borderRadius: 0,
                minHeight: "0px",
                minWidth: "0px",
              }}
            />
          );
        })}
      </Stack>
    </Card>
  );
};

export const data: StartNodeData = {
  label: "Start",
  description: "The starting point of a flow",
  inputs: [],
  outputs: [{ id: nanoid(), name: "Initial Trigger" }],
};

export const NodeAvatar = (props: any) => {
  return <IconPlayerPlay {...props} />;
};
