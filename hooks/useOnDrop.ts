import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import {
  Component,
  DropTarget,
  addComponent,
  getComponentIndex,
  getComponentParent,
  moveComponent,
  moveComponentToDifferentParent,
  removeComponent,
  removeComponentFromParent,
  getComponentTreeById,
  EditorTreeCopy,
  ComponentStructure,
} from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import { useCallback } from "react";

const parseId = (_id: string) => {
  const id = _id.startsWith("layer")
    ? _id.split("layer-")[1]
    : _id.startsWith("add")
    ? _id.split("add-")[1]
    : _id;
  return id;
};

export const useOnDrop = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const componentToAdd = useEditorStore((state) => state.componentToAdd);
  const setComponentToAdd = useEditorStore((state) => state.setComponentToAdd);
  const setSelectedComponentIds = useEditorStore(
    (state) => state.setSelectedComponentIds,
  );
  const isResizing = useEditorStore((state) => state.isResizing);

  const onDrop = useCallback(
    (_droppedId: string, dropTarget: DropTarget) => {
      if (isResizing) return;
      const droppedId = parseId(_droppedId ?? componentToAdd?.id);
      dropTarget.id = parseId(dropTarget.id);
      const editorTreeCopy = cloneDeep(editorTree) as EditorTreeCopy;
      const activeComponentTree = getComponentTreeById(
        editorTreeCopy.root,
        droppedId,
      );
      const activeComponent =
        useEditorStore.getState().componentMutableAttrs[droppedId];
      let targetComponent =
        useEditorStore.getState().componentMutableAttrs[dropTarget.id];
      const targetParentComponentTree = getComponentParent(
        editorTreeCopy.root,
        dropTarget.id,
      );
      const isParentContentWrapper =
        targetParentComponentTree?.id === "content-wrapper";
      const isDroppable =
        !isParentContentWrapper || dropTarget.edge === "center";
      const isMoving = !!activeComponentTree;
      if (!isMoving && droppedId && componentToAdd && isDroppable) {
        if (componentToAdd.name === "Grid") {
          handleGridComponentAddition(
            editorTreeCopy.root,
            dropTarget,
            targetComponent,
            componentToAdd,
          );
        } else {
          handleComponentAddition(
            editorTreeCopy.root,
            dropTarget,
            targetComponent,
            componentToAdd,
          );
        }
      } else if (dropTarget.id !== "root" && isDroppable) {
        if (activeComponent?.name === "Grid") {
          const isDopopingInVerticalAxis =
            dropTarget.edge === "top" || dropTarget.edge === "bottom";
          let useParentInstead = false;
          if (
            isMoving &&
            isDopopingInVerticalAxis &&
            targetComponent?.name === "GridColumn"
          ) {
            useParentInstead = true;
          }

          handleGridReorderingOrMoving(
            editorTreeCopy.root,
            droppedId,
            targetComponent,
            dropTarget,
            useParentInstead,
          );
        } else {
          handleReorderingOrMoving(
            editorTreeCopy.root,
            droppedId,
            targetComponent,
            dropTarget,
          );
        }
      } else if (isDroppable) {
        handleRootDrop(
          editorTreeCopy.root,
          droppedId,
          activeComponent,
          dropTarget,
        );
      }

      setEditorTree(editorTreeCopy);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      componentToAdd,
      editorTree,
      setEditorTree,
      handleComponentAddition,
      handleReorderingOrMoving,
      handleRootDrop,
      isResizing,
    ],
  );

  function handleGridComponentAddition(
    treeRoot: ComponentStructure,
    dropTarget: DropTarget,
    targetComponent: Component | null,
    componentToAdd: ComponentStructure,
  ) {
    const allowedParentTypes =
      componentMapper[componentToAdd.name].allowedParentTypes;

    if (allowedParentTypes?.includes(targetComponent?.name as string)) {
      const newSelectedId = addComponent(treeRoot, componentToAdd, dropTarget);
      setSelectedComponentIds(() => [newSelectedId]);
    } else {
      const targetParentTree = getComponentParent(treeRoot, dropTarget.id);
      const targetParent =
        useEditorStore.getState().componentMutableAttrs[targetParentTree?.id!];
      if (targetParent && allowedParentTypes?.includes(targetParent.name)) {
        const newSelectedId = addComponent(treeRoot, componentToAdd, {
          id: targetParent.id as string,
          edge: dropTarget.edge,
        });
        setSelectedComponentIds(() => [newSelectedId]);
      }
    }

    setComponentToAdd(undefined);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleComponentAddition(
    treeRoot: ComponentStructure,
    dropTarget: DropTarget,
    targetComponent: Component | null,
    componentToAdd: ComponentStructure,
  ) {
    const targetParent = getComponentParent(treeRoot, dropTarget.id);
    const isPopOver = componentToAdd.name === "PopOver";
    if (!targetComponent?.blockDroppingChildrenInside || isPopOver) {
      const newSelectedId = addComponent(treeRoot, componentToAdd, dropTarget);

      if (dropTarget.edge !== "center") {
        handleReorderingOrMoving(
          treeRoot,
          newSelectedId,
          targetComponent,
          dropTarget,
        );
      }

      setSelectedComponentIds(() => [newSelectedId]);
    } else {
      if (targetParent) {
        const dropTargetIndex = getComponentIndex(targetParent, dropTarget.id);

        const newSelectedId = addComponent(
          treeRoot,
          componentToAdd,
          {
            id: targetParent.id as string,
            edge: dropTarget.edge,
          },
          ["right", "bottom"].includes(dropTarget.edge)
            ? dropTargetIndex + 1
            : dropTargetIndex,
        );
        setSelectedComponentIds(() => [newSelectedId]);
      }
    }
    setComponentToAdd(undefined);
  }

  function handleGridReorderingOrMoving(
    treeRoot: ComponentStructure,
    droppedId: string,
    targetComponent: Component | null,
    dropTarget: DropTarget,
    useParentInstead?: boolean,
  ) {
    if (dropTarget.id === "root") {
      return;
    }

    const activeParent = getComponentParent(treeRoot, droppedId);
    const targetParent = getComponentParent(treeRoot, targetComponent?.id!);
    const p = getComponentParent(treeRoot, targetParent?.id!);

    const isSameParent = useParentInstead
      ? activeParent?.id === p?.id
      : activeParent?.id === targetParent?.id;

    if (isSameParent) {
      moveComponent(treeRoot, droppedId, dropTarget);
    } else {
      let newParentId = targetParent!.id;
      if (dropTarget.edge === "center") {
        newParentId = dropTarget.id;
      }
      moveComponentToDifferentParent(
        treeRoot,
        droppedId,
        dropTarget,
        newParentId as string,
      );
      removeComponentFromParent(
        treeRoot,
        droppedId,
        activeParent!.id as string,
      );
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleReorderingOrMoving(
    treeRoot: ComponentStructure,
    droppedId: string,
    targetComponent: Component | null,
    dropTarget: DropTarget,
  ) {
    if (dropTarget.id === "root") {
      return;
    }

    const activeParent = getComponentParent(treeRoot, droppedId);
    const targetParent = getComponentParent(treeRoot, dropTarget.id);
    if (
      targetComponent?.blockDroppingChildrenInside &&
      activeParent?.id === targetParent?.id
    ) {
      moveComponent(treeRoot, droppedId, dropTarget);
    } else {
      let newParentId = targetParent!.id;
      if (dropTarget.edge === "center") {
        newParentId = dropTarget.id;
      }
      moveComponentToDifferentParent(
        treeRoot,
        droppedId,
        dropTarget,
        newParentId as string,
      );
      removeComponentFromParent(
        treeRoot,
        droppedId,
        activeParent!.id as string,
      );
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleRootDrop(
    treeRoot: ComponentStructure,
    droppedId: string,
    activeComponent: Component | null,
    dropTarget: DropTarget,
  ) {
    removeComponent(treeRoot, droppedId);
    const newSelectedId = addComponent(treeRoot, activeComponent!, dropTarget);
    setSelectedComponentIds(() => [newSelectedId]);
  }
  return onDrop;
};
