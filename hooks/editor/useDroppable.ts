import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper, structureMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  addParentContainerToIfNeeded,
  debugTree,
  DropTarget,
  Edge,
  getClosestEdge,
  getComponentParent,
  getComponentTreeById,
} from "@/utils/editor";
import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import {
  isEditorModeSelector,
  selectedComponentIdSelector,
} from "@/utils/componentSelectors";
import { cloneObject } from "@/utils/common";

const debouncedDragEnter = debounce((event: any, id: string) => {
  const isResizing = useEditorStore.getState().isResizing;
  if (isResizing) return;

  const componentToAdd = useEditorStore.getState().componentToAdd;
  const selectedComponentId = selectedComponentIdSelector(
    useEditorTreeStore.getState(),
  );
  const setCurrentTargetId = useEditorStore.getState().setCurrentTargetId;
  const activeTab = useEditorStore.getState().activeTab;
  const setActiveTab = useEditorStore.getState().setActiveTab;
  const isTabPinned = useUserConfigStore.getState().isTabPinned;
  const activeId = componentToAdd?.id ?? selectedComponentId;

  const activeComponent =
    useEditorTreeStore.getState().componentMutableAttrs[activeId!];

  const comp = useEditorTreeStore.getState().componentMutableAttrs[id];
  const isTryingToDropInsideItself =
    activeComponent && activeId !== id
      ? !!getComponentTreeById(activeComponent!, id)
      : false;

  if (id === "root" || id === "content-wrapper") {
    return;
  }

  const isGrid = activeComponent?.name === "Grid";
  const isPopOver = activeComponent?.name === "PopOver";

  const isAllowed = isGrid
    ? componentMapper[
        activeComponent?.name as string
      ].allowedParentTypes?.includes(comp?.name as string)
    : isPopOver
      ? true
      : !comp?.props?.blockDroppingChildrenInside;

  // console.log("==>", event);
  if (
    !isTryingToDropInsideItself &&
    // activeComponent &&
    isAllowed &&
    event.shiftKey
  ) {
    setCurrentTargetId(id);
  } // else if (!activeComponent) {
  //   setCurrentTargetId(id);
  // }

  if (event.clientX > NAVBAR_WIDTH && !isTabPinned) {
    setActiveTab(undefined);
  } else {
    if (
      (isTabPinned && activeTab !== "layers") ||
      (!isTabPinned && activeTab === "layers")
    ) {
      setActiveTab("layers");
    }
  }
}, 100);

export const useDroppable = ({
  id,
  onDrop,
  currentWindow,
}: {
  id: string;
  onDrop: (droppedId: string, dropTarget: DropTarget) => void;
  currentWindow?: Window;
}) => {
  // const [dropTargetId, setDropTargetId] = useState<string>(id);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      const { componentToAdd, isResizing, setCurrentTargetId, dropTargetId } =
        useEditorStore.getState();
      if (isResizing || !isEditorMode || !event.shiftKey) return;
      const edge = useEditorStore.getState().edge;
      const selectedComponentId = selectedComponentIdSelector(
        useEditorTreeStore.getState(),
      );
      const activeId = componentToAdd?.id ?? selectedComponentId;

      const dropTarget = {
        id: dropTargetId || id,
        edge: "center",
      } as DropTarget;
      if (activeId) {
        onDrop?.(activeId as string, dropTarget);
      }

      setCurrentTargetId(undefined);
    },
    [onDrop],
  );

  const _handleEdgeSet = (
    distances: {
      leftDist: number;
      rightDist: number;
      topDist: number;
      bottomDist: number;
    },
    threshold: number,
  ): string => {
    const { blockDroppingChildrenInside, name: componentName } =
      useEditorTreeStore.getState().componentMutableAttrs[id];
    const { componentToAdd, edge, setEdge } = useEditorStore.getState();
    const { leftDist, rightDist, topDist, bottomDist } = distances;
    const isPopOver = componentToAdd?.name === "PopOver";
    let isAllowed = !blockDroppingChildrenInside || isPopOver;
    if (componentName === "NavLink")
      isAllowed = componentToAdd?.name === "NavLink";

    // if (
    //   leftDist > threshold &&
    //   rightDist > threshold &&
    //   topDist > threshold &&
    //   bottomDist > threshold &&
    //   isAllowed
    // ) {
    //   // If not within 5 pixels of top and bottom edge, set edge to center.
    //   if (edge !== "center") {
    //     setEdge("center");
    //   }
    // } else {
    //   // Check the closest edge and set it accordingly.
    //   const { edge: newEdge } = getClosestEdge(
    //     leftDist,
    //     rightDist,
    //     topDist,
    //     bottomDist,
    //   );
    //   if (edge !== newEdge) {
    //     setEdge(newEdge as Edge);
    //   }
    // }

    const { edge: newEdge } = getClosestEdge(
      leftDist,
      rightDist,
      topDist,
      bottomDist,
    );
    if (edge !== newEdge) {
      setEdge(newEdge as Edge);
    }

    return String(newEdge);
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const { currentTargetId, isResizing, setDropTargetId, setEdge } =
        useEditorStore.getState();
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      if (
        isResizing ||
        !isEditorMode ||
        !event.shiftKey ||
        ["root", "content-wrapper", "main-content"].includes(id)
      )
        return;

      const { virtualTree: editorTree, setVirtualTree } =
        useEditorTreeStore.getState();

      const { clientX: mouseX, clientY: mouseY } = event;
      const w = currentWindow ?? window;
      const comp =
        w?.document?.querySelector(`[data-id^="${id}"]`) ??
        w?.document?.querySelector(`[id^="${id}"]`);
      const rect = comp?.getBoundingClientRect()!;

      if (!mouseX || !mouseY || !rect) return;

      const leftDist = mouseX - rect.left;
      const rightDist = rect.right - mouseX;
      const topDist = mouseY - rect.top;
      const bottomDist = rect.bottom - mouseY;

      // if (mouseX <= NAVBAR_WIDTH) {
      //   edge = _handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 2);
      // } else {
      //
      // }

      const edge = _handleEdgeSet(
        { leftDist, rightDist, topDist, bottomDist },
        5,
      );

      const {
        treeRoot: newTree,
        parentAddedFlag,
        newParentComponent,
      } = addParentContainerToIfNeeded(
        cloneObject(editorTree?.root!),
        id,
        edge as Edge,
      );

      if (parentAddedFlag) {
        console.log(
          debugTree(newTree),
          newParentComponent,
          // `era ${dropTargetId} agora é ${newParentComponent?.id!}`,
        );
        setEdge("center");
        setVirtualTree(newTree);
        setDropTargetId(newParentComponent?.id!);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, currentWindow],
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      if (!isEditorMode) return;

      debouncedDragEnter(event, id);
    },
    [id],
  );

  const handleDragLeave = useCallback((event: any) => {
    const { isResizing, setEdge, edge } = useEditorStore.getState();
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (isResizing || !isEditorMode) return;

    event.preventDefault();
    event.stopPropagation();
    if (edge !== undefined) {
      setEdge(undefined);
    }
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    const { setVirtualTree } = useEditorTreeStore.getState();
    if (!event || !isEditorMode) {
      return;
    }

    const { isResizing, setEdge, edge } = useEditorStore.getState();
    if (isResizing) return;

    event.preventDefault();
    event.stopPropagation();
    setVirtualTree(undefined);
    if (edge !== undefined) {
      setEdge(undefined);
    }
  }, []);

  return {
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
  };
};
