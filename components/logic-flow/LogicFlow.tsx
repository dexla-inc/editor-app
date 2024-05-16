// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { edgeTypes } from "@/components/logic-flow/nodes/CustomEdge";
import {
  onDeleteIfTrueOrFalseNode,
  onNodesPositionChange,
} from "@/components/logic-flow/nodes/compute";
import { FlowState, useFlowStore } from "@/stores/flow";
import { nodes as nodeTypes } from "@/utils/logicFlows";
import { nanoid } from "nanoid";
import { MutableRefObject, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { SegmentedControl } from "@mantine/core";

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
  setSelectedNode: state.setSelectedNode,
});

type FlowProps = {
  wrapperRef: MutableRefObject<HTMLDivElement | null>;
};

export const LogicFlow = ({ wrapperRef }: FlowProps) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setFlowInstance,
    setSelectedNode,
  } = useFlowStore(selector);
  const { setEdges, setNodes } = useReactFlow();
  const rect = wrapperRef.current?.getBoundingClientRect();
  const defaultViewport = { zoom: 2, x: (rect?.width ?? 1000) / 2, y: 150 };

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          let outgoers = getOutgoers(node, nodes, edges);
          const booleanNode = incomers.find((n) => n.type === "booleanNode");

          const connectedEdges = getConnectedEdges([node], edges);
          const edgeToConnect = connectedEdges[connectedEdges.length - 1];
          onNodesPositionChange(node);

          let remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );

          if (node.type === "booleanNode") {
            const result = onDeleteIfTrueOrFalseNode(
              node,
              connectedEdges,
              remainingEdges,
              outgoers,
              incomers,
            );
            remainingEdges = result.remainingEdges;
            outgoers = result.outgoers;
          }

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              type: "straight",
              ...(booleanNode && edgeToConnect),
              id: nanoid(),
              source,
              target,
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, edges],
  );

  const toggleFlowVisibility = (isDefaultFlow: boolean) => {
    const updatedEdges = [...edges];
    let { startNodeFlow = [], startNodeFlowError } = nodes.reduce(
      (acc, node) => {
        if (node.id === "start-node") {
          acc.startNodeFlow = [node, ...getOutgoers(node, nodes, edges)];
        }

        if (node.id === "start-node-error") {
          acc.startNodeFlowError = [node, ...getOutgoers(node, nodes, edges)];
        }
        return acc;
      },
      { startNodeFlow: [], startNodeFlowError: [] } as Record<
        "startNodeFlow" | "startNodeFlowError",
        Node[]
      >,
    );

    if (!startNodeFlowError.length) {
      const newConnectionCreatorNodeIdError = nanoid();
      // add error node
      startNodeFlowError = [
        {
          id: "start-node-error",
          type: "startNode",
          data: {
            label: "Start",
            description: "The starting point of an error flow",
            inputs: [],
            outputs: [{ id: nanoid(), name: "Initial Trigger" }],
          },
          position: { x: 0, y: 0 },
          deletable: false,
          draggable: false,
          hidden: true,
        },
        {
          id: newConnectionCreatorNodeIdError,
          type: "connectionCreatorNode",
          data: {
            inputs: [{ id: nanoid() }],
            outputs: [],
          },
          position: { x: 17.5, y: 80 },
          deletable: false,
          hidden: true,
        },
      ];

      updatedEdges.push({
        id: nanoid(),
        source: "start-node-error",
        target: newConnectionCreatorNodeIdError,
        type: "straight",
      });
    }

    let visibleFlow = startNodeFlow;
    let hiddenFlow = startNodeFlowError;

    if (!isDefaultFlow) {
      visibleFlow = startNodeFlowError;
      hiddenFlow = startNodeFlow;
    }

    visibleFlow = visibleFlow.map((node) => ({ ...node, hidden: false }));
    hiddenFlow = hiddenFlow.map((node) => ({ ...node, hidden: true }));

    setNodes([...visibleFlow, ...hiddenFlow]);
    setEdges(updatedEdges);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodesDraggable={false}
      zoomOnScroll={false}
      onInit={setFlowInstance}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onNodesDelete={onNodesDelete}
      onNodeClick={(e, node) => {
        if (node.type !== "connectionCreatorNode") {
          setSelectedNode(node);
        }
      }}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      deleteKeyCode={["Backspace", "Delete"]}
      selectionOnDrag
      panOnDrag={false}
      panOnScroll
      defaultViewport={defaultViewport}
    >
      <Controls showInteractive={false} />
      <Background />
      <Panel position="top-center">
        <SegmentedControl
          size="md"
          data={[
            { label: "Default", value: "default" },
            { label: "Error", value: "error" },
          ]}
          onChange={(value) => {
            if (value === "error") {
              toggleFlowVisibility(false);
            } else {
              toggleFlowVisibility(true);
            }
          }}
        />
      </Panel>
    </ReactFlow>
  );
};
