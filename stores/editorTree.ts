import { updatePageState } from "@/requests/pages/mutations";
import { PageStateParams } from "@/requests/pages/types";
import { cloneObject, emptyEditorTree } from "@/utils/common";
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
        height: "auto",
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
    replaceAll?: boolean;
  }) => Promise<void>;
  resetComponentsState: (
    componentIds: string[],
    stateToBeRemoved: string,
  ) => void;
  historyCount: number | null;
  setHistoryCount: (count: number | null) => void;
  pageLoadTree?: EditorTree;
  setPageLoadTree: (tree: EditorTree) => void;
  pageLoadComponentMutableAttrs?: Record<string, Component>;
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
  relatedComponentsData: Record<string, any>;
  setRelatedComponentsData: (props: Record<string, any>) => void;
  language: string;
  setLanguage: (isSaving: string) => void;
};

const updatePageStateFunc = async (
  state: PageStateParams["state"],
  description: PageStateParams["description"],
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
      description,
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
                if (
                  !options?.onLoad &&
                  !state.isPreviewMode &&
                  !state.isLive &&
                  !options?.skipSave
                ) {
                  debouncedUpdatePageState(
                    encodeSchema(JSON.stringify(tree)),
                    options?.action ?? "Generic change",
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

                // WARNING: backwards compatibility, removing height: 100% from main-content, fixes safari issues
                newComponentMutableAttrs["main-content"].props.style.height =
                  "auto";

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
                  pageLoadComponentMutableAttrs: options?.onLoad
                    ? merge(
                        {},
                        state.pageLoadComponentMutableAttrs,
                        newComponentMutableAttrs,
                      )
                    : state.pageLoadComponentMutableAttrs,
                };

                // also set the pageLoadComponentMutableAttrs if it's an onLoad with componentMutableAttrs

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
                    "children change",
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
            replaceAll = false,
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

                componentIds.forEach((id) => {
                  const clonedAttrs = cloneObject(
                    state.componentMutableAttrs[id] ?? {},
                  );

                  const componentAttrs = replaceAll
                    ? attrs
                    : updateTreeComponentAttrs(
                        clonedAttrs,
                        attrs,
                        currentState,
                      );

                  state.componentMutableAttrs[id] = componentAttrs as Component;
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
                    "Attribute change",
                    state.currentProjectId ?? "",
                    state.currentPageId ?? "",
                    state.setIsSaving,
                    state.pageLoadTimestamp,
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
          resetComponentsState: (componentIds, stateToBeRemoved) => {
            set((state) => {
              componentIds.forEach((id) => {
                state.componentMutableAttrs[id] = cloneObject(
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
                  "Reset component",
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
            set({ pageLoadTree }, true, "editorTree/setPageLoadTree"),
          setRelatedComponentsData: ({ id, data }: any) =>
            set(
              (state) => ({
                relatedComponentsData: {
                  ...state.relatedComponentsData,
                  [id]: data,
                },
              }),
              false,
              "editorTree/setRelatedComponentsData",
            ),
          relatedComponentsData: {},
          language: "en",
          setLanguage: (language) =>
            set({ language }, false, "editorTree/setLanguage"),
        }),
        {
          name: "editor-tree-config",
          partialize: (state) => {
            return {
              isPreviewMode: state.isPreviewMode,
              language: state.language,
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
