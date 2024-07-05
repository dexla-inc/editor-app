import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { SortableTreeItem } from "@/components/navbar/PageStructure/components";
import type {
  FlattenedItem,
  TreeItems,
} from "@/components/navbar/PageStructure/types";
import {
  buildTree,
  flattenTree,
  getAllTreeIds,
  getProjection,
  updateCollapseState,
} from "@/components/navbar/PageStructure/utilities";
import { CSS } from "@dnd-kit/utilities";
import { useEditorTreeStore } from "@/stores/editorTree";
import List from "rc-virtual-list";
import { cloneObject } from "@/utils/common";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { useEditorStore } from "@/stores/editor";

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};

interface Props {
  indentationWidth?: number;
  indicator?: boolean;
}

export function NavbarLayersSection({
  indicator = false,
  indentationWidth = 10,
}: Props) {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const selectedComponentId = useEditorTreeStore(selectedComponentIdSelector);
  const editorTree = useEditorTreeStore((state) => state.tree.root);
  const isStructureCollapsed = useEditorStore(
    (state) => state.isStructureCollapsed,
  );
  const flattenedItems = flattenTree(editorTree.children as TreeItems, true);

  const [list, setList] = useState<FlattenedItem[]>([]);

  useEffect(() => {
    setList(flattenedItems);
  }, [flattenedItems]);

  useEffect(() => {
    const expandedIds = updateCollapseState(
      editorTree.children,
      selectedComponentId,
    );
    updateTreeComponentAttrs({
      componentIds: expandedIds.filter((id) => id !== selectedComponentId),
      // @ts-ignore
      attrs: { collapsed: false },
      save: false,
    });
  }, [selectedComponentId]);

  useEffect(() => {
    const allTreeIds = getAllTreeIds(editorTree);
    updateTreeComponentAttrs({
      componentIds: allTreeIds,
      // @ts-ignore
      attrs: { collapsed: isStructureCollapsed },
      save: false,
    });
  }, [isStructureCollapsed]);

  const setTree = useEditorTreeStore((state) => state.setTree);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const projected = activeId && overId ? getProjection(list, overId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const sortedIds = useMemo(() => list.map(({ id }) => id), [list]);

  const activeItem = activeId ? list.find(({ id }) => id === activeId) : null;

  function handleDragStart(e: DragStartEvent) {
    const {
      active: { id: activeId },
    } = e;
    setActiveId(activeId);
    setOverId(activeId);
  }

  function handleDragMove({ activatorEvent }: DragMoveEvent) {
    activatorEvent?.preventDefault();
    activatorEvent?.stopPropagation();
  }

  function handleDragOver({ over, activatorEvent }: DragOverEvent) {
    activatorEvent?.preventDefault();
    activatorEvent?.stopPropagation();
    setOverId(over?.id ?? null);

    if (activeId === over?.id) {
      document.body.style?.setProperty("cursor", "not-allowed");
    } else {
      document.body.style?.setProperty("cursor", "grabbing");
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { tree } = useEditorTreeStore.getState();
      const editorTreeCopy = cloneObject(tree);
      const { depth, parentId } = projected;
      // flattenedItems is just representative, where we really want to move items is the actual tree with uncollapsed items
      const clonedItems: FlattenedItem[] = flattenTree(
        editorTreeCopy.root.children as TreeItems,
        false,
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = {
        ...activeTreeItem,
        depth,
        parentId: parentId!,
      };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      editorTreeCopy.root.children = buildTree(sortedItems);
      setTree(editorTreeCopy, { action: "children change" });
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);

    document.body.style?.setProperty("cursor", "");
  }

  const handleCollapse = async (id: string) => {
    const { componentMutableAttrs } = useEditorTreeStore.getState();

    // @ts-ignore
    const collapsed = componentMutableAttrs[id]?.collapsed;
    const updatedCollapse = !(collapsed === true || collapsed === undefined);

    await updateTreeComponentAttrs({
      componentIds: [id],
      attrs: {
        // @ts-ignore
        collapsed: updatedCollapse,
      },
      save: false,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (overId) {
        await handleCollapse(overId as string);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [overId]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={sortedIds as string[]}
        strategy={verticalListSortingStrategy}
      >
        <List data={list} itemKey="id" itemHeight={30} height={790}>
          {(component) => {
            const isCollapsed =
              component?.collapsed === true ||
              component?.collapsed === undefined;

            return (
              <SortableTreeItem
                component={component}
                key={component.id}
                id={component.id!}
                depth={
                  component.id === activeId && projected
                    ? projected.depth
                    : component.depth
                }
                indentationWidth={indentationWidth}
                indicator={indicator}
                collapsed={isCollapsed}
                onCollapse={
                  (component.children ?? []).length
                    ? () => handleCollapse(component.id!)
                    : undefined
                }
              />
            );
          }}
        </List>
      </SortableContext>
      {createPortal(
        <DragOverlay
          dropAnimation={dropAnimationConfig}
          modifiers={indicator ? [adjustTranslate] : undefined}
        >
          {activeId && activeItem ? (
            <SortableTreeItem
              component={activeItem}
              id={activeId}
              depth={activeItem.depth}
              clone
              indentationWidth={indentationWidth}
            />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
