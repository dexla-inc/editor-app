import { SectionId } from "@/components/navbar/EditorNavbarSections";
import { PageResponse } from "@/requests/pages/types";
import { Action } from "@/utils/actions";
import { ComponentStructure, ComponentTree, Edge } from "@/utils/editor";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import merge from "lodash.merge";
import { ActionsResponsesType } from "@/types/dataBinding";

export type OpenAction = {
  actionIds?: string[];
  componentId?: string;
};

export type ClipboardProps = {
  componentName: string;
  componentProps: { [key: string]: any };
  componentStates: Record<string, any>;
};

export type Tab = "design" | "data" | "actions";

export type EditorState = {
  copiedComponent?: ComponentTree;
  componentToAdd?: ComponentStructure;
  iframeWindow?: Window;
  currentTargetId?: string;
  isSaving: boolean;
  isNavBarVisible: boolean;
  activeTab?: SectionId;
  activeSubTab?: "config" | "actions";
  isStructureCollapsed: boolean;
  pages: PageResponse[];
  copiedAction?: Action[];
  sequentialTo?: string;
  openAction?: OpenAction;
  copiedProperties?: ClipboardProps;
  setCopiedProperties: (copiedProperties: ClipboardProps) => void;
  setOpenAction: (openAction: OpenAction) => void;
  setSequentialTo: (sequentialTo?: string) => void;
  setCopiedComponent: (copiedComponent?: ComponentTree) => void;
  setPages: (pages: PageResponse[]) => void;
  updatePageResponse: (page: PageResponse) => void;
  setIframeWindow: (iframeWindow: Window) => void;
  setCurrentTargetId: (currentTargetId?: string) => void;
  setComponentToAdd: (componentToAdd?: ComponentStructure) => void;
  setIsSaving: (isSaving: boolean) => void;
  setIsNavBarVisible: () => void;
  setActiveTab: (activeTab?: SectionId) => void;
  setActiveSubTab: (activeTab: "config" | "actions") => void;
  setIsStructureCollapsed: (value: boolean) => void;
  setCopiedAction: (copiedAction?: Action[]) => void;
  isResizing?: boolean;
  setIsResizing: (isResizing?: boolean) => void;
  isWindowError?: boolean;
  setIsWindowError: (isWindowError: boolean) => void;
  collapsedItemsCount: number;
  setCollapsedItemsCount: (collapsedItemsCount: number) => void;
  setActivePage: (activePage?: PageResponse | null) => void;
  activePage?: PageResponse | null;
  actionsResponse: ActionsResponsesType;
  setActionsResponse: (actionId: string, response: any) => void;
  asideSelectedTab: Tab;
  setAsideSelectedTab: (tab: Tab) => void;
  edge?: Edge;
  setEdge: (edge: Edge | undefined) => void;
  selectedPageActionIds: string[];
  setSelectedPageActionIds: (actionId: string) => void;
};

// creates a store with undo/redo capability
export const useEditorStore = create<EditorState>()(
  // @ts-ignore
  devtools(
    (set) => ({
      edge: undefined,
      activeSubTab: "config",
      setEdge: (edge) => set({ edge }, false, "editor/setEdge"),
      asideSelectedTab: "design",
      setAsideSelectedTab: (tab) =>
        set({ asideSelectedTab: tab }, false, "editor/setAsideSelectedTab"),
      selectedPageActionIds: [],
      setSelectedPageActionIds: (actionId) =>
        set(
          (state) => {
            if (state.selectedPageActionIds.includes(actionId)) {
              return {
                selectedPageActionIds: state.selectedPageActionIds.filter(
                  (id) => id !== actionId,
                ),
              };
            }
            return {
              selectedPageActionIds: [...state.selectedPageActionIds, actionId],
            };
          },
          false,
          "editor/setSelectedPageActionId",
        ),
      setActionsResponse: (actionId, response) =>
        set(
          (state) => ({
            actionsResponse: {
              ...state.actionsResponse,
              [actionId]: merge(
                {},
                state.actionsResponse?.[actionId],
                response,
              ),
            },
          }),
          false,
          "editor/setActionsResponse",
        ),
      setActivePage: async (activePage) =>
        set({ activePage }, false, "editor/setActivePage"),
      collapsedItemsCount: 0,
      pages: [],
      actionsResponse: {},
      setCopiedProperties: (copiedProperties) =>
        set({ copiedProperties }, false, "editor/setCopiedProperties"),
      setOpenAction: (openAction) =>
        set({ openAction }, false, "editor/setOpenAction"),
      setPages: (pages) => set({ pages }, false, "editor/setPages"),
      updatePageResponse: (pageUpdate: PageResponse) =>
        set(
          (state) => {
            const updatedPages = state.pages.map((page) =>
              page.id === pageUpdate.id ? { ...page, ...pageUpdate } : page,
            );
            return { pages: updatedPages };
          },
          false,
          "editor/updatePageResponse",
        ),
      setSequentialTo: (sequentialTo) =>
        set({ sequentialTo }, false, "editor/setSequentialTo"),
      setCopiedComponent: (copiedComponent) =>
        set({ copiedComponent }, false, "editor/setCopiedComponent"),
      setIframeWindow: async (iframeWindow) =>
        set({ iframeWindow }, false, "editor/setIframeWindow"),
      setCurrentTargetId: (currentTargetId) =>
        set({ currentTargetId }, false, "editor/setCurrentTargetId"),
      isSaving: false,
      setComponentToAdd: (componentToAdd) =>
        set({ componentToAdd }, false, "editor/setComponentToAdd"),
      setIsSaving: (isSaving) => set({ isSaving }, false, "editor/setIsSaving"),
      isNavBarVisible: true,
      isStructureCollapsed: false,
      setActiveTab: (activeTab) =>
        set({ activeTab }, false, "editor/setActiveTab"),
      setActiveSubTab: (activeSubTab) =>
        set({ activeSubTab }, false, "editor/setActiveSubTab"),
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
      setIsWindowError: (isWindowError) =>
        set({ isWindowError }, false, "editor/setIsWindowError"),
      setIsResizing: (isResizing) =>
        set({ isResizing }, false, "editor/setIsResizing"),
      setCollapsedItemsCount: (collapsedItemsCount) =>
        set({ collapsedItemsCount }, false, "editor/setCollapsedItemsCount"),
    }),
    { name: "Editor store" },
  ),
);
