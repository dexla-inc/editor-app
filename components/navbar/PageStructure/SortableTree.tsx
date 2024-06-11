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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { SortableTreeItem } from "@/components/navbar/PageStructure/components";
import type {
  FlattenedItem,
  SensorContext,
  TreeItem,
  TreeItems,
} from "@/components/navbar/PageStructure/types";
import {
  buildTree,
  flattenTree,
  getAllAncestors,
  getChildCount,
  getProjection,
  removeChildrenOf,
  setProperty,
} from "@/components/navbar/PageStructure/utilities";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeRootChildrenUpdate } from "@/utils/editor";
import { CSS } from "@dnd-kit/utilities";
import { usePrevious } from "@mantine/hooks";
import { useEditorTreeStore } from "../../../stores/editorTree";
import List from "rc-virtual-list";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { safeJsonParse } from "@/utils/common";

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
  const items = useEditorTreeStore((state) => {
    const { children } = state.tree.root;
    return children;
  });
  const selectedComponentId = useEditorTreeStore(selectedComponentIdSelector);
  const isStructureCollapsed = useEditorStore(
    (state) => state.isStructureCollapsed,
  );
  const setItems = useCallback((updateItems: any, save = true) => {
    debouncedTreeRootChildrenUpdate(updateItems, save);
  }, []);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const prevIsStructureCollapsed = usePrevious(isStructureCollapsed);

  const didStructureCollapedChange =
    prevIsStructureCollapsed !== isStructureCollapsed;

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items as TreeItems);
    let ancestors: FlattenedItem[] = [];
    if (selectedComponentId) {
      ancestors = getAllAncestors(flattenedTree, selectedComponentId);
    }

    if (didStructureCollapedChange && !isStructureCollapsed) {
      return flattenedTree;
    }

    if (didStructureCollapedChange && isStructureCollapsed) {
      const _flattenedTree = flattenedTree.map((item) => {
        return { ...item, collapsed: true };
      });

      const collapsedItems = _flattenedTree.map((item) => item.id);

      return removeChildrenOf(
        _flattenedTree,
        // @ts-ignore
        activeId ? [activeId, ...collapsedItems] : collapsedItems,
      );
    }

    // @ts-ignore
    const collapsedItems: string[] = flattenedTree
      .map((item) => {
        if (ancestors.find((a) => a.id === item.id)) {
          return { ...item, collapsed: true };
        }

        return item;
      })
      .reduce(
        // @ts-ignore
        (acc, { children, collapsed, id }: TreeItem) => {
          const isCollapsed = collapsed ?? true;
          if (isCollapsed && !ancestors.find((a) => a.id === id)) {
            return [...acc, id];
          }

          return acc;
        },
        [] as string[],
      );

    return removeChildrenOf(
      flattenedTree,
      // @ts-ignore
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    );
  }, [
    items,
    selectedComponentId,
    didStructureCollapedChange,
    isStructureCollapsed,
    activeId,
  ]);

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

  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });

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

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  function handleDragStart(e: DragStartEvent) {
    const {
      active: { id: activeId },
    } = e;
    setActiveId(activeId);
    setOverId(activeId);

    document.body.style?.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta, activatorEvent }: DragMoveEvent) {
    activatorEvent?.preventDefault();
    activatorEvent?.stopPropagation();
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over, activatorEvent }: DragOverEvent) {
    activatorEvent?.preventDefault();
    activatorEvent?.stopPropagation();
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = safeJsonParse(
        JSON.stringify(flattenTree(items as TreeItems)),
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
      const newItems = buildTree(sortedItems);

      setItems(newItems as any);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);

    document.body.style?.setProperty("cursor", "");
  }

  const handleCollapse = useCallback(
    (id: UniqueIdentifier) => {
      setItems(
        setProperty(items as TreeItems, id, "collapsed", (value) => {
          if (value === undefined) {
            return false;
          }
          return !value;
        }),
        false,
      );
    },
    [items, setItems],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (overId) {
        setItems(
          setProperty(items as TreeItems, overId, "collapsed", (value) => {
            return false;
          }),
          false,
        );
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [overId, handleCollapse, items, setItems]);

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
        <List data={flattenedItems} itemKey="id" itemHeight={30} height={790}>
          {(component) => {
            const isCollapsed = !!component?.collapsed;

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
                collapsed={Boolean(isCollapsed)}
                onCollapse={
                  (component.children ?? []).length
                    ? () => handleCollapse(component.id!)
                    : undefined
                }
              />
            );
          }}
        </List>

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
                childCount={getChildCount(items as TreeItems, activeId) + 1}
                indentationWidth={indentationWidth}
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
}
