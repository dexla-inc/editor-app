import type { UniqueIdentifier } from "@dnd-kit/core";
import type { FlattenedItem, TreeItem, TreeItems } from "./types";
import { ComponentStructure } from "@/utils/editor";
import crawl from "tree-crawl";
import { arrayMove } from "@dnd-kit/sortable";

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = (activeItem?.depth ?? 0) + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
  if (previousItem) {
    if (previousItem.blockDroppingChildrenInside) {
      return previousItem.depth;
    }
    return previousItem.depth + 1;
  }

  return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

export const getAllTreeIds = (treeRoot: TreeItem) => {
  const componentIds: string[] = [];
  crawl(
    treeRoot,
    (node, context) => {
      componentIds.push(node.id!);
    },
    { order: "bfs" },
  );

  return componentIds;
};

export function getAllIdsToBeExpanded(
  componentTree: any,
  selectedComponentId: any,
) {
  let updatedIds: any[] = [];

  function traverseAndExpand(component: any, selectedComponentId: any) {
    if (component.id === selectedComponentId) {
      updatedIds.push(component.id);
      return true; // Found the selected component
    }

    if (component.children) {
      for (let child of component.children) {
        if (traverseAndExpand(child, selectedComponentId)) {
          updatedIds.push(component.id);
          return true; // Continue to propagate up
        }
      }
    }

    return false; // Selected component not found in this subtree
  }

  for (let component of componentTree ?? []) {
    traverseAndExpand(component, selectedComponentId);
  }

  return updatedIds;
}

function flatten(
  items: TreeItems,
  componentMutableAttrs: any,
  skipChildren: boolean,
  parentId: UniqueIdentifier | null = null,
  depth = 0,
): FlattenedItem[] {
  return (items ?? []).reduce<FlattenedItem[]>((acc, item, index) => {
    if (item.id! in componentMutableAttrs) {
      item.collapsed = componentMutableAttrs[item.id!].collapsed;
    }

    const isCollapsed =
      item?.collapsed === true || item?.collapsed === undefined;

    if (isCollapsed && skipChildren) {
      return [...acc, { ...item, parentId, depth, index }];
    }

    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(
        item.children ?? [],
        componentMutableAttrs,
        skipChildren,
        item.id,
        depth + 1,
      ),
    ];
  }, []);
}

export function flattenTree(
  items: TreeItems,
  componentMutableAttrs: any,
  skipChildren: boolean,
): FlattenedItem[] {
  return flatten(items, componentMutableAttrs, skipChildren);
}

export function buildTree(
  flattenedItems: FlattenedItem[],
): ComponentStructure[] {
  const root: TreeItem = { id: "root", children: [], name: "Container" };
  const nodes: Record<string, TreeItem> = { [root.id as string]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children } = item;
    if (id === undefined) {
      continue;
    }
    const parentId = item.parentId ?? root.id ?? "content-wrapper";
    const parent = nodes[parentId] ?? findItem(items, parentId);

    // @ts-ignore
    nodes[id] = { id, children };
    parent.children?.push(item);
  }

  return root.children as ComponentStructure[];
}

export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId);
}
