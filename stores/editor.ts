import { defaultTheme } from "@/components/IFrame";
import { updatePageState } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { Logo } from "@/requests/themes/types";
import { Action } from "@/utils/actions";
import { encodeSchema } from "@/utils/compression";
import {
  Component,
  EditorTree,
  updateTreeComponent,
  updateTreeComponentActions,
  updateTreeComponentChildren,
  updateTreeComponentDescription,
} from "@/utils/editor";
import { MantineTheme } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
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

export interface MantineThemeExtended extends MantineTheme {
  logoUrl?: string;
  faviconUrl?: string;
  logos?: Logo[];
}

export type ComponentToBind = {
  componentId: string;
  trigger: string;
  endpointId?: string;
  param?: string;
  bindedId?: string;
  index?: number;
};

export type EditorState = {
  tree: EditorTree;
  currentProjectId?: string;
  currentPageId?: string;
  selectedComponentId?: string;
  copiedComponent?: Component;
  componentToAdd?: Component;
  iframeWindow?: Window;
  currentTargetId?: string;
  theme: MantineThemeExtended;
  isSaving: boolean;
  isPreviewMode: boolean;
  isNavBarVisible: boolean;
  pages: PageResponse[];
  onMountActionsRan: string[];
  pickingComponentToBindTo?: ComponentToBind;
  pickingComponentToBindFrom?: ComponentToBind;
  componentToBind?: string;
  currentTreeComponentsStates?: {
    [key: string]: string;
  };
  copiedAction?: Action[];
  setPickingComponentToBindTo: (
    pickingComponentToBindTo?: ComponentToBind
  ) => void;
  setPickingComponentToBindFrom: (
    pickingComponentToBindFrom?: ComponentToBind
  ) => void;
  setComponentToBind: (componentToBind?: string) => void;
  addOnMountActionsRan: (action: string) => void;
  resetOnMountActionsRan: () => void;
  setCopiedComponent: (copiedComponent?: Component) => void;
  setPages: (pages: PageResponse[]) => void;
  setTheme: (theme: MantineThemeExtended) => void;
  setIframeWindow: (iframeWindow: Window) => void;
  setCurrentTargetId: (currentTargetId?: string) => void;
  setTree: (tree: EditorTree, onLoad?: boolean) => void;
  resetTree: () => void;
  setCurrentProjectId: (currentProjectId: string) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setComponentToAdd: (componentToAdd?: Component) => void;
  updateTreeComponent: (
    componentId: string,
    props: any,
    save?: boolean
  ) => void;
  updateTreeComponentChildren: (
    componentId: string,
    children: Component[]
  ) => void;
  updateTreeComponentActions: (componentId: string, actions: Action[]) => void;
  updateTreeComponentDescription: (
    componentId: string,
    description: string
  ) => void;
  setTreeComponentCurrentState: (
    componentId: string,
    currentState: string
  ) => void;
  setSelectedComponentId: (selectedComponentId?: string) => void;
  clearSelection: () => void;
  setIsSaving: (isSaving: boolean) => void;
  setPreviewMode: (value: boolean) => void;
  setIsNavBarVisible: () => void;
  setCopiedAction: (copiedAction?: Action[]) => void;
  // pasteAction: (componentId: string) => void;
};

const debouncedUpdatePageState = debounce(updatePageState, 2000);

// creates a store with undo/redo capability
export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      tree: emptyEditorTree,
      theme: defaultTheme,
      pages: [],
      onMountActionsRan: [],
      selectedComponentId: "content-wrapper",
      addOnMountActionsRan: (onMountAction) =>
        set((state) => ({
          ...state,
          onMountActionsRan: state.onMountActionsRan.concat(onMountAction),
        })),
      resetOnMountActionsRan: () => set({ onMountActionsRan: [] }),
      setPages: (pages) => set({ pages }),
      setPickingComponentToBindFrom: (pickingComponentToBindFrom) =>
        set({ pickingComponentToBindFrom }),
      setPickingComponentToBindTo: (pickingComponentToBindTo) =>
        set({ pickingComponentToBindTo }),
      setComponentToBind: (componentToBind) => set({ componentToBind }),
      setCopiedComponent: (copiedComponent) => set({ copiedComponent }),
      setTheme: (theme) => set({ theme }),
      setIframeWindow: (iframeWindow) => set({ iframeWindow }),
      setCurrentTargetId: (currentTargetId) => set({ currentTargetId }),
      isSaving: false,
      setTree: (tree, onLoad) => {
        set((state) => {
          if (!onLoad) {
            debouncedUpdatePageState(
              encodeSchema(JSON.stringify(tree)),
              state.currentProjectId ?? "",
              state.currentPageId ?? "",
              state.setIsSaving
            );
          }
          return { tree };
        });
      },
      resetTree: () => {
        set({ tree: emptyEditorTree });
      },
      updateTreeComponent: (componentId, props, save = true) => {
        set((prev) => {
          const copy = cloneDeep(prev.tree);
          const currentState =
            prev.currentTreeComponentsStates?.[componentId] ?? "default";
          updateTreeComponent(copy.root, componentId, props, currentState);
          if (save) {
            debouncedUpdatePageState(
              encodeSchema(JSON.stringify(copy)),
              prev.currentProjectId ?? "",
              prev.currentPageId ?? "",
              prev.setIsSaving
            );
          }

          return {
            tree: copy,
          };
        });
      },
      updateTreeComponentChildren: (componentId, children) => {
        set((state) => {
          const copy = cloneDeep(state.tree);
          updateTreeComponentChildren(copy.root, componentId, children);
          debouncedUpdatePageState(
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
      updateTreeComponentActions: (componentId, actions) => {
        set((state) => {
          const copy = cloneDeep(state.tree);
          updateTreeComponentActions(copy.root, componentId, actions);
          debouncedUpdatePageState(
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
      updateTreeComponentDescription: (componentId, description) => {
        set((state) => {
          const copy = cloneDeep(state.tree);

          updateTreeComponentDescription(copy.root, componentId, description);
          debouncedUpdatePageState(
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
      setTreeComponentCurrentState: (componentId, currentState = "default") => {
        set((prev) => {
          return {
            currentTreeComponentsStates: {
              ...prev.currentTreeComponentsStates,
              [componentId]: currentState,
            },
          };
        });
      },
      setCurrentProjectId: (currentProjectId) => set({ currentProjectId }),
      setCurrentPageId: (currentPageId) => set({ currentPageId }),
      setComponentToAdd: (componentToAdd) => set({ componentToAdd }),
      setSelectedComponentId: (selectedComponentId) =>
        set({ selectedComponentId }),
      clearSelection: () => set({ selectedComponentId: "content-wrapper" }),
      setIsSaving: (isSaving) => set({ isSaving }),
      isPreviewMode: false,
      isNavBarVisible: true,
      setPreviewMode: (value) => set({ isPreviewMode: value }),
      setIsNavBarVisible: () =>
        set((state) => ({ isNavBarVisible: !state.isNavBarVisible })),
      setCopiedAction: (copiedAction) => set({ copiedAction }),
    }),
    {
      partialize: (state) => {
        const { tree } = state;
        return { tree };
      },
      limit: 500,
      equality(currentState, pastState) {
        return isEqual(currentState.tree, pastState.tree);
      },
    }
  )
);

export const useTemporalStore = <T>(
  selector: (state: TemporalState<Partial<EditorState>>) => T
) => useStore(useEditorStore.temporal, selector);
