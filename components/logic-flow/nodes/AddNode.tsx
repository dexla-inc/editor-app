import { Handle, NodeProps, Position } from "reactflow";
import { IconPlus } from "@tabler/icons-react";
import {
  CustomNode,
  NodeData,
  NodeInput,
  NodeOutput,
} from "@/components/logic-flow/nodes/CustomNode";
import {
  ActionIcon,
  Box,
  Card,
  Menu,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useFlowStore } from "@/stores/flow";

interface AddNodeData extends NodeData {}

export const AddNode = (node: NodeProps<AddNodeData>) => {
  const theme = useMantineTheme();
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const { data, selected: Avatar } = node;

  const selectNode = () => {
    setSelectedNode(node);
  };

  return (
    <Card
      p={0}
      //onClick={selectNode}
      sx={{
        borderRadius: 50,
        border: "1px solid",
        borderColor: theme.colors.gray[3],
        // minWidth: "100px",
        width: "20px",
        height: "20px",

        "&:hover": {
          outline: "4px solid",
          outlineColor: theme.fn.rgba("gray", 0.05),
        },
      }}
    >
      {data.inputs.map((input: NodeInput) => {
        return (
          <Handle
            key={input.id}
            id={input.id}
            type="target"
            position={Position.Left}
            style={{
              marginLeft: "-4px",
              backgroundColor: theme.colors.gray[4],
              border: "none",
              borderRadius: 0,
              minHeight: "0px",
              minWidth: "0px",
            }}
          />
        );
      })}
      <Stack w="100%" h="100%" justify="center" align="center">
        <Menu shadow="md" width={200} withinPortal>
          <Menu.Target>
            <ActionIcon>
              <IconPlus size="15px" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
          </Menu.Dropdown>
        </Menu>
      </Stack>
    </Card>
  );
};

export const data: AddNodeData = {
  label: "Add",
  description: "",
  inputs: [],
  outputs: [],
};

export const NodeAvatar = (props: any) => {
  return <IconPlus {...props} />;
};
