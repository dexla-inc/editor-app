import type { UniqueIdentifier } from "@dnd-kit/core";
import type { FlattenedItem, TreeItem, TreeItems } from "./types";
import { ComponentStructure } from "@/utils/editor";
import { useEditorTreeStore } from "@/stores/editorTree";

export function getProjection(
  items: FlattenedItem[],
  overId: UniqueIdentifier,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const overItem = items[overItemIndex];
  return {
    depth: overItem.depth,
    parentId: overItem.parentId,
  };
}

export function updateCollapseState(
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

  for (let component of componentTree) {
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
  skipChildren: boolean,
): FlattenedItem[] {
  const componentMutableAttrs =
    useEditorTreeStore.getState().componentMutableAttrs;
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
