import { EdgeAddChange, Handle, NodeProps, Position } from "reactflow";
import { IconPlus } from "@tabler/icons-react";
import { NodeData, NodeInput } from "@/components/logic-flow/nodes/CustomNode";
import { ActionIcon, Card, Menu, Stack, useMantineTheme } from "@mantine/core";
import { FlowState, useFlowStore } from "@/stores/flow";
import { nanoid } from "nanoid";

interface AddNodeData extends NodeData {}

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onAddNode: state.onAddNode,
  setFlowInstance: state.setFlowInstance,
  flowInstance: state.flowInstance,
  setIsDragging: state.setIsDragging,
});

export const AddNode = (node: NodeProps<AddNodeData>) => {
  const theme = useMantineTheme();
  const { data } = node;
  const { onNodesChange, onEdgesChange, edges } = useFlowStore(selector);

  const onClickAddAction = async () => {
    const actionId = nanoid();
    const addId = nanoid();
    const edge = edges.find((edge) => edge.target === node.id);

    await onNodesChange([
      {
        item: {
          id: actionId,
          type: "actionNode",
          position: { x: node.xPos - 30, y: node.yPos },
          data: {
            label: "Action",
            description: "Execute an action",
            inputs: [{ id: nanoid(), name: "Input" }],
            outputs: [{ id: nanoid(), name: "Output" }],
          },
        },
        type: "add",
      },
    ]);

    await onEdgesChange([
      {
        item: { ...edge, id: nanoid(), target: actionId },
        type: "add",
      } as EdgeAddChange,
    ]);

    await onNodesChange([
      {
        item: {
          id: addId,
          type: "addNode",
          position: { x: node.xPos, y: node.yPos + 150 },
          data: {
            inputs: [{ id: nanoid() }],
          },
        },
        type: "add",
      },
      {
        id: node.id,
        type: "remove",
      },
    ]);

    await onEdgesChange([
      {
        item: { id: nanoid(), target: addId, source: actionId },
        type: "add",
      },
    ]);
  };

  const onClickAddConditional = async () => {
    const conditionalId = nanoid();
    const addId = nanoid();
    const edge = edges.find((edge) => edge.target === node.id);

    const outputConnectorId = nanoid();
    await onNodesChange([
      {
        item: {
          id: conditionalId,
          type: "conditionalNode",
          position: { x: node.xPos - 30, y: node.yPos },
          data: {
            label: "Conditional",
            description: "Execute actions conditionally",
            inputs: [{ id: nanoid(), name: "Input" }],
            outputs: [{ id: outputConnectorId, name: "Output" }],
          },
        },
        type: "add",
      },
    ]);

    await onEdgesChange([
      {
        item: {
          ...edge,
          id: nanoid(),
          target: conditionalId,
          sourceHandle: outputConnectorId,
        },
        type: "add",
      } as EdgeAddChange,
    ]);

    await onNodesChange([
      {
        item: {
          id: addId,
          type: "addNode",
          position: { x: node.xPos, y: node.yPos + 150 },
          data: {
            inputs: [{ id: nanoid() }],
          },
        },
        type: "add",
      },
      {
        id: node.id,
        type: "remove",
      },
    ]);

    await onEdgesChange([
      {
        item: { id: nanoid(), target: addId, source: conditionalId },
        type: "add",
      },
    ]);
  };

  return (
    <Card
      p={0}
      sx={{
        borderRadius: 50,
        border: "1px solid",
        borderColor: theme.colors.gray[3],
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
            position={Position.Top}
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
      <Stack w="100%" h="100%" justify="center" align="center">
        <Menu shadow="md" width={200} withinPortal>
          <Menu.Target>
            <ActionIcon>
              <IconPlus size="15px" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={onClickAddAction}>Action</Menu.Item>
            <Menu.Item onClick={onClickAddConditional}>Conditional</Menu.Item>
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
