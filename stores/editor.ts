import { defaultTheme } from "@/components/IFrame";
import { updatePageState } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { CardStyle } from "@/requests/projects/types";
import { Logo } from "@/requests/themes/types";
import { Action } from "@/utils/actions";
import { encodeSchema } from "@/utils/compression";
import { GRID_SIZE } from "@/utils/config";
import {
  Component,
  EditorTree,
  getComponentById,
  updateTreeComponent,
  updateTreeComponentActions,
  updateTreeComponentAttrs,
  updateTreeComponentChildren,
  updateTreeComponentDescription,
  updateTreeComponentWithOmitProps,
} from "@/utils/editor";
import { MantineNumberSize, MantineTheme } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import { nanoid } from "nanoid";
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
    description: "Root component",
    children: [
      {
        id: "content-wrapper",
        name: "Grid",
        description: "Grid",
        props: {
          m: 0,
          p: 0,
          gridSize: GRID_SIZE,
          style: {
            width: "100%",
            height: "auto",
            minHeight: "50px",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "GridColumn",
            description: "GridColumn",
            props: {
              span: GRID_SIZE,
              style: {
                height: "auto",
                border: "2px dotted #ddd",
              },
            },
          },
        ],
      },
    ],
  },
};

export interface MantineThemeExtended extends MantineTheme {
  logoUrl?: string;
  faviconUrl?: string;
  logos?: Logo[];
  defaultFont?: string;
  hasCompactButtons?: boolean;
  cardStyle?: CardStyle;
  defaultSpacing?: MantineNumberSize;
}

export type ComponentToBind = {
  componentId: string;
  onPick?: (props: any) => void;
};

export type OpenAction = {
  actionId?: string;
  componentId?: string;
};

export type ClipboardProps = {
  componentName: string;
  componentProps: { [key: string]: any };
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
  activeTab?: string;
  isStructureCollapsed: boolean;
  pages: PageResponse[];
  onMountActionsRan: string[];
  pickingComponentToBindTo?: ComponentToBind;
  pickingComponentToBindFrom?: ComponentToBind;
  componentToBind?: string;
  currentTreeComponentsStates?: {
    [key: string]: string;
  };
  copiedAction?: Action[];
  sequentialTo?: string;
  openAction?: OpenAction;
  defaultComponentWidth?: number;
  isPageStructure?: boolean;
  copiedProperties?: ClipboardProps;

  setCopiedProperties: (copiedProperties: ClipboardProps) => void;
  setIsPageStructure: (isPageStructure: boolean) => void;
  setDefaultComponentWidth: (defaultComponentWidth: number) => void;
  setOpenAction: (openAction: OpenAction) => void;
  setSequentialTo: (sequentialTo?: string) => void;
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
    save?: boolean,
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
  clearSelection: (id?: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  setPreviewMode: (value: boolean) => void;
  setIsLive: (value: boolean) => void;
  setIsNavBarVisible: () => void;
  setActiveTab: (activeTab?: string) => void;
  setIsStructureCollapsed: (value: boolean) => void;
  setCopiedAction: (copiedAction?: Action[]) => void;
  // pasteAction: (componentId: string) => void;
  language: string;
  setLanguage: (isSaving: string) => void;
  setHighlightedComponentId: (componentId: string | null) => void;
  highlightedComponentId?: string | null;
  isResizing?: boolean;
  setIsResizing: (isResizing?: boolean) => void;
  columnSpans?: { [key: string]: number };
  setColumnSpan: (id: string, span: number) => void;
};

export const debouncedUpdatePageState = debounce(updatePageState, 2000);

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
        setCopiedProperties: (copiedProperties) =>
          set({ copiedProperties }, false, "editor/setCopiedProperties"),
        setDefaultComponentWidth: (defaultComponentWidth) =>
          set(
            { defaultComponentWidth },
            false,
            "editor/setDefaultComponentWidth",
          ),
        setOpenAction: (openAction) =>
          set({ openAction }, false, "editor/setOpenAction"),
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
        setSequentialTo: (sequentialTo) =>
          set({ sequentialTo }, false, "editor/setSequentialTo"),
        setComponentToBind: (componentToBind) => {
          set(
            (state) => {
              componentToBind &&
                state.pickingComponentToBindTo?.onPick &&
                state.pickingComponentToBindTo?.onPick(componentToBind);
              return { componentToBind };
            },
            false,
            "editor/setComponentToBind",
          );
        },
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
        updateTreeComponentChildren: (componentId, children, save = true) => {
          set(
            (state) => {
              const copy = cloneDeep(state.tree);
              updateTreeComponentChildren(copy.root, componentId, children);

              if (save) {
                const toBeSavedCopy = cloneDeep(copy);
                updateTreeComponentWithOmitProps(toBeSavedCopy.root);
                debouncedUpdatePageState(
                  encodeSchema(JSON.stringify(toBeSavedCopy)),
                  state.currentProjectId ?? "",
                  state.currentPageId ?? "",
                  state.setIsSaving,
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
        clearSelection: (id) =>
          set(
            { selectedComponentId: id ?? "content-wrapper" },
            false,
            "editor/clearSelection",
          ),
        setIsSaving: (isSaving) =>
          set({ isSaving }, false, "editor/setIsSaving"),
        isPreviewMode: false,
        isLive: false,
        isNavBarVisible: true,
        isStructureCollapsed: false,
        setActiveTab: (activeTab) =>
          set({ activeTab }, false, "editor/setActiveTab"),
        setPreviewMode: (value) =>
          set(
            { isPreviewMode: value, currentTreeComponentsStates: {} },
            false,
            "editor/setPreviewMode",
          ),
        setIsLive: (value) => set({ isLive: value }, false, "editor/setIsLive"),
        setIsPageStructure: (isPageStructure) =>
          set({ isPageStructure }, false, "editor/setIsPageStructure"),
        setIsStructureCollapsed: (value) =>
          set(
            { isStructureCollapsed: value },
            false,
            "editor/setIsStructureCollapsed",
          ),
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
        setIsResizing: (isResizing) => set({ isResizing }),
        setColumnSpan: (id, span) =>
          set((state) => ({
            columnSpans: { ...(state.columnSpans ?? {}), [id]: span },
          })),
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
