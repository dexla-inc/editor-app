import { Edge, Node, NodeProps } from "reactflow";
import * as StartNodeExports from "@/components/logic-flow/nodes/StartNode";
import * as ActionNodeExports from "@/components/logic-flow/nodes/ActionNode";
import { computeNodeMapper } from "@/components/logic-flow/nodes/compute";
import { LogicFlow } from "@prisma/client";
import { decodeSchema } from "@/utils/compression";
import { FlowData } from "@/stores/flow";

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
          const compute = computeNodeMapper[current!.type!];
          await compute?.(current, params);

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
    const response = await fetch(`/api/logic-flows/${flowId}`);
    const flow: LogicFlow = await response.json();
    const flowData: FlowData = JSON.parse(decodeSchema(flow.data as string));
    await run(flowData, params);
  } catch (error) {
    console.log(error);
  }
};
