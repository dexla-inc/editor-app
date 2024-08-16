import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  DropTarget,
  Edge,
  getClosestEdge,
  getComponentTreeById,
} from "@/utils/editor";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import {
  isEditorModeSelector,
  selectedComponentIdSelector,
} from "@/utils/componentSelectors";

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

  if (!isTryingToDropInsideItself && activeComponent && isAllowed) {
    setCurrentTargetId(id);
  } else if (!activeComponent) {
    setCurrentTargetId(id);
  }

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
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      // @ts-ignore
      // const rect = event.target?.getBoundingClientRect();
      const w = useEditorStore.getState().iframeWindow;
      const currDraggableId =
        // @ts-ignore
        event.target.dataset.id || event.target.getAttribute(" id")!;
      const componentMutableAttrs =
        useEditorTreeStore.getState().componentMutableAttrs;
      const updatedComponentMutableAttrs = {
        ...componentMutableAttrs,
        [id]: {
          ...componentMutableAttrs[id],
          blockDroppingChildrenInside: true,
        },
      };

      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;

      // const left = event.pageX - rect.width / 2;
      // const top = event.pageY - rect.height / 2;
      // console.log(rect, left, top);

      const elements = w?.document.elementsFromPoint(
        event.clientX,
        event.clientY,
      );
      // .filter((item) => {
      //   // @ts-ignore
      //   const currItemId = (item.dataset.id ||
      //     item.getAttribute("id"))!;
      //   const filterIds = [
      //     currDraggableId,
      //   ];

      //   return (
      //     // currItemId &&
      //     !filterIds.includes(currItemId) &&
      //     componentMutableAttrs[currItemId?.split("-related-").at(0)!]
      //   );
      // });
      // console.log(currDraggableId, elements);

      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      const { componentToAdd, isResizing, setCurrentTargetId } =
        useEditorStore.getState();
      if (isResizing || !isEditorMode) return;
      const edge = useEditorStore.getState().edge;
      const selectedComponentId = selectedComponentIdSelector(
        useEditorTreeStore.getState(),
      );
      const setComponentToAdd = useEditorStore.getState().setComponentToAdd;
      const activeId = componentToAdd?.id ?? selectedComponentId;

      const dropZoneStyles = w?.getComputedStyle(event.target as Element);
      const paddingLeft = parseFloat(dropZoneStyles?.paddingLeft ?? "0");
      const paddingTop = parseFloat(dropZoneStyles?.paddingTop ?? "0");
      const marginLeft = parseFloat(dropZoneStyles?.marginLeft ?? "0");
      const marginTop = parseFloat(dropZoneStyles?.marginTop ?? "0");
      const zIndex = isNaN(parseInt(dropZoneStyles?.zIndex!))
        ? 10
        : parseInt(dropZoneStyles?.zIndex!) + 10;

      event.preventDefault();
      event.stopPropagation();

      if (componentToAdd?.id) {
        // console.log("componentToAdd", componentToAdd);
        const rect = componentToAdd.props?.style;
        const left = event.pageX - rect.width / 2 - paddingLeft - marginLeft;
        const top = event.pageY - rect.height / 2 - paddingTop - marginTop;
        // console.log(rect, left, top, event.pageX, event.pageY);
        setComponentToAdd({
          ...componentToAdd,
          props: {
            ...componentToAdd.props,
            style: {
              ...componentToAdd.props?.style,
              top,
              left,
              position: "absolute",
              zIndex,
            },
          },
        });
        console.log("===>", { zIndex });
      } else {
        // @ts-ignore
        // console.log(activeId, event.target.id);
        const rect = w?.document
          .getElementById(activeId!)
          ?.getBoundingClientRect()!;
        const left = event.pageX - rect.width / 2 - paddingLeft - marginLeft;
        const top = event.pageY - rect.height / 2 - paddingTop - marginTop;
        // console.log(rect, left, top, event.pageX, event.pageY);
        console.log("---->", { zIndex });
        updateTreeComponentAttrs({
          componentIds: [activeId!],
          attrs: {
            props: {
              style: {
                top: top < 0 ? 0 : top,
                left: left < 0 ? 0 : left,
                position: "absolute",
                zIndex,
              },
            },
          },
        });
      }

      const dropTarget = {
        id,
        edge: edge ?? "center",
      } as DropTarget;
      if (activeId) {
        onDrop?.(activeId as string, dropTarget);
      }

      setCurrentTargetId(undefined);
    },
    [id, onDrop],
  );

  const _handleEdgeSet = (
    distances: {
      leftDist: number;
      rightDist: number;
      topDist: number;
      bottomDist: number;
    },
    threshold: number,
  ) => {
    const { blockDroppingChildrenInside, name: componentName } =
      useEditorTreeStore.getState().componentMutableAttrs[id];
    const { componentToAdd, edge, setEdge } = useEditorStore.getState();
    const { leftDist, rightDist, topDist, bottomDist } = distances;
    const isPopOver = componentToAdd?.name === "PopOver";
    let isAllowed = !blockDroppingChildrenInside || isPopOver;
    if (componentName === "NavLink")
      isAllowed = componentToAdd?.name === "NavLink";

    if (
      leftDist > threshold &&
      rightDist > threshold &&
      topDist > threshold &&
      bottomDist > threshold &&
      isAllowed
    ) {
      // If not within 5 pixels of top and bottom edge, set edge to center.
      if (edge !== "center") {
        setEdge("center");
      }
    } else {
      // Check the closest edge and set it accordingly.
      const { edge: newEdge } = getClosestEdge(
        leftDist,
        rightDist,
        topDist,
        bottomDist,
      );
      if (edge !== newEdge) {
        setEdge(newEdge as Edge);
      }
    }
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      const { currentTargetId, isResizing } = useEditorStore.getState();
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      if (isResizing || !isEditorMode) return;

      event.preventDefault();
      event.stopPropagation();

      const { clientX: mouseX, clientY: mouseY } = event;
      const w = currentWindow ?? window;
      const comp =
        w?.document?.querySelector(`[data-id^="${id}"]`) ??
        w?.document?.querySelector(`[id^="${id}"]`);
      const rect = comp?.getBoundingClientRect()!;

      if (!mouseX || !mouseY || !rect || currentTargetId !== id) return;

      const leftDist = mouseX - rect.left;
      const rightDist = rect.right - mouseX;
      const topDist = mouseY - rect.top;
      const bottomDist = rect.bottom - mouseY;

      if (mouseX <= NAVBAR_WIDTH) {
        _handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 2);
      } else {
        _handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 5);
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
    console.log("test");
    // @ts-ignore
    const rect = event.target?.getBoundingClientRect();
    const w = useEditorStore.getState().iframeWindow;
    const currDraggableId =
      // @ts-ignore
      event.target.dataset.id || event.target.getAttribute("id")!;
    const componentMutableAttrs =
      useEditorTreeStore.getState().componentMutableAttrs;

    const left = event.pageX - rect.width / 2;
    const top = event.pageY - rect.height / 2;
    // console.log(rect, left, top);

    const elements = w?.document.elementsFromPoint(
      event.clientX,
      event.clientY,
    );
    // .filter((item) => {
    //   // @ts-ignore
    //   const currItemId = (item.dataset.id ||
    //     item.getAttribute("id"))!;
    //   const filterIds = [
    //     currDraggableId,
    //   ];

    //   return (
    //     // currItemId &&
    //     !filterIds.includes(currItemId) &&
    //     componentMutableAttrs[currItemId?.split("-related-").at(0)!]
    //   );
    // });
    // console.log(currDraggableId, elements);

    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (!event || !isEditorMode) {
      return;
    }

    const { isResizing, setEdge, edge } = useEditorStore.getState();
    if (isResizing) return;

    event.preventDefault();
    event.stopPropagation();
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
