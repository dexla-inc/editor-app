import { updatePageState } from "@/requests/pages/mutations";
import { encodeSchema } from "@/utils/compression";
import { GRID_SIZE } from "@/utils/config";
import {
  Component,
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
import { User } from "@propelauth/react";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import merge from "lodash.merge";
import { TemporalState, temporal } from "zundo";
import { create, useStore } from "zustand";
import { devtools } from "zustand/middleware";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY ?? "",
});

const initialGridValues = requiredModifiers.grid;
const initialGridColumnValues = requiredModifiers.gridColumn;

export const emptyEditorTree = {
  name: "Initial State",
  timestamp: Date.now(),
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

export type EditorTreeState = {
  tree: EditorTree;
  setTree: (
    tree: EditorTreeCopy,
    options?: { onLoad?: boolean; action?: string },
    isPreviewMode?: boolean,
    projectId?: string,
    pageId?: string,
  ) => void;
  resetTree: () => void;
  componentMutableAttrs: Record<string, Component>;
  updateTreeComponentChildren: (
    componentId: string,
    children: Component[],
    isPreviewMode?: boolean,
    projectId?: string,
    pageId?: string,
    save?: boolean,
  ) => any;
  updateTreeComponentAttrs: (params: {
    componentIds: string[];
    attrs: Partial<Component>;
    forceState?: string;
    isPreviewMode?: boolean;
    projectId?: string;
    pageId?: string;
    save?: boolean;
  }) => void;
  currentUser?: User;
  setCurrentUser: (user?: User) => void;
  cursor?: {
    x: number;
    y: number;
  };
  setCursor: (cursor?: { x: number; y: number }) => void;
  setColumnSpan: (id: string, span: number) => void;
  columnSpans?: { [key: string]: number };
};

export const debouncedUpdatePageState = debounce(updatePageState, 1000);

// creates a store with undo/redo capability
export const useEditorTreeStore = create<WithLiveblocks<EditorTreeState>>()(
  // @ts-ignore
  liveblocks(
    devtools(
      temporal(
        (set) => ({
          setTree: (
            tree,
            options,
            isPreviewMode = false,
            projectId = "adeb8b9d70354bd3bf612f019d151345",
            pageId = "2e726525b99641e49d32555f2781249a",
          ) => {
            set(
              (state: EditorTreeState) => {
                if (!options?.onLoad && !isPreviewMode) {
                  debouncedUpdatePageState(
                    encodeSchema(JSON.stringify(tree)),
                    projectId,
                    pageId,
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
          updateTreeComponentChildren: (
            componentId,
            children,
            isPreviewMode = false,
            projectId = "adeb8b9d70354bd3bf612f019d151345",
            pageId = "2e726525b99641e49d32555f2781249a",
            save = true,
          ) =>
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

                if (save && !isPreviewMode) {
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
                    projectId,
                    pageId,
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
            isPreviewMode = false,
            projectId = "adeb8b9d70354bd3bf612f019d151345",
            pageId = "2e726525b99641e49d32555f2781249a",
            save = true,
          }) => {
            set(
              (state: EditorTreeState) => {
                const lastComponentId = componentIds.at(-1)!;
                const currentState =
                  // forceState ??
                  // state.currentTreeComponentsStates?.[lastComponentId] ??
                  "default";

                componentIds.forEach((id) => {
                  state.componentMutableAttrs[id] = updateTreeComponentAttrs2(
                    state.componentMutableAttrs[id] ?? {},
                    attrs,
                    currentState,
                  );
                });

                const treeWithRecoveredAttrs = recoverTreeComponentAttrs(
                  state.tree,
                  state.componentMutableAttrs,
                );
                if (save && !isPreviewMode) {
                  debouncedUpdatePageState(
                    encodeSchema(
                      JSON.stringify(
                        removeKeysRecursive(treeWithRecoveredAttrs, ["error"]),
                      ),
                    ),
                    projectId,
                    pageId,
                  );
                }

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
          isSaving: false,
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

export const useTemporalStore = <T>(
  selector: (state: TemporalState<Partial<EditorTreeState>>) => T,
) => useStore(useEditorTreeStore.temporal, selector);
