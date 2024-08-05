import { useHotkeysOnIframe } from "@/hooks/editor/useHotkeysOnIframe";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
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
import {
  selectedComponentIdSelector,
  selectedComponentIdsSelector,
} from "@/utils/componentSelectors";
import { cloneObject } from "@/utils/common";

export const useEditorHotkeys = () => {
  const editorTree = useEditorTreeStore((state) => state.tree);

  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );

  const copiedComponent = useEditorStore((state) => state.copiedComponent);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const deleteComponentMutableAttr = useEditorTreeStore(
    (state) => state.deleteComponentMutableAttr,
  );

  const deleteComponent = useCallback(() => {
    const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
    const selectedComponentIds = selectedComponentIdsSelector(
      useEditorTreeStore.getState(),
    );
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
        deleteComponentMutableAttr(selectedComponentId);
        if (targetModal) {
          setSelectedComponentIds(() => [targetModal.id!]);
        } else {
          setSelectedComponentIds(() => []);
        }
        const editorTreeCopy = cloneObject(editorTree);
        setEditorTree(editorTreeCopy, {
          action: `Removed ${comp?.name}`,
        });
      });
    }
  }, [
    editorTree,
    deleteComponentMutableAttr,
    setEditorTree,
    setSelectedComponentIds,
  ]);

  const copySelectedComponent = useCallback(() => {
    const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
    const selectedComponentId = selectedComponentIdSelector(
      useEditorTreeStore.getState(),
    );
    const componentToCopy = getComponentTreeById(
      editorTree.root,
      selectedComponentId!,
    )!;
    if (!isPreviewMode && selectedComponentId) {
      setCopiedComponent(componentToCopy);
      copyToClipboard(componentToCopy);
    }
  }, [editorTree.root, setCopiedComponent]);

  const pasteCopiedComponent = useCallback(async () => {
    const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
    const clipboardContent = pasteFromClipboard() as ComponentStructure;
    const componentToPaste =
      (clipboardContent as typeof copiedComponent as ComponentStructure) ||
      (copiedComponent as ComponentStructure);
    if (!componentToPaste || isPreviewMode) {
      return;
    }

    const selectedComponentId = selectedComponentIdSelector(
      useEditorTreeStore.getState(),
    );

    if (!selectedComponentId || selectedComponentId === "root")
      return "content-wrapper";

    const selectedComponent = getComponentTreeById(
      editorTree.root,
      selectedComponentId,
    ) as ComponentStructure;

    let targetId = selectedComponentId;
    const targetName = selectedComponent?.name!;

    if (!targetId || targetId === "root") return "content-wrapper";

    let componentIndex = 0;

    const isSpecialComponents = ["GridColumn", "Alert", "Accordion"].includes(
      clipboardContent.name,
    );
    const isGridItems = ["Grid", "GridColumn"].includes(componentToPaste.name);
    const isTargetGridItems = ["Grid", "GridColumn"].includes(targetName);
    const isTargetModalsOrDrawers = ["Modal", "Drawer"].includes(targetName);

    const isLayoutCategory =
      structureMapper[componentToPaste.name!]?.category === "Layout";
    const isAllowedGridMatch =
      isGridItems === isTargetGridItems && targetName === componentToPaste.name;
    const isAllowedSibling =
      isLayoutCategory && !isTargetGridItems && !isTargetModalsOrDrawers;

    const addAsSiblingFlag =
      selectedComponent?.blockDroppingChildrenInside ||
      isSpecialComponents ||
      isAllowedSibling ||
      isAllowedGridMatch;

    const editorTreeCopy = cloneObject(editorTree) as EditorTreeCopy;

    if (addAsSiblingFlag) {
      const parentComponentTree = getComponentParent(
        editorTreeCopy.root as ComponentStructure,
        selectedComponentId,
      );
      targetId = parentComponentTree?.id as string;
      componentIndex =
        getComponentIndex(parentComponentTree!, selectedComponentId!) + 1;
    } else {
      componentIndex = clipboardContent?.children?.length ?? 0;
    }

    const newSelectedId = addComponent(
      editorTreeCopy.root as ComponentStructure,
      clipboardContent,
      {
        id: targetId!,
        edge: isGridItems ? "center" : "top",
      },
      componentIndex,
      true,
    );

    setEditorTree(editorTreeCopy, {
      action: `Pasted ${clipboardContent.name}`,
    });
    setSelectedComponentIds(() => [newSelectedId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiedComponent, editorTree, setEditorTree]);

  const cutSelectedComponent = useCallback(() => {
    const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
    const selectedComponentId = selectedComponentIdSelector(
      useEditorTreeStore.getState(),
    );

    if (!isPreviewMode && selectedComponentId) {
      copySelectedComponent();
      deleteComponent();
    }
  }, [copySelectedComponent, deleteComponent]);

  const isMac = window.navigator.userAgent.includes("Mac");
  const deleteHotkey = isMac ? "backspace" : "delete";

  useHotkeys([
    [deleteHotkey, deleteComponent],
    ["mod+C", copySelectedComponent],
    ["mod+V", pasteCopiedComponent],
    ["mod+X", cutSelectedComponent],
  ]);

  useHotkeysOnIframe([
    [
      deleteHotkey,
      (e: KeyboardEvent) => {
        const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
        // @ts-ignore
        if (e.target?.contentEditable !== "true" && !isPreviewMode) {
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
  ]);
};

export default useEditorHotkeys;
