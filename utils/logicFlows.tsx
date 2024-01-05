import * as ActionNodeExports from "@/components/logic-flow/nodes/ActionNode";
import * as ConditionalNodeExports from "@/components/logic-flow/nodes/ConditionalNode";
import { NodeOutput } from "@/components/logic-flow/nodes/CustomNode";
import * as StartNodeExports from "@/components/logic-flow/nodes/StartNode";
import * as AddNodeExports from "@/components/logic-flow/nodes/AddNode";
import { computeNodeMapper } from "@/components/logic-flow/nodes/compute";
import { getLogicFlow } from "@/requests/logicflows/queries-noauth";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { FlowData } from "@/stores/flow";
import { decodeSchema } from "@/utils/compression";
import { checkIfValid } from "@/utils/triggerConditions";
import { Edge, Node, NodeProps } from "reactflow";

const { AddNode, data: addNodeData, ...addNode } = AddNodeExports;
const { StartNode, data: startNodeData, ...startNode } = StartNodeExports;
const { ActionNode, data: actionNodeData, ...actionNode } = ActionNodeExports;
const {
  ConditionalNode,
  data: conditionalNodeData,
  ...conditionalNode
} = ConditionalNodeExports;

export const nodesData = {
  addNode: { data: addNodeData, ...addNode },
  startNode: { data: startNodeData, ...startNode },
  actionNode: { data: actionNodeData, ...actionNode },
  conditionalNode: { data: conditionalNodeData, ...conditionalNode },
};

export type PossibleNodes = keyof typeof nodesData;

export const nodes: {
  [key in PossibleNodes]: ({ data }: NodeProps) => JSX.Element;
} = {
  addNode: AddNode,
  startNode: StartNode,
  actionNode: ActionNode,
  conditionalNode: ConditionalNode,
};

const run = async (state: FlowData, params: any) => {
  const initialNode = state.nodes.find((n) => n.id === "start-node") as Node;
  if (!initialNode) {
    throw new Error("Invalid starting node");
  }

  const traverseGraph = (start: Node) => {
    const visited = new Set();
    const queue: Node[] = [start];
    const dependants: { node: Node }[] = [];

    while (queue.length > 0) {
      const current = queue.shift(); // mutates the queue
      const edges = state.edges.filter((e: Edge) => e.source === current?.id);
      for (const edge of edges) {
        if (!visited.has(edge.id)) {
          visited.add(edge.id);
          const node = state.nodes.find(
            (n: Node) => n.id === edge.target,
          ) as Node;
          queue.push(node);
          dependants.push({ node });
        }
      }
    }

    return dependants;
  };

  const getSortedGraph = (start: Node) => {
    const sortedGraph: { node: Node }[] = [];
    const getDependants = (node: Node) => {
      const alreadyThere = sortedGraph.find((dg) => dg.node.id === node.id);
      if (alreadyThere) {
        return;
      }
      const dependants = traverseGraph(node);
      dependants.forEach((dependant) => {
        getDependants(dependant.node);
      });

      sortedGraph.push({ node });
    };

    getDependants(start);
    return sortedGraph;
  };

  const sortedGraph = getSortedGraph(initialNode!);
  const outputs: any[] = [];

  const compute = async (start: Node) => {
    const queue: Node[] = [start];

    while (queue.length > 0) {
      const current = queue.shift() as Node;
      const edges = state.edges.filter((e: Edge) => e.target === current?.id);
      for await (const edge of edges) {
        const alreadyThere = !!outputs.find((o: any) => {
          return o.sourceId === edge.source && o.targetId == edge.target;
        });

        if (!alreadyThere) {
          const outputingNode = state.nodes.find(
            (n: Node) => n.id === edge.source,
          ) as Node;

          queue.push(outputingNode);

          const out = outputingNode?.data.outputs.find(
            (o: NodeOutput) => o.id === edge.sourceHandle,
          );

          let isValid = true;
          if (out?.triggerCondition && out?.triggerCondition !== "none") {
            isValid = checkIfValid({
              data: outputingNode?.data,
              condition: out.triggerCondition,
              conditionValue: out.triggerConditionValue,
            });
          }

          if (isValid) {
            const compute = computeNodeMapper[current!.type!];
            await compute?.(current, params, out);
          }

          outputs.push({
            sourceId: outputingNode.id,
            targetId: current?.id,
          });
        }
      }
    }
  };

  const execute = async () => {
    const invertedGraph = sortedGraph.reverse();
    for await (const graph of invertedGraph) {
      await compute(graph.node);
    }
  };

  await execute();
};

export const executeFlow = async (flowId: string, params: any) => {
  try {
    const flow: LogicFlowResponse = await getLogicFlow(
      params.router.query.id,
      flowId,
    );
    const flowData: FlowData = JSON.parse(decodeSchema(flow.data as string));
    await run(flowData, params);
  } catch (error) {
    console.error(error);
  }
};
