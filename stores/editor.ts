import { defaultTheme } from "@/components/IFrame";
import { updatePageState } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { encodeSchema } from "@/utils/compression";
import { Component, EditorTree, updateTreeComponent } from "@/utils/editor";
import { MantineTheme } from "@mantine/core";
import throttle from "lodash.throttle";
import { TemporalState, temporal } from "zundo";
import { create, useStore } from "zustand";

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
  iframeWindow?: Window;
  currentTargetId?: string;
  theme: MantineTheme;
  isSaving: boolean;
  pages: PageResponse[];
  setPages: (pages: PageResponse[]) => void;
  setTheme: (theme: MantineTheme) => void;
  setIframeWindow: (iframeWindow: Window) => void;
  setCurrentTargetId: (currentTargetId?: string) => void;
  setTree: (tree: EditorTree) => void;
  resetTree: () => void;
  setCurrentProjectId: (currentProjectId: string) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setComponentToAdd: (componentToAdd?: Component) => void;
  updateTreeComponent: (componentId: string, props: any) => void;
  setSelectedComponentId: (selectedComponentId: string) => void;
  clearSelection: () => void;
  setIsSaving: (isSaving: boolean) => void;
};

// creates a store with undo/redo capability
export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      tree: emptyEditorTree,
      theme: defaultTheme,
      pages: [],
      setPages: (pages) => set({ pages }),
      setTheme: (theme) => set({ theme }),
      setIframeWindow: (iframeWindow) => set({ iframeWindow }),
      setCurrentTargetId: (currentTargetId) => set({ currentTargetId }),
      isSaving: false,
      setTree: (tree) => {
        set((state) => {
          updatePageState(
            encodeSchema(JSON.stringify(tree)),
            state.currentProjectId ?? "",
            state.currentPageId ?? "",
            state.setIsSaving
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
            state.currentPageId ?? "",
            state.setIsSaving
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
      setIsSaving: (isSaving) => set({ isSaving }),
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
