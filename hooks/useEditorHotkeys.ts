import { useAppMode } from "@/hooks/useAppMode";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
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
import cloneDeep from "lodash.clonedeep";
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
        const editorTreeCopy = cloneDeep(editorTree);
        setEditorTree(editorTreeCopy, {
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
    const clipboardContent = pasteFromClipboard() as ComponentStructure;
    const componentToPaste =
      (clipboardContent as typeof copiedComponent as ComponentStructure) ||
      (copiedComponent as ComponentStructure);
    if (!componentToPaste || isPreviewMode) {
      return;
    }

    const selectedComponentId = useEditorTreeStore
      .getState()
      .selectedComponentIds?.at(-1);

    if (!selectedComponentId || selectedComponentId === "root")
      return "content-wrapper";

    const selectedComponent = getComponentTreeById(
      editorTree.root,
      selectedComponentId,
    ) as ComponentStructure;

    let targetId = selectedComponentId;

    if (!targetId || targetId === "root") return "content-wrapper";

    let componentIndex = 0;

    const isSpecialComponents = ["GridColumn", "Alert", "Accordion"].includes(
      clipboardContent.name,
    );
    const isGridItems = ["Grid", "GridColumn"].includes(componentToPaste.name);
    const isTargetGridItems = ["Grid", "GridColumn"].includes(
      selectedComponent?.name!,
    );
    const isLayoutCategory =
      structureMapper[componentToPaste.name!].category === "Layout";
    const isAllowedGridMatch =
      isGridItems === isTargetGridItems &&
      selectedComponent?.name === componentToPaste.name;
    const isAllowedSibling = isLayoutCategory && !isTargetGridItems;

    const addAsSiblingFlag =
      selectedComponent?.blockDroppingChildrenInside ||
      isSpecialComponents ||
      isAllowedSibling ||
      isAllowedGridMatch;

    const editorTreeCopy = cloneDeep(editorTree) as EditorTreeCopy;

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

  useHotkeys([
    ["backspace", deleteComponent],
    ["delete", deleteComponent],
    ["mod+C", copySelectedComponent],
    ["mod+V", pasteCopiedComponent],
    ["mod+X", cutSelectedComponent],
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
  ]);
};

export default useEditorHotkeys;
