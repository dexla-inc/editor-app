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
import setObj from "lodash.set";

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
        minHeight: "100vh",
        paddingLeft: "0px",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        backgroundSize: "contain",
        overflow: "auto",
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
  deleteComponentMutableAttr: (id: string) => void;
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
  resetComponentsState: (
    componentIds: string[],
    stateToBeRemoved: string,
  ) => void;
  historyCount: number | null;
  setHistoryCount: (count: number | null) => void;
  pageLoadTree?: EditorTree;
  setPageLoadTree: (tree: EditorTree) => void;
  pageLoadTimestamp: number;
  setPageLoadTimestamp: (value: number | null) => void;
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
  selectedComponentParentIndex?: number | undefined;
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
  pageLoadTimestamp: number,
  history?: number | null,
  setHistoryCount?: (count: number | null) => void,
) => {
  try {
    setIsSaving(true);
    await updatePageState(
      state,
      projectId,
      pageId,
      pageLoadTimestamp,
      history ?? null,
    );
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
        (set, get) => ({
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
                    state.pageLoadTimestamp,
                    state?.historyCount,
                    state?.setHistoryCount,
                  );
                }

                const newComponentMutableAttrs = getTreeComponentMutableProps(
                  tree.root,
                );

                const newState = {
                  ...state,
                  pageLoadTree: options?.onLoad ? tree : state.pageLoadTree,
                  tree: {
                    ...tree,
                    name: options?.action || "Generic change",
                    timestamp: Date.now(),
                  },
                  componentMutableAttrs: merge(
                    {},
                    state.componentMutableAttrs,
                    newComponentMutableAttrs,
                  ),
                };
                console.log(
                  "setTree",
                  options?.onLoad ? tree : state.pageLoadTree,
                );
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
                    state.pageLoadTimestamp,
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
                componentIds = componentIds.map(
                  (id) => id.split("-related-")[0],
                );
                const lastComponentId = componentIds.at(-1)!;
                const currentState =
                  forceState ??
                  state.currentTreeComponentsStates?.[lastComponentId] ??
                  "default";

                const copiedComponentMutableAttrs = cloneDeep(
                  state.componentMutableAttrs,
                );

                componentIds.forEach((id) => {
                  copiedComponentMutableAttrs[id] = updateTreeComponentAttrs(
                    copiedComponentMutableAttrs[id] ?? {},
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
                    state.pageLoadTimestamp,
                  );
                }

                // Return the new state with the updated componentMutableAttrs

                return {
                  componentMutableAttrs: copiedComponentMutableAttrs,
                };
              },
              false,
              "editorTree/updateTreeComponentAttrs",
            );
          },
          resetComponentsState: (componentIds, stateToBeRemoved) => {
            set((state) => {
              componentIds.forEach((id) => {
                state.componentMutableAttrs[id] = cloneDeep(
                  state.componentMutableAttrs[id] ?? {},
                );
                setObj(
                  state.componentMutableAttrs[id].states ?? {},
                  stateToBeRemoved,
                  {},
                );
              });

              const treeWithRecoveredAttrs = recoverTreeComponentAttrs(
                state.tree,
                state.componentMutableAttrs,
              );
              if (!state.isPreviewMode && !state.isLive) {
                debouncedUpdatePageState(
                  encodeSchema(
                    JSON.stringify(
                      removeKeysRecursive(treeWithRecoveredAttrs, ["error"]),
                    ),
                  ),
                  state.currentProjectId ?? "",
                  state.currentPageId ?? "",
                  state.setIsSaving,
                  state.pageLoadTimestamp,
                );
              }

              return {
                componentMutableAttrs: state.componentMutableAttrs,
              };
            });
          },
          tree: emptyEditorTree,
          componentMutableAttrs: emptyEditorComponentMutableAttrs,
          deleteComponentMutableAttr: (id: string) =>
            set(
              (state) => {
                const { [id]: _, ...remainingAttrs } =
                  state.componentMutableAttrs;
                return { componentMutableAttrs: remainingAttrs };
              },
              false,
              "editorTree/deleteComponentMutableAttr",
            ),
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

                return {
                  selectedComponentIds,
                };
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
          pageLoadTimestamp: Date.now(),
          setPageLoadTimestamp: (value) =>
            set(
              { pageLoadTimestamp: value as number },
              false,
              "editorTree/setPageLoadTimestamp",
            ),
          setPageLoadTree: (pageLoadTree) =>
            set({ pageLoadTree }, false, "editorTree/setPageLoadTree"),
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
      // Adding this back in causes SortableTreeItem to error
      storageMapping: {
        tree: true,
        componentMutableAttrs: true,
      },
      presenceMapping: {
        currentUser: true,
        cursor: true,
      },
    },
  ),
);
