import * as ActionNodeExports from "@/components/logic-flow/nodes/ActionNode";
import * as BooleanNodeExports from "@/components/logic-flow/nodes/BooleanNode";
import { computeNodeMapper } from "@/components/logic-flow/nodes/compute";
import * as ConditionalNodeExports from "@/components/logic-flow/nodes/ConditionalNode";
import * as ConnectionCreatorNodeExports from "@/components/logic-flow/nodes/ConnectionCreatorNode";
import * as StartNodeExports from "@/components/logic-flow/nodes/StartNode";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { FlowData } from "@/stores/flow";
import { safeJsonParse } from "@/utils/common";
import { decodeSchema } from "@/utils/compression";
import startCase from "lodash.startcase";
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

const getNextNode = (
  state: FlowData,
  nextNode: Node<any, string | undefined>,
  params: any,
) => {
  const computeValue = params.computeValue;
  const condition =
    computeValue({
      value: nextNode.data.form.condition,
      staticFallback: false,
    }) ?? false;

  const nextNodes = getOutgoers(nextNode, state.nodes, state.edges);
  const outgoerEdges = state.edges.find(
    (edge) =>
      edge.label === startCase(`${condition}`) && edge.source === nextNode.id,
  );
  const nodeToTrigger = nextNodes.find(
    (node) => node.id === outgoerEdges?.target,
  );

  return nodeToTrigger;
};

const run = async (state: FlowData, params: any) => {
  const initialNode = state.nodes.find((n) => n.id === "start-node") as Node;

  const compute = async () => {
    let nextNodes = getOutgoers(initialNode!, state.nodes, state.edges);

    while (nextNodes.length) {
      let nextNode = nextNodes[0];

      // Keep evaluating boolean nodes until we get a non-boolean node
      while (nextNode.type === "booleanNode") {
        const nodeToTrigger = getNextNode(state, nextNode, params);
        if (!nodeToTrigger) break;
        nextNode = nodeToTrigger;
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
    const flowData: FlowData = safeJsonParse(decodeSchema(flow.data as string));

    await run(flowData, params);
  } catch (error) {
    console.error(error);
  }
};
