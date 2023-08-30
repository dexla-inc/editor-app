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
      const droppedId = parseId(_droppedId ?? componentToAdd?.id);
      dropTarget.id = parseId(dropTarget.id);
      const copy = cloneDeep(editorTree);
      const activeComponent = getComponentById(copy.root, droppedId);
      const targetComponent = getComponentById(copy.root, dropTarget.id);
      if (droppedId && componentToAdd) {
        handleComponentAddition(
          copy,
          dropTarget,
          targetComponent,
          componentToAdd
        );
      } else if (dropTarget.id !== "root") {
        handleReorderingOrMoving(copy, droppedId, targetComponent, dropTarget);
      } else {
        handleRootDrop(copy, droppedId, activeComponent, dropTarget);
      }
      setEditorTree(copy);
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
    copy: any,
    dropTarget: any,
    targetComponent: any,
    componentToAdd: any
  ) {
    if (!targetComponent?.blockDroppingChildrenInside) {
      const newSelectedId = addComponent(copy.root, componentToAdd, dropTarget);
      setSelectedComponentId(newSelectedId);
      setComponentToAdd(undefined);
    } else {
      const targetParent = getComponentParent(copy.root, dropTarget.id);
      if (targetParent) {
        const newSelectedId = addComponent(copy.root, componentToAdd, {
          id: targetParent.id as string,
          edge: "bottom",
        });
        setSelectedComponentId(newSelectedId);
      }
    }
  }
  function handleReorderingOrMoving(
    copy: any,
    droppedId: any,
    targetComponent: any,
    dropTarget: any
  ) {
    const activeParent = getComponentParent(copy.root, droppedId);
    const targetParent = getComponentParent(copy.root, dropTarget.id);
    if (targetComponent?.blockDroppingChildrenInside) {
      console.log("droppedId", getComponentById(copy.root, droppedId));
      console.log("dropTarget", getComponentById(copy.root, dropTarget.id), {
        dropTarget,
      });
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
    copy: any,
    droppedId: any,
    activeComponent: any,
    dropTarget: any
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
