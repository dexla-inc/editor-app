import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  NodeAddChange,
  ReactFlowInstance,
  EdgeAddChange,
} from "reactflow";
import { nanoid } from "nanoid";

export type FlowData = {
  edges: Edge[];
  nodes: Node[];
};

const getDependecies = (start: Node, state: any) => {
  const visited = new Set();
  const queue: Node[] = [start];
  const dependencies: { node: Node }[] = [];

  while (queue.length > 0) {
    const current = queue.shift(); // mutates the queue
    const edges = state.edges.filter((e: Edge) => e.target === current?.id);
    for (const edge of edges) {
      if (!visited.has(edge.id)) {
        visited.add(edge.id);
        const node = state.nodes.find((n: Node) => n.id === edge.source);
        queue.push(node);
        dependencies.push({ node });
      }
    }
  }

  return dependencies;
};

export type FlowState = {
  selectedNode?: Partial<Node>;
  isDragging: boolean;
  isRestored: boolean;
  isUpdating: boolean;
  flowInstance?: ReactFlowInstance;
  nodes: Node[];
  edges: Edge[];
  shouldShowFormModal?: boolean;
  currentFlowId?: string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onAddNode: (nodeToAdd: Node) => void;
  setFlowInstance: (flowInstance: ReactFlowInstance) => void;
  restoreFlow: (state: FlowData) => void;
  resetFlow: () => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  setSelectedNode: (selectedNode?: Partial<Node>) => void;
  updateNodeData: (node: Partial<Node>) => Promise<Node[]>;
  getNodeById: (id?: string) => Partial<Node>;
  setCurrentFlowId: (currentFlowId?: string) => void;
  setShowFormModal: (shouldShowFormModal?: boolean, flowId?: string) => void;
};

const edgeProps = {
  type: "smoothstep",
};

export const initialNodes = [
  {
    id: "start-node",
    type: "startNode",
    data: {
      label: "Start",
      description: "The starting point of a flow",
      inputs: [],
      outputs: [{ id: nanoid(), name: "Initial Trigger" }],
      isNotEditable: true,
    },
    position: { x: 0, y: 0 },
  },
] as Node[];

export const initialEdges = [] as Edge[];

export const useFlowStore = create<FlowState>((set, get) => ({
  isDragging: false,
  isRestored: false,
  isUpdating: false,
  shouldShowFormModal: false,
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(
        changes.map((change) => {
          const isAdd = change.type === "add";
          return {
            ...change,
            ...(isAdd
              ? {
                  item: { ...change.item, ...edgeProps },
                }
              : {}),
          };
        }),
        get().edges.map((edge) => {
          return {
            ...edge,
            ...edgeProps,
          };
        }),
      ),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        { ...connection, ...edgeProps },
        get().edges.map((edge) => {
          return {
            ...edge,
            ...edgeProps,
          };
        }),
      ),
    });
  },
  onAddNode: (nodeToAdd: Node) => {
    set({
      nodes: applyNodeChanges<NodeAddChange>(
        [{ item: nodeToAdd, type: "add" }],
        get().nodes,
      ),
    });
  },
  setFlowInstance: (flowInstance: ReactFlowInstance) => {
    set({ flowInstance });
  },
  restoreFlow: (state: FlowData) => {
    set({
      nodes: applyNodeChanges<NodeAddChange>(
        state.nodes.map((node) => ({ item: node, type: "add" })),
        [],
      ),
      edges: applyEdgeChanges<EdgeAddChange>(
        state.edges.map((edge) => ({ item: edge, type: "add" })),
        [],
      ),
      isRestored: true,
    });
  },
  resetFlow: () => {
    set({
      nodes: applyNodeChanges<NodeAddChange>(
        initialNodes.map((node) => ({ item: node, type: "add" })),
        [],
      ),
      edges: applyEdgeChanges<EdgeAddChange>(
        initialEdges.map((edge) => ({ item: edge, type: "add" })),
        [],
      ),
      isRestored: false,
      isDragging: false,
      selectedNode: undefined,
      flowInstance: undefined,
    });
  },
  setIsDragging: (isDragging) => {
    set({ isDragging });
  },
  setIsUpdating: (isUpdating) => {
    set({ isUpdating });
  },
  setSelectedNode: (selectedNode?: Partial<Node>) => {
    set({ selectedNode: selectedNode ?? undefined });
  },
  updateNodeData: async (node: Partial<Node>): Promise<Node[]> => {
    const state = get();
    const dependencies = getDependecies(node as Node, state);

    const nodes = state.nodes.map((n) => {
      if (node.id === n.id) {
        return {
          ...n,
          data: {
            ...n.data,
            ...node.data,
          },
        };
      }

      if (!!dependencies.find((dep) => dep.node.id === n.id)) {
        return {
          ...n,
          data: {
            ...n.data,
          },
        };
      }

      return n;
    });

    set({ nodes });

    return Promise.resolve(nodes);
  },
  getNodeById: (id?: string) => {
    return get().nodes.find((n) => n.id === id) as Partial<Node>;
  },
  setCurrentFlowId: (currentFlowId?: string) => {
    set({ currentFlowId });
  },
  setShowFormModal: (shouldShowFormModal?: boolean, currentFlowId?: string) => {
    set({ shouldShowFormModal, currentFlowId: currentFlowId ?? undefined });
  },
}));
