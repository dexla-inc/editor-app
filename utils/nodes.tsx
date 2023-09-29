import { NodeProps } from "reactflow";
import * as StartNodeExports from "@/components/logic-flow/nodes/StartNode";

const { StartNode, data: startNodeData, ...startNode } = StartNodeExports;

export const nodesData = {
  startNode: { data: startNodeData, ...startNode },
};

export type PossibleNodes = keyof typeof nodesData;

export const nodes: {
  [key in PossibleNodes]: ({ data }: NodeProps) => JSX.Element;
} = {
  startNode: StartNode,
};
