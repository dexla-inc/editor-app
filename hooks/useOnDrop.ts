import { useEditorStore } from "@/stores/editor";
import {
  DropTarget,
  getComponentById,
  addComponent,
  getComponentParent,
  moveComponentToDifferentParent,
  removeComponentFromParent,
  moveComponent,
  removeComponent,
  Component,
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
      const droppedId = parseId(_droppedId);
      dropTarget.id = parseId(dropTarget.id);
      const copy = cloneDeep(editorTree);
      const activeComponent = getComponentById(copy.root, droppedId);

      if (droppedId && componentToAdd) {
        const newSelectedId = addComponent(
          copy.root,
          componentToAdd,
          dropTarget
        );
        setSelectedComponentId(newSelectedId);
        setComponentToAdd(undefined);
      } else if (dropTarget.id !== "root") {
        const activeParent = getComponentParent(copy.root, droppedId);
        const targetParent = getComponentParent(copy.root, dropTarget.id);
        const targetComponent = getComponentById(copy.root, dropTarget.id);

        if (targetComponent?.props?.blockDroppingChildrenInside) {
          // reorder
          moveComponent(copy.root, droppedId, dropTarget);
        } else {
          // move to a new parent
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
      } else {
        removeComponent(copy.root, droppedId);
        const newSelectedId = addComponent(
          copy.root,
          activeComponent as unknown as Component,
          dropTarget
        );

        setSelectedComponentId(newSelectedId);
      }

      setEditorTree(copy);
    },
    [
      componentToAdd,
      editorTree,
      setComponentToAdd,
      setEditorTree,
      setSelectedComponentId,
    ]
  );

  return onDrop;
};
