import { defaultTheme } from "@/components/IFrame";
import { updatePageState } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { Logo } from "@/requests/themes/types";
import { Action } from "@/utils/actions";
import { encodeSchema } from "@/utils/compression";
import { ApiType } from "@/utils/dashboardTypes";
import {
  Component,
  EditorTree,
  getComponentById,
  updateTreeComponent,
  updateTreeComponentActions,
  updateTreeComponentAttrs,
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
  paramType?: ApiType;
  bindedId?: string;
  index?: number;
  onPick?: (props: any) => void;
};

export type FeatureToBind = {
  key: string;
  value: string;
  trigger: string;
  endpointId?: string;
  param?: string;
  paramType?: ApiType;
  bindedId?: string;
  index?: number;
};

export type Variables = {
  key: string;
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
  isLive: boolean;
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
  featureToBind?: string;
  featureToBindTo?: FeatureToBind;
  sequentialTo?: string;
  setSequentialTo: (sequentialTo?: string) => void;
  setFeatureToBindTo: (featuretoBindTo?: FeatureToBind) => void;
  setFeatureToBind: (featureToBind?: string) => void;
  setPickingComponentToBindTo: (
    pickingComponentToBindTo?: ComponentToBind,
  ) => void;
  setPickingComponentToBindFrom: (
    pickingComponentToBindFrom?: ComponentToBind,
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
    options?: { onLoad?: boolean; action?: string },
  ) => void;
  resetTree: () => void;
  setCurrentProjectId: (currentProjectId: string) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setComponentToAdd: (componentToAdd?: Component) => void;
  updateTreeComponent: (
    componentId: string,
    props: any,
    save?: boolean,
  ) => void;
  updateTreeComponentChildren: (
    componentId: string,
    children: Component[],
  ) => void;
  updateTreeComponentActions: (componentId: string, actions: Action[]) => void;
  updateTreeComponentDescription: (
    componentId: string,
    description: string,
  ) => void;
  updateTreeComponentAttrs: (
    componentIds: string[],
    attrs: Partial<Component>,
  ) => void;
  setTreeComponentCurrentState: (
    componentId: string,
    currentState: string,
  ) => void;
  setSelectedComponentId: (selectedComponentId?: string) => void;
  clearSelection: () => void;
  setIsSaving: (isSaving: boolean) => void;
  setPreviewMode: (value: boolean) => void;
  setIsLive: (value: boolean) => void;
  setIsNavBarVisible: () => void;
  setCopiedAction: (copiedAction?: Action[]) => void;
  // pasteAction: (componentId: string) => void;
  language: string;
  setLanguage: (isSaving: string) => void;
  setHighlightedComponentId: (componentId: string | null) => void;
  highlightedComponentId?: string | null;
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
          set(
            (state) => ({
              ...state,
              onMountActionsRan: state.onMountActionsRan.concat(onMountAction),
            }),
            false,
            "editor/addOnMountActionsRan",
          ),
        removeOnMountActionsRan: (onMountAction) =>
          set(
            (state) => ({
              ...state,
              onMountActionsRan: state.onMountActionsRan.filter(
                (action) => action !== onMountAction,
              ),
            }),
            false,
            "editor/removeOnMountActionsRan",
          ),
        resetOnMountActionsRan: () =>
          set(
            { onMountActionsRan: [] },
            false,
            "editor/resetOnMountActionsRan",
          ),
        setPages: (pages) => set({ pages }, false, "editor/setPages"),
        setPickingComponentToBindFrom: (pickingComponentToBindFrom) =>
          set(
            { pickingComponentToBindFrom },
            false,
            "editor/setPickingComponentToBindFrom",
          ),
        setPickingComponentToBindTo: (pickingComponentToBindTo) =>
          set(
            { pickingComponentToBindTo },
            false,
            "editor/setPickingComponentToBindTo",
          ),
        setFeatureToBind: (featureToBind) =>
          set({ featureToBind }, false, "editor/setFeatureToBind"),
        setFeatureToBindTo: (featureToBindTo) =>
          set({ featureToBindTo }, false, "editor/setFeatureToBindTo"),
        setSequentialTo: (sequentialTo) =>
          set({ sequentialTo }, false, "editor/setSequentialTo"),
        setComponentToBind: (componentToBind) =>
          set({ componentToBind }, false, "editor/setComponentToBind"),
        setCopiedComponent: (copiedComponent) =>
          set({ copiedComponent }, false, "editor/setCopiedComponent"),
        setTheme: (theme) => set({ theme }, false, "editor/setTheme"),
        setIframeWindow: (iframeWindow) =>
          set({ iframeWindow }, false, "editor/setIframeWindow"),
        setCurrentTargetId: (currentTargetId) =>
          set({ currentTargetId }, false, "editor/setCurrentTargetId"),
        isSaving: false,
        // any component's move or reordering
        setTree: (tree, options) => {
          set(
            (state: EditorState) => {
              if (!options?.onLoad) {
                debouncedUpdatePageState(
                  encodeSchema(JSON.stringify(tree)),
                  state.currentProjectId ?? "",
                  state.currentPageId ?? "",
                  state.setIsSaving,
                );
              }

              return {
                tree: {
                  ...tree,
                  name: options?.action || "Generic move",
                  timestamp: Date.now(),
                },
              };
            },
            false,
            "editor/setTree",
          );
        },
        resetTree: () => {
          const timestamp = Date.now();
          set(
            {
              tree: { ...emptyEditorTree, timestamp },
            },
            false,
            "editor/resetTree",
          );
        },
        // any props change
        updateTreeComponent: (componentId, props, save = true) => {
          set(
            (prev) => {
              const copy = cloneDeep(prev.tree);
              const currentState =
                prev.currentTreeComponentsStates?.[componentId] ?? "default";
              const currentLanguage = prev.language;

              updateTreeComponent(
                copy.root,
                componentId,
                props,
                currentState,
                currentLanguage,
              );
              if (save) {
                debouncedUpdatePageState(
                  encodeSchema(JSON.stringify(copy)),
                  prev.currentProjectId ?? "",
                  prev.currentPageId ?? "",
                  prev.setIsSaving,
                );
              }

              const component = getComponentById(copy.root, componentId);

              return {
                tree: {
                  ...cloneDeep(copy),
                  name: `Edited ${component?.name}`,
                  timestamp: Date.now(),
                },
              };
            },
            false,
            "editor/updateTreeComponent",
          );
        },
        // anything out of .props that changes .children[]
        updateTreeComponentChildren: (componentId, children) => {
          set(
            (state) => {
              const copy = cloneDeep(state.tree);
              updateTreeComponentChildren(copy.root, componentId, children);
              debouncedUpdatePageState(
                encodeSchema(JSON.stringify(copy)),
                state.currentProjectId ?? "",
                state.currentPageId ?? "",
                state.setIsSaving,
              );

              const component = getComponentById(copy.root, componentId);

              return {
                tree: {
                  ...copy,
                  name: `Edited ${component?.name}`,
                  timestamp: Date.now(),
                },
              };
            },
            false,
            "editor/updateTreeComponentChildren",
          );
        },
        // any action change
        updateTreeComponentActions: (componentId, actions) => {
          set(
            (state) => {
              const copy = cloneDeep(state.tree);
              updateTreeComponentActions(copy.root, componentId, actions);
              debouncedUpdatePageState(
                encodeSchema(JSON.stringify(copy)),
                state.currentProjectId ?? "",
                state.currentPageId ?? "",
                state.setIsSaving,
              );

              const component = getComponentById(copy.root, componentId);

              return {
                tree: {
                  ...copy,
                  name: `Edited ${component?.name}`,
                  timestamp: Date.now(),
                },
              };
            },
            false,
            "editor/updateTreeComponentActions",
          );
        },
        updateTreeComponentDescription: (componentId, description) => {
          set(
            (state) => {
              const copy = cloneDeep(state.tree);

              updateTreeComponentDescription(
                copy.root,
                componentId,
                description,
              );
              debouncedUpdatePageState(
                encodeSchema(JSON.stringify(copy)),
                state.currentProjectId ?? "",
                state.currentPageId ?? "",
                state.setIsSaving,
              );

              return {
                tree: copy,
              };
            },
            false,
            "editor/updateTreeComponentDescription",
          );
        },
        updateTreeComponentAttrs: (
          componentIds: string[],
          attrs: Partial<Component>,
        ) => {
          set(
            (state) => {
              const copy = cloneDeep(state.tree);

              updateTreeComponentAttrs(copy.root, componentIds, attrs);
              debouncedUpdatePageState(
                encodeSchema(JSON.stringify(copy)),
                state.currentProjectId ?? "",
                state.currentPageId ?? "",
                state.setIsSaving,
              );

              return {
                tree: copy,
              };
            },
            false,
            "editor/updateTreeComponentAttrs",
          );
        },
        setTreeComponentCurrentState: (
          componentId,
          currentState = "default",
        ) => {
          set(
            (prev) => {
              return {
                currentTreeComponentsStates: {
                  ...prev.currentTreeComponentsStates,
                  [componentId]: currentState,
                },
              };
            },
            false,
            "editor/setTreeComponentCurrentState",
          );
        },
        setCurrentProjectId: (currentProjectId) =>
          set({ currentProjectId }, false, "editor/setCurrentProjectId"),
        setCurrentPageId: (currentPageId) =>
          set({ currentPageId }, false, "editor/setCurrentPageId"),
        setComponentToAdd: (componentToAdd) =>
          set({ componentToAdd }, false, "editor/setComponentToAdd"),
        setSelectedComponentId: (selectedComponentId) =>
          set({ selectedComponentId }, false, "editor/setSelectedComponentId"),
        clearSelection: () =>
          set(
            { selectedComponentId: "content-wrapper" },
            false,
            "editor/clearSelection",
          ),
        setIsSaving: (isSaving) =>
          set({ isSaving }, false, "editor/setIsSaving"),
        isPreviewMode: false,
        isLive: false,
        isNavBarVisible: true,
        setPreviewMode: (value) =>
          set(
            { isPreviewMode: value, currentTreeComponentsStates: {} },
            false,
            "editor/setPreviewMode",
          ),
        setIsLive: (value) => set({ isLive: value }, false, "editor/setIsLive"),
        setIsNavBarVisible: () =>
          set(
            (state) => ({ isNavBarVisible: !state.isNavBarVisible }),
            false,
            "editor/setIsNavBarVisible",
          ),
        setCopiedAction: (copiedAction) =>
          set({ copiedAction }, false, "editor/setCopiedAction"),
        setLanguage: (language) =>
          set({ language }, false, "editor/setLanguage"),
        setHighlightedComponentId: (componentId) =>
          set(
            { highlightedComponentId: componentId },
            false,
            "editor/setHighlightedComponentId",
          ),
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
      },
    ),
    { name: "Editor store" },
  ),
);

export const useTemporalStore = <T>(
  selector: (state: TemporalState<Partial<EditorState>>) => T,
) => useStore(useEditorStore.temporal, selector);
