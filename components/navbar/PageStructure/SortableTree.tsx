import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MeasuringStrategy,
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
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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
  getAllIdsToBeExpanded,
} from "@/components/navbar/PageStructure/utilities";
import { CSS } from "@dnd-kit/utilities";
import { useEditorTreeStore } from "@/stores/editorTree";
import List, { ListRef } from "rc-virtual-list";
import { cloneObject } from "@/utils/common";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { useEditorStore } from "@/stores/editor";
import { useShallow } from "zustand/react/shallow";

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

interface Props {
  indentationWidth?: number;
}

export function NavbarLayersSection({ indentationWidth = 15 }: Props) {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const setTree = useEditorTreeStore((state) => state.setTree);
  const selectedComponentId = useEditorTreeStore(selectedComponentIdSelector);
  const editorTree = useEditorTreeStore((state) => state.tree.root);
  const isStructureCollapsed = useEditorStore(
    (state) => state.isStructureCollapsed,
  );
  const flattenedItems = useEditorTreeStore(
    useShallow((state) => {
      return flattenTree(
        state.tree.root.children as TreeItems,
        state.componentMutableAttrs,
        true,
      );
    }),
  );
  const listRef = useRef<ListRef>(null);
  const [scrollIndex, setScrollIndex] = useState<number>();
  const [, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const navbarSectionHeight = useEditorStore(
    (state) => state.navbarSectionHeight,
  );

  useEffect(() => {
    const expandedIds = getAllIdsToBeExpanded(
      editorTree.children,
      selectedComponentId,
    );

    startTransition(() => {
      updateTreeComponentAttrs({
        componentIds: expandedIds.filter((id) => id !== selectedComponentId),
        // @ts-ignore
        attrs: { collapsed: false },
        save: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  // useEffect(() => {
  //   const newScrollIndex = flattenedItems.findIndex(
  //     (component) => component.id === selectedComponentId,
  //   );
  //   if (scrollIndex !== newScrollIndex) {
  //     setTimeout(() => {
  //       setScrollIndex(newScrollIndex);
  //     }, 100);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [flattenedItems]);

  useEffect(() => {
    if (listRef && scrollIndex !== undefined) {
      listRef.current?.scrollTo({
        index: scrollIndex,
        align: "auto",
      });
    }
  }, [scrollIndex]);

  useEffect(() => {
    const allTreeIds = getAllTreeIds(editorTree);
    updateTreeComponentAttrs({
      componentIds: allTreeIds,
      // @ts-ignore
      attrs: { collapsed: isStructureCollapsed },
      save: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStructureCollapsed]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  );

  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;
  const overItem = activeId
    ? flattenedItems.find(({ id }) => id === overId)
    : null;

  function handleDragStart(e: DragStartEvent) {
    const {
      active: { id: activeId },
    } = e;
    setActiveId(activeId);
    setOverId(activeId);
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
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
      const { tree, componentMutableAttrs } = useEditorTreeStore.getState();
      const editorTreeCopy = cloneObject(tree);
      const { depth, parentId } = projected;
      // flattenedItems is just representative, where we really want to move items is the actual tree with uncollapsed items
      const clonedItems: FlattenedItem[] = flattenTree(
        editorTreeCopy.root.children as TreeItems,
        componentMutableAttrs,
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
    setOffsetLeft(0);
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
      if (overId && !overItem?.blockDroppingChildrenInside) {
        updateTreeComponentAttrs({
          componentIds: [overId as string],
          attrs: {
            // @ts-ignore
            collapsed: false,
          },
          save: false,
        });
      }
    }, 700);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overId]);

  const hightlightId = !overItem?.blockDroppingChildrenInside
    ? overItem?.id
    : overItem?.parentId;

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
        <List
          data={flattenedItems}
          itemKey="id"
          itemHeight={22}
          height={navbarSectionHeight}
          ref={listRef}
        >
          {(component) => {
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
                onCollapse={
                  (component.children ?? []).length
                    ? () => handleCollapse(component.id!)
                    : undefined
                }
                highlightId={hightlightId as string}
              />
            );
          }}
        </List>
      </SortableContext>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimationConfig}>
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
