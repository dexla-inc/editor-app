import { NodeTriggerCondition } from "@/utils/triggerConditions";
import {
  Box,
  Card,
  CSSObject,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconBoxModel2 } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { Handle, NodeProps, Position } from "reactflow";
import { useFlowStore } from "@/stores/flow";
import startCase from "lodash.startcase";

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
  avatar?: React.FunctionComponent<{ size: number }>;
  style?: CSSObject;
}

export const CustomNode = (props: CustomNodeProps) => {
  const theme = useMantineTheme();
  const { data, selected, avatar: Avatar, ...node } = props;
  const { style } = props;
  const { selectedNode } = useFlowStore();

  return (
    <Card
      p={0}
      sx={{
        border: "1px solid",
        borderColor: `${
          selectedNode?.id === node.id
            ? theme.colors.gray[6]
            : theme.colors.gray[3]
        } !important`,
        minWidth: "70px",

        "&:hover": {
          outline: "4px solid",
          outlineColor: theme.fn.rgba("gray", 0.05),
        },
        ...style,
      }}
    >
      <Stack spacing={4}>
        {data.inputs.map((input: NodeInput) => {
          return (
            <Handle
              key={input.id}
              id={input.id}
              type="target"
              position={Position.Top}
              style={{
                backgroundColor: theme.colors.gray[4],
                border: "none",
                borderRadius: 0,
                minHeight: "3px",
              }}
            />
          );
        })}
      </Stack>
      <Stack justify="center" align="center" spacing={2} mt="8px" mb="4px">
        {Avatar ? <Avatar size={14} /> : <NodeAvatar size={14} />}
        <Text size={6} weight="bold" w="90%" ta="center">
          {node.type === "conditionalNode" && "Conditional"}
          {startCase(data.form.action)}
        </Text>
      </Stack>
      <Stack spacing={4} mb={4} align="flex-end">
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
                minHeight: "3px",
              }}
            />
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

export const NodeAvatar = (props: { size: number }) => {
  return <IconBoxModel2 {...props} />;
};
