import { useEditorTreeStore } from "@/stores/editorTree";
import { RenderTreeFunc } from "@/types/component";
import { DataType, ValueProps } from "@/types/dataBinding";
import { MantineThemeExtended } from "@/types/types";
import { Action } from "@/utils/actions";
import { IDENTIFIER } from "@/utils/branding";
import { cloneObject } from "@/utils/common";
import {
  selectedComponentIdSelector,
  selectedComponentIdsSelector,
} from "@/utils/componentSelectors";
import { GRID_SIZE } from "@/utils/config";
import { calculateGridSizes } from "@/utils/grid";
import { CSSObject } from "@mantine/core";
import debounce from "lodash.debounce";
import every from "lodash.every";
import get from "lodash.get";
import merge from "lodash.merge";
import pickBy from "lodash.pickby";
import { nanoid } from "nanoid";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { CSSProperties } from "react";
import crawl from "tree-crawl";

export type ComponentStructure = {
  children?: ComponentStructure[];
} & Component;

export type EditableComponentMapper = {
  id: string;
  renderTree: RenderTreeFunc;
  component: ComponentTree & Component;
  shareableContent?: any;
  style?: CSSObject & { display?: string | ValueProps };
  ChildrenWrapper: any;
};

type ComponentBase = {
  id?: string;
  name: string;
};

export type Component = {
  description?: string;
  title?: string;
  props?: { [key: string]: any; dataType?: DataType };
  blockDroppingChildrenInside?: boolean;
  fixedPosition?: {
    position: "left" | "top";
    target: string;
  };
  actions?: Action[];
  onLoad?: any;
  states?: Record<string, any>;
  languages?: Record<string, any>;
  isBeingAdded?: boolean;

  // page structure props - can be removed if we change page structure solution
  depth?: number;
} & ComponentBase;

export type ComponentTree = {
  blockDroppingChildrenInside?: boolean;
  children?: ComponentTree[];
} & ComponentBase;

export type Row = {
  columns: number;
  components: ComponentStructure[];
};

export type EditorTree = {
  root: ComponentTree;
  name: string;
  timestamp: number;
};

export type EditorTreeCopy = {
  root: ComponentStructure;
  name: string;
  timestamp: number;
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
    newArray.splice(from, 1)[0],
  );

  return newArray;
}

export const replaceIdsDeeply = (treeRoot: ComponentStructure) => {
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;
  const componentMutableAttrs =
    useEditorTreeStore.getState().componentMutableAttrs;

  let popoverNode: ComponentStructure;
  crawl(
    treeRoot,
    async (node) => {
      const newId = nanoid();

      const nodeAttrs = cloneObject(componentMutableAttrs[node.id!]);
      nodeAttrs.id = newId;

      // if targetId is equal to the current pointer node, update that parent targetId with the new id of the current node
      if (node.id === popoverNode?.props?.targetId) {
        popoverNode.props!.targetId = newId;
      }

      // copying all attributes from the old node to the new node
      updateTreeComponentAttrs({
        componentIds: [newId],
        attrs: nodeAttrs,
        save: false,
      });

      // if the node is a PopOver, we keep the node to be updated when we find the targetId
      if (node.name === "PopOver") {
        popoverNode = node;
      }

      node.id = newId;
    },
    { order: "bfs" },
  );
};

export type TileType = {
  node: Component;
  name: string;
  count: number;
};

export const getTiles = (treeRoot: ComponentTree): TileType[] => {
  let tiles: TileType[] = [];

  crawl(
    treeRoot,
    (nodeTree) => {
      const node =
        useEditorTreeStore.getState().componentMutableAttrs[nodeTree.id!];
      const name = node.description?.replace(".tile", "");
      if (
        node.description?.endsWith(".tile") &&
        !tiles.find((t) => t.name === name)
      ) {
        tiles.push({ name: name as string, node, count: 1 });
      } else {
        tiles = tiles.map((t) => {
          if (t.name === name) {
            return { ...t, count: t.count + 1 } as TileType;
          }

          return t as TileType;
        });
      }
    },
    { order: "bfs" },
  );

  return tiles;
};

export const getTileData = (treeRoot: Component): { [key: string]: any } => {
  let data: { [key: string]: any } = {};

  crawl(
    treeRoot,
    (node) => {
      if (node.description?.startsWith("tile.data.")) {
        let type = "string";
        // TODO: Handle unique types of charts, like PieChart that needs different data
        if (node.name.endsWith("Chart")) {
          type = `{
            data: {
              series: {
                name: string;
                data: number[]
              }[]
              xaxis: { categories: string[] }
            }
          }`;
        }

        if (node.name === "Table") {
          type = `{
            data: {
              value: { [key: string]: any }[]
            }
          }`;
        }

        data = {
          ...data,
          [node.description.replace("tile.data.", "")]: type,
        };
      }
    },
    { order: "bfs" },
  );

  return data;
};

// TODO: get this back - not used, needs deleting?
// // recursively replace all tile.data with the actual tile data
// const replaceTileData = (node: Component, tile: any, entities: object) => {
//   if (node.description?.startsWith("tile.data.")) {
//     const key = node.description?.replace("tile.data.", "");
//     const val = tile.data[key];
//
//     if (node.name === "Text" || node.name === "Title") {
//       // @ts-ignore
//       node.props.children = val;
//     }
//
//     if (node.name.endsWith("Chart")) {
//       try {
//         const data = typeof val === "string" ? JSON.parse(val).data : val.data;
//         node.props = {
//           ...node.props,
//           ...data,
//         };
//       } catch (error) {
//         // do nothing
//       }
//     }
//
//     // @ts-ignore
//     node.props.data = { value: val };
//   }
//
//   if (node.children) {
//     node.children?.map((child) => replaceTileData(child, tile, entities)) ?? [];
//   }
//
//   return node;
// };
//
// export const replaceTilesData = (
//   tree: EditorTree,
//   tiles: any[],
//   entities: object,
// ): EditorTree => {
//   // crawl(
//   //   tree.root,
//   //   (node) => {
//   //     if (node.description?.endsWith(".tile")) {
//   //       const name = node.description?.replace(".tile", "");
//   //       const tile = tiles.find((t) => t.name === `${name}Tile`);
//   //
//   //       node.children =
//   //         node.children?.map((child) =>
//   //           replaceTileData(child, tile, entities as object),
//   //         ) ?? [];
//   //     }
//   //   },
//   //   { order: "bfs" },
//   // );
//   //
//   return tree;
// };

export const getComponentTreeById = (
  treeRoot: ComponentTree,
  id: string,
): ComponentTree | null => {
  let found: ComponentTree | null = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        found = node as Component;
        context.break();
      }
    },
    { order: "bfs" },
  );

  return found;
};

export const getAllComponentsByIds = (
  treeRoot: ComponentTree,
  ids: string[],
): ComponentTree[] => {
  let found: ComponentTree[] = [];
  crawl(
    treeRoot,
    (node, context) => {
      if (ids.includes(node.id!)) {
        found.push(node);
      }
    },
    { order: "bfs" },
  );

  return found;
};

export const getComponentBeingAddedId = (): string | null => {
  return (
    Object.values(useEditorTreeStore.getState().componentMutableAttrs).find(
      (component) => component.isBeingAdded,
    )?.id || null
  );
};

const styleFieldsKeys = [
  "styles",
  "style",
  "sx",
  "size",
  "bg",
  "color",
  "variant",
  "textColor",
  "leftIcon",
  "icon",
  "iconColor",
  "orientation",
  "weight",
];

const pickStyleFields = (value: string, key: string) => {
  return value !== "" && styleFieldsKeys.includes(key);
};

export const updateTreeComponentAttrs = (
  component: Component,
  attrs: Partial<Component>,
  state: string = "default",
) => {
  const styleProps = pickBy(attrs.props, pickStyleFields);
  // properties that are not merging with states
  const alwaysDefaultProps = omit(attrs.props ?? {}, styleFieldsKeys);

  if (state === "default") {
    merge(component, { props: styleProps });
  } else {
    merge(component, {
      states: {
        [state]: styleProps,
      },
    });
  }

  // Handle default properties, ensuring arrays are replaced, not merged such as multi select accept modifiers
  Object.entries(alwaysDefaultProps).forEach(([key, value]) => {
    if (component.props && Array.isArray(value)) {
      component.props[key] = value;
    }
  });

  // attributes we want to deep merge
  merge(component, { props: alwaysDefaultProps });
  component.onLoad = Object.assign({}, component.onLoad, attrs.onLoad);
  merge(component, { states: attrs.states });
  // attribute we want to overwrite, in this case, the ones that are not listed above
  Object.entries(omit(attrs, ["props", "onLoad", "states"])).forEach(
    ([key, value]) => {
      component[key as keyof Component] = value;
    },
  );

  return component;
};

export const recoverTreeComponentAttrs = (
  tree: EditorTree,
  componentMutableAttrs: Record<string, Component>,
) => {
  crawl(
    tree.root,
    (nodeTree, context) => {
      const node = {
        ...componentMutableAttrs[nodeTree.id!],
        children: nodeTree.children,
      };
      if (context.parent?.children) {
        context.parent.children[context.index] = node;
      }
      context.replace(node);
    },
    { order: "bfs" },
  );

  return tree;
};

export const getTreeComponentMutableProps = (treeRoot: Component) => {
  const newComponentMutableAttrs: Record<string, any> = {};
  crawl(
    treeRoot,
    (node, context) => {
      newComponentMutableAttrs[node.id!] = extractComponentMutableAttrs(node);
    },
    { order: "bfs" },
  );

  return newComponentMutableAttrs;
};

export const extractComponentMutableAttrs = (
  component: Partial<ComponentTree>,
) => {
  return omit(component, ["children"]);
};

export const updateTreeComponentChildren = (
  treeRoot: ComponentTree,
  id: string,
  children: Component[],
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        node.children = children;
        context.break();
      }
    },
    { order: "bfs" },
  );
};

export const getComponentParent = (
  treeRoot: ComponentStructure,
  id: string,
): ComponentStructure | null => {
  let parent: ComponentStructure | null = null;
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        parent = context.parent;
        context.break();
      }
    },
    { order: "bfs" },
  );

  return parent;
};

function objectsIntersect(
  obj: { [key: string]: any },
  criteriaObject: Record<string, any>,
) {
  return every(criteriaObject, (value, key) => get(obj, key) === value);
}

export const checkNavbarExists = (): boolean => {
  const tree = useEditorTreeStore.getState().tree;

  if (!tree || !tree.root) {
    return false;
  }

  const rootChildren = tree.root.children;
  if (
    !rootChildren ||
    rootChildren.length === 0 ||
    !rootChildren[0].children ||
    rootChildren[0].children.length === 0
  ) {
    return false;
  }

  const navbarName = rootChildren[0].children[0].name;
  return navbarName === "Navbar";
};

export const getAllComponentsByName = (
  treeRoot: ComponentStructure,
  componentName: string | string[],
  propCriterias = {},
): Component[] => {
  const components: Component[] = [];

  if (!Array.isArray(componentName)) {
    componentName = [componentName];
  }

  crawl(
    treeRoot,
    (node) => {
      if (
        componentName.includes(node.name) &&
        objectsIntersect(node.props!, propCriterias)
      ) {
        components.push(node);
      }
    },
    { order: "bfs" },
  );

  return components;
};

export const getAllChildrenComponents = (
  treeRoot: ComponentTree,
): ComponentTree[] => {
  const components: ComponentTree[] = [];

  crawl(
    treeRoot,
    (node) => {
      components.push(node);
    },
    { order: "bfs" },
  );

  return components;
};

export const getComponentIndex = (parent: ComponentTree, id: string) => {
  if (!parent) return -1;
  return parent.children?.findIndex((child) => child.id === id) ?? -1;
};

export const addComponent = (
  treeRoot: ComponentStructure,
  componentToAdd: ComponentStructure,
  dropTarget: DropTarget,
  dropIndex?: number,
  isPasteAction?: boolean,
  isDuplicateAction?: boolean,
): string => {
  const copyComponentToAdd = cloneObject(componentToAdd);
  let copyComponentToAddId = copyComponentToAdd.id;
  if (isPasteAction) {
    replaceIdsDeeply(copyComponentToAdd);
    copyComponentToAddId = copyComponentToAdd.id as string;
  }

  const directChildren = ["Modal", "Drawer", "Toast"];
  const isGrid = copyComponentToAdd.name === "Grid";
  const isColumn = copyComponentToAdd.name === "GridColumn";
  const isNavbar = copyComponentToAdd.name === "Navbar";
  let targetComponent = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (isNavbar) {
        const contentWrapper = treeRoot.children?.find(
          (child) => child.id === "content-wrapper",
        );
        if (contentWrapper) {
          contentWrapper.props = {
            ...contentWrapper.props,
            navbarWidth: copyComponentToAdd.props?.style.width,
          };
        }
      }
      if ((isGrid || isColumn) && node.id === dropTarget.id) {
        targetComponent = addNodeToTarget(
          treeRoot,
          node,
          copyComponentToAdd,
          context,
          dropTarget,
          false,
          false,
          dropIndex,
        );

        context.break();
      } else {
        if (copyComponentToAdd.fixedPosition) {
          if (node.id === copyComponentToAdd.fixedPosition.target) {
            if (
              copyComponentToAdd.fixedPosition.position === "left" ||
              copyComponentToAdd.fixedPosition.position === "top"
            ) {
              node.children = [copyComponentToAdd, ...(node.children || [])];
            } else if (
              copyComponentToAdd.fixedPosition.position === "right" ||
              copyComponentToAdd.fixedPosition.position === "bottom"
            ) {
              node.children = [...(node.children || []), copyComponentToAdd];
            }

            context.break();
          }
        } else {
          if (
            directChildren.includes(copyComponentToAdd.name) &&
            node.id === "content-wrapper"
          ) {
            node.children = [...(node.children || []), copyComponentToAdd];
            context.break();
          } else if (node.id === dropTarget.id) {
            const isPopOver = copyComponentToAdd.name === "PopOver";
            if (isPopOver) {
              if (isPasteAction) {
                node.children = [...(node.children || []), copyComponentToAdd];
              } else {
                copyComponentToAdd.props!.targetId = node.id;
                copyComponentToAdd.children = [
                  ...(copyComponentToAdd.children || []),
                  node,
                ];
                context.parent?.children?.splice(
                  context.index,
                  1,
                  copyComponentToAdd,
                );
              }
            } else {
              node.children = node.children ?? [];

              if (isDuplicateAction) copyComponentToAddId = nanoid();

              if (dropTarget.edge === "left" || dropTarget.edge === "top") {
                const index = dropIndex ?? context.index - 1;
                node.children.splice(index, 0, {
                  ...copyComponentToAdd,
                  id: copyComponentToAddId,
                });
              } else if (["right", "bottom"].includes(dropTarget.edge)) {
                const index = dropIndex ?? context.index + 1;
                node.children.splice(index, 0, {
                  ...copyComponentToAdd,
                  id: copyComponentToAddId,
                });
              } else if (dropTarget.edge === "center") {
                node.children = [
                  ...(node.children || []),
                  { ...copyComponentToAdd, id: copyComponentToAddId },
                ];
              }
            }

            context.break();
          }
        }
      }
    },
    { order: "bfs" },
  );

  if ((isGrid || isColumn) && targetComponent) {
    calculateGridSizes(targetComponent);
  }

  return copyComponentToAddId as string;
};

export type Edge = "left" | "right" | "top" | "bottom" | "center";

export const getClosestEdge = (
  left: number,
  right: number,
  top: number,
  bottom: number,
) => {
  const all = { left, right, top, bottom, center: Infinity };
  const closest = Math.min(...Object.values(all));
  const closestKey = Object.keys(all).find((key: string) => {
    return all[key as Edge] === closest;
  });

  return { edge: closestKey, value: all[closestKey as Edge] };
};

export const debouncedTreeComponentChildrenUpdate = debounce(
  async (value: Component[], save = true) => {
    const updateTreeComponentChildren =
      useEditorTreeStore.getState().updateTreeComponentChildren;
    const selectedComponentId = selectedComponentIdSelector(
      useEditorTreeStore.getState(),
    );

    return await updateTreeComponentChildren(
      selectedComponentId as string,
      value,
      save,
    );
  },
  300,
);
export const debouncedTreeRootChildrenUpdate = debounce(
  (value: Component[], save = true) => {
    const updateTreeComponentChildren =
      useEditorTreeStore.getState().updateTreeComponentChildren;
    const tree = useEditorTreeStore.getState().tree;

    updateTreeComponentChildren(tree.root.id as string, value, save);
  },
  300,
);

export const debouncedTreeComponentAttrsUpdate = debounce(
  async ({
    componentIds = [],
    attrs,
    forceState,
    save = true,
  }: {
    componentIds?: string[];
    attrs: Partial<Component>;
    forceState?: string;
    save?: boolean;
  }) => {
    const updateTreeComponentAttrs =
      useEditorTreeStore.getState().updateTreeComponentAttrs;
    const selectedComponentIds = selectedComponentIdsSelector(
      useEditorTreeStore.getState(),
    );

    if (!componentIds.length) {
      componentIds = selectedComponentIds;
    }

    await updateTreeComponentAttrs({
      componentIds,
      attrs,
      forceState,
      save,
    });
  },
  300,
);

export const getColorFromTheme = (
  theme: MantineThemeExtended,
  colorName = "",
) => {
  if (colorName === "transparent") {
    return "transparent";
  }
  const lastDotIndex = colorName.lastIndexOf(".");
  const section = colorName.slice(0, lastDotIndex);
  const index = colorName.slice(lastDotIndex + 1);
  const colorSection = theme.colors[section];
  return index !== undefined && colorSection
    ? colorSection[Number(index)]
    : section;
};

export const getThemeColor = (theme: any, hex: string) => {
  hex = hex.replace("!important", "").trim();
  if (hex === "transparent") return hex;
  return Object.keys(theme.colors).reduce((themeColor: string, key: string) => {
    const colorIndex = theme.colors[key].findIndex((c: string) => c === hex);

    if (colorIndex > -1) {
      themeColor = `${key}.${colorIndex}`;
    }

    return themeColor;
  }, "Border.6");
};

export const componentStyleMapper = (
  componentName: string,
  { style }: { style: CSSProperties },
) => {
  const { background, backgroundColor, color, ...rest } = style;
  const result = merge({}, { style: rest });

  if (componentName === "Button") {
    merge(result, {
      color: background ?? backgroundColor,
      textColor: color,
    });
  }

  if (
    ["Container", "NavLink", "Icon", "RadioItem", "Navbar", "AppBar"].includes(
      componentName,
    )
  ) {
    merge(result, {
      bg: background ?? backgroundColor,
    });
  }

  if ("NavLink" === componentName) {
    merge(result, {
      align: rest.textAlign,
      color,
    });
  }

  if (
    ["Text", "Checkbox", "Divider", "Button", "Select", "Input"].includes(
      componentName,
    )
  ) {
    merge(result, {
      color,
      size: rest.fontSize,
      weight: rest.fontWeight,
    });
  }

  return result;
};

const addNodeToTarget = (
  treeRoot: ComponentStructure,
  targetNode: ComponentStructure,
  copy: ComponentStructure,
  context: crawl.Context<ComponentStructure>,
  dropTarget: DropTarget,
  isMoving?: boolean,
  forceTarget?: boolean,
  dropIndex?: number,
) => {
  const parent = context.parent as ComponentStructure;
  const isAddingToXAxis =
    dropTarget.edge === "left" || dropTarget.edge === "right";
  const isAddingToYAxis =
    dropTarget.edge === "top" || dropTarget.edge === "bottom";
  let target =
    isAddingToXAxis || isAddingToYAxis
      ? forceTarget
        ? targetNode
        : parent
      : targetNode;

  if (dropTarget.edge === "center") {
    targetNode.children = [...(targetNode.children || []), copy];

    copy.props!.resized = false;
    copy.children = copy.children?.map((child) => {
      child.props!.resized = false;
      return child;
    });

    if (copy.props?.resetTargetResized && !isMoving) {
      target.props!.resized = false;
      target.children = target.children?.map((child) => {
        child.props!.resized = false;
        return child;
      });
    }

    return target;
  }
  const shouldRemoveResizing = target.name === "Grid" && isAddingToXAxis;

  if (shouldRemoveResizing) {
    copy.props!.resized = false;
    target.children = target.children?.map((child) => {
      child.props!.resized = false;
      return child;
    });
  }

  if (dropTarget.edge === "top") {
    if (targetNode.name === "GridColumn" && !forceTarget) {
      target = getComponentParent(treeRoot, parent.id!)!;
      dropIndex = getComponentIndex(target, parent.id!);
    }

    if (isMoving) {
      const dropTargetParent = getComponentParent(treeRoot, dropTarget.id!);
      const items = (target?.children?.map((c) => c.id) ?? []) as string[];
      const oldIndex = items.indexOf(copy.id!);
      let newIndex = items.indexOf(dropTargetParent?.id!);

      if (newIndex > oldIndex) {
        newIndex = Math.max(newIndex - 1, 0);
      }

      if (oldIndex !== newIndex) {
        const newPositions = arrayMove(items, oldIndex, newIndex);
        target!.children = parent?.children?.sort((a, b) => {
          const aIndex = newPositions.indexOf(a.id as string);
          const bIndex = newPositions.indexOf(b.id as string);
          return aIndex - bIndex;
        });
      }
    } else {
      let i = dropIndex;
      if (typeof dropIndex === "undefined") {
        i = context.index;
      }

      // @ts-ignore
      target.children?.splice(i, 0, copy);
    }

    return target;
  }

  if (dropTarget.edge === "bottom") {
    if (targetNode.name === "GridColumn" && !forceTarget) {
      target = getComponentParent(treeRoot, parent.id!)!;
      dropIndex = getComponentIndex(target, parent.id!) + 1;
    }

    if (isMoving) {
      const dropTargetParent = getComponentParent(treeRoot, dropTarget.id!);
      const items = (target?.children?.map((c) => c.id) ?? []) as string[];
      const oldIndex = items.indexOf(copy.id!);
      let newIndex = items.indexOf(dropTargetParent?.id!);

      if (newIndex < oldIndex) {
        newIndex = Math.min(newIndex + 1, items.length);
      }

      if (oldIndex !== newIndex) {
        const newPositions = arrayMove(items, oldIndex, newIndex);
        target!.children = parent?.children?.sort((a, b) => {
          const aIndex = newPositions.indexOf(a.id as string);
          const bIndex = newPositions.indexOf(b.id as string);
          return aIndex - bIndex;
        });
      }
    } else {
      let i = dropIndex;
      if (typeof dropIndex === "undefined") {
        i = context.index + 1;
      }

      target.children?.splice(i!, 0, copy);
    }

    return target;
  }

  const gridColumn = {
    id: nanoid(),
    name: "GridColumn",
    description: "GridColumn",
    props: {
      span: GRID_SIZE,
      style: {
        height: "auto",
        ...IDENTIFIER,
      },
    },
    children: [copy],
  } as Component;

  if (dropTarget.edge === "left") {
    let i = dropIndex;
    if (typeof dropIndex === "undefined") {
      i = context.index - 1 < 0 ? 0 : context.index;
    }
    // @ts-ignore
    target.children?.splice(i, 0, gridColumn);
  } else if (dropTarget.edge === "right") {
    let i = dropIndex;
    if (typeof dropIndex === "undefined") {
      i = context.index + 1;
    }
    // @ts-ignore
    target.children?.splice(i, 0, gridColumn);
  }
};

export const moveComponent = (
  treeRoot: ComponentStructure,
  componentToAdd: ComponentStructure,
  dropTarget: DropTarget,
) => {
  let targetComponent = null;
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === componentToAdd.id) {
        const isGrid = node.name === "Grid";
        if (isGrid) {
          targetComponent = addNodeToTarget(
            treeRoot,
            context.parent!,
            node,
            context,
            dropTarget,
            true,
            true,
          );
        } else {
          const parent = context.parent;
          const items = (parent?.children?.map((c) => c.id) ?? []) as string[];
          const oldIndex = items.indexOf(componentToAdd.id!);
          let newIndex = items.indexOf(dropTarget.id);

          if (
            ["top", "left"].includes(dropTarget.edge) &&
            oldIndex < newIndex
          ) {
            newIndex = Math.max(newIndex - 1, 0);
          } else if (
            ["right", "bottom", "center"].includes(dropTarget.edge) &&
            newIndex < oldIndex
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
        }

        context.break();
      }
    },
    { order: "bfs" },
  );

  if (targetComponent) {
    calculateGridSizes(targetComponent);
  }
};

export const moveComponentToDifferentParent = (
  treeRoot: ComponentStructure,
  componentToAdd: ComponentStructure,
  dropTarget: DropTarget,
  newParentId: string,
) => {
  const isGrid = componentToAdd.name === "Grid";
  let targetComponent = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === newParentId) {
        if (isGrid) {
          const isHorizontalAxis =
            dropTarget.edge === "right" || dropTarget.edge === "left";
          const dropIndex = node.children?.findIndex(
            (c) => c.id === dropTarget.id,
          ) as number;

          targetComponent = addNodeToTarget(
            treeRoot,
            node,
            componentToAdd,
            context,
            dropTarget,
            false,
            isHorizontalAxis,
            isHorizontalAxis
              ? dropTarget.edge === "right"
                ? dropIndex + 1
                : dropIndex
              : undefined,
          );
        } else {
          if (dropTarget.edge === "left" || dropTarget.edge === "top") {
            const dropIndex = node.children?.findIndex(
              (c) => c.id === dropTarget.id,
            );
            node.children?.splice(
              Math.max(dropIndex || 0, 0),
              0,
              componentToAdd,
            );
          } else if (
            dropTarget.edge === "right" ||
            dropTarget.edge === "bottom" ||
            dropTarget.edge === "center"
          ) {
            if (!node.children) {
              node.children = [];
            }

            const dropIndex = node.children.findIndex(
              (c) => c.id === dropTarget.id,
            );
            node.children.splice(
              Math.min((dropIndex || 0) + 1, node.children.length),
              0,
              componentToAdd,
            );
          }
        }

        context.break();
      }
    },
    { order: "bfs" },
  );

  if (targetComponent) {
    calculateGridSizes(targetComponent);
  }
};

export const removeComponentFromParent = (
  treeRoot: ComponentTree,
  componentToAdd: ComponentStructure,
  parentId: string,
) => {
  let shouldRecalculate = false;
  let targetComponent = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === componentToAdd.id && context.parent?.id === parentId) {
        context.parent?.children?.splice(context.index, 1);
        shouldRecalculate =
          componentToAdd.name === "GridColumn" ||
          componentToAdd.name === "Grid";
        targetComponent = context.parent;
        context.remove();
        context.break();
      }
    },
    { order: "bfs" },
  );

  if (shouldRecalculate && targetComponent) {
    calculateGridSizes(targetComponent);
  }
};

export const removeComponent = (treeRoot: ComponentStructure, id: string) => {
  let shouldRecalculate = false;
  let targetComponent = null;
  let isNavbar = false;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        if (node.name === "Navbar") {
          isNavbar = true;
        }
        context.parent?.children?.splice(context.index, 1);
        shouldRecalculate = node.name === "GridColumn" || node.name === "Grid";
        targetComponent = context.parent;
        context.remove();
        context.break();
      }
    },
    { order: "bfs" },
  );

  if (isNavbar) {
    const contentWrapper = treeRoot.children?.find(
      (child) => child.id === "content-wrapper",
    );
    if (contentWrapper) {
      contentWrapper.props = {
        ...contentWrapper.props,
        navbarWidth: undefined,
      };
    }
  }

  if (shouldRecalculate && targetComponent) {
    calculateGridSizes(targetComponent);
  }
};
