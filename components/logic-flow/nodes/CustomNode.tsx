import { useFlowStore } from "@/stores/flow";
import { NodeTriggerCondition } from "@/utils/triggerConditions";
import { Box, Card, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconBoxModel2 } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { Handle, NodeProps, Position } from "reactflow";

export type NodeInput = {
  id: string;
  name: string;
};

export type NodeOutput = {
  id: string;
  name: string;
  triggerCondition?: NodeTriggerCondition;
  triggerConditionValue?: string;
};

export type NodeData = {
  label: string;
  description: string;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  form?: any;
};

export interface CustomNodeProps extends NodeProps<NodeData> {
  avatar?: React.FunctionComponent;
}

export const CustomNode = (node: CustomNodeProps) => {
  const theme = useMantineTheme();
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const { data, selected } = node;
  const Avatar = node.avatar;

  const selectNode = () => {
    setSelectedNode(node);
  };

  return (
    <Card
      p="sm"
      onDoubleClick={selectNode}
      sx={{
        border: "1px solid",
        borderColor: selected
          ? theme.colors[theme.primaryColor][6]
          : theme.colors.gray[3],
        minWidth: "100px",

        "&:hover": {
          outline: "4px solid",
          outlineColor: theme.fn.rgba("gray", 0.05),
        },
      }}
    >
      <Stack spacing={4}>
        {data.inputs.map((input: NodeInput) => {
          return (
            <Card.Section key={input.id}>
              <Box
                pos="relative"
                left={0}
                p={1}
                bg={theme.colors.gray[1]}
                w="90%"
                sx={{
                  borderTopRightRadius: theme.radius.xl,
                  borderBottomRightRadius: theme.radius.xl,
                }}
              >
                <Handle
                  id={input.id}
                  type="target"
                  position={Position.Left}
                  style={{
                    marginLeft: "4px",
                    backgroundColor: theme.colors.gray[4],
                    border: "none",
                    borderRadius: 0,
                    minHeight: "11px",
                  }}
                />
                <Text size={6} color="dark" ml="xs">
                  {input.name}
                </Text>
              </Box>
            </Card.Section>
          );
        })}
      </Stack>
      <Stack w="100%" justify="center" align="center" spacing={2} my="sm">
        {Avatar ? <Avatar /> : <NodeAvatar />}
        <Text size={6}>{data.label}</Text>
      </Stack>
      <Stack spacing={4}>
        {data.outputs.map((output: NodeOutput) => {
          return (
            <Card.Section key={output.id}>
              <Box
                pos="relative"
                left="10%"
                p={1}
                bg={theme.colors.gray[1]}
                w="90%"
                sx={{
                  borderTopLeftRadius: theme.radius.xl,
                  borderBottomLeftRadius: theme.radius.xl,
                }}
              >
                <Handle
                  key={output.id}
                  id={output.id}
                  type="source"
                  position={Position.Right}
                  style={{
                    marginRight: "4px",
                    backgroundColor: theme.colors.gray[4],
                    border: "none",
                    borderRadius: 0,
                    minHeight: "11px",
                  }}
                />
                <Text size={6} color="dark" ml="xs">
                  {output.name}
                </Text>
              </Box>
            </Card.Section>
          );
        })}
      </Stack>
    </Card>
  );
};

export const data: NodeData = {
  label: "Custom",
  description: "A custom node",
  inputs: [{ id: nanoid(), name: "Input" }],
  outputs: [{ id: nanoid(), name: "Output" }],
};

export const NodeAvatar = () => {
  return <IconBoxModel2 />;
};
