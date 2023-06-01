import { emptyEditorTree } from "@/stores/editor";
import { ClientRect, CollisionDescriptor, Active } from "@dnd-kit/core";
import { DroppableContainer, RectMap } from "@dnd-kit/core/dist/store";
import { Coordinates } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";
import crawl from "tree-crawl";

export type Component = {
  id?: string;
  columns: number;
  name: string;
  description: string;
  children?: Component[];
};

export type Row = {
  row: number;
  components: Component[];
};

export type EditorTree = {
  root: Component;
};

export type DropTarget = {
  id: string;
  edge: Edge;
  rect: ClientRect;
};

export const getEditorTreeFromInitialPageStructure = (tree: {
  rows: Row[];
}) => {
  const editorTree: EditorTree = {
    root: {
      ...emptyEditorTree.root,
      children: tree.rows.map((row: Row) => {
        return {
          id: nanoid(),
          name: "Container",
          columns: 12,
          description: "Container",
          children: row.components.map((c) => {
            return {
              ...c,
              id: nanoid(),
              children: [],
            };
          }),
        };
      }),
    },
  };

  return editorTree;
};

export const findComponentById = (
  treeRoot: Component,
  id: string
): Component | null => {
  let found: Component | null = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        found = node as Component;
        context.break();
      }
    },
    { order: "bfs" }
  );

  return found;
};

export const checkIfIsChild = (treeRoot: Component, childId: string) => {
  let isChild = false;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === childId) {
        isChild = true;
        context.break();
      }
    },
    { order: "bfs" }
  );

  return isChild;
};

export const removeComponent = (treeRoot: Component, id: string) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        context.parent?.children?.splice(context.index, 1);
        context.remove();
        context.break();
      }
    },
    { order: "bfs" }
  );
};

export const addComponent = (
  treeRoot: Component,
  componentToAdd: Component,
  dropTarget: DropTarget
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === dropTarget.id) {
        if (dropTarget.edge === "left") {
          componentToAdd.columns = Math.floor(
            componentToAdd.columns / ((node.children || [])?.length + 1)
          );
          node.children?.forEach((child) => {
            child.columns = Math.floor(
              child.columns / ((node.children || [])?.length + 1)
            );
          });
          node.children = [componentToAdd, ...(node.children || [])];
          context.break();
        } else if (dropTarget.edge === "right") {
          componentToAdd.columns = Math.floor(
            componentToAdd.columns / ((node.children || [])?.length + 1)
          );
          node.children?.forEach((child) => {
            child.columns = Math.floor(
              child.columns / ((node.children || [])?.length + 1)
            );
          });
          node.children = [...(node.children || []), componentToAdd];
          context.break();
        } else if (dropTarget.edge === "top") {
          node.children = [componentToAdd, ...(node.children || [])];
          context.break();
        } else if (dropTarget.edge === "bottom") {
          node.children = [...(node.children || []), componentToAdd];
          context.break();
        }
      }
    },
    { order: "bfs" }
  );
};

export function leftOfRectangle(
  rect: ClientRect,
  left = rect.left,
  top = rect.top
): Coordinates {
  return {
    x: left,
    y: top + rect.height * 0.5,
  };
}

export function rightOfRectangle(
  rect: ClientRect,
  right = rect.right,
  top = rect.top
): Coordinates {
  return {
    x: right,
    y: top + rect.height * 0.5,
  };
}

export function topOfRectangle(
  rect: ClientRect,
  left = rect.left,
  top = rect.top
): Coordinates {
  return {
    x: left + rect.width * 0.5,
    y: top,
  };
}

export function bottomOfRectangle(
  rect: ClientRect,
  left = rect.left,
  bottom = rect.bottom
): Coordinates {
  return {
    x: left + rect.width * 0.5,
    y: bottom,
  };
}

export function centerOfRectangle(
  rect: ClientRect,
  left = rect.left,
  top = rect.top
): Coordinates {
  return {
    x: left + rect.width * 0.5,
    y: top + rect.height * 0.5,
  };
}

export type Edge = "left" | "right" | "top" | "bottom";

export function distanceBetween(p1: Coordinates, p2: Coordinates) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function sortCollisionsAsc(
  { data: { value: a } }: CollisionDescriptor,
  { data: { value: b } }: CollisionDescriptor
) {
  return a - b;
}

export const getClosestEdge = (
  left: number,
  right: number,
  top: number,
  bottom: number
) => {
  const all = { left, right, top, bottom };
  const closest = Math.min(...Object.values(all));
  const closestKey = Object.keys(all).find((key: string) => {
    return all[key as Edge] === closest;
  });

  return { edge: closestKey, value: all[closestKey as Edge] };
};

export const closestEdge = (
  {
    active,
    collisionRect,
    droppableRects,
    droppableContainers,
  }: {
    active: Active;
    collisionRect: ClientRect;
    droppableRects: RectMap;
    droppableContainers: DroppableContainer[];
    pointerCoordinates: Coordinates | null;
  },
  editorTree: EditorTree
) => {
  const centerRect = centerOfRectangle(
    collisionRect,
    collisionRect.left,
    collisionRect.top
  );

  const collisions: CollisionDescriptor[] = [];
  const activeComponent = findComponentById(
    editorTree.root,
    active.id as string
  );

  for (const droppableContainer of droppableContainers) {
    const { id } = droppableContainer;
    const rect = droppableRects.get(id);
    const isChild = checkIfIsChild(activeComponent!, id as string);

    if (rect && !isChild) {
      const leftDist = distanceBetween(leftOfRectangle(rect), centerRect);
      const rigthDist = distanceBetween(rightOfRectangle(rect), centerRect);
      const topDist = distanceBetween(topOfRectangle(rect), centerRect);
      const bottomDist = distanceBetween(bottomOfRectangle(rect), centerRect);

      const { edge, value } = getClosestEdge(
        leftDist,
        rigthDist,
        topDist,
        bottomDist
      );

      collisions.push({
        id,
        data: { droppableContainer, value, edge, rect },
      });
    }
  }

  return collisions.sort(sortCollisionsAsc);
};
