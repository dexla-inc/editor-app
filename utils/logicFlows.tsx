import * as ActionNodeExports from "@/components/logic-flow/nodes/ActionNode";
import * as BooleanNodeExports from "@/components/logic-flow/nodes/BooleanNode";
import { computeNodeMapper } from "@/components/logic-flow/nodes/compute";
import * as ConditionalNodeExports from "@/components/logic-flow/nodes/ConditionalNode";
import * as ConnectionCreatorNodeExports from "@/components/logic-flow/nodes/ConnectionCreatorNode";
import * as StartNodeExports from "@/components/logic-flow/nodes/StartNode";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { FlowData } from "@/stores/flow";
import { decodeSchema } from "@/utils/compression";
import { getOutgoers, Node, NodeProps } from "reactflow";

const {
  ConnectionCreatorNode,
  data: connectionCreatorNodeData,
  ...connectionCreatorNode
} = ConnectionCreatorNodeExports;
const { StartNode, data: startNodeData, ...startNode } = StartNodeExports;
const { ActionNode, data: actionNodeData, ...actionNode } = ActionNodeExports;
const {
  ConditionalNode,
  data: conditionalNodeData,
  ...conditionalNode
} = ConditionalNodeExports;
const {
  BooleanNode,
  data: booleanNodeData,
  ...booleanNode
} = BooleanNodeExports;

export const nodesData = {
  connectionCreatorNode: {
    data: connectionCreatorNodeData,
    ...connectionCreatorNode,
  },
  startNode: { data: startNodeData, ...startNode },
  actionNode: { data: actionNodeData, ...actionNode },
  conditionalNode: { data: conditionalNodeData, ...conditionalNode },
  booleanNode: { data: booleanNodeData, ...booleanNode },
};

export type PossibleNodes = keyof typeof nodesData;

export const nodes: {
  [key in PossibleNodes]: ({ data }: NodeProps) => JSX.Element;
} = {
  connectionCreatorNode: ConnectionCreatorNode,
  booleanNode: BooleanNode,
  startNode: StartNode,
  actionNode: ActionNode,
  conditionalNode: ConditionalNode,
};

const run = async (state: FlowData, params: any) => {
  const initialNode = state.nodes.find((n) => n.id === "start-node") as Node;

  const compute = async () => {
    let nextNodes = getOutgoers(initialNode!, state.nodes, state.edges);

    while (nextNodes.length) {
      const nextNode = nextNodes[0];
      if (nextNode.type === "booleanNode") {
        const computeValue = params.computeValue;
        const value = computeValue({
          value: nextNode.data.form.condition,
          staticFallback: false,
        });

        if (value) {
          nextNodes = getOutgoers(nextNode, state.nodes, state.edges);
          console.log(nextNodes);
        } else {
          nextNodes = getOutgoers(nextNode, state.nodes, state.edges);
          console.log(nextNodes);
        }
      }
      const computeNode = computeNodeMapper[nextNode?.type!];

      await computeNode?.(nextNode, params);

      nextNodes = getOutgoers(nextNode, state.nodes, state.edges);
    }
  };

  await compute();
};

export const executeFlow = async (flow: LogicFlowResponse, params: any) => {
  try {
    const flowData: FlowData = JSON.parse(decodeSchema(flow.data as string));

    await run(flowData, params);
  } catch (error) {
    console.error(error);
  }
};
