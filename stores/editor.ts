import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { SectionId } from "@/components/navbar/EditorNavbarSections";
import { updatePageState } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { CardStyle } from "@/requests/projects/types";
import { Font, Logo, ResponsiveBreakpoint } from "@/requests/themes/types";
import { Action } from "@/utils/actions";
import { defaultTheme } from "@/utils/branding";
import { encodeSchema } from "@/utils/compression";
import { GRID_SIZE } from "@/utils/config";
import {
  Component,
  ComponentStructure,
  EditorTree,
  EditorTreeCopy,
  getTreeComponentMutableProps,
  recoverTreeComponentAttrs,
  updateTreeComponentAttrs2,
  updateTreeComponentChildren,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { removeKeysRecursive } from "@/utils/removeKeys";
import { createClient } from "@liveblocks/client";
import { WithLiveblocks, liveblocks } from "@liveblocks/zustand";
import { MantineSize, MantineTheme, Tuple } from "@mantine/core";
import { User } from "@propelauth/react";
import cloneDeep from "lodash.clonedeep";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import merge from "lodash.merge";
import { Node } from "reactflow";
import { TemporalState, temporal } from "zundo";
import { create, useStore } from "zustand";
import { devtools } from "zustand/middleware";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY ?? "",
});

const initialGridValues = requiredModifiers.grid;
const initialGridColumnValues = requiredModifiers.gridColumn;

const initialTimestamp = Date.now();
export const emptyEditorTree = {
  name: "Initial State",
  timestamp: initialTimestamp,
  root: {
    id: "root",
    children: [
      {
        id: "content-wrapper",
        children: [
          {
            id: "main-content",
          },
        ],
      },
    ],
  },
};

const emptyEditorComponentMutableAttrs = {
  root: {
    id: "root",
    name: "Container",
    description: "Root component",
  },
  "content-wrapper": {
    id: "content-wrapper",
    name: "Grid",
    description: "Body",
    props: {
      gridSize: GRID_SIZE,
      ...initialGridValues,
      style: {
        ...initialGridValues.style,
        gap: "0",
        minHeight: "20px",
      },
    },
  },
  "main-content": {
    id: "main-content",
    name: "GridColumn",
    description: "Main Content",
    props: {
      span: GRID_SIZE,
      ...initialGridColumnValues,
      style: {
        ...initialGridColumnValues.style,
        height: "100vh",
        paddingLeft: "0px",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        backgroundSize: "contain",
      },
    },
  },
};

// Copy the properties from ThemeMutationParams
export interface MantineThemeExtended extends MantineTheme {
  colors: ExtendedMantineThemeColors;
  fonts: Font[];
  defaultRadius: MantineSize;
  defaultSpacing: MantineSize;
  inputSize: MantineSize;
  defaultFont?: string;
  hasCompactButtons?: boolean;
  cardStyle?: CardStyle;
  theme: "LIGHT" | "DARK";
  responsiveBreakpoints?: ResponsiveBreakpoint[];
  faviconUrl?: string;
  logoUrl?: string;
  logos?: Logo[];
}

interface CustomColors {
  Primary: Tuple<string, 10>;
  PrimaryText: Tuple<string, 10>;
  Secondary: Tuple<string, 10>;
  SecondaryText: Tuple<string, 10>;
  Tertiary: Tuple<string, 10>;
  TertiaryText: Tuple<string, 10>;
  Background: Tuple<string, 10>;
  Danger: Tuple<string, 10>;
  Warning: Tuple<string, 10>;
  Success: Tuple<string, 10>;
  Neutral: Tuple<string, 10>;
  Black: Tuple<string, 10>;
  White: Tuple<string, 10>;
  Border: Tuple<string, 10>;
}

export type ExtendedMantineThemeColors = CustomColors & MantineTheme["colors"];

export type ComponentToBind = {
  componentId: string;
  onPick?: (props: any) => void;
};

export type OpenAction = {
  actionIds?: string[];
  componentId?: string;
};

export type ClipboardProps = {
  componentName: string;
  componentProps: { [key: string]: any };
  componentStates: Record<string, any>;
};

export type EditorState = {
  tree: EditorTree;
  componentMutableAttrs: Record<string, Component>;
  currentProjectId?: string;
  currentPageId?: string;
  hoveredComponentId?: string;
  selectedComponentIds?: string[];
  copiedComponent?: Component;
  componentToAdd?: ComponentStructure;
  iframeWindow?: Window;
  currentTargetId?: string;
  theme: MantineThemeExtended;
  isSaving: boolean;
  isPreviewMode: boolean;
  isLive: boolean;
  isNavBarVisible: boolean;
  activeTab?: SectionId;
  isStructureCollapsed: boolean;
  pages: PageResponse[];
  pickingComponentToBindTo?: ComponentToBind;
  pickingComponentToBindFrom?: ComponentToBind;
  componentToBind?: string;
  currentTreeComponentsStates?: {
    [key: string]: string;
  };
  copiedAction?: Action[];
  sequentialTo?: string;
  openAction?: OpenAction;
  isPageStructure?: boolean;
  copiedProperties?: ClipboardProps;
  setCopiedProperties: (copiedProperties: ClipboardProps) => void;
  setIsPageStructure: (isPageStructure: boolean) => void;
  setOpenAction: (openAction: OpenAction) => void;
  setSequentialTo: (sequentialTo?: string) => void;
  setPickingComponentToBindTo: (
    pickingComponentToBindTo?: ComponentToBind,
  ) => void;
  setPickingComponentToBindFrom: (
    pickingComponentToBindFrom?: ComponentToBind,
  ) => void;
  setComponentToBind: (componentToBind?: string) => void;
  setCopiedComponent: (copiedComponent?: Component) => void;
  setPages: (pages: PageResponse[]) => void;
  setTheme: (theme: MantineThemeExtended) => void;
  setIframeWindow: (iframeWindow: Window) => void;
  setCurrentTargetId: (currentTargetId?: string) => void;
  setTree: (
    tree: EditorTreeCopy,
    options?: { onLoad?: boolean; action?: string },
  ) => void;
  resetTree: () => void;
  setCurrentPageAndProjectIds: (
    currentProjectId: string,
    currentPageId: string,
  ) => void;
  setComponentToAdd: (componentToAdd?: ComponentStructure) => void;
  updateTreeComponentChildren: (
    componentId: string,
    children: Component[],
    save?: boolean,
  ) => any;
  updateTreeComponentAttrs: (params: {
    componentIds: string[];
    attrs: Partial<Component>;
    forceState?: string;
    save?: boolean;
  }) => void;
  setTreeComponentCurrentState: (
    componentId: string,
    currentState: string,
  ) => void;
  setHoveredComponentId: (hoveredComponentId?: string) => void;
  setSelectedComponentIds: (cb: (ids: string[]) => string[]) => void;
  clearSelection: (id?: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  setPreviewMode: (value: boolean) => void;
  setIsLive: (value: boolean) => void;
  setIsNavBarVisible: () => void;
  setActiveTab: (activeTab?: SectionId) => void;
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
  isWindowError?: boolean;
  setIsWindowError: (isWindowError: boolean) => void;
  collapsedItemsCount: number;
  setCollapsedItemsCount: (collapsedItemsCount: number) => void;
  currentUser?: User;
  setCurrentUser: (user?: User) => void;
  cursor?: {
    x: number;
    y: number;
  };
  setCursor: (cursor?: { x: number; y: number }) => void;
  setTriggeredLogicFlow: (lf: Node<NodeData>[]) => Promise<void>;
  lf: Node<NodeData>[];
  setTriggeredAction: (actions: Action[]) => Promise<void>;
  actions: Action[];
  setNonEditorActions: (
    cb: (actions: Record<string, any>) => Record<string, any>,
  ) => Promise<void>;
  nonEditorActions: Record<string, any>;
};

export const debouncedUpdatePageState = debounce(updatePageState, 1000);

// creates a store with undo/redo capability
export const useEditorStore = create<WithLiveblocks<EditorState>>()(
  // @ts-ignore
  liveblocks(
    devtools(
      temporal(
        (set, get) => ({
          setTriggeredLogicFlow: async (lf) =>
            set({ lf }, false, "editor/setTriggeredLogicFlow"),
          lf: [],
          setTriggeredAction: async (actions) =>
            set({ actions }, false, "editor/setTriggeredAction"),
          actions: [],
          setNonEditorActions: async (cb) => {
            return set(
              (state) => {
                const nonEditorActions = cb(state.nonEditorActions);
                return { nonEditorActions };
              },
              false,
              "editor/setNonEditorActions",
            );
          },
          nonEditorActions: {},
          collapsedItemsCount: 0,
          tree: emptyEditorTree,
          componentMutableAttrs: emptyEditorComponentMutableAttrs,
          theme: defaultTheme,
          pages: [],
          selectedComponentId: "content-wrapper",
          selectedComponentIds: ["content-wrapper"],
          language: "default",
          projectId: "",
          setCopiedProperties: (copiedProperties) =>
            set({ copiedProperties }, false, "editor/setCopiedProperties"),
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
          setTheme: (theme) =>
            set(
              (prev) => ({ theme: merge(prev.theme, theme) }),
              false,
              "editor/setTheme",
            ),
          setIframeWindow: (iframeWindow) =>
            set({ iframeWindow }, false, "editor/setIframeWindow"),
          setCurrentTargetId: (currentTargetId) =>
            set({ currentTargetId }, false, "editor/setCurrentTargetId"),
          isSaving: false,
          // any component's move or reordering
          setTree: (tree, options) => {
            set(
              (state: EditorState) => {
                if (!options?.onLoad && !state.isPreviewMode) {
                  debouncedUpdatePageState(
                    encodeSchema(JSON.stringify(tree)),
                    state.currentProjectId ?? "",
                    state.currentPageId ?? "",
                    state.setIsSaving,
                  );
                }

                const newComponentMutableAttrs = getTreeComponentMutableProps(
                  tree.root,
                );

                return {
                  tree: {
                    ...tree,
                    name: options?.action || "Generic move",
                    timestamp: Date.now(),
                  },
                  componentMutableAttrs: merge(
                    {},
                    state.componentMutableAttrs,
                    newComponentMutableAttrs,
                  ),
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
          // anything out of .props that changes .children[]
          updateTreeComponentChildren: (componentId, children, save = true) =>
            set(
              (state: EditorState) => {
                const copy = cloneDeep(state.tree);
                updateTreeComponentChildren(copy.root, componentId, children);

                children.forEach((child) => {
                  state.componentMutableAttrs = {
                    ...state.componentMutableAttrs,
                    ...getTreeComponentMutableProps(child),
                  };
                });

                const treeWithRecoveredAttrs = recoverTreeComponentAttrs(
                  state.tree,
                  state.componentMutableAttrs,
                );

                if (save && !state.isPreviewMode) {
                  debouncedUpdatePageState(
                    encodeSchema(
                      JSON.stringify(
                        removeKeysRecursive(treeWithRecoveredAttrs, [
                          "error",
                          "collapsed",
                          "depth",
                          "index",
                          "parentId",
                        ]),
                      ),
                    ),
                    state.currentProjectId ?? "",
                    state.currentPageId ?? "",
                    state.setIsSaving,
                  );
                }

                const component = state.componentMutableAttrs[componentId];

                return {
                  tree: {
                    ...copy,
                    name: `Edited ${component?.name}`,
                    timestamp: Date.now(),
                  },
                  componentMutableAttrs: state.componentMutableAttrs,
                };
              },
              false,
              "editor/updateTreeComponentChildren",
            ),
          updateTreeComponentAttrs: ({
            componentIds,
            attrs,
            forceState,
            save = true,
          }) => {
            set(
              (state: EditorState) => {
                const lastComponentId = componentIds.at(-1)!;
                const currentState =
                  forceState ??
                  state.currentTreeComponentsStates?.[lastComponentId] ??
                  "default";
                const currentLanguage = state.language;

                componentIds.forEach((id) => {
                  state.componentMutableAttrs[id] = updateTreeComponentAttrs2(
                    state.componentMutableAttrs[id],
                    attrs,
                    currentState,
                    currentLanguage,
                  );
                });

                const treeWithRecoveredAttrs = recoverTreeComponentAttrs(
                  state.tree,
                  state.componentMutableAttrs,
                );
                if (save && !state.isPreviewMode) {
                  debouncedUpdatePageState(
                    encodeSchema(
                      JSON.stringify(
                        removeKeysRecursive(treeWithRecoveredAttrs, ["error"]),
                      ),
                    ),
                    state.currentProjectId ?? "",
                    state.currentPageId ?? "",
                    state.setIsSaving,
                  );
                }

                return {
                  componentMutableAttrs: state.componentMutableAttrs,
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
          setCurrentPageAndProjectIds: (currentProjectId, currentPageId) => {
            if (
              get().currentProjectId !== currentProjectId ||
              get().currentPageId !== currentPageId
            ) {
              set(
                { currentProjectId, currentPageId },
                false,
                "editor/setCurrentPageAndProjectIds",
              );
            }
          },
          setComponentToAdd: (componentToAdd) =>
            set({ componentToAdd }, false, "editor/setComponentToAdd"),
          setSelectedComponentIds: (cb) => {
            return set(
              (state) => {
                const selectedComponentIds = cb(
                  state.selectedComponentIds ?? [],
                );
                return { selectedComponentIds };
              },
              false,
              "editor/setSelectedComponentIds",
            );
          },
          clearSelection: (id) =>
            set(
              { selectedComponentIds: [id ?? "content-wrapper"] },
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
          setIsLive: (value) =>
            set({ isLive: value }, false, "editor/setIsLive"),
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
          setIsWindowError: (isWindowError) =>
            set({ isWindowError }, false, "editor/setIsWindowError"),
          setHighlightedComponentId: (componentId) =>
            set(
              { highlightedComponentId: componentId },
              false,
              "editor/setHighlightedComponentId",
            ),
          setHoveredComponentId: (hoveredComponentId) =>
            set({ hoveredComponentId }, false, "editor/setHoveredComponentId"),
          setIsResizing: (isResizing) =>
            set({ isResizing }, false, "editor/setIsResizing"),
          setColumnSpan: (id, span) =>
            set(
              (state) => ({
                columnSpans: { ...(state.columnSpans ?? {}), [id]: span },
              }),
              false,
              "editor/setColumnSpan",
            ),
          setCollapsedItemsCount: (collapsedItemsCount) =>
            set(
              { collapsedItemsCount },
              false,
              "editor/setCollapsedItemsCount",
            ),
          setCurrentUser: (currentUser) =>
            set({ currentUser }, false, "editor/setCurrentUser"),
          setCursor: (cursor) => set({ cursor }, false, "editor/setCursor"),
        }),
        {
          partialize: (state) => {
            const { tree, columnSpans } = state;
            return { tree, columnSpans };
          },
          limit: 500,
          equality(currentState, pastState) {
            return isEqual(currentState.tree, pastState.tree);
          },
        },
      ),
      { name: "Editor store" },
    ),
    {
      client,
      // comment this out to disable multiplayer and see if that fix the state loss issue
      // storageMapping: {
      //   tree: true,
      // },
      presenceMapping: {
        selectedComponentIds: true,
        currentUser: true,
        cursor: true,
      },
    },
  ),
);

export const useTemporalStore = <T>(
  selector: (state: TemporalState<Partial<EditorState>>) => T,
) => useStore(useEditorStore.temporal, selector);
