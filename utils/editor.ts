import { emptyEditorTree } from "@/stores/editor";
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
  const _componentToAdd = getComponentById(treeRoot, id) as Component;
  const componentToAdd = { ..._componentToAdd };
  replaceIdsDeeply(componentToAdd);

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
): string => {
  const copy = { ...componentToAdd };
  replaceIdsDeeply(copy);

  crawl(
    treeRoot,
    (node, context) => {
      if (copy.props?.fixedPosition && node.id === "root") {
        if (
          copy.props?.fixedPosition === "left" ||
          copy.props?.fixedPosition === "top"
        ) {
          node.children = [copy, ...(node.children || [])];
        } else if (
          copy.props?.fixedPosition === "right" ||
          copy.props?.fixedPosition === "bottom"
        ) {
          node.children = [...(node.children || []), copy];
        }

        context.break();
      } else {
        if (node.id === dropTarget.id) {
          if (dropTarget.edge === "left" || dropTarget.edge === "top") {
            node.children = [copy, ...(node.children || [])];
          } else if (
            dropTarget.edge === "right" ||
            dropTarget.edge === "bottom"
          ) {
            node.children = [...(node.children || []), copy];
          }

          context.break();
        }
      }
    },
    { order: "bfs" }
  );

  return copy.id as string;
};

export type ComponentRect = {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  x: number;
  y: number;
};

export function leftOfRectangle(
  rect: DOMRect,
  left = rect.left,
  top = rect.top
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = left;
  newRect.y = top + newRect.height * 0.5;
  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export function rightOfRectangle(
  rect: DOMRect,
  right = rect.right,
  top = rect.top
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = right;
  newRect.y = top + newRect.height * 0.5;
  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export function topOfRectangle(
  rect: DOMRect,
  left = rect.left,
  top = rect.top
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = left + newRect.width * 0.5;
  newRect.y = top;
  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export function bottomOfRectangle(
  rect: DOMRect,
  left = rect.left,
  bottom = rect.bottom
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = left + newRect.width * 0.5;
  newRect.y = bottom;
  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export function centerOfRectangle(
  rect: DOMRect,
  left = rect.left,
  top = rect.top
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = left + newRect.width * 0.5;
  newRect.y = top + newRect.height * 0.5;

  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export type Edge = "left" | "right" | "top" | "bottom";

export function distanceBetween(p1: DOMRect, p2: DOMRect) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
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
