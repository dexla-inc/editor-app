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
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { SortableTreeItem } from "@/components/navbar/PageStructure/components";
import type {
  FlattenedItem,
  SensorContext,
  TreeItems,
} from "@/components/navbar/PageStructure/types";
import {
  buildTree,
  flattenTree,
  getProjection,
} from "@/components/navbar/PageStructure/utilities";
import { CSS } from "@dnd-kit/utilities";
import { useEditorTreeStore } from "@/stores/editorTree";
import List from "rc-virtual-list";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { cloneObject } from "@/utils/common";

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
  const flattenedItems = useEditorTreeStore((state) => {
    const { children } = state.tree.root;
    const result = flattenTree(
      children as TreeItems,
      state.componentMutableAttrs,
      true,
    );

    return result;
  });

  const selectedComponentId = useEditorTreeStore(selectedComponentIdSelector);
  // const isStructureCollapsed = useEditorStore(
  //   (state) => state.isStructureCollapsed,
  // );
  const setItems = useEditorTreeStore((state) => state.setTree);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const projected =
    activeId && overId ? getProjection(flattenedItems, overId) : null;

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
      const editorTree = cloneObject(tree);
      const { depth, parentId } = projected;
      // flattenedItems is just representative, where we really want to move items is the actual tree with uncollapsed items
      const clonedItems: FlattenedItem[] = flattenTree(
        editorTree.root.children as TreeItems,
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
      editorTree.root.children = buildTree(sortedItems);
      setItems(editorTree, { action: "children change" });
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

  const handleCollapse = async (id: string) => {
    const { componentMutableAttrs, updateTreeComponentAttrs } =
      useEditorTreeStore.getState();

    // @ts-ignore
    const collapsed = componentMutableAttrs[id]?.collapsed;
    const updatedCollapse = !(collapsed === true || collapsed === undefined);

    await updateTreeComponentAttrs({
      componentIds: [id],
      // @ts-ignore
      attrs: { collapsed: updatedCollapse },
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
        <List data={flattenedItems} itemKey="id" itemHeight={30} height={790}>
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
      </SortableContext>
    </DndContext>
  );
}
