// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { FlowState, useFlowStore } from "@/stores/flow";
import { nodes as nodeTypes } from "@/utils/logicFlows";
import { nanoid } from "nanoid";
import { MutableRefObject, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  Node,
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
    flowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setFlowInstance,
    onAddNode,
    setIsDragging,
    setSelectedNode,
  } = useFlowStore(selector);
  const { setEdges } = useReactFlow();

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = wrapperRef.current?.getBoundingClientRect();
      const { type, data, id } = JSON.parse(
        event.dataTransfer.getData("application/reactflow"),
      );

      // check if the dropped element is valid
      if (
        typeof type === "undefined" ||
        !type ||
        !reactFlowBounds ||
        !flowInstance
      ) {
        return;
      }

      const position = flowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id,
        type,
        position,
        data: {
          ...data,
          inputs: data.inputs.map((input: any) => ({ ...input, id: nanoid() })),
          outputs: data.outputs.map((output: any) => ({
            ...output,
            id: nanoid(),
          })),
        },
      };

      onAddNode(newNode as Node);
    },
    [flowInstance, onAddNode, wrapperRef],
  );

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
              type: "smoothstep",
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
      onInit={setFlowInstance}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onNodesDelete={onNodesDelete}
      onNodeDragStart={(e, node) => {
        setIsDragging(true);
        if (node.type === "connectionCreatorNode") {
          setSelectedNode(undefined);
        }
      }}
      onNodeClick={(e, node) => {
        if (node.type !== "connectionCreatorNode") {
          setSelectedNode(node);
        }
      }}
      onNodeDragStop={() => {
        setIsDragging(false);
      }}
      onEdgesChange={onEdgesChange}
      onDragOver={onDragOver}
      onDrop={onDrop}
      nodeTypes={nodeTypes}
      fitView
      deleteKeyCode={["Backspace", "Delete"]}
      selectionOnDrag
    >
      <Controls showInteractive={false} />
      <Background />
    </ReactFlow>
  );
};
