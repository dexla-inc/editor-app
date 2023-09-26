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
} from "reactflow";

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
  isRunning: boolean;
  flowInstance?: ReactFlowInstance;
  nodes: Node[];
  edges: Edge[];
  pinnedPreviewNodeId?: string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onAddNode: (nodeToAdd: Node) => void;
  setFlowInstance: (flowInstance: ReactFlowInstance) => void;
  restoreFlow: (state: FlowData) => void;
  resetFlow: () => void;
  setIsDragging: (isDragging: boolean) => void;
  setSelectedNode: (selectedNode?: Partial<Node>) => void;
  updateNodeData: (node: Partial<Node>) => Promise<Node[]>;
  setIsRunning: (isRunning: boolean) => void;
  getNodeById: (id?: string) => Partial<Node>;
  setPinnedPreview: (pinnedPreviewNodeId?: string) => void;
};

const edgeProps = {
  type: "smoothstep",
};

export const useFlowStore = create<FlowState>((set, get) => ({
  isDragging: false,
  isRestored: false,
  isRunning: false,
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
      nodes: state.nodes,
      edges: state.edges,
      isRestored: true,
    });
  },
  resetFlow: () => {
    set({
      nodes: [],
      edges: [],
      isRestored: false,
      isRunning: false,
      isDragging: false,
      selectedNode: undefined,
      pinnedPreviewNodeId: undefined,
      flowInstance: undefined,
    });
  },
  setIsDragging: (isDragging) => {
    set({ isDragging });
  },
  setSelectedNode: (selectedNode?: Partial<Node>) => {
    set({ selectedNode: selectedNode ?? undefined });
  },
  updateNodeData: async (node: Partial<Node>): Promise<Node[]> => {
    const state = get();
    const dependencies = getDependecies(node as Node, state);
    const previousStateForCurrentNode = state.nodes.find(
      (n) => n.id === node.id,
    );
    const isChangingCache =
      previousStateForCurrentNode?.data.shouldCache !== node.data.shouldCache;

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

      if (
        !!dependencies.find((dep) => dep.node.id === n.id) &&
        isChangingCache
      ) {
        return {
          ...n,
          data: {
            ...n.data,
            shouldCache: node.data.shouldCache,
          },
        };
      }

      return n;
    });

    set({ nodes });

    return Promise.resolve(nodes);
  },
  setIsRunning: (isRunning: boolean) => {
    set({
      isRunning,
      edges: get().edges.map((edge) => {
        return {
          ...edge,
          animated: isRunning,
        };
      }),
    });
  },
  getNodeById: (id?: string) => {
    return get().nodes.find((n) => n.id === id) as Partial<Node>;
  },
  setPinnedPreview: (pinnedPreviewNodeId?: string) => {
    set({ pinnedPreviewNodeId });
  },
}));
