import { NodeData, NodeInput } from "@/components/logic-flow/nodes/CustomNode";
import { useLogicFlows } from "@/hooks/logic-flow/useLogicFlows";
import { FlowState, useFlowStore } from "@/stores/flow";
import { actions } from "@/utils/actions";
import { BORDER_COLOR } from "@/utils/branding";
import {
  ActionIcon,
  Card,
  Menu,
  Popover,
  ScrollArea,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import groupBy from "lodash.groupby";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";
import { EdgeAddChange, Handle, NodeProps, Position } from "reactflow";

interface ConnectionCreatorNodeData extends NodeData {}

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

export const ConnectionCreatorNode = (
  node: NodeProps<ConnectionCreatorNodeData>,
) => {
  const theme = useMantineTheme();
  const { data } = node;
  const { onNodesChange, onEdgesChange, edges } = useFlowStore(selector);
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const groupedActions = groupBy(actions, (action) => action.group);
  const { addConnectionCreatorNode } = useLogicFlows();

  const onClickAddAction = async (actionName: string) => {
    const actionId = nanoid();
    const edge = edges.find((edge) => edge.target === node.id);

    const newActionNode = {
      id: actionId,
      type: "actionNode",
      position: { x: node.xPos - 52.5, y: node.yPos },
      data: {
        label: "Action",
        form: { action: actionName },
        description: "Execute an action",
        inputs: [{ id: nanoid(), name: "Input" }],
        outputs: [{ id: nanoid(), name: "Output" }],
      },
    };

    onNodesChange([
      {
        item: newActionNode,
        type: "add",
      },
    ]);

    onEdgesChange([
      {
        item: { ...edge, id: nanoid(), target: actionId },
        type: "add",
      } as EdgeAddChange,
    ]);

    addConnectionCreatorNode(node, actionId);

    setSelectedNode(newActionNode);
  };

  const onClickAddConditional = async () => {
    const conditionalId = nanoid();
    const addId = nanoid();
    const edge = edges.find((edge) => edge.target === node.id);

    const defaultOutput = {
      id: nanoid(),
      name: "Output",
    };
    const newConditionalNode = {
      id: conditionalId,
      type: "conditionalNode",
      position: { x: node.xPos - 52.5, y: node.yPos },
      data: {
        label: "Conditional",
        description: "Execute actions conditionally",
        inputs: [{ id: nanoid(), name: "Input" }],
        outputs: [defaultOutput],
        form: {
          outputs: [defaultOutput],
        },
      },
    };
    onNodesChange([
      {
        item: newConditionalNode,
        type: "add",
      },
    ]);

    onEdgesChange([
      {
        item: {
          ...edge,
          id: nanoid(),
          target: conditionalId,
        },
        type: "add",
      } as EdgeAddChange,
    ]);

    onNodesChange([
      {
        item: {
          id: addId,
          type: "connectionCreatorNode",
          position: { x: node.xPos, y: node.yPos + 72 },
          data: {
            inputs: [{ id: nanoid() }],
          },
          deletable: false,
        },
        type: "add",
      },
      {
        id: node.id,
        type: "remove",
      },
    ]);

    onEdgesChange([
      {
        item: {
          id: nanoid(),
          target: addId,
          source: conditionalId,
          sourceHandle: defaultOutput.id,
        },
        type: "add",
      },
    ]);

    setSelectedNode(newConditionalNode);
  };

  const onClickAddTrueOrFalseNode = async () => {
    const trueOrFalseId = nanoid();
    const trueOutputId = nanoid();
    const falseOutputId = nanoid();
    const edge = edges.find((edge) => edge.target === node.id);

    const defaultOutput = {
      id: nanoid(),
      name: "Output",
    };
    const newTrueOrFalseNode = {
      id: trueOrFalseId,
      type: "trueOrFalseNode",
      position: { x: node.xPos - 52.5, y: node.yPos },
      data: {
        label: "True/False",
        description: "Execute true/false actions",
        inputs: [{ id: nanoid(), name: "Input" }],
        outputs: [defaultOutput],
        form: {
          outputs: [defaultOutput],
        },
      },
    };

    onNodesChange([
      {
        item: newTrueOrFalseNode,
        type: "add",
      },
    ]);

    onEdgesChange([
      {
        item: { ...edge, id: nanoid(), target: trueOrFalseId },
        type: "add",
      } as EdgeAddChange,
    ]);

    onNodesChange([
      {
        item: {
          id: trueOutputId,
          type: "connectionCreatorNode",
          position: { x: node.xPos - 100, y: node.yPos + 100 },
          data: {
            inputs: [{ id: nanoid() }],
          },
          deletable: false,
        },
        type: "add",
      },
      {
        item: {
          id: falseOutputId,
          type: "connectionCreatorNode",
          position: { x: node.xPos + 100, y: node.yPos + 100 },
          data: {
            inputs: [{ id: nanoid() }],
          },
          deletable: false,
        },
        type: "add",
      },
      {
        id: node.id,
        type: "remove",
      },
    ]);

    onEdgesChange([
      {
        item: {
          id: nanoid(),
          target: trueOutputId,
          source: trueOrFalseId,
          sourceHandle: defaultOutput.id,
          type: "custom-edge",
          label: "True",
          deletable: false,
        },
        type: "add",
      },
      {
        item: {
          id: nanoid(),
          target: falseOutputId,
          source: trueOrFalseId,
          sourceHandle: defaultOutput.id,
          type: "custom-edge",
          label: "False",
          deletable: false,
        },
        type: "add",
      },
    ]);

    setSelectedNode(newTrueOrFalseNode);
  };

  return (
    <Card
      p={0}
      sx={{
        borderRadius: 50,
        border: "1px solid",
        borderColor: BORDER_COLOR,
        width: "15px",
        height: "15px",

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
              minHeight: "3px",
            }}
          />
        );
      })}
      <Stack w="100%" h="100%" justify="center" align="center">
        <Popover withinPortal withArrow position="right">
          <Popover.Target>
            <ActionIcon>
              <IconPlus size="10px" />
            </ActionIcon>
          </Popover.Target>

          <Popover.Dropdown>
            <Menu opened shadow="md" width={200}>
              <Menu.Dropdown>
                <ScrollArea h={200}>
                  <Menu.Label>Conditions</Menu.Label>
                  <Menu.Item onClick={onClickAddConditional}>
                    Conditional
                  </Menu.Item>
                  <Menu.Item onClick={onClickAddTrueOrFalseNode}>
                    True/False
                  </Menu.Item>
                  <Menu.Label>Actions</Menu.Label>
                  {Object.entries(groupedActions).map(([key, value]) => {
                    return (
                      <>
                        <Menu.Label key={key}>{key}</Menu.Label>
                        {value.map((item) => (
                          <Menu.Item
                            key={item.name}
                            onClick={() => onClickAddAction(item.name)}
                          >
                            {startCase(item.name)}
                          </Menu.Item>
                        ))}
                      </>
                    );
                  })}
                </ScrollArea>
              </Menu.Dropdown>
            </Menu>
          </Popover.Dropdown>
        </Popover>
      </Stack>
    </Card>
  );
};

export const data: ConnectionCreatorNodeData = {
  label: "Add",
  description: "",
  inputs: [],
  outputs: [],
};

export const NodeAvatar = (props: any) => {
  return <IconPlus {...props} />;
};
