import type { UniqueIdentifier } from "@dnd-kit/core";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

import { useEditorTreeStore } from "@/stores/editorTree";
import { TreeItem, Props as TreeItemProps } from "./TreeItem";

interface Props extends TreeItemProps {
  id: UniqueIdentifier;
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

export function SortableTreeItem({ id, depth, ...props }: Props) {
  //console.log("SortableTreeItem", id, depth);
  const component = useEditorTreeStore((state) => ({
    name: state.componentMutableAttrs[id].name,
    value: state.componentMutableAttrs[id].description?.toString(),
  }));

  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItem
      id={id}
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableInteraction={isSorting}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
      name={component.name}
      value={component.value}
    />
  );
}
