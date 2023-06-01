import { DropTarget, EditorTree } from "@/utils/editor";
import { create, useStore } from "zustand";
import { TemporalState, temporal } from "zundo";
import throttle from "lodash.throttle";

export const emptyEditorTree = {
  root: {
    id: "root",
    name: "Container",
    description: "Root Container",
    columns: 12,
    children: [],
  },
};

export interface EditorState {
  tree: EditorTree;
  dropTarget?: DropTarget;
  selectedComponentId?: string;
  setTree: (tree: EditorTree) => void;
  setDropTarget: (dropTarget: DropTarget) => void;
  clearDropTarget: () => void;
  setSelectedComponentId: (selectedComponentId: string) => void;
  clearSelection: () => void;
}

// creates a store with undo/redo capability
export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      tree: emptyEditorTree,
      setTree: (tree) => set({ tree }),
      setDropTarget: (dropTarget) => set({ dropTarget }),
      clearDropTarget: () => set({ dropTarget: undefined }),
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
