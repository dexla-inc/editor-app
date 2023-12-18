// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { ComponentToolbox } from "@/components/ComponentToolbox";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { Droppable } from "@/components/Droppable";
import { EditableComponent } from "@/components/EditableComponent";
import { IFrame } from "@/components/IFrame";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import {
  debouncedUpdatePageState,
  useEditorStore,
  useTemporalStore,
} from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { copyToClipboard, pasteFromClipboard } from "@/utils/clipboard";
import { componentMapper, structureMapper } from "@/utils/componentMapper";
import { encodeSchema } from "@/utils/compression";
import { HEADER_HEIGHT } from "@/utils/config";
import {
  Component,
  addComponent,
  getComponentById,
  getComponentIndex,
  getComponentParent,
  removeComponent,
} from "@/utils/editor";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Paper } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import cloneDeep from "lodash.clonedeep";
import { memo, useCallback, useMemo } from "react";

type Props = {
  projectId: string;
};

const EditableComponentContainer = ({ children, component }: any) => {
  const isSelected = useEditorStore(
    (state) => state.selectedComponentIds?.includes(component.id),
  );

  return (
    <EditableComponent
      id={component.id!}
      component={component}
      isSelected={isSelected}
    >
      {children}
    </EditableComponent>
  );
};

const EditorCanvasComponent = ({ projectId }: Props) => {
  const undo = useTemporalStore((state) => state.undo);
  const redo = useTemporalStore((state) => state.redo);
  const pastStates = useTemporalStore((state) => state.pastStates);
  const copiedComponent = useEditorStore((state) => state.copiedComponent);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const currentProjectId = useEditorStore((state) => state.currentProjectId);
  const currentPageId = useEditorStore((state) => state.currentPageId);
  const setIsSaving = useEditorStore((state) => state.setIsSaving);

  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const setSelectedComponentIds = useEditorStore(
    (state) => state.setSelectedComponentIds,
  );
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  const deleteComponent = useCallback(() => {
    const selectedComponentId = useEditorStore.getState().selectedComponentId;
    if (selectedComponentId && !isPreviewMode) {
      const copy = cloneDeep(editorTree);

      const comp = getComponentById(copy.root, selectedComponentId);
      const parent = getComponentParent(copy.root, selectedComponentId);
      const grandParent = getComponentParent(copy.root, parent?.id!);

      if (
        comp?.name === "GridColumn" &&
        parent?.name === "Grid" &&
        parent?.children?.length === 1 &&
        grandParent?.id === "root"
      ) {
        return;
      }

      removeComponent(copy.root, selectedComponentId);

      if (
        comp?.name === "GridColumn" &&
        parent?.name === "Grid" &&
        parent?.children?.length === 0
      ) {
        removeComponent(copy.root, parent.id!);
      }

      setSelectedComponentId(undefined);
      setSelectedComponentIds(() => []);
      setEditorTree(copy, { action: `Removed ${comp?.name}` });
    }
  }, [
    isPreviewMode,
    editorTree,
    setSelectedComponentId,
    setSelectedComponentIds,
    setEditorTree,
  ]);

  const copySelectedComponent = useCallback(() => {
    const selectedComponentId = useEditorStore.getState().selectedComponentId;
    const componentToCopy = getComponentById(
      editorTree.root,
      selectedComponentId!,
    )!;
    if (!isPreviewMode && selectedComponentId) {
      setCopiedComponent(componentToCopy);
      copyToClipboard(componentToCopy);
    }
  }, [editorTree.root, isPreviewMode, setCopiedComponent]);

  const cutSelectedComponent = useCallback(() => {
    const selectedComponentId = useEditorStore.getState().selectedComponentId;

    if (!isPreviewMode && selectedComponentId) {
      copySelectedComponent();
      deleteComponent();
    }
  }, [copySelectedComponent, deleteComponent, isPreviewMode]);

  const pasteCopiedComponent = useCallback(async () => {
    const clipboardContent = pasteFromClipboard();
    let componentToPaste =
      (clipboardContent as typeof copiedComponent) || copiedComponent;
    if (!componentToPaste || isPreviewMode) {
      return;
    }

    const selectedComponentId = useEditorStore.getState().selectedComponentId;
    const copy = cloneDeep(editorTree);

    if (!selectedComponentId || selectedComponentId === "root")
      return "content-wrapper";
    const component = getComponentById(editorTree.root, selectedComponentId);
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
      const parentComponent = getComponentParent(
        editorTree.root,
        selectedComponentId,
      );
      targetId = parentComponent?.id as string;
      componentIndex =
        getComponentIndex(parentComponent!, selectedComponentId!) + 1;
    } else {
      componentIndex = component?.children?.length ?? 0;
    }

    const newSelectedId = addComponent(
      copy.root,
      componentToPaste,
      {
        id: targetId,
        edge: isGridItems ? "center" : "top",
      },
      componentIndex,
    );

    setEditorTree(copy, { action: `Pasted ${componentToPaste.name}` });
    setSelectedComponentId(newSelectedId);
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

  const renderTree = useCallback(
    (component: Component) => {
      if (component.id === "root") {
        return (
          <Droppable
            key={`${component.id}-${isPreviewMode ? "preview" : "editor"}`}
            id={component.id}
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
              {component.children?.map((child) => renderTree(child))}
            </Paper>
          </Droppable>
        );
      }

      const componentToRender = componentMapper[component.name];

      if (!componentToRender) {
        return (
          <EditableComponentContainer
            key={`${component.id}-${isPreviewMode ? "preview" : "editor"}`}
            component={component}
          >
            {component.children?.map((child) => renderTree(child))}
          </EditableComponentContainer>
        );
      }

      return (
        <EditableComponentContainer
          key={`${component.id}-${isPreviewMode ? "preview" : "editor"}`}
          component={component}
        >
          {componentToRender?.Component({ component, renderTree })}
        </EditableComponentContainer>
      );
    },
    [canvasRef, isPreviewMode],
  );

  const treeRoot = useMemo(() => editorTree.root, [editorTree.root]);

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
      >
        <IFrame projectId={projectId}>{renderTree(treeRoot)}</IFrame>
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
