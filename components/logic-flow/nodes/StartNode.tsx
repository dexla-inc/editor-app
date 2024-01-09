import { Handle, NodeProps, Position } from "reactflow";
import { IconPlayerPlay } from "@tabler/icons-react";
import { NodeData, NodeOutput } from "@/components/logic-flow/nodes/CustomNode";
import { nanoid } from "nanoid";
import { Card, Stack, Text, useMantineTheme } from "@mantine/core";
import { useFlowStore } from "@/stores/flow";

interface StartNodeData extends NodeData {}

export const StartNode = (node: NodeProps<StartNodeData>) => {
  const theme = useMantineTheme();
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const selectNode = () => {
    setSelectedNode(node);
  };

  return (
    <Card
      p="sm"
      onClick={selectNode}
      sx={{
        border: "1px solid",
        borderColor: node.selected
          ? theme.colors[theme.primaryColor][6]
          : theme.colors.gray[3],
        minWidth: "90px",

        "&:hover": {
          outline: "4px solid",
          outlineColor: theme.fn.rgba("gray", 0.05),
        },
        borderRadius: 50,
      }}
    >
      <Stack w="100%" justify="center" align="center" spacing={2} my="sm">
        <NodeAvatar />
        <Text size={6}>
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
