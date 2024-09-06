import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import {
  Component,
  ComponentStructure,
  DropTarget,
  EditorTreeCopy,
  getComponentParent,
  moveComponent,
  moveComponentToDifferentParent,
  removeComponentFromParent,
  addComponent2,
  moveComponent2,
} from "@/utils/editor";
import set from "lodash.set";
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
  const setComponentToAdd = useEditorStore((state) => state.setComponentToAdd);

  const onDrop = useCallback(
    (
      _droppedId: string,
      dropTarget: DropTarget,
      position: { gridColumn: string; gridRow: string },
    ) => {
      const { tree: editorTree, setTree: setEditorTree } =
        useEditorTreeStore.getState();
      const { componentToAdd } = useEditorStore.getState();
      const selectedComponentId = selectedComponentIdSelector(
        useEditorTreeStore.getState(),
      );
      const { componentMutableAttrs, updateTreeComponentAttrs } =
        useEditorTreeStore.getState();
      const selectedComponent = componentMutableAttrs[selectedComponentId!];
      const component = componentToAdd ?? selectedComponent;

      // Position updated
      set(component.props ?? {}, "style", {
        ...(component.props?.style ?? {}),
        ...position,
      });
      // console.log("pos=>", component.props);

      if (componentToAdd) {
        addComponent2(
          editorTree.root as ComponentStructure,
          component,
          dropTarget,
        );
        // console.log("onDrop", editorTree, componentToAdd, dropTarget);
        setComponentToAdd(undefined);
        setEditorTree(editorTree as EditorTreeCopy);
      } else {
        // const activeComponent = useEditorTreeStore.getState().componentMutableAttrs[_droppedId];
        // const activeComponentTree = getComponentTreeById(
        //   editorTree.root,
        //   activeComponent.id!,
        // );

        moveComponent2(
          editorTree.root as ComponentStructure,
          component.id!,
          dropTarget,
        );
        setEditorTree(editorTree as EditorTreeCopy);
        updateTreeComponentAttrs({
          componentIds: [component.id!],
          attrs: {
            props: {
              ...component.props,
              style: component.props?.style,
            },
          },
        });
      }
      // const droppedId = parseId(_droppedId ?? componentToAdd?.id);
      // const activeComponent = componentToAdd
      //   ? componentToAdd
      //   : useEditorTreeStore.getState().componentMutableAttrs[_droppedId];
      // dropTarget.id = parseId(dropTarget.id);
      // const activeComponentTree = getComponentTreeById(
      //   editorTree.root,
      //   activeComponent.id!,
      // );
      //
      // let targetComponent =
      //   useEditorTreeStore.getState().componentMutableAttrs[dropTarget.id];
      // const targetParentComponentTree = getComponentParent(
      //   editorTree.root as ComponentStructure,
      //   dropTarget.id,
      // );
      // const isParentContentWrapper =
      //   targetParentComponentTree?.id === "content-wrapper";
      // const isDroppable =
      //   !isParentContentWrapper || dropTarget.edge === "center";
      // const isMoving = !!activeComponentTree;
      // if (!isMoving && activeComponent.id && componentToAdd && isDroppable) {
      //   if (componentToAdd.name === "Grid") {
      //     handleGridComponentAddition(
      //       editorTree.root as ComponentStructure,
      //       dropTarget,
      //       targetComponent,
      //       componentToAdd,
      //     );
      //   } else {
      //     handleComponentAddition(
      //       editorTree.root as ComponentStructure,
      //       dropTarget,
      //       targetComponent,
      //       componentToAdd,
      //     );
      //   }
      // } else if (dropTarget.id !== "root" && isDroppable) {
      //   if (activeComponent?.name === "Grid") {
      //     const isDopopingInVerticalAxis =
      //       dropTarget.edge === "top" || dropTarget.edge === "bottom";
      //     let useParentInstead = false;
      //     if (
      //       isMoving &&
      //       isDopopingInVerticalAxis &&
      //       targetComponent?.name === "GridColumn"
      //     ) {
      //       useParentInstead = true;
      //     }
      //
      //     handleGridReorderingOrMoving(
      //       editorTree.root as ComponentStructure,
      //       activeComponent,
      //       targetComponent,
      //       dropTarget,
      //       useParentInstead,
      //     );
      //   } else {
      //     handleReorderingOrMoving(
      //       editorTree.root as ComponentStructure,
      //       activeComponent,
      //       targetComponent,
      //       dropTarget,
      //     );
      //   }
      // } else if (isDroppable) {
      //   handleRootDrop(
      //     editorTree.root as ComponentStructure,
      //     activeComponent,
      //     dropTarget,
      //   );
      // }
      //
      // setEditorTree(editorTree as EditorTreeCopy);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleComponentAddition, handleReorderingOrMoving],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleComponentAddition(
    treeRoot: ComponentStructure,
    dropTarget: DropTarget,
    targetComponent: Component | null,
    componentToAdd: ComponentStructure,
  ) {
    console.log(dropTarget, targetComponent, componentToAdd);
    // const targetParent = getComponentParent(treeRoot, dropTarget.id);
    // // const isPopOver = componentToAdd.name === "PopOver";
    // if (!targetComponent?.blockDroppingChildrenInside) {
    //   addComponent(treeRoot, componentToAdd, dropTarget);
    //
    //   if (dropTarget.edge !== "center") {
    //     handleReorderingOrMoving(
    //       treeRoot,
    //       componentToAdd,
    //       targetComponent,
    //       dropTarget,
    //     );
    //   }
    //
    //   setSelectedComponentIds(() => [componentToAdd.id!]);
    // } else {
    //   if (targetParent) {
    //     const dropTargetIndex = getComponentIndex(targetParent, dropTarget.id);
    //
    //     const newSelectedId = addComponent(
    //       treeRoot,
    //       componentToAdd,
    //       {
    //         id: targetParent.id as string,
    //         edge: dropTarget.edge,
    //       },
    //       ["right", "bottom"].includes(dropTarget.edge)
    //         ? dropTargetIndex + 1
    //         : dropTargetIndex,
    //     );
    //     setSelectedComponentIds(() => [newSelectedId]);
    //   }
    // }
    // setComponentToAdd(undefined);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleReorderingOrMoving(
    treeRoot: ComponentStructure,
    componentToAdd: ComponentStructure,
    targetComponent: Component | null,
    dropTarget: DropTarget,
  ) {
    if (dropTarget.id === "root") {
      return;
    }

    const activeParent = getComponentParent(treeRoot, componentToAdd.id!);
    const targetParent = getComponentParent(treeRoot, dropTarget.id);
    if (
      targetComponent?.blockDroppingChildrenInside &&
      activeParent?.id === targetParent?.id
    ) {
      moveComponent(treeRoot, componentToAdd, dropTarget);
    } else {
      let newParentId = targetParent!.id;
      if (dropTarget.edge === "center") {
        newParentId = dropTarget.id;
      }
      moveComponentToDifferentParent(
        treeRoot,
        componentToAdd,
        dropTarget,
        newParentId as string,
      );
      removeComponentFromParent(
        treeRoot,
        componentToAdd,
        activeParent!.id as string,
      );
    }
  }
  return onDrop;
};
