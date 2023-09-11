import { defaultTheme } from "@/components/IFrame";
import { updatePageState } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { Logo } from "@/requests/themes/types";
import { Action } from "@/utils/actions";
import { encodeSchema } from "@/utils/compression";
import {
  Component,
  EditorTree,
  getComponentById,
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
import { devtools } from "zustand/middleware";

const initialTimestamp = Date.now();
export const emptyEditorTree = {
  name: "Initial State",
  timestamp: initialTimestamp,
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

export type QueryToBind = {
  queryKey: string;
  queryValue: string;
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
  queryToBind?: Record<string, string>;
  queryToBindTo?: QueryToBind;
  setQueryToBindTo: (querytoBindTo?: QueryToBind) => void;
  setQueryToBind: (queryToBind?: Record<string, string>) => void;
  setPickingComponentToBindTo: (
    pickingComponentToBindTo?: ComponentToBind
  ) => void;
  setPickingComponentToBindFrom: (
    pickingComponentToBindFrom?: ComponentToBind
  ) => void;
  setComponentToBind: (componentToBind?: string) => void;
  addOnMountActionsRan: (action: string) => void;
  removeOnMountActionsRan: (action: string) => void;
  resetOnMountActionsRan: () => void;
  setCopiedComponent: (copiedComponent?: Component) => void;
  setPages: (pages: PageResponse[]) => void;
  setTheme: (theme: MantineThemeExtended) => void;
  setIframeWindow: (iframeWindow: Window) => void;
  setCurrentTargetId: (currentTargetId?: string) => void;
  setTree: (
    tree: EditorTree,
    options?: { onLoad?: boolean; action?: string }
  ) => void;
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
  language: string;
  setLanguage: (isSaving: string) => void;
};

const debouncedUpdatePageState = debounce(updatePageState, 2000);

// creates a store with undo/redo capability
export const useEditorStore = create<EditorState>()(
  devtools(
    temporal(
      (set) => ({
        tree: emptyEditorTree,
        theme: defaultTheme,
        pages: [],
        onMountActionsRan: [],
        selectedComponentId: "content-wrapper",
        language: "default",
        addOnMountActionsRan: (onMountAction) =>
          set((state) => ({
            ...state,
            onMountActionsRan: state.onMountActionsRan.concat(onMountAction),
          })),
        removeOnMountActionsRan: (onMountAction) =>
          set((state) => ({
            ...state,
            onMountActionsRan: state.onMountActionsRan.filter(
              (action) => action !== onMountAction
            ),
          })),
        resetOnMountActionsRan: () => set({ onMountActionsRan: [] }),
        setPages: (pages) => set({ pages }),
        setPickingComponentToBindFrom: (pickingComponentToBindFrom) =>
          set({ pickingComponentToBindFrom }),
        setPickingComponentToBindTo: (pickingComponentToBindTo) =>
          set({ pickingComponentToBindTo }),
        setQueryToBind: (queryToBind) => set({ queryToBind }),
        setQueryToBindTo: (queryToBindTo) => set({ queryToBindTo }),
        setComponentToBind: (componentToBind) => set({ componentToBind }),
        setCopiedComponent: (copiedComponent) => set({ copiedComponent }),
        setTheme: (theme) => set({ theme }),
        setIframeWindow: (iframeWindow) => set({ iframeWindow }),
        setCurrentTargetId: (currentTargetId) => set({ currentTargetId }),
        isSaving: false,
        // any component's move or reordering
        setTree: (tree, options) => {
          set((state: EditorState) => {
            if (!options?.onLoad) {
              debouncedUpdatePageState(
                encodeSchema(JSON.stringify(tree)),
                state.currentProjectId ?? "",
                state.currentPageId ?? "",
                state.setIsSaving
              );
            }

            return {
              tree: {
                ...tree,
                name: options?.action || "Generic move",
                timestamp: Date.now(),
              },
            };
          });
        },
        resetTree: () => {
          const timestamp = Date.now();
          set({
            tree: { ...emptyEditorTree, timestamp },
          });
        },
        // any props change
        updateTreeComponent: (componentId, props, save = true) => {
          set((prev) => {
            const copy = cloneDeep(prev.tree);
            const currentState =
              prev.currentTreeComponentsStates?.[componentId] ?? "default";
            const currentLanguage = prev.language;

            updateTreeComponent(
              copy.root,
              componentId,
              props,
              currentState,
              currentLanguage
            );
            if (save) {
              debouncedUpdatePageState(
                encodeSchema(JSON.stringify(copy)),
                prev.currentProjectId ?? "",
                prev.currentPageId ?? "",
                prev.setIsSaving
              );
            }

            const component = getComponentById(copy.root, componentId);

            return {
              tree: {
                ...copy,
                name: `Edited ${component?.name}`,
                timestamp: Date.now(),
              },
            };
          });
        },
        // anything out of .props that changes .children[]
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

            const component = getComponentById(copy.root, componentId);

            return {
              tree: {
                ...copy,
                name: `Edited ${component?.name}`,
                timestamp: Date.now(),
              },
            };
          });
        },
        // any action change
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

            const component = getComponentById(copy.root, componentId);

            return {
              tree: {
                ...copy,
                name: `Edited ${component?.name}`,
                timestamp: Date.now(),
              },
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
        setTreeComponentCurrentState: (
          componentId,
          currentState = "default"
        ) => {
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
        setLanguage: (language) => set({ language }),
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
    ),
    { name: "Editor store" }
  )
);

export const useTemporalStore = <T>(
  selector: (state: TemporalState<Partial<EditorState>>) => T
) => useStore(useEditorStore.temporal, selector);
