import { Tile } from "@/components/templates/dashboard";
import { PageResponse } from "@/requests/pages/types";
import {
  MantineThemeExtended,
  emptyEditorTree,
  useEditorStore,
} from "@/stores/editor";
import { Action } from "@/utils/actions";
import { GRAY_OUTLINE } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { GRID_SIZE } from "@/utils/config";
import { calculateGridSizes } from "@/utils/grid";
import cloneDeep from "lodash.clonedeep";
import debounce from "lodash.debounce";
import every from "lodash.every";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import pickBy from "lodash.pickby";
import { nanoid } from "nanoid";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { CSSProperties } from "react";
import crawl from "tree-crawl";
import { CSSObject } from "@mantine/core";

export type ComponentStructure = {
  children?: ComponentStructure[];
} & Component;

export type EditableComponentMapper = {
  renderTree: (component: ComponentTree, shareableContent?: any) => any;
  component: ComponentTree & Component;
  shareableContent?: any;
  isPreviewMode?: boolean;
  style?: CSSObject;
};

type ComponentBase = {
  id?: string;
};

export type Component = {
  name: string;
  description?: string;
  title?: string;
  props?: { [key: string]: any };
  blockDroppingChildrenInside?: boolean;
  fixedPosition?: {
    position: "left" | "top";
    target: string;
  };
  actions?: Action[];
  onLoad?: any;
  dataType?: "static" | "dynamic";
  states?: Record<string, any>;
  languages?: Record<string, any>;
  isBeingAdded?: boolean;

  // page structure props - can be removed if we change page structure solution
  depth?: number;
} & ComponentBase;

export type ComponentTree = {
  // TODO: this needs to be a ComponentTree[]
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

export const replaceIdsDeeply = (treeRoot: Component) => {
  crawl(
    treeRoot,
    (node) => {
      node.id = nanoid();
    },
    { order: "bfs" },
  );
};

// TODO: get this back - not sure if we need this
// export const getEditorTreeFromPageStructure = (
//   tree: { rows: Row[] },
//   theme: MantineThemeExtended,
//   pages: PageResponse[],
// ) => {
//   const editorTree: { root: ComponentStructure } & Omit<EditorTree, "root"> = {
//     name: "Initial State",
//     timestamp: Date.now(),
//     root: {
//       ...emptyEditorTree.root,
//       children: [
//         {
//           id: "content-wrapper",
//           name: "Container",
//           description: "Root Container",
//           props: {
//             style: {
//               width: "100%",
//               display: "flex",
//               flexDirection: "column",
//               boxSizing: "border-box",
//               minHeight: "20px",
//             },
//           },
//           children: tree.rows.map((row: Row) => {
//             return {
//               id: nanoid(),
//               name: "Container",
//               description: "Container",
//               props: {
//                 style: {
//                   width: "100%",
//                   backgroundColor: "White.6",
//                   display: "flex",
//                   flexDirection: "row",
//                 },
//               },
//               children: traverseComponents(row.components, theme),
//             };
//           }),
//         },
//       ],
//     },
//   };
//
//   return editorTree;
// };

// TODO: get this back - not sure if we need this
// export const getNewComponent = (
//   components: ComponentStructure[],
//   theme: MantineThemeExtended,
//   pages: PageResponse[],
// ): ComponentStructure => {
//   const firstComponent = components[0];
//   const structureDefinition = structureMapper[firstComponent.name];
//   const firstComponentStructure = structureDefinition.structure({
//     ...firstComponent,
//     props: {
//       ...(firstComponent?.props ?? {}),
//     },
//     theme,
//   });
//
//   return {
//     id: nanoid(),
//     name: firstComponentStructure.name,
//     description: firstComponentStructure.name,
//     props: { ...firstComponentStructure.props },
//     children:
//       firstComponent.children && firstComponent.children.length > 0
//         ? traverseComponents(firstComponent.children, theme)
//         : [],
//   };
// };

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
        useEditorStore.getState().componentMutableAttrs[nodeTree.id!];
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

export const getComponentById = (
  treeRoot: Component,
  id: string,
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
    Object.values(useEditorStore.getState().componentMutableAttrs).find(
      (component) => component.isBeingAdded,
    )?.id || null
  );
};

const translatableFieldsKeys = [
  "children",
  "label",
  "title",
  "alt",
  "placeholder",
  "data",
  "tooltip",
];

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
  "orientation",
  "weight",
];

const pickTranslatableFields = (value: string, key: string) => {
  return value !== "" && translatableFieldsKeys.includes(key);
};

const pickStyleFields = (value: string, key: string) => {
  return value !== "" && styleFieldsKeys.includes(key);
};

export const updateTreeComponentAttrs2 = (
  component: Component,
  attrs: Partial<Component>,
  state: string = "default",
  language: string = "default",
) => {
  const newComponent = cloneDeep(component);
  const translatableProps = pickBy(attrs.props, pickTranslatableFields);
  const styleProps = pickBy(attrs.props, pickStyleFields);
  const alwaysDefaultProps = omit(attrs.props ?? {}, [
    ...translatableFieldsKeys,
    ...styleFieldsKeys,
  ]);

  if (language === "default") {
    merge(newComponent, { props: translatableProps });
  } else {
    merge(newComponent, { languages: { [language]: translatableProps } });
  }

  if (state === "default") {
    merge(newComponent, { props: styleProps });
  } else {
    merge(newComponent, {
      states: {
        [state]: styleProps,
      },
    });
  }

  merge(newComponent, { props: alwaysDefaultProps });
  merge(newComponent, omit(attrs, ["props"]));

  return newComponent;
};

export const recoverTreeComponentAttrs = (
  tree: EditorTree,
  componentMutableAttrs: Record<string, Component>,
) => {
  crawl(
    tree.root,
    (node, context) => {
      merge(node, componentMutableAttrs[node.id!]);
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
  treeRoot: Component,
  id: string,
  children: Component[],
) => {
  // TODO: get this back
  // crawl(
  //   treeRoot,
  //   (node, context) => {
  //     if (node.id === id) {
  //       node.children = children;
  //       context.break();
  //     }
  //   },
  //   { order: "bfs" },
  // );
};

//TODO: make it run through the new component list and find the parent component by id
export const getParentComponentData = (
  treeRoot: ComponentTree,
  componentId: string,
): Component | null => {
  const parentComponentNames = ["Container", "Table", "Form", "Card"];
  let parentWithOnLoad: Component | null = null;
  crawl(
    treeRoot,
    (nodeTree, context) => {
      const node =
        useEditorStore.getState().componentMutableAttrs[nodeTree.id!];
      if (
        !isEmpty(node.onLoad?.endpointId) &&
        parentComponentNames.includes(node.name)
      ) {
        const childComponent = getComponentById(node, componentId);
        if (childComponent) {
          parentWithOnLoad = node;
          context.break();
        }
      }
    },
    { order: "pre" },
  );

  return parentWithOnLoad;
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

export const getAllComponentsByName = (
  treeRoot: Component,
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
): string => {
  const copy = cloneDeep(componentToAdd);
  replaceIdsDeeply(copy);
  const directChildren = ["Modal", "Drawer", "Toast"];
  const isGrid = copy.name === "Grid";
  const isColumn = copy.name === "GridColumn";
  const isNavbar = copy.name === "Navbar";
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
            navbarWidth: componentToAdd.props?.style.width,
          };
        }
      }
      if ((isGrid || isColumn) && node.id === dropTarget.id) {
        targetComponent = addNodeToTarget(
          treeRoot,
          node,
          copy,
          context,
          dropTarget,
          false,
          false,
          dropIndex,
        );

        context.break();
      } else {
        if (copy.fixedPosition) {
          if (node.id === copy.fixedPosition.target) {
            if (
              copy.fixedPosition.position === "left" ||
              copy.fixedPosition.position === "top"
            ) {
              node.children = [copy, ...(node.children || [])];
            } else if (
              copy.fixedPosition.position === "right" ||
              copy.fixedPosition.position === "bottom"
            ) {
              node.children = [...(node.children || []), copy];
            }

            context.break();
          }
        } else {
          if (
            directChildren.includes(copy.name) &&
            node.id === "content-wrapper"
          ) {
            node.children = [...(node.children || []), copy];
            context.break();
          } else if (node.id === dropTarget.id) {
            const isPopOver = copy.name === "PopOver";
            if (isPopOver) {
              copy.props!.targetId = node.id;
              copy.children = [...(copy.children || []), node];
              context.parent?.children?.splice(context.index, 1, copy);
            } else {
              node.children = node.children ?? [];

              if (dropTarget.edge === "left" || dropTarget.edge === "top") {
                const index = dropIndex ?? context.index - 1;
                node.children.splice(index, 0, copy);
              } else if (["right", "bottom"].includes(dropTarget.edge)) {
                const index = dropIndex ?? context.index + 1;
                node.children.splice(index, 0, copy);
              } else if (dropTarget.edge === "center") {
                node.children = [...(node.children || []), copy];
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

  return copy.id as string;
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
      useEditorStore.getState().updateTreeComponentChildren;
    const selectedComponentId = useEditorStore
      .getState()
      .selectedComponentIds?.at(-1);

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
      useEditorStore.getState().updateTreeComponentChildren;
    const tree = useEditorStore.getState().tree;

    updateTreeComponentChildren(tree.root.id as string, value, save);
  },
  300,
);

export const debouncedTreeComponentAttrsUpdate = debounce(
  ({
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
      useEditorStore.getState().updateTreeComponentAttrs;
    const selectedComponentIds =
      useEditorStore.getState().selectedComponentIds ?? [];

    if (!componentIds.length) {
      componentIds = selectedComponentIds;
    }

    updateTreeComponentAttrs({
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
  const [section, index] = colorName.split(".");
  const colorSection = theme.colors[section];
  return index !== undefined && colorSection
    ? colorSection[Number(index)]
    : section;
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
        outline: GRAY_OUTLINE,
        outlineOffset: "-2px",
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
  id: string,
  dropTarget: DropTarget,
) => {
  let targetComponent = null;
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
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
          const oldIndex = items.indexOf(id);
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
  id: string,
  dropTarget: DropTarget,
  newParentId: string,
) => {
  const componentToAdd = getComponentById(treeRoot, id) as Component;
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
  id: string,
  parentId: string,
) => {
  let shouldRecalculate = false;
  let targetComponent = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id && context.parent?.id === parentId) {
        context.parent?.children?.splice(context.index, 1);
        const component =
          useEditorStore.getState().componentMutableAttrs[node.id];
        shouldRecalculate =
          component.name === "GridColumn" || component.name === "Grid";
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

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        context.parent?.children?.splice(context.index, 1);
        shouldRecalculate = node.name === "GridColumn" || node.name === "Grid";
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
