import { useAppMode } from "@/hooks/useAppMode";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore, useTemporalStore } from "@/stores/editorTree";
import { copyToClipboard, pasteFromClipboard } from "@/utils/clipboard";
import { structureMapper } from "@/utils/componentMapper";
import {
  ComponentStructure,
  EditorTreeCopy,
  addComponent,
  getComponentIndex,
  getComponentParent,
  getComponentTreeById,
  removeComponent,
} from "@/utils/editor";
import { useHotkeys } from "@mantine/hooks";
import { useCallback } from "react";

export const useEditorHotkeys = () => {
  const editorTree = useEditorTreeStore((state) => state.tree);

  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const { isPreviewMode } = useAppMode();

  const copiedComponent = useEditorStore((state) => state.copiedComponent);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const saveTree = useEditorTreeStore((state) => state.saveTree);

  const undo = useTemporalStore((state) => state.undo);
  const redo = useTemporalStore((state) => state.redo);
  const pastStates = useTemporalStore((state) => state.pastStates);

  const deleteComponent = useCallback(() => {
    const selectedComponentIds =
      useEditorTreeStore.getState().selectedComponentIds;
    if (
      selectedComponentIds &&
      selectedComponentIds.length > 0 &&
      !isPreviewMode
    ) {
      const modals = Object.values(
        useEditorTreeStore.getState().componentMutableAttrs,
      ).filter((c) => c.name === "Modal");
      const targetModal = modals.find(
        (modal) => modal.id === selectedComponentIds[0],
      );
      selectedComponentIds.map((selectedComponentId) => {
        const comp =
          useEditorTreeStore.getState().componentMutableAttrs[
            selectedComponentId
          ];
        const parentTree = getComponentParent(
          editorTree.root as ComponentStructure,
          selectedComponentId,
        );
        const parent =
          useEditorTreeStore.getState().componentMutableAttrs[parentTree?.id!];
        const grandParent = getComponentParent(
          editorTree.root as ComponentStructure,
          parentTree?.id!,
        );

        if (
          selectedComponentId === "content-wrapper" ||
          selectedComponentId === "main-content"
        )
          return;
        if (
          comp?.name === "GridColumn" &&
          parent?.name === "Grid" &&
          parentTree?.children?.length === 1 &&
          grandParent?.id === "root"
        ) {
          return;
        }
        removeComponent(
          editorTree.root as ComponentStructure,
          selectedComponentId,
        );
        if (
          comp?.name === "GridColumn" &&
          parent?.name === "Grid" &&
          parentTree?.children?.length === 0
        ) {
          removeComponent(
            editorTree.root as ComponentStructure,
            parentTree.id!,
          );
        }
        if (targetModal) {
          setSelectedComponentIds(() => [targetModal.id!]);
        } else {
          setSelectedComponentIds(() => []);
        }
        setEditorTree(editorTree as EditorTreeCopy, {
          action: `Removed ${comp?.name}`,
        });
      });
    }
  }, [isPreviewMode, editorTree, setSelectedComponentIds, setEditorTree]);

  const copySelectedComponent = useCallback(() => {
    const selectedComponentId = useEditorTreeStore
      .getState()
      .selectedComponentIds?.at(-1);
    const componentToCopy = getComponentTreeById(
      editorTree.root,
      selectedComponentId!,
    )!;
    if (!isPreviewMode && selectedComponentId) {
      setCopiedComponent(componentToCopy);
      copyToClipboard(componentToCopy);
    }
  }, [editorTree.root, isPreviewMode, setCopiedComponent]);

  const pasteCopiedComponent = useCallback(async () => {
    const clipboardContent = pasteFromClipboard();
    let componentToPasteTree =
      (clipboardContent as typeof copiedComponent) || copiedComponent;
    if (!componentToPasteTree || isPreviewMode) {
      return;
    }
    const componentToPaste =
      useEditorTreeStore.getState().componentMutableAttrs[
        componentToPasteTree.id!
      ];

    console.log("componentToPaste", componentToPaste);

    const selectedComponentId = useEditorTreeStore
      .getState()
      .selectedComponentIds?.at(-1);

    if (!selectedComponentId || selectedComponentId === "root")
      return "content-wrapper";
    const component =
      useEditorTreeStore.getState().componentMutableAttrs[selectedComponentId];
    const componentTree = getComponentTreeById(
      editorTree.root,
      selectedComponentId,
    );
    let targetId = selectedComponentId;
    let componentIndex = 0;

    const isSpecialComponents = ["GridColumn", "Alert", "Accordion"].includes(
      componentToPaste.name,
    );
    const isGridItems = ["Grid", "GridColumn"].includes(componentToPaste.name);
    const isTargetGridItems = ["Grid", "GridColumn"].includes(component?.name!);
    const isLayoutCategory =
      structureMapper[componentToPaste.name!].category === "Layout";
    const isAllowedGridMatch =
      isGridItems === isTargetGridItems &&
      component?.name === componentToPaste.name;
    const isAllowedSibling = isLayoutCategory && !isTargetGridItems;

    const addAsSiblingFlag =
      component?.blockDroppingChildrenInside ||
      isSpecialComponents ||
      isAllowedSibling ||
      isAllowedGridMatch;
    if (addAsSiblingFlag) {
      const parentComponentTree = getComponentParent(
        editorTree.root as ComponentStructure,
        selectedComponentId,
      );
      targetId = parentComponentTree?.id as string;
      componentIndex =
        getComponentIndex(parentComponentTree!, selectedComponentId!) + 1;
    } else {
      componentIndex = componentTree?.children?.length ?? 0;
    }

    const newSelectedId = addComponent(
      editorTree.root as ComponentStructure,
      componentToPaste,
      {
        id: targetId,
        edge: isGridItems ? "center" : "top",
      },
      componentIndex,
      true,
    );

    setEditorTree(editorTree as EditorTreeCopy, {
      action: `Pasted ${componentToPaste.name}`,
    });
    setSelectedComponentIds(() => [newSelectedId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiedComponent, editorTree, isPreviewMode, setEditorTree]);

  const cutSelectedComponent = useCallback(() => {
    const selectedComponentId = useEditorTreeStore
      .getState()
      .selectedComponentIds?.at(-1);

    if (!isPreviewMode && selectedComponentId) {
      copySelectedComponent();
      deleteComponent();
    }
  }, [copySelectedComponent, deleteComponent, isPreviewMode]);

  const handlePageStateChange = (
    operation: (steps?: number | undefined) => void,
  ) => {
    operation();
  };

  useHotkeys([
    ["backspace", deleteComponent],
    ["delete", deleteComponent],
    ["mod+C", copySelectedComponent],
    ["mod+V", pasteCopiedComponent],
    ["mod+X", cutSelectedComponent],
    [
      "mod+Z",
      () => {
        if (!isPreviewMode) {
          if (pastStates.length <= 1) return; // to avoid rendering a blank page
          handlePageStateChange(undo);
        }
      },
    ],
    [
      "mod+shift+Z",
      () => {
        if (!isPreviewMode) {
          redo();
        }
      },
    ],
    [
      "mod+Y",
      () => {
        if (!isPreviewMode) {
          redo();
        }
      },
    ],
  ]);

  const isMac = window.navigator.userAgent.includes("Mac");

  useHotkeysOnIframe([
    [
      isMac ? "backspace" : "delete",
      (e) => {
        // @ts-ignore
        if (e.target.contentEditable !== "true" && !isPreviewMode) {
          deleteComponent();
        }
      },
      { preventDefault: false },
    ],
    ["mod+C", copySelectedComponent, { preventDefault: false }],
    ["mod+X", cutSelectedComponent, { preventDefault: false }],
    [
      "mod+V",
      (e) => {
        // @ts-ignore
        if (e.target.contentEditable !== "true" && !isPreviewMode) {
          pasteCopiedComponent();
        }
      },
      { preventDefault: false },
    ],
    [
      "mod+Z",
      () => {
        if (!isPreviewMode) {
          if (pastStates.length <= 1) return; // to avoid rendering a blank page
          handlePageStateChange(undo);
        }
      },
    ],
    [
      "mod+shift+Z",
      () => {
        if (!isPreviewMode) {
          handlePageStateChange(redo);
        }
      },
    ],
    [
      "mod+Y",
      () => {
        if (!isPreviewMode) {
          handlePageStateChange(redo);
        }
      },
    ],
  ]);
};

export default useEditorHotkeys;
