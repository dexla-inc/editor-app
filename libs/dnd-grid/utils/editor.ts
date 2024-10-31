import crawl from "tree-crawl";
import { ComponentStructure } from "@/utils/editor";

export const updateComponentPosition = (
  components: any,
  id: string,
  newPosition: { gridColumn: string; gridRow: string; parentId: string },
) => {
  let movedComponent: any = null;
  let oldParent: any = null;

  // First crawl: find the component, update its position, and remove from current parent
  crawl(
    components,
    (node: any, context: any) => {
      if (node.id === id) {
        node.props.style.gridColumn = newPosition.gridColumn;
        node.props.style.gridRow = newPosition.gridRow;
        movedComponent = { ...node };
        oldParent = context.parent;

        if (oldParent) {
          oldParent.children = oldParent.children.filter(
            (child: any) => child.id !== id,
          );
        }
      }
    },
    { order: "bfs" },
  );

  crawl(
    components,
    (node: any) => {
      if (
        node.id === newPosition.parentId.replace("-body", "") &&
        movedComponent
      ) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(movedComponent);
      }
    },
    { order: "bfs" },
  );

  return components;
};

export const addComponent = (
  components: ComponentStructure,
  componentToAdd: ComponentStructure,
  targetId: string,
): ComponentStructure => {
  crawl(
    components,
    (node: ComponentStructure) => {
      if (node.id === targetId) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(componentToAdd);
      }
    },
    {
      getChildren: (node) => node.children || [],
      order: "bfs",
    },
  );

  return components;
};

export const getAllIds = (
  components: ComponentStructure,
  options?: {
    filterBy?: Partial<ComponentStructure>;
    filterFromParent?: string;
  },
): string[] => {
  const ids: string[] = [];

  crawl(
    components,
    (node: ComponentStructure, context: any) => {
      if (node.id) {
        if (
          options?.filterFromParent &&
          context.parent &&
          context.parent.id === options.filterFromParent
        ) {
          return; // Skip children of the specified parent
        }
        if (options?.filterBy) {
          const matchesFilter = Object.entries(options.filterBy).every(
            ([key, value]) => node[key as keyof ComponentStructure] === value,
          );
          if (matchesFilter) {
            ids.push(node.id);
          }
        } else {
          ids.push(node.id);
        }
      }
    },
    { order: "bfs" },
  );

  return ids;
};

export const getComponentById = (
  components: ComponentStructure,
  componentId: string,
): ComponentStructure | null => {
  let foundComponent: ComponentStructure | null = null;

  crawl(
    components,
    (node: ComponentStructure) => {
      if (node.id === componentId) {
        foundComponent = node;
      }
    },
    { order: "bfs" },
  );

  return foundComponent;
};

export const getParentId = (
  components: ComponentStructure,
  componentId: string,
): string | null => {
  let parentId: string | null = null;

  crawl(
    components,
    (node: ComponentStructure, context: any) => {
      if (node.id === componentId && context.parent) {
        parentId = context.parent.id;
      }
    },
    { order: "bfs" },
  );

  return parentId;
};
