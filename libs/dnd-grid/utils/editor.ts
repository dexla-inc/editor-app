import crawl from "tree-crawl";
import { cloneObject } from "./common";
import { ComponentStructure } from "../types/components";

export const updateComponentPosition = (
  components: any,
  id: string,
  newPosition: { gridColumn: string; gridRow: string; parentId: string },
) => {
  let movedComponent: any = null;
  let oldParent: any = null;

  // First crawl: find the component, update its position, and remove from current parent
  crawl(components, (node: any, context: any) => {
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
  });

  crawl(components, (node: any) => {
    if (node.id === newPosition.parentId && movedComponent) {
      if (!node.children) {
        node.children = [];
      }
      node.children.push(movedComponent);
    }
  });

  return components;
};

export const addComponent = (
  components: ComponentStructure,
  componentToAdd: ComponentStructure,
  targetId: string,
): ComponentStructure => {
  const updatedComponents = { ...components };

  crawl(
    updatedComponents,
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
    },
  );

  return updatedComponents;
};

export const getAllIds = (
  components: ComponentStructure,
  options?: {
    filterBy?: Partial<ComponentStructure>;
    filterFromParent?: string;
  },
): string[] => {
  const ids: string[] = [];

  crawl(components, (node: ComponentStructure, context: any) => {
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
  });

  return ids;
};

export const updateComponentSize = (
  components: ComponentStructure,
  componentId: string,
  newGridColumn: string,
  newGridRow: string,
): ComponentStructure => {
  const updatedComponents = cloneObject(components);

  crawl(updatedComponents, (node: ComponentStructure) => {
    if (node.id === componentId) {
      node.props.style.gridColumn = newGridColumn;
      node.props.style.gridRow = newGridRow;
    }
  });

  return updatedComponents;
};

export const getComponentById = (
  components: ComponentStructure,
  componentId: string,
): ComponentStructure | null => {
  let foundComponent: ComponentStructure | null = null;

  crawl(components, (node: ComponentStructure) => {
    if (node.id === componentId) {
      foundComponent = node;
    }
  });

  return foundComponent;
};

export const getParentId = (
  components: ComponentStructure,
  componentId: string,
): string | null => {
  let parentId: string | null = null;

  crawl(components, (node: ComponentStructure, context: any) => {
    if (node.id === componentId && context.parent) {
      parentId = context.parent.id;
    }
  });

  return parentId;
};
