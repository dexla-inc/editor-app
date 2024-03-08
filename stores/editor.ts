import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { SectionId } from "@/components/navbar/EditorNavbarSections";
import { updatePageState } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { Action } from "@/utils/actions";
import { ComponentStructure, ComponentTree } from "@/utils/editor";
import debounce from "lodash.debounce";
import { Node } from "reactflow";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
  currentProjectId?: string;
  currentPageId?: string;
  selectedComponentIds?: string[];
  copiedComponent?: ComponentTree;
  componentToAdd?: ComponentStructure;
  iframeWindow?: Window;
  currentTargetId?: string;
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
  copiedProperties?: ClipboardProps;
  setCopiedProperties: (copiedProperties: ClipboardProps) => void;
  setOpenAction: (openAction: OpenAction) => void;
  setSequentialTo: (sequentialTo?: string) => void;
  setPickingComponentToBindTo: (
    pickingComponentToBindTo?: ComponentToBind,
  ) => void;
  setPickingComponentToBindFrom: (
    pickingComponentToBindFrom?: ComponentToBind,
  ) => void;
  setComponentToBind: (componentToBind?: string) => void;
  setCopiedComponent: (copiedComponent?: ComponentTree) => void;
  setPages: (pages: PageResponse[]) => void;
  setIframeWindow: (iframeWindow: Window) => void;
  setCurrentTargetId: (currentTargetId?: string) => void;
  setCurrentPageAndProjectIds: (
    currentProjectId: string,
    currentPageId: string,
  ) => void;
  setComponentToAdd: (componentToAdd?: ComponentStructure) => void;
  setTreeComponentCurrentState: (
    componentId: string,
    currentState: string,
  ) => void;
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
  isWindowError?: boolean;
  setIsWindowError: (isWindowError: boolean) => void;
  collapsedItemsCount: number;
  setCollapsedItemsCount: (collapsedItemsCount: number) => void;
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
export const useEditorStore = create<EditorState>()(
  // @ts-ignore
  devtools(
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

      setIframeWindow: (iframeWindow) =>
        set({ iframeWindow }, false, "editor/setIframeWindow"),
      setCurrentTargetId: (currentTargetId) =>
        set({ currentTargetId }, false, "editor/setCurrentTargetId"),
      isSaving: false,
      setTreeComponentCurrentState: (componentId, currentState = "default") => {
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
            const selectedComponentIds = cb(state.selectedComponentIds ?? []);
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
      setIsSaving: (isSaving) => set({ isSaving }, false, "editor/setIsSaving"),
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
      setLanguage: (language) => set({ language }, false, "editor/setLanguage"),
      setIsWindowError: (isWindowError) =>
        set({ isWindowError }, false, "editor/setIsWindowError"),
      setHighlightedComponentId: (componentId) =>
        set(
          { highlightedComponentId: componentId },
          false,
          "editor/setHighlightedComponentId",
        ),
      setIsResizing: (isResizing) =>
        set({ isResizing }, false, "editor/setIsResizing"),
      setCollapsedItemsCount: (collapsedItemsCount) =>
        set({ collapsedItemsCount }, false, "editor/setCollapsedItemsCount"),
    }),
    { name: "Editor store" },
  ),
);
