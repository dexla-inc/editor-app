// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { IFrame } from "@/components/IFrame";
import { useGetPageData } from "@/hooks/useGetPageData";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import { useEditorStore, useTemporalStore } from "@/stores/editor";
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
  pageId: string;
};

export const EditorCanvas = ({ projectId, pageId }: Props) => {
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
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  useGetPageData({ projectId, pageId });

  const deleteComponent = useCallback(() => {
    const selectedComponentId = useEditorStore.getState().selectedComponentId;

    if (
      selectedComponentId &&
      selectedComponentId !== "root" &&
      selectedComponentId !== "content-wrapper" &&
      !isPreviewMode
    ) {
      const copy = cloneDeep(editorTree);

      const parent = getComponentParent(editorTree.root, selectedComponentId);
      const component = getComponentById(copy.root, selectedComponentId);
      removeComponent(copy.root, selectedComponentId);
      setEditorTree(copy, { action: `Removed ${component?.name}` });
      clearSelection(parent?.id);
    }
  }, [clearSelection, editorTree, setEditorTree, isPreviewMode]);

  const copySelectedComponent = useCallback(() => {
    const selectedComponentId = useEditorStore.getState().selectedComponentId;

    if (!isPreviewMode && selectedComponentId) {
      setCopiedComponent(
        getComponentById(editorTree.root, selectedComponentId!)!,
      );
    }
  }, [editorTree.root, isPreviewMode, setCopiedComponent]);

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
    if (!copiedComponent || isPreviewMode) {
      return; // Early exit if conditions aren't met
    }

    const selectedComponentId = useEditorStore.getState().selectedComponentId;

    const copy = cloneDeep(editorTree);
    const targetId = determinePasteTarget(selectedComponentId);
    const parentComponent = getComponentParent(copy.root, targetId);

    const newSelectedId = addComponent(
      copy.root,
      copiedComponent,
      {
        id: parentComponent!.id as string,
        edge: "right",
      },
      getComponentIndex(parentComponent!, selectedComponentId!) + 1,
    );

    await setEditorTree(copy, { action: `Pasted ${copiedComponent.name}` });
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

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Droppable
          key={`${component.id}-${isPreviewMode ? "preview" : "editor"}`}
          id={component.id}
          m={0}
          p={2}
        >
          <Paper shadow="xs" ref={canvasRef} bg="gray.0" display="flex">
            {component.children?.map((child) => renderTree(child))}
          </Paper>
        </Droppable>
      );
    }

    const componentToRender = componentMapper[component.name];

    if (!componentToRender) {
      return (
        <DroppableDraggable
          key={`${component.id}-${isPreviewMode ? "preview" : "editor"}`}
          id={component.id!}
          component={component}
          customComponentModal={customComponentModal}
        >
          {component.children?.map((child) => renderTree(child))}
        </DroppableDraggable>
      );
    }

    return (
      <DroppableDraggable
        key={`${component.id}-${isPreviewMode ? "preview" : "editor"}`}
        id={component.id!}
        component={component}
        customComponentModal={customComponentModal}
      >
        {componentToRender?.Component({ component, renderTree })}
      </DroppableDraggable>
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
    </>
  );
};
