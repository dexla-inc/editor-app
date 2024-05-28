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
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useReactFlow,
  Panel,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { SegmentedControl } from "@mantine/core";
import camelCase from "lodash.camelcase";

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
  forceRenderId: string;
};

function findConnectedNodes(
  startNodeId: string,
  nodes: Node[],
  edges: Edge[],
  isHidden: boolean,
): Node[] {
  // Initialize an empty set to keep track of visited node IDs
  const visited = new Set();

  // Helper function to perform depth-first search (DFS)
  function dfs(currentNodeId: string) {
    // If the node ID is already visited, return
    if (visited.has(currentNodeId)) return;

    // Mark the current node ID as visited
    visited.add(currentNodeId);

    // Find the current node by its ID
    const currentNode = nodes.find((node) => node.id === currentNodeId);
    if (!currentNode) return;

    // Get all outgoers (connected nodes) from the current node
    const outgoers = getOutgoers(currentNode, nodes, edges);

    // Recursively visit all outgoers
    outgoers.forEach((outgoer) => {
      dfs(outgoer.id);
    });
  }

  // Start DFS from the given node ID
  dfs(startNodeId);

  // Return an array of connected nodes
  return Array.from(visited).reduce((acc: Node[], id) => {
    const node = nodes.find((n) => n.id === id);
    if (node) {
      acc.push({ ...node, hidden: isHidden });
    }
    return acc;
  }, []);
}

export const LogicFlow = ({ wrapperRef, forceRenderId }: FlowProps) => {
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
  const [activeFlowTab, setActiveFlowTab] = useState("start-node");
  const rect = wrapperRef.current?.getBoundingClientRect();
  const defaultViewport = { zoom: 2, x: (rect?.width ?? 1000) / 2, y: 150 };
  const tabs = [
    { label: "Default", value: "start-node" },
    { label: "Handled Error", value: "start-node-error" },
    { label: "Unhandled Error", value: "start-node-unhandled-error" },
  ];

  useEffect(() => {
    onActivateVisibility("start-node");
    setActiveFlowTab("start-node");
  }, [forceRenderId]);

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

  const onActivateVisibility = (tab: string) => {
    const updatedEdges = [...edges];

    const flows = tabs.reduce(
      (acc, { value }) => {
        acc[camelCase(value) + "Flow"] = findConnectedNodes(
          value,
          nodes,
          edges,
          value !== tab,
        );
        return acc;
      },
      {} as Record<string, Node[]>,
    );

    const selectedFlow = camelCase(tab) + "Flow";

    if (!flows[selectedFlow].length) {
      const newConnectionCreatorNodeIdError = nanoid();

      flows[selectedFlow] = [
        {
          id: selectedFlow,
          type: "startNode",
          data: {
            label: "Start",
            description: "The starting point of a flow",
            inputs: [],
            outputs: [{ id: nanoid(), name: "Initial Trigger" }],
          },
          position: { x: 0, y: 0 },
          deletable: false,
          draggable: false,
          hidden: false,
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
          hidden: false,
        },
      ];

      updatedEdges.push({
        id: nanoid(),
        source: selectedFlow,
        target: newConnectionCreatorNodeIdError,
        type: "straight",
      });
    }

    setActiveFlowTab(tab);
    setNodes(Object.values(flows).flat());
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
          value={activeFlowTab}
          data={tabs}
          onChange={onActivateVisibility}
        />
      </Panel>
    </ReactFlow>
  );
};
