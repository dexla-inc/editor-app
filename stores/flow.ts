import { LogicFlowResponse } from "@/requests/logicflows/types";
import { nanoid } from "nanoid";
import {
  Connection,
  Edge,
  EdgeAddChange,
  EdgeChange,
  Node,
  NodeAddChange,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
  currentFlow?: LogicFlowResponse;
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
  setCurrentFlow: (currentFlow?: LogicFlowResponse) => void;
  setShowFormModal: (
    shouldShowFormModal?: boolean,
    flow?: LogicFlowResponse,
  ) => void;
  selectedTabView: "list" | "flow";
  setSelectedTabView: (selectedTabView: "list" | "flow") => void;
  setIsRestored: (isRestored: boolean) => void;
};

const edgeProps: Partial<Edge> = {
  type: "straight",
};

const addNodeId = nanoid();
export const initialNodes = [
  {
    id: "start-node",
    type: "startNode",
    data: {
      label: "Start",
      description: "The starting point of a flow",
      inputs: [],
      outputs: [{ id: nanoid(), name: "Initial Trigger" }],
    },
    position: { x: 0, y: 0 },
    deletable: false,
    draggable: false,
  },
  {
    id: addNodeId,
    type: "connectionCreatorNode",
    data: {
      inputs: [{ id: nanoid() }],
      outputs: [],
    },
    position: { x: 17.5, y: 80 },
    deletable: false,
  },
] as Node[];

export const initialEdges = [
  { id: nanoid(), source: "start-node", target: addNodeId, type: "straight" },
] as Edge[];

export const useFlowStore = create<FlowState>()(
  devtools(
    (set, get) => ({
      selectedTabView: "list",
      setSelectedTabView: (selectedTabView) => {
        set({ selectedTabView }, false, "editor/setSelectedTabView");
      },
      isDragging: false,
      isRestored: false,
      setIsRestored: (isRestored) => {
        set({ isRestored }, false, "flow/setIsRestored");
      },
      isUpdating: false,
      shouldShowFormModal: false,
      nodes: [],
      edges: [],
      onNodesChange: (changes: NodeChange[]) => {
        set(
          {
            nodes: applyNodeChanges(changes, get().nodes),
          },
          false,
          "flow/onNodesChange",
        );
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set(
          {
            edges: applyEdgeChanges(
              changes.map((change) => {
                const isAdd = change.type === "add";
                return {
                  ...change,
                  ...(isAdd
                    ? {
                        item: { ...edgeProps, ...change.item },
                      }
                    : {}),
                };
              }),
              get().edges.map((edge) => {
                return {
                  ...edgeProps,
                  ...edge,
                };
              }),
            ),
          },
          false,
          "flow/onEdgesChange",
        );
      },
      onConnect: (connection: Connection) => {
        set(
          {
            edges: addEdge(
              { ...edgeProps, ...connection },
              get().edges.map((edge) => {
                return {
                  ...edgeProps,
                  ...edge,
                };
              }),
            ),
          },
          false,
          "flow/onConnect",
        );
      },
      onAddNode: (nodeToAdd: Node) => {
        set(
          {
            nodes: applyNodeChanges<NodeAddChange>(
              [{ item: nodeToAdd, type: "add" }],
              get().nodes,
            ),
          },
          false,
          "flow/onAddNode",
        );
      },
      setFlowInstance: (flowInstance: ReactFlowInstance) => {
        set({ flowInstance }, false, "flow/setFlowInstance");
      },
      restoreFlow: (state: FlowData) => {
        set(
          {
            nodes: applyNodeChanges<NodeAddChange>(
              state.nodes.map((node) => ({ item: node, type: "add" })),
              [],
            ),
            edges: applyEdgeChanges<EdgeAddChange>(
              state.edges.map((edge) => ({ item: edge, type: "add" })),
              [],
            ),
            isRestored: true,
          },
          false,
          "flow/restoreFlow",
        );
      },
      resetFlow: () => {
        set(
          {
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
          },
          false,
          "flow/resetFlow",
        );
      },
      setIsDragging: (isDragging) => {
        set({ isDragging }, false, "flow/setIsDragging");
      },
      setIsUpdating: (isUpdating) => {
        set({ isUpdating }, false, "flow/setIsUpdating");
      },
      setSelectedNode: (selectedNode?: Partial<Node>) => {
        set(
          { selectedNode: selectedNode ?? undefined },
          false,
          "flow/setSelectedNode",
        );
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

        set({ nodes }, false, "flow/updateNodeData");

        return Promise.resolve(nodes);
      },
      getNodeById: (id?: string) => {
        return get().nodes.find((n) => n.id === id) as Partial<Node>;
      },
      setCurrentFlow: (currentFlow?: LogicFlowResponse) => {
        set({ currentFlow }, false, "flow/setCurrentFlow");
      },
      setShowFormModal: (
        shouldShowFormModal?: boolean,
        currentFlow?: LogicFlowResponse,
      ) => {
        set(
          { shouldShowFormModal, currentFlow: currentFlow ?? undefined },
          false,
          "flow/setShowFormModal",
        );
      },
    }),
    { name: "Flow Store" },
  ),
);
