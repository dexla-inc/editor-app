import { updatePageState } from "@/requests/pages/mutations";
import { PageStateParams } from "@/requests/pages/types";
import { emptyEditorTree } from "@/utils/common";
import { encodeSchema } from "@/utils/compression";
import { GRID_SIZE } from "@/utils/config";
import {
  Component,
  EditorTree,
  EditorTreeCopy,
  getTreeComponentMutableProps,
  recoverTreeComponentAttrs,
  updateTreeComponentAttrs,
  updateTreeComponentChildren,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { removeKeysRecursive } from "@/utils/removeKeys";
import { createClient } from "@liveblocks/client";
import { WithLiveblocks, liveblocks } from "@liveblocks/zustand";
import { User } from "@propelauth/react";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import cloneDeep from "lodash.clonedeep";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY ?? "",
});

const initialGridValues = requiredModifiers.grid;
const initialGridColumnValues = requiredModifiers.gridColumn;

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

export type EditorTreeState = {
  tree: EditorTree;
  setTree: (
    tree: EditorTreeCopy,
    options?: { onLoad?: boolean; action?: string; skipSave?: boolean },
  ) => void;
  resetTree: () => void;
  componentMutableAttrs: Record<string, Component>;
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
  }) => Promise<void>;
  historyCount: number | null;
  setHistoryCount: (count: number | null) => void;
  pageLoadTimestamp?: number;
  setPageLoadTimestamp: (value: number) => void;
  currentUser?: User;
  setCurrentUser: (user?: User) => void;
  cursor?: {
    x: number;
    y: number;
  };
  setCursor: (cursor?: { x: number; y: number }) => void;
  setColumnSpan: (id: string, span: number) => void;
  columnSpans?: { [key: string]: number };
  selectedComponentIds?: string[];
  setSelectedComponentIds: (cb: (ids: string[]) => string[]) => void;
  setCurrentPageAndProjectIds: (
    currentProjectId: string,
    currentPageId: string,
  ) => void;
  currentProjectId?: string;
  currentPageId?: string;
  isPreviewMode?: boolean;
  isLive: boolean;
  setPreviewMode: (isPreviewMode: boolean) => void;
  setIsLive: (value: boolean) => void;
  currentTreeComponentsStates?: {
    [key: string]: string;
  };
  setTreeComponentCurrentState: (
    componentId: string,
    currentState: string,
  ) => void;
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
};

const updatePageStateFunc = async (
  state: PageStateParams["state"],
  projectId: string,
  pageId: string,
  setIsSaving: (value: boolean) => void,
  history?: number | null,
  setHistoryCount?: (count: number | null) => void,
) => {
  try {
    setIsSaving(true);
    await updatePageState(state, projectId, pageId, history ?? null);
    setHistoryCount?.(null);
  } finally {
    setIsSaving(false);
  }
};

export const debouncedUpdatePageState = debounce(updatePageStateFunc, 200);

// creates a store with undo/redo capability
export const useEditorTreeStore = create<WithLiveblocks<EditorTreeState>>()(
  // @ts-ignore
  liveblocks(
    devtools(
      persist(
        (set) => ({
          setTree: (tree, options) => {
            set(
              (state: EditorTreeState) => {
                // TODO: Look into why the previous history appears when refreshing page
                if (
                  !options?.onLoad &&
                  !state.isPreviewMode &&
                  !state.isLive &&
                  !options?.skipSave
                ) {
                  debouncedUpdatePageState(
                    encodeSchema(JSON.stringify(tree)),
                    state.currentProjectId ?? "",
                    state.currentPageId ?? "",
                    state.setIsSaving,
                    state?.historyCount,
                    state?.setHistoryCount,
                  );
                }

                const newComponentMutableAttrs = getTreeComponentMutableProps(
                  tree.root,
                );

                const newState = {
                  ...state,
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

                return newState;
              },
              false,
              "editorTree/setTree",
            );
          },
          resetTree: () => {
            const timestamp = Date.now();
            set(
              {
                tree: { ...emptyEditorTree, timestamp },
              },
              false,
              "editorTree/resetTree",
            );
          },
          updateTreeComponentChildren: (componentId, children, save = true) =>
            set(
              (state: EditorTreeState) => {
                updateTreeComponentChildren(
                  state.tree.root,
                  componentId,
                  children,
                );

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

                if (save && !state.isPreviewMode && !state.isLive) {
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
                    ...state.tree,
                    name: `Edited ${component?.name}`,
                    timestamp: Date.now(),
                  },
                  componentMutableAttrs: state.componentMutableAttrs,
                };
              },
              false,
              "editorTree/updateTreeComponentChildren",
            ),
          updateTreeComponentAttrs: async ({
            componentIds,
            attrs,
            forceState,
            save = true,
          }) => {
            set(
              (state: EditorTreeState) => {
                const lastComponentId = componentIds.at(-1)!;
                const currentState =
                  forceState ??
                  state.currentTreeComponentsStates?.[lastComponentId] ??
                  "default";

                componentIds.forEach((id) => {
                  state.componentMutableAttrs[id] = updateTreeComponentAttrs(
                    cloneDeep(state.componentMutableAttrs[id] ?? {}),
                    attrs,
                    currentState,
                  );
                });

                const treeWithRecoveredAttrs = recoverTreeComponentAttrs(
                  state.tree,
                  state.componentMutableAttrs,
                );
                if (save && !state.isPreviewMode && !state.isLive) {
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

                // Return the new state with the updated componentMutableAttrs
                return {
                  componentMutableAttrs: state.componentMutableAttrs,
                };
              },
              false,
              "editorTree/updateTreeComponentAttrs",
            );
          },
          tree: emptyEditorTree,
          componentMutableAttrs: emptyEditorComponentMutableAttrs,
          setCurrentUser: (currentUser) =>
            set({ currentUser }, false, "editorTree/setCurrentUser"),
          setCursor: (cursor) => set({ cursor }, false, "editorTree/setCursor"),
          setColumnSpan: (id, span) =>
            set(
              (state) => ({
                columnSpans: { ...(state.columnSpans ?? {}), [id]: span },
              }),
              false,
              "editorTree/setColumnSpan",
            ),
          columnSpans: {},
          selectedComponentIds: ["content-wrapper"],
          isLive: false,
          setSelectedComponentIds: (cb) => {
            return set(
              (state) => {
                const selectedComponentIds = cb(
                  state.selectedComponentIds ?? [],
                ).filter((id) => id !== "content-wrapper");

                return { selectedComponentIds };
              },
              false,
              "editorTree/setSelectedComponentIds",
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
              "editorTree/setTreeComponentCurrentState",
            );
          },
          setCurrentPageAndProjectIds: (currentProjectId, currentPageId) => {
            set(
              { currentProjectId, currentPageId },
              false,
              "editorTree/setCurrentPageAndProjectIds",
            );
          },
          setPreviewMode: (value) =>
            set(
              { isPreviewMode: value, currentTreeComponentsStates: {} },
              false,
              "editorTree/setPreviewMode",
            ),
          setIsLive: (isLive) => set({ isLive }, false, "editor/setIsLive"),
          setIsSaving: (value) =>
            set({ isSaving: value }, false, "editorTree/setIsSaving"),
          historyCount: null,
          setHistoryCount: (count) =>
            set({ historyCount: count }, false, "editorTree/setHistoryCount"),
          isSaving: false,
          setPageLoadTimestamp: (value) =>
            set(
              { pageLoadTimestamp: value },
              false,
              "editorTree/setPageLoadTimestamp",
            ),
        }),
        {
          name: "editor-tree-config",
          partialize: (state) => {
            return {
              isPreviewMode: state.isPreviewMode,
            };
          },
        },
      ),
      { name: "Editor Tree store" },
    ),
    {
      client,
      // comment this out to disable multiplayer and see if that fix the state loss issue
      // storageMapping: {
      //   tree: true,
      // },
      presenceMapping: {
        currentUser: true,
        cursor: true,
      },
    },
  ),
);
