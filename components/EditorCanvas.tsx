// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { ComponentToolbox } from "@/components/ComponentToolbox";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { Droppable } from "@/components/Droppable";
import { EditableComponent } from "@/components/EditableComponent";
import { IFrame } from "@/components/IFrame";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import { useEditorStore, useTemporalStore } from "@/stores/editor";
import { copyToClipboard, pasteFromClipboard } from "@/utils/clipboard";
import { componentMapper } from "@/utils/componentMapper";
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
import { useCallback, useMemo } from "react";

type Props = {
  projectId: string;
};

export const EditorCanvas = ({ projectId }: Props) => {
  const undo = useTemporalStore((state) => state.undo);
  const redo = useTemporalStore((state) => state.redo);
  const copiedComponent = useEditorStore((state) => state.copiedComponent);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  const deleteComponent = useCallback(() => {
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
      setEditorTree(copy, { action: `Removed ${comp?.name}` });
    }
  }, [
    editorTree,
    selectedComponentId,
    setEditorTree,
    setSelectedComponentId,
    isPreviewMode,
  ]);

  const copySelectedComponent = useCallback(() => {
    const selectedComponentId = useEditorStore.getState().selectedComponentId;
    const componentToCopy = getComponentById(
      editorTree.root,
      selectedComponentId!,
    )!;
    if (!isPreviewMode && selectedComponentId) {
      setCopiedComponent(componentToCopy);
      copyToClipboard(projectId, componentToCopy);
    }
  }, [editorTree.root, isPreviewMode, setCopiedComponent, projectId]);

  const cutSelectedComponent = useCallback(() => {
    const selectedComponentId = useEditorStore.getState().selectedComponentId;

    if (!isPreviewMode && selectedComponentId) {
      copySelectedComponent();
      deleteComponent();
    }
  }, [copySelectedComponent, deleteComponent, isPreviewMode]);

  const determinePasteTarget = (selectedId: string | undefined) => {
    if (!selectedId) return "content-wrapper";
    if (selectedId === "root") return "content-wrapper";
    return selectedId as string;
  };

  const pasteCopiedComponent = useCallback(async () => {
    const clipboardContent = pasteFromClipboard(projectId);
    let componentToPaste =
      (clipboardContent as typeof copiedComponent) || copiedComponent;
    if (!componentToPaste || isPreviewMode) {
      return; // Early exit if conditions aren't met
    }

    const selectedComponentId = useEditorStore.getState().selectedComponentId;

    const copy = cloneDeep(editorTree);
    const targetId = determinePasteTarget(selectedComponentId);
    const parentComponent = getComponentParent(copy.root, targetId);

    const newSelectedId = addComponent(
      copy.root,
      componentToPaste,
      {
        id: parentComponent!.id as string,
        edge: "right",
      },
      getComponentIndex(parentComponent!, selectedComponentId!) + 1,
    );

    await setEditorTree(copy, { action: `Pasted ${componentToPaste.name}` });
    setSelectedComponentId(newSelectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiedComponent, editorTree, isPreviewMode, setEditorTree]);

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
          undo();
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
          undo();
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

  const EditableComponentContainer = ({ children, component }: any) => {
    const isSelected = useEditorStore(
      (state) => state.selectedComponentId === component.id,
    );

    return (
      <EditableComponent
        id={component.id!}
        component={component}
        customComponentModal={customComponentModal}
        isSelected={isSelected}
      >
        {children}
      </EditableComponent>
    );
  };

  const renderTree = (component: Component) => {
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
  };

  const treeRoot = useMemo(() => editorTree.root, [editorTree.root]);

  if ((editorTree?.root?.children ?? [])?.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        pos="relative"
        onClick={() => clearSelection()}
        style={{
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          height: "100%",
          overflow: "hidden",
        }}
        p={0}
      >
        <IFrame onClick={clearSelection} projectId={projectId}>
          {renderTree(treeRoot)}
        </IFrame>
      </Box>
      {isCustomComponentModalOpen && (
        <CustomComponentModal
          customComponentModal={customComponentModal}
          isCustomComponentModalOpen={isCustomComponentModalOpen}
        />
      )}
      <ComponentToolbox />
    </>
  );
};
