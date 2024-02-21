import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import {
  Component,
  DropTarget,
  EditorTree,
  addComponent,
  getComponentById,
  getComponentIndex,
  getComponentParent,
  moveComponent,
  moveComponentToDifferentParent,
  removeComponent,
  removeComponentFromParent,
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
      const copy = cloneDeep(editorTree);
      const activeComponent = getComponentById(copy.root, droppedId);
      let targetComponent = getComponentById(copy.root, dropTarget.id);
      const targetParentComponent = getComponentParent(
        copy.root,
        dropTarget.id,
      );
      const isParentContentWrapper =
        targetParentComponent?.id === "content-wrapper";
      const isDroppable =
        !isParentContentWrapper || dropTarget.edge === "center";
      const isMoving = !!activeComponent;

      if (!isMoving && droppedId && componentToAdd && isDroppable) {
        if (componentToAdd.name === "Grid") {
          handleGridComponentAddition(
            copy.root,
            dropTarget,
            targetComponent,
            componentToAdd,
          );
        } else {
          handleComponentAddition(
            copy,
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
            copy.root,
            droppedId,
            targetComponent,
            dropTarget,
            useParentInstead,
          );
        } else {
          handleReorderingOrMoving(
            copy,
            droppedId,
            targetComponent,
            dropTarget,
          );
        }
      } else if (isDroppable) {
        handleRootDrop(copy, droppedId, activeComponent, dropTarget);
      }

      setEditorTree(copy);
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
    copy: Component,
    dropTarget: DropTarget,
    targetComponent: Component | null,
    componentToAdd: Component,
  ) {
    const allowedParentTypes =
      componentMapper[componentToAdd.name].allowedParentTypes;

    if (allowedParentTypes?.includes(targetComponent?.name as string)) {
      const newSelectedId = addComponent(copy, componentToAdd, dropTarget);
      setSelectedComponentIds(() => [newSelectedId]);
    } else {
      const targetParent = getComponentParent(copy, dropTarget.id);
      if (targetParent && allowedParentTypes?.includes(targetParent.name)) {
        const newSelectedId = addComponent(copy, componentToAdd, {
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
    copy: EditorTree,
    dropTarget: DropTarget,
    targetComponent: Component | null,
    componentToAdd: Component,
  ) {
    const targetParent = getComponentParent(copy.root, dropTarget.id);
    const isPopOver = componentToAdd.name === "PopOver";
    if (!targetComponent?.blockDroppingChildrenInside || isPopOver) {
      const newSelectedId = addComponent(copy.root, componentToAdd, dropTarget);

      if (dropTarget.edge !== "center") {
        handleReorderingOrMoving(
          copy,
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
          copy.root,
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
    copy: Component,
    droppedId: string,
    targetComponent: Component | null,
    dropTarget: DropTarget,
    useParentInstead?: boolean,
  ) {
    if (dropTarget.id === "root") {
      return;
    }

    const activeParent = getComponentParent(copy, droppedId);
    const targetParent = getComponentParent(copy, targetComponent?.id!);
    const p = getComponentParent(copy, targetParent?.id!);

    const isSameParent = useParentInstead
      ? activeParent?.id === p?.id
      : activeParent?.id === targetParent?.id;

    if (isSameParent) {
      moveComponent(copy, droppedId, dropTarget);
    } else {
      let newParentId = targetParent!.id;
      if (dropTarget.edge === "center") {
        newParentId = dropTarget.id;
      }
      moveComponentToDifferentParent(
        copy,
        droppedId,
        dropTarget,
        newParentId as string,
      );
      removeComponentFromParent(copy, droppedId, activeParent!.id as string);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleReorderingOrMoving(
    copy: EditorTree,
    droppedId: string,
    targetComponent: Component | null,
    dropTarget: DropTarget,
  ) {
    if (dropTarget.id === "root") {
      return;
    }

    const activeParent = getComponentParent(copy.root, droppedId);
    const targetParent = getComponentParent(copy.root, dropTarget.id);
    if (
      targetComponent?.blockDroppingChildrenInside &&
      activeParent?.id === targetParent?.id
    ) {
      moveComponent(copy.root, droppedId, dropTarget);
    } else {
      let newParentId = targetParent!.id;
      if (dropTarget.edge === "center") {
        newParentId = dropTarget.id;
      }
      moveComponentToDifferentParent(
        copy.root,
        droppedId,
        dropTarget,
        newParentId as string,
      );
      removeComponentFromParent(
        copy.root,
        droppedId,
        activeParent!.id as string,
      );
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleRootDrop(
    copy: EditorTree,
    droppedId: string,
    activeComponent: Component | null,
    dropTarget: DropTarget,
  ) {
    removeComponent(copy.root, droppedId);
    const newSelectedId = addComponent(
      copy.root,
      activeComponent as unknown as Component,
      dropTarget,
    );
    setSelectedComponentIds(() => [newSelectedId]);
  }
  return onDrop;
};
