import { Icon } from "@/components/Icon";
import { useFlowStore } from "@/stores/flow";
import { NodeTriggerCondition } from "@/utils/triggerConditions";
import {
  Button,
  Card,
  CSSObject,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconBoxModel2, IconPlayerPause } from "@tabler/icons-react";
import startCase from "lodash.startcase";
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
      bg="dark"
      sx={{
        border: "1px solid",
        borderColor: `${
          selectedNode?.id === node.id
            ? theme.colors.gray[3]
            : theme.colors.gray[6]
        } !important`,
        width: "120px",

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
        <Button
          // @ts-ignore
          size={7}
          variant="default"
          pos="absolute"
          right="0"
          top="0"
          m={4}
          p={2}
          leftIcon={<Icon name="IconPlayerPlay" size={10} />}
          styles={{ leftIcon: { marginRight: 2 } }}
        >
          Test
        </Button>

        <Text size={6} weight="bold" w="90%" ta="center">
          {node.type === "conditionalNode" && "Conditional"}
          {node.type === "booleanNode"
            ? `True/False Split`
            : `${startCase(data.form?.action || "")} - ${data.label}`}
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
