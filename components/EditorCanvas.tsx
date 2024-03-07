// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { ComponentToolbox } from "@/components/ComponentToolbox";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { Droppable } from "@/components/Droppable";
import { EditableComponentContainer } from "@/components/EditableComponentContainer";
import { IFrame } from "@/components/IFrame";
import { useAppMode } from "@/hooks/useAppMode";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import {
  debouncedUpdatePageState,
  useEditorStore,
  useTemporalStore,
} from "@/stores/editor";
import { copyToClipboard, pasteFromClipboard } from "@/utils/clipboard";
import { componentMapper, structureMapper } from "@/utils/componentMapper";
import { encodeSchema } from "@/utils/compression";
import { HEADER_HEIGHT } from "@/utils/config";
import {
  ComponentStructure,
  ComponentTree,
  EditorTreeCopy,
  addComponent,
  getComponentIndex,
  getComponentParent,
  getComponentTreeById,
  removeComponent,
} from "@/utils/editor";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Paper } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { memo, useCallback } from "react";

type Props = {
  projectId: string;
};

const EditorCanvasComponent = ({ projectId }: Props) => {
  const undo = useTemporalStore((state) => state.undo);
  const redo = useTemporalStore((state) => state.redo);
  const pastStates = useTemporalStore((state) => state.pastStates);
  // TODO: get this back - turn it off for now
  // const setCursor = useEditorStore((state) => state.setCursor);
  const copiedComponent = useEditorStore((state) => state.copiedComponent);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const { isPreviewMode } = useAppMode();
  const currentProjectId = useEditorStore((state) => state.currentProjectId);
  const currentPageId = useEditorStore((state) => state.currentPageId);
  const setIsSaving = useEditorStore((state) => state.setIsSaving);
  const setSelectedComponentIds = useEditorStore(
    (state) => state.setSelectedComponentIds,
  );
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  const deleteComponent = useCallback(() => {
    const selectedComponentIds = useEditorStore.getState().selectedComponentIds;
    if (
      selectedComponentIds &&
      selectedComponentIds.length > 0 &&
      !isPreviewMode
    ) {
      const modals = Object.values(
        useEditorStore.getState().componentMutableAttrs,
      ).filter((c) => c.name === "Modal");
      const targetModal = modals.find(
        (modal) => modal.id === selectedComponentIds[0],
      );
      selectedComponentIds.map((selectedComponentId) => {
        const comp =
          useEditorStore.getState().componentMutableAttrs[selectedComponentId];
        const parentTree = getComponentParent(
          editorTree.root as ComponentStructure,
          selectedComponentId,
        );
        const parent =
          useEditorStore.getState().componentMutableAttrs[parentTree?.id!];
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
    const selectedComponentId = useEditorStore
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

  const cutSelectedComponent = useCallback(() => {
    const selectedComponentId = useEditorStore
      .getState()
      .selectedComponentIds?.at(-1);

    if (!isPreviewMode && selectedComponentId) {
      copySelectedComponent();
      deleteComponent();
    }
  }, [copySelectedComponent, deleteComponent, isPreviewMode]);

  const pasteCopiedComponent = useCallback(async () => {
    const clipboardContent = pasteFromClipboard();
    let componentToPasteTree =
      (clipboardContent as typeof copiedComponent) || copiedComponent;
    if (!componentToPasteTree || isPreviewMode) {
      return;
    }
    const componentToPaste =
      useEditorStore.getState().componentMutableAttrs[componentToPasteTree.id!];

    const selectedComponentId = useEditorStore
      .getState()
      .selectedComponentIds?.at(-1);

    if (!selectedComponentId || selectedComponentId === "root")
      return "content-wrapper";
    const component =
      useEditorStore.getState().componentMutableAttrs[selectedComponentId];
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

  const handlePageStateChange = (
    operation: (steps?: number | undefined) => void,
  ) => {
    operation();
    debouncedUpdatePageState(
      encodeSchema(JSON.stringify(editorTree)),
      currentProjectId ?? "",
      currentPageId ?? "",
      setIsSaving,
    );
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

  const renderTree = (componentTree: ComponentTree, shareableContent = {}) => {
    if (componentTree.id === "root") {
      return (
        <Droppable
          key={`${componentTree.id}`}
          id={componentTree.id}
          m={0}
          p={2}
          miw={980}
        >
          <Paper
            shadow="xs"
            ref={canvasRef}
            bg="gray.0"
            display="flex"
            sx={{ flexDirection: "column" }}
          >
            {componentTree.children?.map((child) => renderTree(child))}
          </Paper>
        </Droppable>
      );
    }

    const component =
      useEditorStore.getState().componentMutableAttrs[componentTree.id!];
    const componentToRender = componentMapper[component.name];

    if (!componentToRender) {
      return (
        <EditableComponentContainer
          key={`${component.id}`}
          componentTree={componentTree}
          shareableContent={shareableContent}
        >
          {componentTree.children?.map((child) => renderTree(child))}
        </EditableComponentContainer>
      );
    }

    return (
      <EditableComponentContainer
        key={`${component.id}`}
        componentTree={componentTree}
        shareableContent={shareableContent}
      >
        {componentToRender?.Component({ component, renderTree })}
      </EditableComponentContainer>
    );
  };

  if ((editorTree?.root?.children ?? [])?.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        pos="relative"
        style={{
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          height: "100%",
          overflow: "hidden",
        }}
        p={0}
        // TODO: get this back - turn it off for now
        // onPointerMove={(event) => {
        //   event.preventDefault();
        //   setCursor({
        //     x: Math.round(event.clientX),
        //     y: Math.round(event.clientY),
        //   });
        // }}
        // onPointerLeave={() => setCursor(undefined)}
      >
        <IFrame projectId={projectId}>{renderTree(editorTree.root)}</IFrame>
      </Box>
      {isCustomComponentModalOpen && (
        <CustomComponentModal
          customComponentModal={customComponentModal}
          isCustomComponentModalOpen={isCustomComponentModalOpen}
        />
      )}
      <ComponentToolbox customComponentModal={customComponentModal} />
    </>
  );
};

export const EditorCanvas = memo(EditorCanvasComponent);
