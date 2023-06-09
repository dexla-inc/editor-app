import { emptyEditorTree } from "@/stores/editor";
import { ClientRect, CollisionDescriptor, Active } from "@dnd-kit/core";
import { DroppableContainer, RectMap } from "@dnd-kit/core/dist/store";
import { Coordinates } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";
import crawl from "tree-crawl";
import { structureMapper } from "@/utils/componentMapper";

export type Component = {
  id?: string;
  name: string;
  description: string;
  children?: Component[];
  props?: { [key: string]: any };
  blockDroppingChildrenInside?: boolean;
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

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );

  return newArray;
}

export const replaceIdsDeeply = (treeRoot: Component) => {
  crawl(
    treeRoot,
    (node) => {
      node.id = nanoid();
      node.children?.forEach((c) => replaceIdsDeeply(c));
    },
    { order: "bfs" }
  );
};

export const getEditorTreeFromPageStructure = (tree: { rows: Row[] }) => {
  const editorTree: EditorTree = {
    root: {
      ...emptyEditorTree.root,
      children: tree.rows.map((row: Row) => {
        return {
          id: nanoid(),
          name: "Container",
          description: "Container",
          props: {
            style: {
              width: "100%",
            },
          },
          children: row.components.map((c) => {
            const component = structureMapper[c.name];
            return component.structure(c);
          }),
        };
      }),
    },
  };

  return editorTree;
};

export const getComponentById = (
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

export const updateTreeComponent = (
  treeRoot: Component,
  id: string,
  props: any
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        node.props = {
          ...node.props,
          ...props,
          style: {
            ...(node.props?.style || {}),
            ...(props.style || {}),
          },
        };
        context.break();
      }
    },
    { order: "bfs" }
  );
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

export const moveComponentToDifferentParent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget,
  newParentId: string
) => {
  const componentToAdd = getComponentById(treeRoot, id) as Component;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === newParentId) {
        if (dropTarget.edge === "left" || dropTarget.edge === "top") {
          const dropIndex = node.children?.findIndex(
            (c) => c.id === dropTarget.id
          );
          node.children?.splice(
            Math.max((dropIndex || 0) - 1, 0),
            0,
            componentToAdd
          );
        } else if (
          dropTarget.edge === "right" ||
          dropTarget.edge === "bottom"
        ) {
          const dropIndex = node.children?.findIndex(
            (c) => c.id === dropTarget.id
          );
          node.children?.splice(
            Math.min((dropIndex || 0) + 1, node.children.length),
            0,
            componentToAdd
          );
        }

        context.break();
      }
    },
    { order: "bfs" }
  );
};

export const moveComponent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        const parent = context.parent;
        const items = (parent?.children?.map((c) => c.id) ?? []) as string[];
        const oldIndex = items.indexOf(id);
        let newIndex = items.indexOf(dropTarget.id);

        if (dropTarget.edge === "left" || dropTarget.edge === "top") {
          newIndex = Math.max(newIndex - 1, 0);
        } else if (
          dropTarget.edge === "right" ||
          dropTarget.edge === "bottom"
        ) {
          newIndex = Math.min(newIndex + 1, items.length);
        }

        if (oldIndex !== newIndex) {
          const newPositions = arrayMove(items, oldIndex, newIndex);
          parent!.children = parent?.children?.sort((a, b) => {
            const aIndex = newPositions.indexOf(a.id as string);
            const bIndex = newPositions.indexOf(b.id as string);
            return aIndex - bIndex;
          });
        }

        context.break();
      }
    },
    { order: "bfs" }
  );
};

export const getComponentParent = (
  treeRoot: Component,
  id: string
): Component | null => {
  let parent: Component | null = null;
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        parent = context.parent;
        context.break();
      }
    },
    { order: "bfs" }
  );

  return parent;
};

export const removeComponentFromParent = (
  treeRoot: Component,
  id: string,
  parentId: string
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id && context.parent?.id === parentId) {
        context.parent?.children?.splice(context.index, 1);
        context.remove();
        context.break();
      }
    },
    { order: "bfs" }
  );
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
        if (dropTarget.edge === "left" || dropTarget.edge === "top") {
          node.children = [componentToAdd, ...(node.children || [])];
        } else if (
          dropTarget.edge === "right" ||
          dropTarget.edge === "bottom"
        ) {
          node.children = [...(node.children || []), componentToAdd];
        }

        context.break();
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
  const activeRect = centerOfRectangle(
    collisionRect,
    collisionRect.left,
    collisionRect.top
  );

  const collisions: CollisionDescriptor[] = [];
  const activeComponent = getComponentById(
    editorTree.root,
    active.id as string
  );

  const filtered = droppableContainers.filter((dc) => {
    const c = getComponentById(editorTree.root, dc.id as string);

    return !c?.blockDroppingChildrenInside;
  });

  for (const droppableContainer of filtered) {
    const { id } = droppableContainer;
    const rect = droppableRects.get(id);
    const isChild = activeComponent
      ? checkIfIsChild(activeComponent!, id as string)
      : false;

    if (rect && !isChild) {
      const leftDist = distanceBetween(leftOfRectangle(rect), activeRect);
      const rigthDist = distanceBetween(rightOfRectangle(rect), activeRect);
      const topDist = distanceBetween(topOfRectangle(rect), activeRect);
      const bottomDist = distanceBetween(bottomOfRectangle(rect), activeRect);

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
