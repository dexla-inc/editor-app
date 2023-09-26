import "reactflow/dist/style.css";
import React, { useCallback, useEffect } from "react";
import ReactFlow, { Background, Controls, Node } from "reactflow";
import { FlowState, useFlowStore } from "@/stores/flow";
import { nanoid } from "nanoid";

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
  resetFlow: state.resetFlow,
});

type FlowProps = {
  wrapperRef: HTMLDivElement | null;
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
    resetFlow,
  } = useFlowStore(selector);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = wrapperRef?.getBoundingClientRect();
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

  useEffect(() => {
    resetFlow();
  }, [resetFlow]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={setFlowInstance}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onNodeDragStart={() => {
        setIsDragging(true);
      }}
      onNodeDragStop={() => {
        setIsDragging(false);
      }}
      onEdgesChange={onEdgesChange}
      onDragOver={onDragOver}
      onDrop={onDrop}
      // nodeTypes={nodeTypes}
      fitView
    >
      <Controls showInteractive={false} />
      <Background />
    </ReactFlow>
  );
};
