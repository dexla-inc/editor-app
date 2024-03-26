// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
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
} from "reactflow";
import "reactflow/dist/style.css";

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
  const { setEdges } = useReactFlow();

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: nanoid(),
              source,
              target,
              type: "straight",
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, edges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
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
      fitView
      deleteKeyCode={["Backspace", "Delete"]}
      selectionOnDrag
      panOnDrag={false}
      panOnScroll
    >
      <Controls showInteractive={false} />
      <Background />
    </ReactFlow>
  );
};
