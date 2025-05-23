import { useFlowStore } from "@/stores/flow";
import { nanoid } from "nanoid";
import { Edge, Node, NodeChange, getOutgoers } from "reactflow";

export const onNodesPositionChange = (deletedNode: Node) => {
  const onNodesChange = useFlowStore.getState().onNodesChange;
  const nodes = useFlowStore.getState().nodes;
  // Get all nodes that are below the deleted node
  const nodesBelow = nodes
    .filter((n) => n.position.y > deletedNode.position.y)
    .sort((a, b) => a.position.y - b.position.y)
    .map((n) => ({
      ...n,
      position: { ...n.position, y: n.position.y - 72 },
    }));

  onNodesChange(
    nodesBelow.map((node) => ({
      ...node,
      type: "position",
    })),
  );
};

export const onDeleteIfTrueOrFalseNode = (
  deletedNode: Node,
  connectedEdges: Edge[],
  remainingEdges: Edge[],
  outgoers: Node<any, string | undefined>[],
  incomers: Node<any, string | undefined>[],
) => {
  const { nodes, edges, onNodesChange } = useFlowStore.getState();
  const booleanNode = incomers.find((n) => n.type === "booleanNode");
  const xValue =
    booleanNode?.position.x! > deletedNode.position.x ? -82.5 : 117.5;
  const xPos = booleanNode ? xValue : 17.5;
  const connectorNode = {
    id: nanoid(),
    type: "connectionCreatorNode",
    data: {
      inputs: [{ id: nanoid() }],
      outputs: [],
    },
    position: { x: xPos, y: deletedNode.position.y },
    deletable: false,
  } as Node;

  // Find the outgoing nodes for 'true' and 'false' paths
  const outgoerEdges = connectedEdges.filter(
    (edge) => edge.source === deletedNode.id,
  );

  const outgoerNodes = outgoerEdges
    .map((edge) => nodes.find((n) => n.id === edge.target))
    .filter((n) => n) as Node[];

  // For each outgoing node, remove it and its descendants
  outgoerNodes.forEach((outgoerNode) => {
    const toDelete = [outgoerNode];
    let currentLayer = [outgoerNode];

    while (currentLayer.length > 0) {
      const nextLayer: Node[] = [];
      currentLayer.forEach((n) => {
        const outgoersOfCurrent = getOutgoers(n, nodes, edges);
        nextLayer.push(...outgoersOfCurrent);
        toDelete.push(...outgoersOfCurrent);
      });
      currentLayer = nextLayer;
    }

    // Remove all nodes in the toDelete list and their connected edges
    toDelete.forEach((n) => {
      remainingEdges = remainingEdges.filter(
        (edge) => edge.source !== n.id && edge.target !== n.id,
      );
    });
    // Remove the nodes from the state
    const updatedNodes = [{ item: connectorNode, type: "add" }].concat(
      // @ts-ignore
      toDelete.map((n) => ({
        ...n,
        type: "remove",
      })),
    ) as NodeChange[];
    onNodesChange(updatedNodes);
    outgoers = [connectorNode];
  });

  return { remainingEdges, outgoers };
};
