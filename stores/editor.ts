import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { SectionId } from "@/components/navbar/EditorNavbarSections";
import { PageResponse } from "@/requests/pages/types";
import { Action } from "@/utils/actions";
import { ComponentStructure, ComponentTree } from "@/utils/editor";
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
  copiedComponent?: ComponentTree;
  componentToAdd?: ComponentStructure;
  iframeWindow?: Window;
  currentTargetId?: string;
  isSaving: boolean;
  isNavBarVisible: boolean;
  activeTab?: SectionId;
  isStructureCollapsed: boolean;
  pages: PageResponse[];
  pickingComponentToBindTo?: ComponentToBind;
  pickingComponentToBindFrom?: ComponentToBind;
  componentToBind?: string;

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
  setComponentToAdd: (componentToAdd?: ComponentStructure) => void;
  setIsSaving: (isSaving: boolean) => void;
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
};

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
      collapsedItemsCount: 0,
      pages: [],
      selectedComponentId: "content-wrapper",
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
      setComponentToAdd: (componentToAdd) =>
        set({ componentToAdd }, false, "editor/setComponentToAdd"),
      setIsSaving: (isSaving) => set({ isSaving }, false, "editor/setIsSaving"),
      isNavBarVisible: true,
      isStructureCollapsed: false,
      setActiveTab: (activeTab) =>
        set({ activeTab }, false, "editor/setActiveTab"),
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
