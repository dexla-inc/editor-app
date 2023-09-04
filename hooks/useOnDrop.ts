import { useEditorStore } from "@/stores/editor";
import {
  Component,
  DropTarget,
  addComponent,
  getComponentById,
  getComponentParent,
  moveComponent,
  moveComponentToDifferentParent,
  removeComponent,
  removeComponentFromParent,
  EditorTree,
  getComponentIndex,
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
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );

  const onDrop = useCallback(
    (_droppedId: string, dropTarget: DropTarget) => {
      let action = "";
      const droppedId = parseId(_droppedId ?? componentToAdd?.id);
      dropTarget.id = parseId(dropTarget.id);
      const copy = cloneDeep(editorTree);
      const activeComponent = getComponentById(copy.root, droppedId);
      const targetComponent = getComponentById(copy.root, dropTarget.id);
      if (droppedId && componentToAdd) {
        action = `Added ${componentToAdd.name}`;
        handleComponentAddition(
          copy,
          dropTarget,
          targetComponent,
          componentToAdd
        );
      } else if (dropTarget.id !== "root") {
        action = `Moved ${activeComponent?.name}`;
        handleReorderingOrMoving(copy, droppedId, targetComponent, dropTarget);
      } else {
        action = `Moved ${activeComponent?.name}`;
        handleRootDrop(copy, droppedId, activeComponent, dropTarget);
      }
      setEditorTree(copy, { action });
    },
    [
      componentToAdd,
      editorTree,
      setEditorTree,
      handleComponentAddition,
      handleReorderingOrMoving,
      handleRootDrop,
    ]
  );
  function handleComponentAddition(
    copy: EditorTree,
    dropTarget: DropTarget,
    targetComponent: Component | null,
    componentToAdd: Component
  ) {
    if (!targetComponent?.blockDroppingChildrenInside) {
      if (dropTarget.id === "root") {
        dropTarget = {
          ...dropTarget,
          id: "content-wrapper",
        };
      }
      const newSelectedId = addComponent(copy.root, componentToAdd, dropTarget);
      setSelectedComponentId(newSelectedId);
    } else {
      const targetParent = getComponentParent(copy.root, dropTarget.id);
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
            : dropTargetIndex
        );
        setSelectedComponentId(newSelectedId);
      }
    }
    setComponentToAdd(undefined);
  }
  function handleReorderingOrMoving(
    copy: EditorTree,
    droppedId: string,
    targetComponent: Component | null,
    dropTarget: DropTarget
  ) {
    const activeParent = getComponentParent(copy.root, droppedId);
    const targetParent = getComponentParent(copy.root, dropTarget.id);
    if (
      targetComponent?.blockDroppingChildrenInside &&
      activeParent?.id === targetParent?.id
    ) {
      moveComponent(copy.root, droppedId, dropTarget);
    } else {
      moveComponentToDifferentParent(
        copy.root,
        droppedId,
        dropTarget,
        targetParent!.id as string
      );
      removeComponentFromParent(
        copy.root,
        droppedId,
        activeParent!.id as string
      );
    }
  }
  function handleRootDrop(
    copy: EditorTree,
    droppedId: string,
    activeComponent: Component | null,
    dropTarget: DropTarget
  ) {
    removeComponent(copy.root, droppedId);
    const newSelectedId = addComponent(
      copy.root,
      activeComponent as unknown as Component,
      dropTarget
    );
    setSelectedComponentId(newSelectedId);
  }
  return onDrop;
};
