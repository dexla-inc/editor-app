import { useEditorStore } from "@/stores/editor";
import { GRID_SIZE } from "@/utils/config";
import {
  getComponentById,
  getComponentIndex,
  getComponentParent,
  updateTreeComponent,
} from "@/utils/editor";
import { Box } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useEffect, useState } from "react";

const SNAP_SIZE = 15;

export const GridColumnResizer = () => {
  const [columnSpan, setColumnSpan] = useState(0);
  const setIsResizing = useEditorStore((state) => state.setIsResizing);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const parent = getComponentParent(editorTree.root, selectedComponentId!);
  const span = component?.props?.span;
  const isColumn = component?.name === "GridColumn";
  const siblings = (parent?.children ?? []).filter(
    (c) => c.name === "GridColumn",
  );
  const isLast = siblings[siblings.length - 1]?.id === component?.id;

  const calculatePosition = useCallback(() => {
    if (component?.id && !isPreviewMode && isColumn) {
      const canvas = document.getElementById("iframe-canvas");
      const resizer = document.getElementById("resizer");
      const comp = iframeWindow?.document.getElementById(component.id);

      if (resizer && comp && canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const resizerRect = resizer.getBoundingClientRect();
        const compRect = comp.getBoundingClientRect();

        resizer.style.top = `${
          canvasRect.top +
          compRect.top +
          compRect.height / 2 -
          resizerRect.height / 2
        }px`;
        resizer.style.left = `${
          canvasRect.left + compRect.left + compRect.width + resizerRect.width
        }px`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    component?.id,
    iframeWindow?.document,
    isPreviewMode,
    editorTree.timestamp,
    isColumn,
  ]);

  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  const calculateDistance = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (component?.id && !isPreviewMode && isColumn) {
        const resizer = document.getElementById("resizer");

        if (resizer) {
          const resizerRect = resizer.getBoundingClientRect();

          const draggedDistanceFormStartingPoint = resizerRect.left - e.clientX;
          const isGoingLeft = draggedDistanceFormStartingPoint > 0;
          const distance = Math.abs(draggedDistanceFormStartingPoint);
          if (distance > SNAP_SIZE) {
            const steps = Math.floor(distance / SNAP_SIZE);
            if (steps === 0) return;

            let newSpan = isGoingLeft ? span - steps : span + steps;

            if (newSpan < 12) {
              newSpan = 12;
            } else if (newSpan > GRID_SIZE) {
              newSpan = GRID_SIZE;
            }

            setColumnSpan(newSpan);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      component?.id,
      iframeWindow?.document,
      isPreviewMode,
      editorTree.timestamp,
      isColumn,
      span,
    ],
  );

  useEffect(() => {
    const el = iframeWindow?.document.querySelector(
      ".iframe-canvas-ScrollArea-viewport",
    );
    el?.addEventListener("scroll", calculatePosition);
    return () => el?.removeEventListener("scroll", calculatePosition);
  }, [calculatePosition, iframeWindow]);

  useEffect(() => {
    if (columnSpan && component?.id && columnSpan !== span) {
      const nextSibling =
        siblings[getComponentIndex(parent!, component.id) + 1];
      const nextSiblingSpan = nextSibling?.props?.span - (columnSpan - span);
      const tree = useEditorStore.getState().tree;
      const copy = cloneDeep(tree);
      updateTreeComponent(copy.root, component?.id, {
        span: columnSpan,
        resized: true,
      });
      updateTreeComponent(copy.root, nextSibling?.id!, {
        span: nextSiblingSpan,
        resized: true,
      });
      setEditorTree(copy, { action: `Resizing ${component?.id}` });
    }
  }, [columnSpan, component?.id, parent, setEditorTree, siblings, span]);

  if (!isColumn || isPreviewMode || !component || isLast) {
    return null;
  }

  return (
    <Box
      id="resizer"
      bg="teal"
      w="4px"
      h="40px"
      pos="absolute"
      draggable
      onDragStart={() => setIsResizing(true)}
      onDragEnd={() => setIsResizing(false)}
      onDrag={calculateDistance}
      style={{
        cursor: "col-resize",
      }}
    />
  );
};
