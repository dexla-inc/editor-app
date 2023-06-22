import { Component, EditorTree, updateTreeComponent } from "@/utils/editor";
import { create, useStore } from "zustand";
import { TemporalState, temporal } from "zundo";
import throttle from "lodash.throttle";
import { updatePageState } from "@/requests/projects/mutations";
import { encodeSchema } from "@/utils/compression";

export const emptyEditorTree = {
  root: {
    id: "root",
    name: "Container",
    description: "Root Container",
    props: {
      style: {
        width: "100%",
      },
    },
    children: [],
  },
};

export type EditorState = {
  tree: EditorTree;
  currentProjectId?: string;
  currentPageId?: string;
  selectedComponentId?: string;
  componentToAdd?: Component;
  iframeWindow?: any;
  setIframeWindow: (iframeWindow: Window) => void;
  setTree: (tree: EditorTree) => void;
  resetTree: () => void;
  setCurrentProjectId: (currentProjectId: string) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setComponentToAdd: (componentToAdd: Component) => void;
  updateTreeComponent: (componentId: string, props: any) => void;
  setSelectedComponentId: (selectedComponentId: string) => void;
  clearSelection: () => void;
};

// creates a store with undo/redo capability
export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      tree: emptyEditorTree,
      setIframeWindow: (iframeWindow) => set({ iframeWindow }),
      setTree: (tree) => {
        set((state) => {
          updatePageState(
            encodeSchema(JSON.stringify(tree)),
            state.currentProjectId ?? "",
            state.currentPageId ?? ""
          );
          return { tree };
        });
      },
      resetTree: () => {
        set({ tree: emptyEditorTree });
      },
      updateTreeComponent: (componentId, props) => {
        set((state) => {
          const copy = { ...state.tree };
          updateTreeComponent(copy.root, componentId, props);
          updatePageState(
            encodeSchema(JSON.stringify(copy)),
            state.currentProjectId ?? "",
            state.currentPageId ?? ""
          );

          return {
            tree: copy,
          };
        });
      },
      setCurrentProjectId: (currentProjectId) => set({ currentProjectId }),
      setCurrentPageId: (currentPageId) => set({ currentPageId }),
      setComponentToAdd: (componentToAdd) => set({ componentToAdd }),
      setSelectedComponentId: (selectedComponentId) =>
        set({ selectedComponentId }),
      clearSelection: () => set({ selectedComponentId: undefined }),
    }),
    {
      partialize: (state) => {
        const { tree } = state;
        return { tree };
      },
      limit: 500,
      handleSet: (handleSet) =>
        throttle<typeof handleSet>((state: EditorState) => {
          handleSet(state);
        }, 1000),
    }
  )
);

export const useTemporalStore = <T>(
  selector: (state: TemporalState<Partial<EditorState>>) => T,
  equality?: (a: T, b: T) => boolean
) => useStore(useEditorStore.temporal, selector, equality);
