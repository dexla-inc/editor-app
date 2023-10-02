import { NodeProps } from "reactflow";
import * as StartNodeExports from "@/components/logic-flow/nodes/StartNode";
import * as ActionNodeExports from "@/components/logic-flow/nodes/ActionNode";

const { StartNode, data: startNodeData, ...startNode } = StartNodeExports;
const { ActionNode, data: actionNodeData, ...actionNode } = ActionNodeExports;

export const nodesData = {
  startNode: { data: startNodeData, ...startNode },
  actionNode: { data: actionNodeData, ...actionNode },
};

export type PossibleNodes = keyof typeof nodesData;

export const nodes: {
  [key in PossibleNodes]: ({ data }: NodeProps) => JSX.Element;
} = {
  startNode: StartNode,
  actionNode: ActionNode,
};
